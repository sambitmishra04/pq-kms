import React, { useState, useEffect, useMemo } from 'react';
import {
  ScrollText,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  Download,
  Layers,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  Check,
  Eye,
  RotateCcw,
  Zap,
  Flame,
  CheckCircle2,
  XCircle,
  Hash,
  Database,
  Link as LinkIcon,
  ShieldAlert,
  FileSpreadsheet,
  FileCode,
} from 'lucide-react';
import { api } from '../api/client';
import { Badge } from '../components/common/Badge';
import { CopyBadge } from '../components/common/CopyBadge';
import { StatCard } from '../components/common/StatCard';
import { Modal } from '../components/common/Modal';
import type { AuditResponse, AuditEvent, AuditBreakDetails } from '../types';

export const AuditLog: React.FC = () => {
  const [auditData, setAuditData] = useState<AuditResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter & Search states
  const [filterType, setFilterType] = useState('ALL');
  const [filterOutcome, setFilterOutcome] = useState('ALL');
  const [filterActor, setFilterActor] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Modals
  const [selectedBlock, setSelectedBlock] = useState<AuditEvent | null>(null);
  const [discontinuityModalOpen, setDiscontinuityModalOpen] = useState(false);
  const [resealModalOpen, setResealModalOpen] = useState(false);
  const [tamperModalOpen, setTamperModalOpen] = useState(false);

  // Actions loading
  const [resealLoading, setResealLoading] = useState(false);
  const [tamperLoading, setTamperLoading] = useState(false);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchAudit = async (resetPage = false) => {
    try {
      const currentPage = resetPage ? 1 : page;
      if (resetPage) setPage(1);

      const offset = (currentPage - 1) * pageSize;
      const data = await api.getAudit({
        limit: pageSize,
        offset,
        search: searchTerm.trim() || undefined,
        event_type: filterType !== 'ALL' ? filterType : undefined,
        outcome: filterOutcome !== 'ALL' ? filterOutcome : undefined,
        actor: filterActor !== 'ALL' ? filterActor : undefined,
      });
      setAuditData(data);
    } catch (err) {
      console.error('Failed to load audit log:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAudit();
  }, [page, pageSize, filterType, filterOutcome, filterActor]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAudit(true);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleResealChain = async () => {
    setResealLoading(true);
    try {
      const res = await api.resealAuditChain('admin');
      setActionNotice({
        type: 'success',
        message: `Audit chain resealed successfully! Re-anchored ${res.resealed_count} blocks (${res.repaired_count} discontinuities repaired).`,
      });
      setResealModalOpen(false);
      setDiscontinuityModalOpen(false);
      await fetchAudit();
    } catch (err: any) {
      setActionNotice({
        type: 'error',
        message: err.response?.data?.detail || 'Failed to reseal audit chain.',
      });
    } finally {
      setResealLoading(false);
    }
  };

  const handleSimulateTamper = async () => {
    setTamperLoading(true);
    try {
      const res = await api.simulateTamper();
      setActionNotice({
        type: 'error',
        message: `Adversarial bit-flip simulated at block index #${res.tampered_index}! Cryptographic hash chain flagged discontinuity.`,
      });
      setTamperModalOpen(false);
      await fetchAudit();
    } catch (err: any) {
      setActionNotice({
        type: 'error',
        message: err.response?.data?.detail || 'Failed to simulate tamper attack.',
      });
    } finally {
      setTamperLoading(false);
    }
  };

  const handleRestoreTamper = async () => {
    setTamperLoading(true);
    try {
      const res = await api.restoreTamper();
      setActionNotice({
        type: 'success',
        message: `Simulated tamper reverted! Cryptographic hash chain restored to 100% verified status across ${res.resealed_count} blocks.`,
      });
      setTamperModalOpen(false);
      await fetchAudit();
    } catch (err: any) {
      setActionNotice({
        type: 'error',
        message: err.response?.data?.detail || 'Failed to restore audit chain.',
      });
    } finally {
      setTamperLoading(false);
    }
  };

  const handleExport = (format: 'csv' | 'json') => {
    const url = `/api/audit/export?format=${format}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = format === 'csv' ? 'audit_ledger_21cfr11.csv' : 'audit_ledger_forensics.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const events = auditData?.events || [];
  const totalRecords = auditData?.total_records || 0;
  const filteredCount = auditData?.filtered_count ?? totalRecords;
  const totalPages = Math.max(1, Math.ceil(filteredCount / pageSize));
  const breakDetails: AuditBreakDetails | null | undefined = auditData?.break_details;

  const stats = auditData?.stats || {
    ACCEPTED: 0,
    REJECTED: 0,
    INFO: 0,
    TOTAL: totalRecords,
  };

  // Known categories for filter dropdown
  const commonCategories = useMemo(() => {
    return [
      'ALL',
      'SESSION',
      'SESSION_CREATED',
      'REGISTRATION',
      'ENROLMENT_CODE_CREATED',
      'MESSAGE',
      'SERVER_STARTED',
      'SERVER_STOPPED',
      'TAMPER_ATTACK_BLOCKED',
      'REPLAY_ATTACK_BLOCKED',
      'DEVICE_REVOKED',
      'CRL_ISSUED',
      'DOCTOR_TELEMETRY_DISPATCHED',
      'DOCTOR_DECRYPTION_VERIFIED',
      'UNAUTHORIZED_BIOCHIP_ACCESS_ATTEMPT',
      'AUDIT_CHAIN_RESEALED',
    ];
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notice */}
      {actionNotice && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 shadow-md animate-in slide-in-from-top-2 duration-300 ${
            actionNotice.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {actionNotice.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span className="text-xs font-medium font-sans">{actionNotice.message}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-xs font-semibold px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Tamper-Evident Forensic Audit Trail
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Adversarial Tamper Sandbox Toggle */}
          <button
            onClick={() => setTamperModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 text-xs font-medium transition-colors shadow-2xs"
            title="Simulate adversarial bit-flip or restore audit chain"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Tamper Sandbox</span>
          </button>

          {/* Export Dropdown / Buttons */}
          <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs overflow-hidden">
            <button
              onClick={() => handleExport('csv')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium border-r border-slate-200 dark:border-slate-700 transition-colors"
              title="Download official FDA 21 CFR Part 11 compliant CSV report"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => handleExport('json')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
              title="Download cryptographic forensic audit bundle in JSON format"
            >
              <FileCode className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>JSON</span>
            </button>
          </div>

          {/* Refresh / Re-verify */}
          <button
            onClick={() => { setRefreshing(true); fetchAudit(); }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-medium transition-colors shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-600 dark:text-emerald-400' : ''}`} />
            <span>Verify & Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Ledger Records"
          value={totalRecords.toLocaleString()}
          variant="teal"
          icon={<Layers className="w-5 h-5" />}
        />
        <StatCard
          title="Hash Chain Integrity"
          value={auditData?.chain_valid ? '100% INTACT' : 'COMPROMISED'}
          variant={auditData?.chain_valid ? 'teal' : 'crimson'}
          icon={auditData?.chain_valid ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
        />
        <StatCard
          title="Security Enforcements"
          value={`${stats.REJECTED || 0} Blocked`}
          variant="amber"
          icon={<ShieldAlert className="w-5 h-5" />}
        />
      </div>

      {/* Hash Chain Integrity Banner */}
      <div
        className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
          auditData?.chain_valid
            ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-200'
            : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/80 text-rose-800 dark:text-rose-200'
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div className={`p-2.5 rounded-lg shrink-0 ${auditData?.chain_valid ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400'}`}>
            {auditData?.chain_valid ? <ShieldCheck className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2">
              {auditData?.chain_valid
                ? 'Cryptographic Hash Chain: 100% INTACT & VERIFIED'
                : 'SECURITY ALERT: Audit Chain Integrity Broken!'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-mono leading-relaxed">
              {auditData?.chain_valid
                ? `Every record's prev_hash verified up to genesis block across ${totalRecords} chronological events.`
                : `Tampering detected at ledger sequence index #${auditData?.chain_break_index}. ${
                    breakDetails?.reason || 'Record hash does not match predecessor SHA-256 digest.'
                  }`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
          {!auditData?.chain_valid && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDiscontinuityModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect Discontinuity</span>
              </button>
              <button
                onClick={() => setResealModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-semibold shadow-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Reseal Chain</span>
              </button>
            </div>
          )}

          <div className="text-right pl-3 border-l border-slate-200 dark:border-slate-700 hidden sm:block">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              GENESIS SEED
            </span>
            <span className="font-mono text-xs text-slate-600 dark:text-slate-300 font-semibold">
              00000000...0000
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#101726] p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search event type, actor, node ID, details, or hash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 text-xs focus:outline-none focus:border-teal-500 font-sans"
            />
          </div>

          {/* Quick Outcome Filter Pills */}
          <div className="flex items-center gap-1 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'ALL', label: `ALL (${stats.TOTAL || 0})` },
              { id: 'ACCEPTED', label: `ACCEPTED (${stats.ACCEPTED || 0})` },
              { id: 'REJECTED', label: `REJECTED (${stats.REJECTED || 0})` },
              { id: 'INFO', label: `INFO (${stats.INFO || 0})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setFilterOutcome(tab.id); setPage(1); }}
                className={`px-2.5 py-1 rounded-md text-xs font-medium font-mono whitespace-nowrap transition-colors ${
                  filterOutcome === tab.id
                    ? 'bg-teal-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary filters row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 dark:text-slate-500 text-[11px] font-mono">CATEGORY:</span>
            <select
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
              className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              {commonCategories.filter((c) => c !== 'ALL').map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <span className="text-slate-400 dark:text-slate-500 text-[11px] font-mono ml-2">ACTOR:</span>
            <select
              value={filterActor}
              onChange={(e) => { setFilterActor(e.target.value); setPage(1); }}
              className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono focus:outline-none"
            >
              <option value="ALL">All Actors</option>
              <option value="server">server</option>
              <option value="admin">admin</option>
              <option value="dr.sharma">dr.sharma</option>
              <option value="dr.alvarez">dr.alvarez</option>
              <option value="ATTACK_LAB">ATTACK_LAB</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            {/* Rows per page */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[11px] font-mono">SHOW:</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                className="px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Jump to broken block button */}
            {!auditData?.chain_valid && auditData?.chain_break_index !== null && (
              <button
                onClick={() => setDiscontinuityModalOpen(true)}
                className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-mono flex items-center gap-1"
              >
                <span>Jump to Break #{auditData?.chain_break_index}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm dark:shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0d131f] text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Event Category</th>
                <th className="py-3 px-4">Target Node</th>
                <th className="py-3 px-4">Outcome</th>
                <th className="py-3 px-4">Cryptographic Details</th>
                <th className="py-3 px-4">Previous Hash (H_i-1)</th>
                <th className="py-3 px-4">Current Hash (H_i)</th>
                <th className="py-3 px-4 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {events.length > 0 ? (
                events.map((evt) => {
                  const isBreakRow =
                    !auditData?.chain_valid &&
                    breakDetails &&
                    (evt.event_id === breakDetails.event_id || evt.rowid === breakDetails.rowid);

                  return (
                    <tr
                      key={evt.event_id}
                      onClick={() => setSelectedBlock(evt)}
                      className={`cursor-pointer transition-colors ${
                        isBreakRow
                          ? 'bg-rose-50/80 dark:bg-rose-950/40 hover:bg-rose-100/80 dark:hover:bg-rose-900/40'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                      }`}
                    >
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                        <CopyBadge text={evt.event_id} truncateLength={4} />
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap" title={evt.time}>
                        {new Date(evt.time).toLocaleTimeString()}
                      </td>
                      <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-semibold">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                          evt.actor === 'admin'
                            ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60'
                            : evt.actor.startsWith('dr.')
                            ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60'
                            : evt.actor === 'server'
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            : 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60'
                        }`}>
                          {evt.actor}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-teal-700 dark:text-teal-300 font-bold whitespace-nowrap">
                        {evt.event_type}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {evt.device_id || '—'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <Badge status={evt.outcome}>{evt.outcome}</Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 text-[11px] max-w-xs truncate" title={evt.details}>
                        {evt.details || '—'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <CopyBadge text={evt.prev_hash} truncateLength={4} />
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {evt.current_hash ? (
                          <CopyBadge text={evt.current_hash} truncateLength={4} />
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBlock(evt);
                          }}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                          title="Inspect cryptographic block link"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400 text-xs">
                    {loading ? 'Verifying and loading cryptographic ledger...' : 'No matching audit records found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0d131f] text-xs font-mono">
          <div className="text-slate-500 dark:text-slate-400">
            Showing <strong className="text-slate-800 dark:text-slate-200">{filteredCount === 0 ? 0 : (page - 1) * pageSize + 1}</strong> to{' '}
            <strong className="text-slate-800 dark:text-slate-200">{Math.min(page * pageSize, filteredCount)}</strong> of{' '}
            <strong className="text-slate-800 dark:text-slate-200">{filteredCount.toLocaleString()}</strong> records
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(1)}
              disabled={page <= 1}
              className="p-1.5 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-800 transition-colors"
              title="First page"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <span className="px-3 py-1 text-slate-700 dark:text-slate-300 font-semibold">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page >= totalPages}
              className="p-1.5 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-800 transition-colors"
              title="Last page"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── MODAL 1: Audit Block Inspector ─────────────────────────────────── */}
      <Modal
        isOpen={Boolean(selectedBlock)}
        onClose={() => setSelectedBlock(null)}
        title="Audit Block Inspector"
        subtitle={`Cryptographic verification details for event ${selectedBlock?.event_id.substring(0, 8)}...`}
        maxWidth="max-w-2xl"
      >
        {selectedBlock && (
          <div className="space-y-4 text-xs font-sans">
            {/* Top metadata cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block">OUTCOME</span>
                <div className="mt-1">
                  <Badge status={selectedBlock.outcome}>{selectedBlock.outcome}</Badge>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block">ACTOR</span>
                <span className="font-semibold text-slate-900 dark:text-white mt-1 block">
                  {selectedBlock.actor}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block">TARGET NODE</span>
                <span className="font-semibold text-teal-600 dark:text-teal-400 mt-1 block">
                  {selectedBlock.device_id || 'System / Platform'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block">TIMESTAMP</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 mt-1 block truncate">
                  {new Date(selectedBlock.time).toLocaleTimeString()}
                </span>
              </div>
            </div>

            {/* Event Category & ID */}
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 font-mono">EVENT CATEGORY</span>
                <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                  {selectedBlock.event_type}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-500 font-mono">EVENT UUID</span>
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-800 dark:text-slate-200">
                  <span>{selectedBlock.event_id}</span>
                  <button
                    onClick={() => copyToClipboard(selectedBlock.event_id, 'modal-event-id')}
                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title="Copy full UUID"
                  >
                    {copiedKey === 'modal-event-id' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-500 font-mono">EXACT UTC TIME</span>
                <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  {selectedBlock.time}
                </span>
              </div>
            </div>

            {/* Cryptographic Details Container */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 font-mono">CRYPTOGRAPHIC DETAILS & PAYLOAD</span>
              <div className="p-3 rounded-lg bg-slate-100 dark:bg-[#0d131f] border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 break-all leading-relaxed">
                {selectedBlock.details || '—'}
              </div>
            </div>

            {/* Cryptographic Chain Link (SHA-256) Visualizer */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Sequential Hash Chain Link
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  H_i = SHA-256(event_id || time || actor || type || dev || outcome || H_{'{i-1}'})
                </span>
              </div>

              {/* H_{i-1} */}
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>PREVIOUS BLOCK HASH (H_{'{i-1}'})</span>
                  <button
                    onClick={() => copyToClipboard(selectedBlock.prev_hash, 'prev-hash')}
                    className="hover:text-slate-800 dark:hover:text-white flex items-center gap-1 text-[10px]"
                  >
                    {copiedKey === 'prev-hash' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>Copy</span>
                  </button>
                </div>
                <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300 break-all select-all">
                  {selectedBlock.prev_hash}
                </div>
              </div>

              {/* H_i */}
              <div className="p-2.5 rounded-lg bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-500/30 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-teal-700 dark:text-teal-400">
                  <span className="font-bold">CURRENT BLOCK SEALED HASH (H_i)</span>
                  {selectedBlock.current_hash && (
                    <button
                      onClick={() => copyToClipboard(selectedBlock.current_hash!, 'curr-hash')}
                      className="hover:text-teal-900 dark:hover:text-teal-200 flex items-center gap-1 text-[10px]"
                    >
                      {copiedKey === 'curr-hash' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  )}
                </div>
                <div className="font-mono text-[11px] text-teal-900 dark:text-teal-200 font-semibold break-all select-all">
                  {selectedBlock.current_hash || 'Computed dynamically on chain verification'}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedBlock(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ─── MODAL 2: Forensic Discontinuity Inspector ────────────────────── */}
      <Modal
        isOpen={discontinuityModalOpen}
        onClose={() => setDiscontinuityModalOpen(false)}
        title="Forensic Ledger Discontinuity Inspector"
        subtitle={`Cryptographic breakdown of detected discontinuity at sequence index #${auditData?.chain_break_index}`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4 text-xs font-sans">
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/80 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200 font-mono">
                DISCONTINUITY FLAGGED AT SEQUENCE INDEX #{breakDetails?.index ?? auditData?.chain_break_index}
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-1 leading-relaxed">
                {breakDetails?.reason ||
                  'The recorded prev_hash does not match the computed SHA-256 digest of the predecessor record. This indicates either an adversarial bit-flip or concurrent execution fork.'}
              </p>
            </div>
          </div>

          {/* Side-by-side Cryptographic Diff */}
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 font-mono block">
                EXPECTED PREVIOUS HASH (H_{'{i-1}'}) — Calculated from Preceding Block
              </span>
              <div className="font-mono text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/40 p-2 rounded border border-emerald-200 dark:border-emerald-800/60 break-all select-all">
                {breakDetails?.expected_prev_hash || 'Computed from row sequence predecessor'}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 font-mono block">
                ACTUAL STORED PREVIOUS HASH (H_{'{i-1}'}) — Found on Record #{breakDetails?.index ?? auditData?.chain_break_index}
              </span>
              <div className="font-mono text-xs text-rose-800 dark:text-rose-300 bg-rose-50/60 dark:bg-rose-950/40 p-2 rounded border border-rose-200 dark:border-rose-800/60 break-all select-all">
                {breakDetails?.actual_prev_hash || 'Mismatch with calculated predecessor'}
              </div>
            </div>
          </div>

          {/* Event Context */}
          {breakDetails && (
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">EVENT UUID:</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">{breakDetails.event_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">EVENT TYPE / ACTOR:</span>
                <span className="text-teal-600 dark:text-teal-400 font-bold">{breakDetails.event_type} by {breakDetails.actor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">RECORDED TIMESTAMP:</span>
                <span className="text-slate-700 dark:text-slate-300">{breakDetails.time}</span>
              </div>
              {breakDetails.details && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block mb-1">RECORDED PAYLOAD:</span>
                  <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 break-all">
                    {breakDetails.details}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setDiscontinuityModalOpen(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                setDiscontinuityModalOpen(false);
                setResealModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reseal & Re-anchor Chain</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* ─── MODAL 3: Administrative Reseal Confirmation ────────────────────── */}
      <Modal
        isOpen={resealModalOpen}
        onClose={() => setResealModalOpen(false)}
        title="Reseal & Re-anchor Forensic Ledger"
        subtitle="Cryptographic re-anchoring of the SHA-256 hash chain"
        maxWidth="max-w-lg"
      >
        <div className="space-y-4 text-xs font-sans">
          <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-500/30 flex items-start gap-3">
            <RotateCcw className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-teal-900 dark:text-teal-200 font-mono">
                ADMINISTRATIVE GOVERNANCE RESEAL
              </h4>
              <p className="text-xs text-teal-700 dark:text-teal-300 mt-1 leading-relaxed">
                This operation recalculates the sequential SHA-256 chain links across all {totalRecords} historical records starting from genesis (00000000...0000). It resolves concurrency forks and logs an official <strong>AUDIT_CHAIN_RESEALED</strong> event in the ledger.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] font-mono space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Records to Re-anchor:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{totalRecords} blocks</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Authorizing Operator:</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">System Administrator</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Standard Compliance:</span>
              <span className="text-slate-700 dark:text-slate-300">FDA 21 CFR Part 11</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              onClick={() => setResealModalOpen(false)}
              disabled={resealLoading}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleResealChain}
              disabled={resealLoading}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
            >
              {resealLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              <span>{resealLoading ? 'Re-anchoring Chain...' : 'Confirm & Reseal'}</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* ─── MODAL 4: Adversarial Tamper Sandbox ───────────────────────────── */}
      <Modal
        isOpen={tamperModalOpen}
        onClose={() => setTamperModalOpen(false)}
        title="Adversarial Tamper Evaluation Sandbox"
        subtitle="Simulate real-time cryptographic bit-flip attacks and test tamper evidence"
        maxWidth="max-w-xl"
      >
        <div className="space-y-4 text-xs font-sans">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            In medical cyber-physical biochips, any unauthorized alteration of clinical dosage commands or diagnostic logs must be caught instantaneously. Use this sandbox to demonstrate real-time tamper-evidence and recovery.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Action A: Simulate Tamper */}
            <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-800/80 bg-rose-50/50 dark:bg-rose-950/20 flex flex-col justify-between space-y-3">
              <div>
                <h4 className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-600" /> Simulate Bit-Flip Attack
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-normal">
                  Inverts the cryptographic hash prefix of a historical record to simulate adversarial bit manipulation.
                </p>
              </div>
              <button
                onClick={handleSimulateTamper}
                disabled={tamperLoading}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
              >
                {tamperLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                <span>Simulate Tamper</span>
              </button>
            </div>

            {/* Action B: Restore / Reseal */}
            <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20 flex flex-col justify-between space-y-3">
              <div>
                <h4 className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Revert & Restore Chain
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-normal">
                  Restores the original cryptographic hash values and re-verifies 100% linear continuity across all blocks.
                </p>
              </div>
              <button
                onClick={handleRestoreTamper}
                disabled={tamperLoading}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
              >
                {tamperLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                <span>Restore & Reseal</span>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button
              onClick={() => setTamperModalOpen(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
