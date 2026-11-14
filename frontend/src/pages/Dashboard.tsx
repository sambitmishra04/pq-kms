import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  Info,
  Cpu,
  KeyRound,
  ArrowRight,
  RefreshCw,
  Layers,
  Search,
} from 'lucide-react';
import { api } from '../api/client';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { CopyBadge } from '../components/common/CopyBadge';
import type { StateSummary, AuditResponse, SystemHealth, Device, AuditEvent } from '../types';

export const Dashboard: React.FC = () => {
  const [state, setState] = useState<StateSummary | null>(null);
  const [audit, setAudit] = useState<AuditResponse | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fleet list controls
  const [deviceFilter, setDeviceFilter] = useState<'all' | 'authorized' | 'revoked'>('all');
  const [deviceSearch, setDeviceSearch] = useState('');

  // Audit list controls
  const [auditFilter, setAuditFilter] = useState<'all' | 'accepted' | 'rejected' | 'info'>('all');
  const [auditSearch, setAuditSearch] = useState('');

  const fetchData = async () => {
    try {
      const [stateData, auditData, healthData] = await Promise.all([
        api.getState(),
        api.getAudit(20),
        api.getHealth(),
      ]);
      setState(stateData);
      setAudit(auditData);
      setHealth(healthData);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Metrics extraction with correct case handling and totals
  const totalDevices = state?.devices.length || 0;
  const authorizedDevices = state?.devices.filter((d) => d.status === 'AUTHORIZED').length || 0;
  const revokedDevicesCount = state?.revoked_devices?.length || 0;
  const activeSessions = state?.sessions.filter((s) => s.state === 'ACTIVE').length || 0;
  
  // Handle case variance in message_stats from backend
  const rawMsgStats = state?.message_stats as Record<string, number> | undefined;
  const acceptedMsgs = rawMsgStats?.ACCEPTED ?? rawMsgStats?.accepted ?? 0;
  const rejectedMsgs = rawMsgStats?.REJECTED ?? rawMsgStats?.rejected ?? 0;

  // Real audit record count from verification engine
  const totalAuditRecords = audit?.total_records ?? audit?.events?.length ?? 0;

  // Filtered devices
  const filteredDevices = useMemo(() => {
    if (!state?.devices) return [];
    return state.devices.filter((device: Device) => {
      const matchesSearch = device.device_id.toLowerCase().includes(deviceSearch.toLowerCase()) ||
        device.role.toLowerCase().includes(deviceSearch.toLowerCase());
      if (!matchesSearch) return false;

      if (deviceFilter === 'authorized') return device.status === 'AUTHORIZED';
      if (deviceFilter === 'revoked') return device.status === 'REVOKED';
      return true;
    });
  }, [state?.devices, deviceFilter, deviceSearch]);

  // Clean details sanitization: strictly strips raw algorithm identifiers, NIST, FIPS, FDA, and researcher citations
  const sanitizeAuditDetails = (details?: string): string => {
    if (!details) return '';
    return details
      .replace(/kem=\S+\s+sig=\S+/gi, 'Quantum-safe cryptographic keys initialized')
      .replace(/ML-KEM[-\w]*/gi, 'Quantum-Safe KEM')
      .replace(/ML-DSA[-\w]*/gi, 'Quantum-Safe Signature')
      .replace(/Kyber[-\w]*/gi, 'Quantum-Safe KEM')
      .replace(/Dilithium[-\w]*/gi, 'Quantum-Safe Signature')
      .replace(/AES[-\w]*/gi, 'Symmetric Cipher')
      .replace(/HKDF[-\w]*/gi, 'Key Derivation')
      .replace(/SHA[-\w]*/gi, 'Cryptographic Hash')
      .replace(/(?:Ali|Guo|Yao|[A-Z][a-z]+)\s+et\s+al\.?/gi, '')
      .replace(/\bet\s+al\.?/gi, '')
      .replace(/\[\d+\]/g, '')
      .replace(/FDA(\s+21\s+CFR(\s+Part\s+11)?)?/gi, '')
      .replace(/21\s+CFR(\s+Part\s+11)?/gi, '')
      .replace(/NIST(\s+SP|\s+FIPS|\s+[A-Z0-9-]+)*/gi, '')
      .replace(/FIPS(\s+[0-9-]+)*/gi, '')
      .replace(/ISO(\s+[0-9-]+)*/gi, '')
      .replace(/IEEE(\s+[0-9.-]+)*/gi, '')
      .replace(/RFC(\s+[0-9]+)*/gi, '')
      .replace(/\(\s*\)/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/^\s*[,.;:\-]\s*/, '')
      .replace(/\s*[,.;:\-]\s*$/, '')
      .trim();
  };

  const humanizeAuditEvent = (evt: AuditEvent): { summary: string; tag?: string } => {
    const rawDetails = evt.details || '';
    const cleanDetails = sanitizeAuditDetails(rawDetails);

    // Extract patient_id, device_id, or session_id for a clean tag
    const patientMatch = rawDetails.match(/patient_id=([^\s,]+)/);
    const deviceMatch = rawDetails.match(/device_id=([^\s,]+)/) || (evt.device_id ? [null, evt.device_id] : null);
    const sessionMatch = rawDetails.match(/session_id=([0-9a-fA-F]{8})/);

    let tag: string | undefined;
    if (patientMatch) tag = patientMatch[1];
    else if (deviceMatch) tag = deviceMatch[1];
    else if (sessionMatch) tag = `#${sessionMatch[1]}`;

    switch (evt.event_type) {
      case 'AUDIT_CHAIN_RESEALED':
        return {
          summary: 'Ledger sequence verified and cryptographic hash chain re-anchored across events.',
          tag,
        };
      case 'SECURITY_ALERT':
        return {
          summary: 'Tampering attempt detected: Invalid cryptographic authentication tag.',
          tag,
        };
      case 'TAMPER_ATTACK_BLOCKED':
        return {
          summary: 'Glucose telemetry payload modification intercepted by AEAD integrity check.',
          tag,
        };
      case 'REPLAY_ATTACK_BLOCKED':
        return {
          summary: 'Duplicate message rejected by sliding-window anti-replay counter.',
          tag,
        };
      case 'SESSION_DESTROYED':
        return {
          summary: 'KMS session terminated securely and volatile keys zeroized.',
          tag,
        };
      case 'SESSION_ROTATED':
        return {
          summary: 'Session key rotated under forward secrecy policy.',
          tag,
        };
      case 'SESSION_CREATED':
        return {
          summary: 'Quantum-resistant session initialized via ML-KEM-768.',
          tag,
        };
      case 'SERVER_STARTED':
        return {
          summary: 'Quantum-safe cryptographic engine and hardware isolation initialized.',
          tag,
        };
      case 'SERVER_STOPPED':
        return {
          summary: 'KMS server shutdown and session buffers purged.',
          tag,
        };
      case 'DEVICE_REVOKED':
        return {
          summary: 'Biochip credentials permanently revoked and CRL updated.',
          tag,
        };
      case 'CRL_GENERATED':
        return {
          summary: 'Certificate Revocation List regenerated and signed.',
          tag,
        };
      case 'CRL_VERIFY':
        return {
          summary: 'Revocation list signature and anti-rollback verified.',
          tag,
        };
      default: {
        let clean = cleanDetails
          .replace(/session_id=[0-9a-fA-F-]{36}/gi, '')
          .replace(/patient_id=[^\s,]+/gi, '')
          .replace(/device_id=[^\s,]+/gi, '')
          .replace(/attack=([a-zA-Z0-9_]+)/gi, 'attack: $1')
          .replace(/error=([a-zA-Z0-9_]+)/gi, 'error: $1')
          .replace(/reason=([a-zA-Z0-9_]+)/gi, 'reason: $1')
          .replace(/\s{2,}/g, ' ')
          .trim();
        if (!clean) {
          clean = `${evt.event_type.replace(/_/g, ' ')} recorded by ${evt.actor}`;
        }
        return { summary: clean, tag };
      }
    }
  };

  // Filtered audit events
  const filteredAuditEvents = useMemo(() => {
    if (!audit?.events) return [];
    return audit.events.filter((evt: AuditEvent) => {
      const sanitizedDetails = sanitizeAuditDetails(evt.details);
      const matchesSearch = 
        evt.event_type.toLowerCase().includes(auditSearch.toLowerCase()) ||
        evt.actor.toLowerCase().includes(auditSearch.toLowerCase()) ||
        sanitizedDetails.toLowerCase().includes(auditSearch.toLowerCase()) ||
        (evt.device_id && evt.device_id.toLowerCase().includes(auditSearch.toLowerCase()));
      if (!matchesSearch) return false;

      if (auditFilter === 'accepted') return evt.outcome === 'ACCEPTED';
      if (auditFilter === 'rejected') return evt.outcome === 'REJECTED';
      if (auditFilter === 'info') return evt.outcome === 'INFO';
      return true;
    });
  }, [audit?.events, auditFilter, auditSearch]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Security Operations Console
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-teal-600 dark:text-teal-400' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Sync KMS State'}</span>
          </button>
        </div>
      </div>

      {/* 4 Clean Core Stat Cards (Green Trend Pills Removed) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Edge Biochip Nodes"
          value={totalDevices.toLocaleString()}
          subtitle={`${authorizedDevices.toLocaleString()} Authorized • ${revokedDevicesCount} Revoked`}
          variant="teal"
          icon={<Cpu className="w-5 h-5" />}
        />
        <StatCard
          title="In-Memory Session Keys"
          value={activeSessions.toLocaleString()}
          subtitle="Volatile memory"
          variant="purple"
          icon={<KeyRound className="w-5 h-5" />}
        />
        <StatCard
          title="AEAD Message Frames"
          value={acceptedMsgs.toLocaleString()}
          subtitle={`${rejectedMsgs.toLocaleString()} Tampered/Replay blocked`}
          variant="blue"
          icon={<ShieldCheck className="w-5 h-5" />}
        />
        <StatCard
          title="Audit Chain"
          value={audit?.chain_valid ? 'INTACT' : 'CORRUPTED'}
          subtitle={`Cryptographically sealed • ${totalAuditRecords.toLocaleString()} records`}
          variant={audit?.chain_valid ? 'teal' : 'crimson'}
          icon={<Layers className="w-5 h-5" />}
        />
      </div>

      {/* Grid: Live Biochip Device Fleet + Live Forensic Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Biochip Device Fleet */}
        <div className="bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm dark:shadow-lg flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80 mb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Biochip Device Fleet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Authorized edge nodes executing assays</p>
            </div>
            <Link
              to="/devices"
              className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium flex items-center gap-1 transition-colors"
            >
              Manage Fleet <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Controls: Search + Status Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-3.5">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={deviceSearch}
                onChange={(e) => setDeviceSearch(e.target.value)}
                placeholder="Search device ID..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-teal-500 transition-colors"
              />
            </div>
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shrink-0">
              <button
                type="button"
                onClick={() => setDeviceFilter('all')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  deviceFilter === 'all'
                    ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                All ({totalDevices})
              </button>
              <button
                type="button"
                onClick={() => setDeviceFilter('authorized')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  deviceFilter === 'authorized'
                    ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Authorized ({authorizedDevices})
              </button>
              <button
                type="button"
                onClick={() => setDeviceFilter('revoked')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  deviceFilter === 'revoked'
                    ? 'bg-white dark:bg-slate-700 text-rose-700 dark:text-rose-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Revoked ({revokedDevicesCount})
              </button>
            </div>
          </div>

          {/* Device Cards List */}
          <div className="space-y-2 flex-1 overflow-y-auto max-h-[360px] pr-0.5">
            {filteredDevices.length > 0 ? (
              filteredDevices.slice(0, 6).map((device) => (
                <div
                  key={device.device_id}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-[#0d131f] border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {device.device_id}
                      </span>
                      <Badge status={device.status}>{device.status}</Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 font-mono">
                      Role: {device.role} • Enrolled: {device.enrolled_at ? new Date(device.enrolled_at).toLocaleTimeString() : 'N/A'}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <CopyBadge text={device.device_id} displayText="Copy ID" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs">
                No matching biochip devices found.
              </div>
            )}
          </div>
        </div>

        {/* Right: Audit Trail */}
        <div className="bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm dark:shadow-lg flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80 mb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Audit Trail
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Cryptographically chained event stream</p>
            </div>
            <Link
              to="/audit"
              className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium flex items-center gap-1 transition-colors"
            >
              Full Log <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Controls: Search + Outcome Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-3.5">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                placeholder="Filter events..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-teal-500 transition-colors"
              />
            </div>
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shrink-0">
              <button
                type="button"
                onClick={() => setAuditFilter('all')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  auditFilter === 'all'
                    ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setAuditFilter('accepted')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  auditFilter === 'accepted'
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Accepted
              </button>
              <button
                type="button"
                onClick={() => setAuditFilter('rejected')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  auditFilter === 'rejected'
                    ? 'bg-white dark:bg-slate-700 text-rose-700 dark:text-rose-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Rejected
              </button>
              <button
                type="button"
                onClick={() => setAuditFilter('info')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  auditFilter === 'info'
                    ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Info
              </button>
            </div>
          </div>

          {/* Audit Events List */}
          <div className="space-y-2 flex-1 overflow-y-auto max-h-[360px] pr-0.5">
            {filteredAuditEvents.length > 0 ? (
              filteredAuditEvents.slice(0, 6).map((evt) => {
                const { summary, tag } = humanizeAuditEvent(evt);
                return (
                  <div
                    key={evt.event_id}
                    title={evt.details ? sanitizeAuditDetails(evt.details) : undefined}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0d131f] border border-slate-200 dark:border-slate-800/80 text-xs flex items-start gap-3 hover:bg-slate-100/60 dark:hover:bg-slate-900/60 transition-colors"
                  >
                    <div className="mt-0.5 shrink-0">
                      {evt.outcome === 'REJECTED' ? (
                        <ShieldAlert className="w-4 h-4 text-rose-500" />
                      ) : evt.outcome === 'ACCEPTED' ? (
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Info className="w-4 h-4 text-blue-500" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                          <span className="font-mono text-[11px] font-bold text-slate-800 dark:text-slate-300">
                            {evt.event_type}
                          </span>
                          <Badge status={evt.outcome}>{evt.outcome}</Badge>
                          {tag && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                              {tag}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                            by {evt.actor}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                          {new Date(evt.time).toLocaleTimeString()}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                        {summary}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs">
                No matching audit events found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
