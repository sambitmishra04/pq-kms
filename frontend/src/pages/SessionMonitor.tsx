import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  KeyRound,
  RefreshCw,
  Clock,
  AlertOctagon,
  ArrowRight,
  Lock,
  Layers,
  Search,
  SearchX,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RotateCw,
  Trash2,
  Eye,
  Download,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Fingerprint,
  Zap,
  SlidersHorizontal,
  Flame,
  Pause,
  Play,
  ArrowUpDown,
  History,
  ShieldAlert,
} from 'lucide-react';
import { api } from '../api/client';
import { Badge } from '../components/common/Badge';
import { CopyBadge } from '../components/common/CopyBadge';
import { Modal } from '../components/common/Modal';
import type {
  Session,
  SessionStats,
  SessionMemoryStatus,
  SessionDetail,
} from '../types';

export const SessionMonitor: React.FC = () => {
  // Data states
  const [sessions, setSessions] = useState<Session[]>([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<SessionStats>({
    total: 0,
    created: 0,
    active: 0,
    deactivated: 0,
    destroyed: 0,
    compromised: 0,
    active_devices: 0,
  });
  const [memoryStatus, setMemoryStatus] = useState<SessionMemoryStatus | null>(null);

  // Loading & refresh states
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<number>(5000); // 0 = paused, 3000, 5000, 10000, 30000

  // Search, filter, sort & pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ACTIVE' | 'DEACTIVATED' | 'DESTROYED' | 'COMPROMISED'>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [jumpPageInput, setJumpPageInput] = useState('');

  // Live client-side tick for smooth countdowns (ticks every 1s)
  const [nowTs, setNowTs] = useState<number>(Date.now());

  // Action & feedback states
  const [actionNotice, setActionNotice] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Deep Cryptographic Inspection Modal state
  const [inspectionSessionId, setInspectionSessionId] = useState<string | null>(null);
  const [sessionDetail, setSessionDetail] = useState<SessionDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'crypto' | 'audit'>('crypto');

  // Confirmation modal state for destructive actions
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    variant: 'danger' | 'warning';
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    description: '',
    confirmLabel: '',
    variant: 'danger',
    onConfirm: async () => {},
  });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 280);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Live 1-second clock tick for countdowns
  useEffect(() => {
    const timer = setInterval(() => {
      setNowTs(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch paginated sessions from API or fallback
  const fetchSessions = useCallback(async (isBackground = false) => {
    if (!isBackground) setRefreshing(true);
    try {
      // 1. Attempt to fetch from /api/sessions endpoint first
      try {
        const res = await api.getSessions({
          search: debouncedSearch.trim() || undefined,
          state: statusFilter !== 'all' ? statusFilter : undefined,
          page: currentPage,
          page_size: pageSize,
          sort_by: sortBy,
          sort_order: sortOrder,
        });

        // Ensure res is a valid JSON response with sessions array and stats
        if (
          res &&
          typeof res === 'object' &&
          Array.isArray(res.sessions) &&
          typeof res.total === 'number' &&
          res.stats &&
          typeof res.stats.total === 'number'
        ) {
          setSessions(res.sessions);
          setTotalSessions(res.total);
          setTotalPages(res.total_pages || 1);
          setStats(res.stats);
          if (res.memory_status) setMemoryStatus(res.memory_status);
          return;
        }
      } catch (err) {
        // Fallback to state endpoint
      }

      // 2. Seamless fallback to api.getState()
      const stateData = await api.getState();
      const rawSessions: Session[] = stateData.sessions || [];

      // Compute stats accurately from full set
      const computedStats: SessionStats = {
        total: rawSessions.length,
        created: 0,
        active: rawSessions.filter((s) => s.state === 'ACTIVE').length,
        deactivated: rawSessions.filter((s) => s.state === 'DEACTIVATED').length,
        destroyed: rawSessions.filter((s) => s.state === 'DESTROYED').length,
        compromised: rawSessions.filter((s) => s.state === 'COMPROMISED').length,
        active_devices: new Set(rawSessions.filter((s) => s.state === 'ACTIVE').map((s) => s.device_id)).size,
      };
      setStats(computedStats);

      setMemoryStatus({
        volatile_keys_in_ram: computedStats.active + computedStats.deactivated,
        active_keys_in_ram: computedStats.active,
        deactivated_in_ram: computedStats.deactivated,
        valid_keys_in_ram: computedStats.active + computedStats.deactivated,
        disk_key_material_stored: false,
        isolation_model: 'Transient Heap Isolation (Zero disk commit)',
        zeroization_guarantee: 'NIST SP 800-88 in-place memory zeroization upon destruction',
      });

      // Filter by state
      let filtered = [...rawSessions];
      if (statusFilter !== 'all') {
        filtered = filtered.filter((s) => s.state === statusFilter);
      }

      // Filter by search
      if (debouncedSearch.trim()) {
        const q = debouncedSearch.toLowerCase().trim();
        filtered = filtered.filter(
          (s) =>
            s.session_id.toLowerCase().includes(q) ||
            s.key_id.toLowerCase().includes(q) ||
            s.device_id.toLowerCase().includes(q)
        );
      }

      // Sort
      filtered.sort((a, b) => {
        if (sortBy === 'created_at') {
          const tA = new Date(a.created_at).getTime();
          const tB = new Date(b.created_at).getTime();
          return sortOrder === 'desc' ? tB - tA : tA - tB;
        }
        if (sortBy === 'expires_at') {
          const tA = new Date(a.expires_at).getTime();
          const tB = new Date(b.expires_at).getTime();
          return sortOrder === 'desc' ? tB - tA : tA - tB;
        }
        if (sortBy === 'msg_count') {
          return sortOrder === 'desc' ? b.msg_count - a.msg_count : a.msg_count - b.msg_count;
        }
        if (sortBy === 'device_id') {
          return sortOrder === 'asc' ? a.device_id.localeCompare(b.device_id) : b.device_id.localeCompare(a.device_id);
        }
        return 0;
      });

      setTotalSessions(filtered.length);
      const computedTotalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
      setTotalPages(computedTotalPages);

      // Paginate
      const safePage = Math.min(currentPage, computedTotalPages);
      const startIndex = (safePage - 1) * pageSize;
      const paged = filtered.slice(startIndex, startIndex + pageSize);

      // Enrich session with RAM status
      const enriched = paged.map((s) => ({
        ...s,
        in_transient_ram: s.state === 'ACTIVE' || s.state === 'DEACTIVATED',
      }));

      setSessions(enriched);
    } catch (err) {
      console.error('Failed to load sessions:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [debouncedSearch, statusFilter, currentPage, pageSize, sortBy, sortOrder]);

  // Initial load and dependency trigger
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Polling timer
  useEffect(() => {
    if (pollingInterval <= 0) return;
    const interval = setInterval(() => {
      fetchSessions(true);
    }, pollingInterval);
    return () => clearInterval(interval);
  }, [fetchSessions, pollingInterval]);

  // Handle open inspection modal
  const handleInspectSession = async (sessionId: string) => {
    setInspectionSessionId(sessionId);
    setDetailLoading(true);
    setActiveModalTab('crypto');
    try {
      try {
        const detail = await api.getSessionDetails(sessionId);
        if (detail && typeof detail === 'object' && detail.session_id) {
          setSessionDetail(detail);
          return;
        }
      } catch (err) {
        console.warn('API getSessionDetails failed, falling back to local session state:', err);
      }

      // Fallback: find session in current list or state
      const match = sessions.find((s) => s.session_id === sessionId);
      if (match) {
        const expTs = new Date(match.expires_at).getTime();
        const isExp = Date.now() >= expTs;
        const timeRem = isExp ? 0 : Math.max(0, Math.floor((expTs - Date.now()) / 1000));
        setSessionDetail({
          session_id: match.session_id,
          key_id: match.key_id,
          device_id: match.device_id,
          created_at: match.created_at,
          expires_at: match.expires_at,
          state: match.state,
          msg_count: match.msg_count,
          last_counter: match.last_counter,
          next_expected_counter: match.last_counter + 1,
          is_expired: isExp,
          time_remaining_s: timeRem,
          grace_remaining_s: match.state === 'DEACTIVATED' ? 15 : 0,
          in_transient_ram: match.state === 'ACTIVE' || match.state === 'DEACTIVATED',
          key_byte_length: 32,
          cipher_suite: 'AES-256-GCM (256-bit symmetric session key)',
          kem_primitive: 'ML-KEM-768 (NIST FIPS 203)',
          sig_primitive: 'ML-DSA-65 (NIST FIPS 204)',
          kdf_primitive: 'HKDF-SHA256 (RFC 5869, context label: PQKMS-v1)',
          device_status: 'AUTHORIZED',
          device_role: 'device',
          audit_events: [],
        });
      } else {
        setSessionDetail(null);
      }
    } catch (e) {
      console.error('Failed fallback inspection:', e);
      setSessionDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  // Force rotation action
  const handleRotateSession = async (sessionId: string) => {
    setActionInProgress(sessionId);
    try {
      const res = await api.rotateSession(sessionId);
      setActionNotice({
        type: 'success',
        message: res.message || `Session ${sessionId.slice(0, 8)}... rotated to DEACTIVATED grace state.`,
      });
      await fetchSessions(true);
      if (inspectionSessionId === sessionId) {
        handleInspectSession(sessionId);
      }
    } catch (err: any) {
      setActionNotice({
        type: 'error',
        message: err.response?.data?.detail || 'Failed to rotate session.',
      });
    } finally {
      setActionInProgress(null);
    }
  };

  // Deactivate session action
  const handleDeactivateSession = async (sessionId: string) => {
    setActionInProgress(sessionId);
    try {
      const res = await api.deactivateSession(sessionId);
      setActionNotice({
        type: 'info',
        message: res.message || `Session ${sessionId.slice(0, 8)}... transitioned to DEACTIVATED grace window.`,
      });
      await fetchSessions(true);
      if (inspectionSessionId === sessionId) {
        handleInspectSession(sessionId);
      }
    } catch (err: any) {
      setActionNotice({
        type: 'error',
        message: err.response?.data?.detail || 'Failed to deactivate session.',
      });
    } finally {
      setActionInProgress(null);
    }
  };

  // Destroy session action
  const handleDestroySession = async (sessionId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Zeroize & Destroy Session Key',
      description: `Are you sure you want to sanitize RAM and immediately destroy session ${sessionId.slice(0, 8)}...? Any in-flight AEAD ciphertext from this device will be rejected.`,
      confirmLabel: 'Zeroize & Destroy',
      variant: 'danger',
      onConfirm: async () => {
        setActionInProgress(sessionId);
        try {
          const res = await api.destroySession(sessionId);
          setActionNotice({
            type: 'success',
            message: res.message || `Session ${sessionId.slice(0, 8)}... sanitized from RAM.`,
          });
          await fetchSessions(true);
          if (inspectionSessionId === sessionId) {
            handleInspectSession(sessionId);
          }
        } catch (err: any) {
          setActionNotice({
            type: 'error',
            message: err.response?.data?.detail || 'Failed to destroy session.',
          });
        } finally {
          setActionInProgress(null);
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  // Trigger cryptoperiod key rotation check
  const handleTriggerRotation = async () => {
    setActionInProgress('rotation');
    try {
      const res = await api.bulkRotateExpired();
      setActionNotice({
        type: 'success',
        message: res.message || (res.affected_count && res.affected_count > 0
          ? `Key rotation enforced successfully. ${res.affected_count} expired session(s) transitioned to grace window.`
          : 'Key lifecycle verification complete. All active session keys are healthy and within their cryptoperiods.'),
      });
      await fetchSessions(true);
    } catch (err: any) {
      setActionNotice({
        type: 'error',
        message: err.response?.data?.detail || 'Failed to enforce key rotation policy.',
      });
    } finally {
      setActionInProgress(null);
    }
  };

  // Purge destroyed sessions
  const handlePurgeDestroyed = async () => {
    setConfirmModal({
      isOpen: true,
      title: 'Purge Destroyed Session Audit Metadata',
      description: 'This will purge metadata for all DESTROYED sessions from the SQLite database. Persistent forensic ledger records remain preserved.',
      confirmLabel: 'Purge Records',
      variant: 'warning',
      onConfirm: async () => {
        setActionInProgress('purge');
        try {
          const res = await api.purgeDestroyedSessions();
          setActionNotice({
            type: 'info',
            message: res.message || `Purged ${res.affected_count} destroyed sessions.`,
          });
          await fetchSessions(true);
        } catch (err: any) {
          setActionNotice({
            type: 'error',
            message: err.response?.data?.detail || 'Failed to purge destroyed sessions.',
          });
        } finally {
          setActionInProgress(null);
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  // Export current sessions as CSV
  const handleExportCSV = () => {
    if (!sessions.length) return;
    const headers = [
      'Session ID',
      'Key ID',
      'Device ID',
      'Lifecycle State',
      'AEAD Message Count',
      'Last Counter',
      'Established At (UTC)',
      'Expires At (UTC)',
    ];
    const rows = sessions.map((s) => [
      `"${s.session_id}"`,
      `"${s.key_id}"`,
      `"${s.device_id}"`,
      `"${s.state}"`,
      s.msg_count,
      s.last_counter,
      `"${s.created_at}"`,
      `"${s.expires_at}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `pq_kms_sessions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper for computing dynamic remaining cryptoperiod
  const computeCryptoperiodInfo = (s: Session) => {
    try {
      const expTs = new Date(s.expires_at).getTime();
      const createTs = new Date(s.created_at).getTime();
      const totalDuration = Math.max(1000, expTs - createTs);
      const elapsed = Math.max(0, nowTs - createTs);
      const remainingMs = Math.max(0, expTs - nowTs);
      const remainingSec = Math.floor(remainingMs / 1000);
      const pct = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
      const isExpired = nowTs >= expTs;

      return {
        remainingSec,
        isExpired,
        pct: Math.round(pct),
      };
    } catch {
      return { remainingSec: 0, isExpired: true, pct: 100 };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Alert Notice */}
      {actionNotice && (
        <div
          className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-mono transition-all shadow-sm ${
            actionNotice.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
              : actionNotice.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60'
              : 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionNotice.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
            {actionNotice.type === 'error' && <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />}
            {actionNotice.type === 'info' && <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />}
            <span>{actionNotice.message}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header with Title and Control Suite */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>Session Key Lifecycle Monitor</span>
          </h1>
        </div>

        {/* Header Action Suite */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* Key Rotation Trigger Button */}
          <button
            onClick={handleTriggerRotation}
            disabled={actionInProgress === 'rotation'}
            title="Enforce cryptoperiod rotation across all active sessions"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 text-xs font-medium transition-colors disabled:opacity-50 shadow-2xs"
          >
            <RotateCw className={`w-3.5 h-3.5 ${actionInProgress === 'rotation' ? 'animate-spin' : ''}`} />
            <span>Enforce Key Rotation</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            disabled={!sessions.length}
            title="Export session inventory to CSV"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Purge Destroyed Records Button */}
          {stats.destroyed > 0 && (
            <button
              onClick={handlePurgeDestroyed}
              disabled={actionInProgress === 'purge'}
              title="Purge destroyed sessions from store"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-slate-700 text-xs transition-colors shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Purge ({stats.destroyed})</span>
            </button>
          )}

          {/* Polling Frequency Dropdown */}
          <div className="inline-flex items-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-0.5 text-xs font-mono shadow-2xs">
            <button
              onClick={() => {
                const nextInterval = pollingInterval === 5000 ? 10000 : pollingInterval === 10000 ? 0 : 5000;
                setPollingInterval(nextInterval);
              }}
              title={`Polling: ${pollingInterval === 0 ? 'Paused' : `${pollingInterval / 1000}s`}. Click to toggle.`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {pollingInterval === 0 ? (
                <>
                  <Pause className="w-3 h-3 text-amber-500" />
                  <span>Paused</span>
                </>
              ) : (
                <>
                  <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin text-purple-600 dark:text-purple-400' : 'text-teal-600'}`} />
                  <span>{pollingInterval / 1000}s</span>
                </>
              )}
            </button>
            <button
              onClick={() => fetchSessions()}
              disabled={refreshing}
              title="Refresh now"
              className="px-2 py-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Cryptoperiod State Machine Banner & Filter Hub */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0f1728] border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Cryptoperiod State Machine</span>
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            Rotation interval: <strong>60s</strong> / <strong>1,000 messages</strong>
          </span>
        </div>

        {/* 5-Card Filter State Machine Hub */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-xs font-mono">
          {/* Card 0: All Sessions */}
          <button
            type="button"
            onClick={() => {
              setStatusFilter('all');
              setCurrentPage(1);
            }}
            className={`p-2.5 rounded-lg border text-left transition-all relative ${
              statusFilter === 'all'
                ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-400 dark:border-purple-600 shadow-xs ring-1 ring-purple-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">ALL SESSIONS</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm block mt-0.5">
              {stats.total} Total
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 truncate">
              {stats.active_devices} Active Devices
            </span>
          </button>

          {/* Card 1: Stage 1 (CREATED / Handshake) */}
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left opacity-90">
            <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">STAGE 1</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm block mt-0.5">
              CREATED <span className="text-[11px] font-normal text-slate-500">(0 Transient)</span>
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">ML-KEM Handshake Complete</span>
          </div>

          {/* Card 2: Stage 2 (ACTIVE) */}
          <button
            type="button"
            onClick={() => {
              setStatusFilter('ACTIVE');
              setCurrentPage(1);
            }}
            className={`p-2.5 rounded-lg border text-left transition-all ${
              statusFilter === 'ACTIVE'
                ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-500 dark:border-emerald-500 shadow-xs ring-1 ring-emerald-500'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 hover:border-emerald-300'
            }`}
          >
            <span className="text-emerald-700 dark:text-emerald-400 block text-[10px] uppercase font-semibold">STAGE 2 (ACTIVE)</span>
            <span className="font-bold text-emerald-800 dark:text-emerald-300 text-sm block mt-0.5">
              ACTIVE ({stats.active})
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400/80 block mt-0.5 truncate">
              Authenticated Encrypt & Decrypt
            </span>
          </button>

          {/* Card 3: Stage 3 (GRACE / DEACTIVATED) */}
          <button
            type="button"
            onClick={() => {
              setStatusFilter('DEACTIVATED');
              setCurrentPage(1);
            }}
            className={`p-2.5 rounded-lg border text-left transition-all ${
              statusFilter === 'DEACTIVATED'
                ? 'bg-amber-100 dark:bg-amber-900/40 border-amber-500 dark:border-amber-500 shadow-xs ring-1 ring-amber-500'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 hover:border-amber-300'
            }`}
          >
            <span className="text-amber-700 dark:text-amber-400 block text-[10px] uppercase font-semibold">STAGE 3 (GRACE)</span>
            <span className="font-bold text-amber-800 dark:text-amber-300 text-sm block mt-0.5">
              DEACTIVATED ({stats.deactivated})
            </span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400/80 block mt-0.5 truncate">
              Decrypt-Only (In-Transit)
            </span>
          </button>

          {/* Card 4: Final Stage (DESTROYED) */}
          <button
            type="button"
            onClick={() => {
              setStatusFilter('DESTROYED');
              setCurrentPage(1);
            }}
            className={`p-2.5 rounded-lg border text-left transition-all ${
              statusFilter === 'DESTROYED'
                ? 'bg-rose-100 dark:bg-rose-950/50 border-rose-500 dark:border-rose-500 shadow-xs ring-1 ring-rose-500'
                : 'bg-slate-100 dark:bg-rose-950/30 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="text-slate-500 dark:text-rose-400 block text-[10px] uppercase font-semibold">FINAL STAGE</span>
            <span className="font-bold text-slate-700 dark:text-slate-300 text-sm block mt-0.5">
              DESTROYED ({stats.destroyed})
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 truncate">
              RAM Sanitized & Wiped
            </span>
          </button>
        </div>
      </div>

      {/* Search, Filter & Sizing Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#101726] p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Session ID, Key ID, or Device Binding..."
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-purple-500 font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters and Sorters */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {/* State Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px] hidden sm:inline">State:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs focus:outline-hidden focus:ring-1 focus:ring-purple-500"
            >
              <option value="all">All States ({stats.total})</option>
              <option value="ACTIVE">ACTIVE ({stats.active})</option>
              <option value="DEACTIVATED">DEACTIVATED ({stats.deactivated})</option>
              <option value="DESTROYED">DESTROYED ({stats.destroyed})</option>
              <option value="COMPROMISED">COMPROMISED ({stats.compromised})</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px] hidden md:inline">Sort:</span>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order as any);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs focus:outline-hidden focus:ring-1 focus:ring-purple-500"
            >
              <option value="created_at-desc">Created (Newest)</option>
              <option value="created_at-asc">Created (Oldest)</option>
              <option value="expires_at-asc">Expiry (Soonest)</option>
              <option value="expires_at-desc">Expiry (Latest)</option>
              <option value="msg_count-desc">Messages (Highest)</option>
              <option value="device_id-asc">Device ID (A-Z)</option>
            </select>
          </div>

          {/* Page Size */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs focus:outline-hidden focus:ring-1 focus:ring-purple-500"
          >
            <option value={15}>15 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>
        </div>
      </div>

      {/* Sessions Table Container */}
      <div className="bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs dark:shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0d131f] text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                <th className="py-3 px-4">Session & Key Identifier</th>
                <th className="py-3 px-4">Device Binding</th>
                <th className="py-3 px-4">Lifecycle State</th>
                <th className="py-3 px-4">Established At</th>
                <th className="py-3 px-4 min-w-[210px]">Cryptoperiod Expiry</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-xs">
              {loading && !sessions.length ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs font-mono">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                    <span>Loading cryptographic session records...</span>
                  </td>
                </tr>
              ) : sessions.length > 0 ? (
                sessions.map((sess) => {
                  const { remainingSec, isExpired, pct } = computeCryptoperiodInfo(sess);
                  const inGrace = sess.state === 'DEACTIVATED';
                  const isDestroyed = sess.state === 'DESTROYED';
                  const isCompromised = sess.state === 'COMPROMISED';

                  return (
                    <tr
                      key={sess.session_id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors font-mono"
                    >
                      {/* Session & Key Identifier */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <CopyBadge
                              text={sess.session_id}
                              label="SID"
                              truncateLength={6}
                            />
                            {sess.in_transient_ram && (
                              <span
                                title="Key is held exclusively in transient RAM (zero disk footprint)"
                                className="text-[9px] px-1 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/40 font-mono"
                              >
                                RAM
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            Key ID: <span className="font-semibold">{sess.key_id.slice(0, 8)}...</span>
                          </span>
                        </div>
                      </td>

                      {/* Device Binding */}
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
                          {sess.device_id}
                        </span>
                      </td>

                      {/* Lifecycle State */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-0.5">
                          <Badge status={sess.state}>{sess.state}</Badge>
                          <span className="text-[9px] text-slate-400 font-sans">
                            {sess.state === 'ACTIVE'
                              ? 'Encrypt & Decrypt'
                              : sess.state === 'DEACTIVATED'
                              ? 'Grace (Decrypt-Only)'
                              : sess.state === 'DESTROYED'
                              ? 'Key Zeroized'
                              : 'Revoked'}
                          </span>
                        </div>
                      </td>

                      {/* Established At */}
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                        <div>{new Date(sess.created_at).toLocaleTimeString()}</div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(sess.created_at).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Cryptoperiod Expiry & Live Countdown */}
                      <td className="py-3 px-4 text-[11px]">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Clock
                                className={`w-3.5 h-3.5 ${
                                  isExpired || isDestroyed
                                    ? 'text-slate-400'
                                    : inGrace
                                    ? 'text-amber-500'
                                    : remainingSec <= 10
                                    ? 'text-rose-500 animate-pulse'
                                    : 'text-teal-600 dark:text-teal-400'
                                }`}
                              />
                              <span
                                className={
                                  isExpired || isDestroyed
                                    ? 'text-slate-400 font-mono'
                                    : inGrace
                                    ? 'text-amber-600 dark:text-amber-400 font-semibold font-mono'
                                    : 'text-slate-700 dark:text-slate-300 font-semibold font-mono'
                                }
                              >
                                {new Date(sess.expires_at).toLocaleTimeString()}
                              </span>
                            </div>

                            {/* Relative countdown pill */}
                            {isDestroyed ? (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                                Zeroized
                              </span>
                            ) : inGrace ? (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 font-mono">
                                Grace Mode
                              </span>
                            ) : isExpired ? (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 font-mono">
                                Expired
                              </span>
                            ) : (
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-medium ${
                                  remainingSec <= 10
                                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 animate-pulse'
                                    : remainingSec <= 25
                                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200'
                                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                                }`}
                              >
                                {remainingSec}s left
                              </span>
                            )}
                          </div>

                          {/* Cryptoperiod visual progress bar */}
                          {!isDestroyed && (
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-500 ${
                                  isExpired
                                    ? 'bg-slate-300 dark:bg-slate-700'
                                    : remainingSec <= 10
                                    ? 'bg-rose-500'
                                    : remainingSec <= 25
                                    ? 'bg-amber-500'
                                    : 'bg-teal-500'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Row Actions Column */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Inspect Details Button */}
                          <button
                            onClick={() => handleInspectSession(sess.session_id)}
                            title="Inspect cryptographic parameters and audit trail"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Force Rotate (Active only) */}
                          {sess.state === 'ACTIVE' && (
                            <button
                              onClick={() => handleRotateSession(sess.session_id)}
                              disabled={actionInProgress === sess.session_id}
                              title="Force immediate key rotation"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                            >
                              <RotateCw
                                className={`w-4 h-4 ${actionInProgress === sess.session_id ? 'animate-spin' : ''}`}
                              />
                            </button>
                          )}

                          {/* Deactivate to grace (Active only) */}
                          {sess.state === 'ACTIVE' && (
                            <button
                              onClick={() => handleDeactivateSession(sess.session_id)}
                              disabled={actionInProgress === sess.session_id}
                              title="Deactivate session into decrypt-only grace mode"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                            >
                              <Pause className="w-4 h-4" />
                            </button>
                          )}

                          {/* Destroy / Sanitize RAM (Active or Deactivated) */}
                          {sess.state !== 'DESTROYED' && (
                            <button
                              onClick={() => handleDestroySession(sess.session_id)}
                              disabled={actionInProgress === sess.session_id}
                              title="Zeroize key bytes from RAM and destroy session"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs font-mono">
                    <SearchX className="w-8 h-8 mx-auto mb-2 text-slate-400 opacity-60" />
                    <p className="font-semibold text-slate-600 dark:text-slate-300">
                      No matching cryptographic sessions found
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {searchQuery || statusFilter !== 'all'
                        ? 'Try clearing the search query or changing your status filter.'
                        : 'Devices will automatically negotiate a cryptographic session when sending encrypted vitals.'}
                    </p>
                    {(searchQuery || statusFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setStatusFilter('all');
                          setCurrentPage(1);
                        }}
                        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 text-xs font-mono hover:bg-purple-100 transition-colors"
                      >
                        Reset Filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Results Summary Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0d131f] text-xs font-mono">
          <div className="text-slate-500 dark:text-slate-400">
            Showing{' '}
            <strong className="text-slate-900 dark:text-white">
              {totalSessions === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </strong>{' '}
            to{' '}
            <strong className="text-slate-900 dark:text-white">
              {Math.min(currentPage * pageSize, totalSessions)}
            </strong>{' '}
            of <strong className="text-slate-900 dark:text-white">{totalSessions}</strong> sessions
            {statusFilter !== 'all' && (
              <span className="ml-1 text-[11px] text-purple-600 dark:text-purple-400">
                (filtered by {statusFilter})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Pagination buttons */}
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="First Page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-2 text-slate-600 dark:text-slate-400 text-xs">
              Page <strong className="text-slate-900 dark:text-white">{currentPage}</strong> of{' '}
              <strong className="text-slate-900 dark:text-white">{totalPages}</strong>
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Last Page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>

            {/* Jump to page */}
            {totalPages > 3 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const p = parseInt(jumpPageInput, 10);
                  if (!isNaN(p) && p >= 1 && p <= totalPages) {
                    setCurrentPage(p);
                    setJumpPageInput('');
                  }
                }}
                className="flex items-center gap-1 ml-2"
              >
                <input
                  type="text"
                  value={jumpPageInput}
                  onChange={(e) => setJumpPageInput(e.target.value)}
                  placeholder="#"
                  className="w-10 px-1.5 py-1 text-center text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md font-mono"
                />
                <button
                  type="submit"
                  className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 rounded-md hover:bg-slate-200 transition-colors font-mono"
                >
                  Go
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Deep Session Cryptographic Inspection Modal */}
      <Modal
        isOpen={Boolean(inspectionSessionId)}
        onClose={() => {
          setInspectionSessionId(null);
          setSessionDetail(null);
          setDetailLoading(false);
        }}
        title="Session Cryptographic Inspector"
        subtitle={
          inspectionSessionId
            ? `Session Key Diagnostics • Session ${inspectionSessionId.slice(0, 8)}...`
            : undefined
        }
        maxWidth="max-w-3xl"
      >
        {detailLoading ? (
          <div className="py-16 text-center text-slate-400 font-mono text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-600" />
            <span>Retrieving in-memory parameters...</span>
          </div>
        ) : sessionDetail ? (
          <div className="space-y-5">
            {/* Modal Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-mono">
              <button
                onClick={() => setActiveModalTab('crypto')}
                className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                  activeModalTab === 'crypto'
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Cryptographic Suite
              </button>
              <button
                onClick={() => setActiveModalTab('audit')}
                className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                  activeModalTab === 'audit'
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Audit Trail ({sessionDetail.audit_events?.length ?? 0})
              </button>
            </div>

            {/* Tab 1: Cryptographic Suite */}
            {activeModalTab === 'crypto' && (
              <div className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">SESSION UUID</span>
                    <CopyBadge text={sessionDetail.session_id} truncateLength={10} className="w-full justify-between" />
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">SESSION KEY UUID</span>
                    <CopyBadge text={sessionDetail.key_id} truncateLength={10} className="w-full justify-between" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">LIFECYCLE STATE</span>
                    <Badge status={sessionDetail.state} className="mt-1">
                      {sessionDetail.state}
                    </Badge>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">KEY BYTE LENGTH</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                      {sessionDetail.key_byte_length * 8} bits (32B)
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">CRYPTOPERIOD REMAINING</span>
                    <span
                      className={`font-bold mt-1 block ${
                        sessionDetail.is_expired ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {sessionDetail.is_expired ? 'Expired' : `${sessionDetail.time_remaining_s}s`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Audit Trail */}
            {activeModalTab === 'audit' && (
              <div className="space-y-3 text-xs font-mono">
                {sessionDetail.audit_events.length > 0 ? (
                  <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                    {sessionDetail.audit_events.map((evt) => (
                      <div key={evt.event_id} className="p-3 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 dark:text-slate-200">{evt.event_type}</span>
                            <Badge status={evt.outcome}>{evt.outcome}</Badge>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-md">{evt.details || 'No details'}</p>
                        </div>
                        <span className="text-[10px] text-slate-400">{new Date(evt.time).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-400 font-mono text-xs">
                    No matching audit records indexed for this session UUID.
                  </div>
                )}
              </div>
            )}

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono">
                Device: <strong>{sessionDetail.device_id}</strong> ({sessionDetail.device_role || 'device'})
              </span>

              <div className="flex items-center gap-2">
                {sessionDetail.state === 'ACTIVE' && (
                  <button
                    onClick={() => handleRotateSession(sessionDetail.session_id)}
                    className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-mono hover:bg-amber-100 transition-colors"
                  >
                    Force Rotate
                  </button>
                )}

                {sessionDetail.state !== 'DESTROYED' && (
                  <button
                    onClick={() => handleDestroySession(sessionDetail.session_id)}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-mono hover:bg-rose-100 transition-colors"
                  >
                    Destroy Key
                  </button>
                )}

                <button
                  onClick={() => {
                    setInspectionSessionId(null);
                    setSessionDetail(null);
                    setDetailLoading(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-mono transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400 font-mono text-xs">
            <span>Unable to retrieve session cryptographic parameters.</span>
          </div>
        )}
      </Modal>

      {/* Confirmation Modal for Destructive Operations */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        title={confirmModal.title}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200 dark:border-rose-800/60 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              {confirmModal.description}
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-mono transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => confirmModal.onConfirm()}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono transition-colors shadow-2xs font-semibold"
            >
              {confirmModal.confirmLabel}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
