import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Plus,
  ShieldAlert,
  Key,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  FileCheck,
  Ban,
  Fingerprint,
  Copy,
  Check,
} from 'lucide-react';
import { api } from '../api/client';
import { Badge } from '../components/common/Badge';
import { CopyBadge } from '../components/common/CopyBadge';
import { Modal } from '../components/common/Modal';
import type { Device, CRLResponse } from '../types';

export const DeviceManagement: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [crl, setCrl] = useState<CRLResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Enrol modal state
  const [isEnrolOpen, setIsEnrolOpen] = useState(false);
  const [newDeviceId, setNewDeviceId] = useState('');
  const [newDeviceRole, setNewDeviceRole] = useState('device');
  const [enrolResult, setEnrolResult] = useState<{ code: string; deviceId: string } | null>(null);
  const [enrolLoading, setEnrolLoading] = useState(false);
  const [enrolError, setEnrolError] = useState('');

  // Key inspection modal
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [keyDetails, setKeyDetails] = useState<Device | null>(null);
  const [keyDetailsLoading, setKeyDetailsLoading] = useState(false);
  const [keyFormat, setKeyFormat] = useState<'hex' | 'b64'>('hex');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleInspectKeys = async (device: Device) => {
    setSelectedDevice(device);
    setKeyDetails(device);
    if (!device.kem_public_key_hex || !device.sig_public_key_hex) {
      setKeyDetailsLoading(true);
      try {
        const fullKeys = await api.getDeviceKeys(device.device_id);
        if (fullKeys && (fullKeys.kem_public_key_hex || fullKeys.sig_public_key_hex)) {
          setKeyDetails({ ...device, ...fullKeys });
        }
      } catch (err) {
        console.error('Failed to load device keys:', err);
      } finally {
        setKeyDetailsLoading(false);
      }
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  // Revocation state
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const fetchDevices = async () => {
    try {
      const [stateData, crlData] = await Promise.all([
        api.getState(),
        api.getRevocations(),
      ]);
      setDevices(stateData.devices);
      setCrl(crlData);
    } catch (err) {
      console.error('Failed to load devices:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleEnrolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceId.trim()) return;
    setEnrolLoading(true);
    setEnrolError('');
    try {
      const res = await api.enrolDevice(newDeviceId.trim(), newDeviceRole);
      setEnrolResult({ code: res.enrolment_code, deviceId: res.device_id });
      setNewDeviceId('');
      fetchDevices();
    } catch (err: any) {
      setEnrolError(err.response?.data?.detail || 'Failed to enrol device');
    } finally {
      setEnrolLoading(false);
    }
  };

  const handleRevoke = async (deviceId: string) => {
    if (!window.confirm(`Are you sure you want to REVOKE device '${deviceId}'? All active sessions will be destroyed immediately and an updated signed revocation certificate will be issued.`)) {
      return;
    }
    setRevokingId(deviceId);
    try {
      await api.revokeDevice(deviceId);
      await fetchDevices();
    } catch (err: any) {
      alert(`Revocation failed: ${err.response?.data?.detail || err.message}`);
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Edge Biochip Fleet Registry
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            One-time token provisioning, cryptographic proof-of-possession verification, and dynamic revocation certificate distribution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { setRefreshing(true); fetchDevices(); }}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs transition-colors shadow-2xs"
            title="Refresh Fleet"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-teal-600 dark:text-teal-400' : ''}`} />
          </button>
          <button
            onClick={() => { setIsEnrolOpen(true); setEnrolResult(null); setEnrolError(''); }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 text-xs font-semibold text-white shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Enrol New Biochip</span>
          </button>
        </div>
      </div>

      {/* CRL Status Banner */}
      {crl && (
        <div className="p-4 rounded-xl bg-purple-50/80 dark:bg-[#0f1728] border border-purple-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-400 shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-200">
                  Active Certificate Revocation List (CRL)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800/60 font-semibold">
                  v{crl.version}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Issued: {new Date(crl.issued_at).toLocaleString()} • {crl.device_ids.length} revoked node(s) listed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <CopyBadge
              text={crl.signature_hex}
              label="Auth Signature"
              truncateLength={8}
            />
          </div>
        </div>
      )}

      {/* Devices Table */}
      <div className="bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm dark:shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0d131f] text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                <th className="py-3 px-4">Node ID</th>
                <th className="py-3 px-4">Authorization Status</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Enrolment Date</th>
                <th className="py-3 px-4">Cryptographic Public Keys</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-xs">
              {devices.length > 0 ? (
                devices.map((device) => (
                  <tr
                    key={device.device_id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-900 dark:text-slate-200">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                        <span>{device.device_id}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={device.status}>{device.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300 capitalize">
                      {device.role}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400">
                      {device.enrolled_at ? new Date(device.enrolled_at).toLocaleString() : 'Pending Registration'}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {device.status === 'AUTHORIZED' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleInspectKeys(device)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-[11px] text-teal-700 dark:text-teal-300 transition-colors shadow-2xs"
                          >
                            <Fingerprint className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                            <span>Inspect PQC Keys</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 text-[11px]">Unregistered</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {device.status === 'AUTHORIZED' && (
                        <button
                          onClick={() => handleRevoke(device.device_id)}
                          disabled={revokingId === device.device_id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 dark:border-rose-800/60 text-[11px] font-medium dark:text-rose-300 transition-colors shadow-2xs"
                        >
                          <Ban className="w-3 h-3" />
                          <span>{revokingId === device.device_id ? 'Revoking...' : 'Revoke'}</span>
                        </button>
                      )}
                      {device.status === 'REVOKED' && (
                        <span className="text-[11px] text-rose-600 dark:text-rose-400 font-mono italic">
                          Revoked & Blacklisted
                        </span>
                      )}
                      {device.status === 'PENDING' && (
                        <span className="text-[11px] text-amber-600 dark:text-amber-400 font-mono italic">
                          Awaiting Registration
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No biochips registered in this fleet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enrolment Modal */}
      <Modal
        isOpen={isEnrolOpen}
        onClose={() => setIsEnrolOpen(false)}
        title="Enrol New Biochip Edge Node"
        subtitle="Generates a single-use token bound to this device identifier"
      >
        {!enrolResult ? (
          <form onSubmit={handleEnrolSubmit} className="space-y-4">
            {enrolError && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-200 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>{enrolError}</span>
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase font-mono mb-1">
                Device Identifier (Unique)
              </label>
              <input
                type="text"
                placeholder="e.g. DMFB-ICU-05"
                value={newDeviceId}
                onChange={(e) => setNewDeviceId(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-teal-500"
              />
              <p className="text-[11px] text-slate-500 mt-1 font-mono">
                Physical biochip identifier bound into the cryptographic proof-of-possession context.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase font-mono mb-1">
                Node Role
              </label>
              <select
                value={newDeviceRole}
                onChange={(e) => setNewDeviceRole(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-teal-500"
              >
                <option value="device">Biochip Node (device)</option>
                <option value="admin">Gateway Controller (admin)</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEnrolOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={enrolLoading}
                className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                {enrolLoading ? 'Generating Token...' : 'Issue Enrolment Token'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-500/40 text-center">
              <CheckCircle className="w-8 h-8 text-teal-600 dark:text-teal-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Enrolment Token Issued</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Deliver this one-time secret securely out-of-band to device <strong className="text-teal-700 dark:text-teal-300 font-mono">{enrolResult.deviceId}</strong>.
              </p>
              <div className="mt-4 p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-sm text-teal-700 dark:text-teal-300 break-all select-all shadow-xs">
                {enrolResult.code}
              </div>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-mono">
              <p>• The server stores only the one-way cryptographic hash of this code.</p>
              <p>• The code is single-use and consumed immediately upon successful registration.</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsEnrolOpen(false)}
                className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Public Key Inspector Modal */}
      <Modal
        isOpen={!!selectedDevice}
        onClose={() => { setSelectedDevice(null); setKeyDetails(null); }}
        title={`Cryptographic Identity: ${selectedDevice?.device_id}`}
        subtitle="Verified Quantum-Resistant Public Keys"
        maxWidth="max-w-2xl"
      >
        {keyDetailsLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 text-teal-600 animate-spin" />
            <p className="text-xs text-slate-500 font-mono">Retrieving verified public keys from secure ledger...</p>
          </div>
        ) : keyDetails && (
          <div className="space-y-4 text-xs font-mono">
            {/* Metadata & Encoding Format Selector */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]">
              <div className="flex items-center gap-3">
                <span className="text-slate-500">Status: <strong className="text-emerald-600 dark:text-emerald-400">{keyDetails.status || selectedDevice?.status}</strong></span>
                <span className="text-slate-500">Role: <strong className="text-slate-700 dark:text-slate-300 capitalize">{keyDetails.role || selectedDevice?.role}</strong></span>
              </div>
              <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-0.5 rounded border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setKeyFormat('hex')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                    keyFormat === 'hex'
                      ? 'bg-teal-600 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Hex Encoding
                </button>
                <button
                  type="button"
                  onClick={() => setKeyFormat('b64')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                    keyFormat === 'b64'
                      ? 'bg-teal-600 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Base64 (RFC 4648)
                </button>
              </div>
            </div>

            {/* Public Encapsulation Key */}
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="font-bold text-purple-700 dark:text-purple-300">
                    Public Key Encapsulation Key
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-[10px] font-semibold border border-purple-200 dark:border-purple-800/60">
                    {keyDetails.kem_key_size_bytes || 1184} Bytes
                  </span>
                  <span className="text-[10px] text-slate-500 font-sans">Quantum-Resistant KEM</span>
                </div>
              </div>

              {keyDetails.kem_fingerprint && (
                <div className="flex items-center justify-between gap-2 p-1.5 px-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-500">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">Key Fingerprint:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 truncate">{keyDetails.kem_fingerprint}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(keyDetails.kem_fingerprint!, 'kem-fp')}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 shrink-0"
                    title="Copy Fingerprint"
                  >
                    {copiedKey === 'kem-fp' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              )}

              <div className="relative">
                <pre className="text-[10.5px] leading-relaxed text-slate-800 dark:text-slate-200 break-all whitespace-pre-wrap bg-white dark:bg-slate-950 p-2.5 rounded border border-slate-200 dark:border-slate-800 max-h-36 overflow-y-auto select-all font-mono">
                  {keyFormat === 'hex'
                    ? keyDetails.kem_public_key_hex || 'No key data available'
                    : keyDetails.kem_public_key_b64 || 'No key data available'}
                </pre>
                <div className="mt-1.5 flex justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(keyFormat === 'hex' ? keyDetails.kem_public_key_hex || '' : keyDetails.kem_public_key_b64 || '', 'kem-key')}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-sans text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs"
                  >
                    {copiedKey === 'kem-key' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-500" />
                        <span>Copy {keyFormat === 'hex' ? 'Hex' : 'Base64'} Key</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Public Signature Verification Key */}
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span className="font-bold text-teal-700 dark:text-teal-300">
                    Digital Signature Verification Key
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[10px] font-semibold border border-teal-200 dark:border-teal-800/60">
                    {keyDetails.sig_key_size_bytes || 1952} Bytes
                  </span>
                  <span className="text-[10px] text-slate-500 font-sans">Quantum-Resistant Signature</span>
                </div>
              </div>

              {keyDetails.sig_fingerprint && (
                <div className="flex items-center justify-between gap-2 p-1.5 px-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-500">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">Key Fingerprint:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 truncate">{keyDetails.sig_fingerprint}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(keyDetails.sig_fingerprint!, 'sig-fp')}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 shrink-0"
                    title="Copy Fingerprint"
                  >
                    {copiedKey === 'sig-fp' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              )}

              <div className="relative">
                <pre className="text-[10.5px] leading-relaxed text-slate-800 dark:text-slate-200 break-all whitespace-pre-wrap bg-white dark:bg-slate-950 p-2.5 rounded border border-slate-200 dark:border-slate-800 max-h-36 overflow-y-auto select-all font-mono">
                  {keyFormat === 'hex'
                    ? keyDetails.sig_public_key_hex || 'No key data available'
                    : keyDetails.sig_public_key_b64 || 'No key data available'}
                </pre>
                <div className="mt-1.5 flex justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(keyFormat === 'hex' ? keyDetails.sig_public_key_hex || '' : keyDetails.sig_public_key_b64 || '', 'sig-key')}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-sans text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs"
                  >
                    {copiedKey === 'sig-key' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-500" />
                        <span>Copy {keyFormat === 'hex' ? 'Hex' : 'Base64'} Key</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
