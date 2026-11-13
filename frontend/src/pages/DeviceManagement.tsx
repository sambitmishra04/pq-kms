import React, { useState, useEffect, useMemo } from 'react';
import {
  Cpu,
  Plus,
  Key,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  FileCheck,
  Ban,
  Fingerprint,
  Copy,
  Check,
  Search,
  SearchX,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Wand2,
  Building2,
  Layers,
  Terminal,
  FileCode,
  QrCode,
  ShieldCheck,
  Clock,
  Radio,
} from 'lucide-react';
import { api } from '../api/client';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { CopyBadge } from '../components/common/CopyBadge';
import { Modal } from '../components/common/Modal';
import type { Device, CRLResponse } from '../types';

export const DeviceManagement: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [crl, setCrl] = useState<CRLResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search, Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'authorized' | 'revoked' | 'pending'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'device' | 'admin'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [jumpPageInput, setJumpPageInput] = useState('');

  // Table copied state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Enrol modal state
  const [isEnrolOpen, setIsEnrolOpen] = useState(false);
  const [newDeviceId, setNewDeviceId] = useState('');
  const [newDeviceRole, setNewDeviceRole] = useState<'device' | 'admin'>('device');
  const [newDepartment, setNewDepartment] = useState('ICU Point-of-Care');
  const [newHardwareSpec, setNewHardwareSpec] = useState('2D EWOD 16x16 Electrowetting Array');
  const [deliveryChannel, setDeliveryChannel] = useState<'flashing' | 'nfc' | 'voucher'>('nfc');
  const [enrolResult, setEnrolResult] = useState<{
    code: string;
    deviceId: string;
    role: string;
    department: string;
    hardwareSpec: string;
    deliveryChannel: string;
  } | null>(null);
  const [enrolLoading, setEnrolLoading] = useState(false);
  const [enrolError, setEnrolError] = useState('');
  const [activeEnrolTab, setActiveEnrolTab] = useState<'token' | 'json' | 'cli' | 'escrow'>('token');
  const [copiedEnrolSnippet, setCopiedEnrolSnippet] = useState<string | null>(null);

  // Key inspection modal
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [keyDetails, setKeyDetails] = useState<Device | null>(null);
  const [keyDetailsLoading, setKeyDetailsLoading] = useState(false);
  const [keyFormat, setKeyFormat] = useState<'hex' | 'b64'>('hex');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Revocation state
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const fetchDevices = async () => {
    try {
      const [stateData, crlData] = await Promise.all([
        api.getState(),
        api.getRevocations(),
      ]);
      setDevices(stateData.devices || []);
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

  // Reset page to 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, roleFilter, pageSize]);

  // Derived counts
  const totalCount = devices.length;
  const authorizedCount = devices.filter((d) => d.status === 'AUTHORIZED').length;
  const revokedCount = devices.filter((d) => d.status === 'REVOKED').length;
  const pendingCount = devices.filter((d) => d.status === 'PENDING').length;

  // Filtered devices list
  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        device.device_id.toLowerCase().includes(q) ||
        device.role.toLowerCase().includes(q) ||
        device.status.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (statusFilter === 'authorized' && device.status !== 'AUTHORIZED') return false;
      if (statusFilter === 'revoked' && device.status !== 'REVOKED') return false;
      if (statusFilter === 'pending' && device.status !== 'PENDING') return false;

      if (roleFilter !== 'all' && device.role.toLowerCase() !== roleFilter.toLowerCase()) return false;

      return true;
    });
  }, [devices, searchQuery, statusFilter, roleFilter]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredDevices.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedDevices = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * pageSize;
    return filteredDevices.slice(startIndex, startIndex + pageSize);
  }, [filteredDevices, validCurrentPage, pageSize]);

  const startRecord = filteredDevices.length === 0 ? 0 : (validCurrentPage - 1) * pageSize + 1;
  const endRecord = Math.min(validCurrentPage * pageSize, filteredDevices.length);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

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

  const copyKeyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleRevoke = async (deviceId: string) => {
    if (
      !window.confirm(
        `Are you sure you want to REVOKE device '${deviceId}'? All active sessions will be destroyed immediately and an updated signed revocation certificate will be issued.`
      )
    ) {
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

  // Quick ID Generator
  const generateRandomId = (prefix: string = 'DMFB-LAB-') => {
    const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
    const newId = `${prefix}${randomHex}`;
    setNewDeviceId(newId);
  };

  // Live duplicate check
  const isDuplicateId = useMemo(() => {
    if (!newDeviceId.trim()) return false;
    return devices.some(
      (d) => d.device_id.toLowerCase() === newDeviceId.trim().toLowerCase()
    );
  }, [devices, newDeviceId]);

  const handleEnrolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceId.trim() || isDuplicateId) return;
    setEnrolLoading(true);
    setEnrolError('');
    try {
      const res = await api.enrolDevice(newDeviceId.trim(), newDeviceRole);
      setEnrolResult({
        code: res.enrolment_code,
        deviceId: res.device_id,
        role: newDeviceRole,
        department: newDepartment,
        hardwareSpec: newHardwareSpec,
        deliveryChannel,
      });
      fetchDevices();
    } catch (err: any) {
      setEnrolError(err.response?.data?.detail || 'Failed to enrol device');
    } finally {
      setEnrolLoading(false);
    }
  };

  const resetEnrolForm = () => {
    setEnrolResult(null);
    setNewDeviceId('');
    setEnrolError('');
    generateRandomId('DMFB-LAB-');
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setRoleFilter('all');
    setCurrentPage(1);
  };

  // Generate pagination page numbers
  const paginationRange = useMemo(() => {
    const delta = 1;
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= validCurrentPage - delta && i <= validCurrentPage + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l !== undefined) {
        if (typeof i === 'number' && i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (typeof i === 'number' && i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      if (typeof i === 'number') l = i;
    }

    return rangeWithDots;
  }, [totalPages, validCurrentPage]);

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
            onClick={() => {
              setRefreshing(true);
              fetchDevices();
            }}
            disabled={refreshing}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs transition-colors shadow-2xs disabled:opacity-50"
            title="Refresh Fleet"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-teal-600 dark:text-teal-400' : ''}`} />
          </button>
          <button
            onClick={() => {
              setIsEnrolOpen(true);
              setEnrolResult(null);
              setEnrolError('');
              if (!newDeviceId) generateRandomId('DMFB-LAB-');
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Enrol New Biochip</span>
          </button>
        </div>
      </div>

      {/* Fleet KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Biochip Fleet"
          value={totalCount}
          subtitle="Registered physical nodes"
          icon={<Cpu className="w-5 h-5" />}
          variant="teal"
        />
        <StatCard
          title="Authorized Active"
          value={authorizedCount}
          subtitle="Operational clinical nodes"
          icon={<ShieldCheck className="w-5 h-5" />}
          variant="teal"
        />
        <StatCard
          title="Revoked / Quarantined"
          value={revokedCount}
          subtitle="Listed in active CRL"
          icon={<Ban className="w-5 h-5" />}
          variant="crimson"
        />
        <StatCard
          title="Pending Registration"
          value={pendingCount}
          subtitle="Awaiting initial PoP"
          icon={<Clock className="w-5 h-5" />}
          variant="amber"
        />
      </div>

      {/* Active CRL Status Banner */}
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

      {/* Fleet Controls: Search Bar & Segmented Filters */}
      <div className="bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Node ID or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Segmented Status Filter Buttons */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shrink-0 overflow-x-auto">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('authorized')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                statusFilter === 'authorized'
                  ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Authorized ({authorizedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('revoked')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                statusFilter === 'revoked'
                  ? 'bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-400 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Revoked ({revokedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                statusFilter === 'pending'
                  ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-400 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Pending ({pendingCount})
            </button>
          </div>
        </div>

        {/* Sub-strip: Role selector & Results count */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-mono text-[11px]">Role filter:</span>
            <div className="flex items-center gap-1">
              {(['all', 'device', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRoleFilter(r)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    roleFilter === r
                      ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-800'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  {r === 'all' ? 'All Roles' : r === 'device' ? 'Biochip Nodes' : 'Gateways'}
                </button>
              ))}
            </div>
            {(searchQuery || statusFilter !== 'all' || roleFilter !== 'all') && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="ml-2 text-[11px] text-teal-600 dark:text-teal-400 hover:underline font-mono"
              >
                Reset filters
              </button>
            )}
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            Showing <strong className="text-slate-700 dark:text-slate-300">{startRecord}–{endRecord}</strong> of{' '}
            <strong className="text-slate-700 dark:text-slate-300">{filteredDevices.length}</strong> biochips
            {filteredDevices.length !== totalCount && ` (filtered from ${totalCount} total)`}
          </div>
        </div>
      </div>

      {/* Devices Table or Loading / Empty States */}
      <div className="bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm dark:shadow-lg">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-center">
            <RefreshCw className="w-8 h-8 text-teal-600 dark:text-teal-400 animate-spin" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Loading Biochip Fleet Registry
            </p>
            <p className="text-xs text-slate-500 font-mono">
              Retrieving cryptographic nodes and active CRL signatures...
            </p>
          </div>
        ) : filteredDevices.length === 0 ? (
          <div className="py-16 px-4 flex flex-col items-center justify-center text-center">
            <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 mb-3">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No Matching Biochips Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-4 font-mono">
              {searchQuery
                ? `No biochips match '${searchQuery}' with status '${statusFilter}'. Try modifying your search or clearing active filters.`
                : `No biochips currently match the selected '${statusFilter}' filter criteria.`}
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 text-white text-xs font-semibold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Search & Filters</span>
            </button>
          </div>
        ) : (
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
                {paginatedDevices.map((device) => (
                  <tr
                    key={device.device_id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-900 dark:text-slate-200">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                        <span className="truncate max-w-[200px]" title={device.device_id}>
                          {device.device_id}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(device.device_id, `node-${device.device_id}`)}
                          className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                          title="Copy Node ID"
                        >
                          {copiedId === `node-${device.device_id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={device.status}>{device.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300 capitalize">
                      {device.role}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400">
                      {device.enrolled_at
                        ? new Date(device.enrolled_at).toLocaleString()
                        : 'Pending Registration'}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {device.status === 'AUTHORIZED' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleInspectKeys(device)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-[11px] text-teal-700 dark:text-teal-300 transition-colors shadow-2xs cursor-pointer"
                          >
                            <Fingerprint className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                            <span>Inspect PQC Keys</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 text-[11px] italic">
                          Unregistered
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {device.status === 'AUTHORIZED' && (
                        <button
                          onClick={() => handleRevoke(device.device_id)}
                          disabled={revokingId === device.device_id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 dark:border-rose-800/60 text-[11px] font-medium dark:text-rose-300 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
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
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Enhanced Pagination Controls Bar */}
        {!loading && filteredDevices.length > 0 && (
          <div className="p-3.5 bg-slate-50 dark:bg-[#0d131f] border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            {/* Rows Per Page Selector */}
            <div className="flex items-center gap-2 text-slate-500">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-teal-500"
              >
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-slate-400">
                (Page {validCurrentPage} of {totalPages})
              </span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                disabled={validCurrentPage === 1}
                className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="First Page"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={validCurrentPage === 1}
                className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {/* Page Number Buttons */}
              <div className="flex items-center gap-1 mx-1">
                {paginationRange.map((page, idx) => {
                  if (page === '...') {
                    return (
                      <span key={`ellipsis-${idx}`} className="px-1 text-slate-400">
                        ...
                      </span>
                    );
                  }
                  const pageNum = Number(page);
                  const isCurrent = pageNum === validCurrentPage;
                  return (
                    <button
                      key={`page-${pageNum}`}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-w-[28px] h-7 px-1.5 rounded text-xs font-semibold transition-colors ${
                        isCurrent
                          ? 'bg-teal-600 text-white shadow-2xs'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={validCurrentPage === totalPages}
                className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(totalPages)}
                disabled={validCurrentPage === totalPages}
                className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Last Page"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Enrolment Modal */}
      <Modal
        isOpen={isEnrolOpen}
        onClose={() => setIsEnrolOpen(false)}
        title="Enrol New Biochip Edge Node"
        subtitle="Provision single-use cryptographic token for verified hardware onboarding"
        maxWidth="max-w-2xl"
      >
        {!enrolResult ? (
          <form onSubmit={handleEnrolSubmit} className="space-y-4 text-xs font-sans">
            {enrolError && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-200 text-xs flex items-center gap-2 font-mono">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>{enrolError}</span>
              </div>
            )}

            {/* Device ID Input with Quick Generator */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase font-mono">
                  Device Hardware Identifier
                </label>
                <button
                  type="button"
                  onClick={() => generateRandomId('DMFB-LAB-')}
                  className="inline-flex items-center gap-1 text-[11px] text-teal-600 dark:text-teal-400 hover:underline font-mono"
                >
                  <Wand2 className="w-3 h-3" />
                  <span>Auto-Generate ID</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. DMFB-ICU-08"
                  value={newDeviceId}
                  onChange={(e) => setNewDeviceId(e.target.value)}
                  required
                  className={`w-full px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none ${
                    isDuplicateId
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-slate-300 dark:border-slate-700 focus:border-teal-500'
                  }`}
                />
              </div>

              {isDuplicateId ? (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 font-mono flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>This Device Identifier is already registered or provisioned in the fleet.</span>
                </p>
              ) : (
                <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10.5px] text-slate-500 font-mono">Quick prefix:</span>
                  {(['DMFB-ICU-', 'DMFB-LAB-', 'DMFB-STAT-', 'e3-pqc-128-'] as const).map((prefix) => (
                    <button
                      key={prefix}
                      type="button"
                      onClick={() => generateRandomId(prefix)}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10.5px] font-mono text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 transition-colors"
                    >
                      {prefix}*
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Node Role Selector Cards */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase font-mono mb-1.5">
                Node Architectural Role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div
                  onClick={() => setNewDeviceRole('device')}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    newDeviceRole === 'device'
                      ? 'bg-teal-50/60 dark:bg-teal-950/40 border-teal-500 ring-1 ring-teal-500'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      Biochip Node (`device`)
                    </span>
                    <input
                      type="radio"
                      checked={newDeviceRole === 'device'}
                      onChange={() => setNewDeviceRole('device')}
                      className="text-teal-600"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                    Executes cyber-physical microfluidic assays, droplet transport, and diagnostic telemetry.
                  </p>
                </div>

                <div
                  onClick={() => setNewDeviceRole('admin')}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    newDeviceRole === 'admin'
                      ? 'bg-teal-50/60 dark:bg-teal-950/40 border-teal-500 ring-1 ring-teal-500'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      Gateway Controller (`admin`)
                    </span>
                    <input
                      type="radio"
                      checked={newDeviceRole === 'admin'}
                      onChange={() => setNewDeviceRole('admin')}
                      className="text-teal-600"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                    Supervisory edge controller managing local biochip clusters and laboratory gateways.
                  </p>
                </div>
              </div>
            </div>

            {/* Department & Hardware Specs (Two Column) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase font-mono mb-1">
                  Clinical Department Zone
                </label>
                <div className="relative">
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-teal-500"
                  >
                    <option value="ICU Point-of-Care">ICU Point-of-Care</option>
                    <option value="Central Pathology & Hematology">Central Pathology & Hematology</option>
                    <option value="Emergency Stat Diagnostic Suite">Emergency Stat Diagnostic Suite</option>
                    <option value="Chemotherapy Compounding Cleanroom">Chemotherapy Compounding Cleanroom</option>
                    <option value="Automated Bio-Repository">Automated Bio-Repository</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase font-mono mb-1">
                  Microfluidic Architecture Spec
                </label>
                <div className="relative">
                  <select
                    value={newHardwareSpec}
                    onChange={(e) => setNewHardwareSpec(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-teal-500"
                  >
                    <option value="2D EWOD 16x16 Electrowetting Array">2D EWOD 16x16 Electrowetting Array</option>
                    <option value="2D EWOD 32x32 High-Density Multi-Assay Array">2D EWOD 32x32 High-Density Array</option>
                    <option value="Continuous Flow Microfluidic Module">Continuous Flow Microfluidic Module</option>
                    <option value="Point-of-Care Biosensor Cartridge">Point-of-Care Biosensor Cartridge</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Out-of-band delivery method */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase font-mono mb-1">
                Out-of-Band Delivery Channel
              </label>
              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setDeliveryChannel('nfc')}
                  className={`p-2 rounded-lg border text-center transition-colors ${
                    deliveryChannel === 'nfc'
                      ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  📶 NFC Tap / BLE
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryChannel('flashing')}
                  className={`p-2 rounded-lg border text-center transition-colors ${
                    deliveryChannel === 'flashing'
                      ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  🔌 Direct USB-C Flashing
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryChannel('voucher')}
                  className={`p-2 rounded-lg border text-center transition-colors ${
                    deliveryChannel === 'voucher'
                      ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  📄 Optical Escrow Voucher
                </button>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsEnrolOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={enrolLoading || isDuplicateId || !newDeviceId.trim()}
                className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {enrolLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating Cryptographic Token...</span>
                  </>
                ) : (
                  <>
                    <Key className="w-3.5 h-3.5" />
                    <span>Issue Enrolment Token</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Post-Issuance Token Screen with Utilities */
          <div className="space-y-4 text-xs font-sans">
            <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-500/40">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    One-Time Enrolment Token Provisioned
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    Assigned to node <strong className="font-mono text-teal-700 dark:text-teal-300">{enrolResult.deviceId}</strong> ({enrolResult.department})
                  </p>
                </div>
              </div>

              {/* Main Token Display Box */}
              <div className="mt-3.5 p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-2xs">
                <span className="font-mono text-sm font-bold text-teal-700 dark:text-teal-300 break-all select-all">
                  {enrolResult.code}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyText(enrolResult.code, 'enrol-token')}
                  className="px-2.5 py-1.5 rounded bg-teal-600 hover:bg-teal-700 text-white font-mono text-[11px] font-semibold shrink-0 transition-colors flex items-center gap-1 shadow-2xs"
                >
                  {copiedId === 'enrol-token' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Token</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Tabbed Provisioning Helpers */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
              <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setActiveEnrolTab('token')}
                  className={`px-3 py-1 rounded transition-colors ${
                    activeEnrolTab === 'token'
                      ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 font-semibold shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Quick Summary
                </button>
                <button
                  type="button"
                  onClick={() => setActiveEnrolTab('json')}
                  className={`px-3 py-1 rounded transition-colors flex items-center gap-1 ${
                    activeEnrolTab === 'json'
                      ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 font-semibold shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <FileCode className="w-3 h-3" />
                  <span>JSON Manifest</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveEnrolTab('cli')}
                  className={`px-3 py-1 rounded transition-colors flex items-center gap-1 ${
                    activeEnrolTab === 'cli'
                      ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 font-semibold shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Terminal className="w-3 h-3" />
                  <span>CLI Command</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveEnrolTab('escrow')}
                  className={`px-3 py-1 rounded transition-colors flex items-center gap-1 ${
                    activeEnrolTab === 'escrow'
                      ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 font-semibold shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <QrCode className="w-3 h-3" />
                  <span>Escrow Voucher</span>
                </button>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 font-mono text-[11px]">
                {activeEnrolTab === 'token' && (
                  <div className="space-y-2 text-slate-600 dark:text-slate-400">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-500">Device ID:</span>{' '}
                        <strong className="text-slate-800 dark:text-slate-200">{enrolResult.deviceId}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Role:</span>{' '}
                        <strong className="text-slate-800 dark:text-slate-200 capitalize">{enrolResult.role}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Zone:</span>{' '}
                        <strong className="text-slate-800 dark:text-slate-200">{enrolResult.department}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Delivery:</span>{' '}
                        <strong className="text-slate-800 dark:text-slate-200 capitalize">{enrolResult.deliveryChannel}</strong>
                      </div>
                    </div>
                    <p className="text-[10.5px] text-slate-500 pt-1">
                      Deliver this single-use secret securely out-of-band to device firmware during installation.
                    </p>
                  </div>
                )}

                {activeEnrolTab === 'json' && (
                  <div>
                    <pre className="text-[10px] leading-relaxed text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 overflow-x-auto select-all">
                      {JSON.stringify(
                        {
                          device_id: enrolResult.deviceId,
                          role: enrolResult.role,
                          department: enrolResult.department,
                          hardware_spec: enrolResult.hardwareSpec,
                          enrolment_code: enrolResult.code,
                          delivery_channel: enrolResult.deliveryChannel,
                          issued_at: new Date().toISOString(),
                        },
                        null,
                        2
                      )}
                    </pre>
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyText(
                            JSON.stringify(
                              {
                                device_id: enrolResult.deviceId,
                                role: enrolResult.role,
                                department: enrolResult.department,
                                hardware_spec: enrolResult.hardwareSpec,
                                enrolment_code: enrolResult.code,
                                delivery_channel: enrolResult.deliveryChannel,
                                issued_at: new Date().toISOString(),
                              },
                              null,
                              2
                            ),
                            'json-bundle'
                          )
                        }
                        className="px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px]"
                      >
                        {copiedId === 'json-bundle' ? 'Copied JSON!' : 'Copy JSON Manifest'}
                      </button>
                    </div>
                  </div>
                )}

                {activeEnrolTab === 'cli' && (
                  <div>
                    <pre className="text-[10px] leading-relaxed text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 overflow-x-auto select-all">
                      {`# Out-of-band registration command on biochip hardware
python3 scripts/register_device.py \\
  --device-id "${enrolResult.deviceId}" \\
  --token "${enrolResult.code}"`}
                    </pre>
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyText(
                            `python3 scripts/register_device.py --device-id "${enrolResult.deviceId}" --token "${enrolResult.code}"`,
                            'cli-cmd'
                          )
                        }
                        className="px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px]"
                      >
                        {copiedId === 'cli-cmd' ? 'Copied Command!' : 'Copy CLI Command'}
                      </button>
                    </div>
                  </div>
                )}

                {activeEnrolTab === 'escrow' && (
                  <div className="p-3 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-900 dark:bg-white p-1 rounded flex items-center justify-center shrink-0">
                      <QrCode className="w-12 h-12 text-white dark:text-slate-900" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-200 text-xs">
                        Optical Escrow Voucher
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Can be scanned via the cleanroom optical diagnostic camera to complete zero-touch hardware proof-of-possession.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cryptographic Security Assurance */}
            <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-mono">
              <p>• The server stores only the one-way cryptographic SHA-256 hash of this code.</p>
              <p>• The code is strictly single-use and will be consumed immediately upon registration.</p>
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-2 flex justify-between items-center border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={resetEnrolForm}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Enrol Another Node</span>
              </button>

              <button
                type="button"
                onClick={() => setIsEnrolOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 text-white text-xs font-semibold transition-colors"
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
        onClose={() => {
          setSelectedDevice(null);
          setKeyDetails(null);
        }}
        title={`Cryptographic Identity: ${selectedDevice?.device_id}`}
        subtitle="Verified Quantum-Resistant Public Keys"
        maxWidth="max-w-2xl"
      >
        {keyDetailsLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 text-teal-600 animate-spin" />
            <p className="text-xs text-slate-500 font-mono">
              Retrieving verified public keys from secure ledger...
            </p>
          </div>
        ) : (
          keyDetails && (
            <div className="space-y-4 text-xs font-mono">
              {/* Metadata & Encoding Format Selector */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]">
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">
                    Status:{' '}
                    <strong className="text-emerald-600 dark:text-emerald-400">
                      {keyDetails.status || selectedDevice?.status}
                    </strong>
                  </span>
                  <span className="text-slate-500">
                    Role:{' '}
                    <strong className="text-slate-700 dark:text-slate-300 capitalize">
                      {keyDetails.role || selectedDevice?.role}
                    </strong>
                  </span>
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
                    <span className="text-[10px] text-slate-500 font-sans">
                      Quantum-Resistant KEM
                    </span>
                  </div>
                </div>

                {keyDetails.kem_fingerprint && (
                  <div className="flex items-center justify-between gap-2 p-1.5 px-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-500">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">
                        Key Fingerprint:
                      </span>
                      <span className="font-mono text-slate-700 dark:text-slate-300 truncate">
                        {keyDetails.kem_fingerprint}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        copyKeyToClipboard(keyDetails.kem_fingerprint!, 'kem-fp')
                      }
                      className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 shrink-0"
                      title="Copy Fingerprint"
                    >
                      {copiedKey === 'kem-fp' ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
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
                      onClick={() =>
                        copyKeyToClipboard(
                          keyFormat === 'hex'
                            ? keyDetails.kem_public_key_hex || ''
                            : keyDetails.kem_public_key_b64 || '',
                          'kem-key'
                        )
                      }
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
                    <span className="text-[10px] text-slate-500 font-sans">
                      Quantum-Resistant Signature
                    </span>
                  </div>
                </div>

                {keyDetails.sig_fingerprint && (
                  <div className="flex items-center justify-between gap-2 p-1.5 px-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-500">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">
                        Key Fingerprint:
                      </span>
                      <span className="font-mono text-slate-700 dark:text-slate-300 truncate">
                        {keyDetails.sig_fingerprint}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        copyKeyToClipboard(keyDetails.sig_fingerprint!, 'sig-fp')
                      }
                      className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 shrink-0"
                      title="Copy Fingerprint"
                    >
                      {copiedKey === 'sig-fp' ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
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
                      onClick={() =>
                        copyKeyToClipboard(
                          keyFormat === 'hex'
                            ? keyDetails.sig_public_key_hex || ''
                            : keyDetails.sig_public_key_b64 || '',
                          'sig-key'
                        )
                      }
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
          )
        )}
      </Modal>
    </div>
  );
};
