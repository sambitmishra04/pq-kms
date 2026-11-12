import React, { useState, useEffect } from 'react';
import {
  ScrollText,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
} from 'lucide-react';
import { api } from '../api/client';
import { Badge } from '../components/common/Badge';
import { CopyBadge } from '../components/common/CopyBadge';
import type { AuditResponse, AuditEvent } from '../types';

export const AuditLog: React.FC = () => {
  const [auditData, setAuditData] = useState<AuditResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState('ALL');
  const [filterOutcome, setFilterOutcome] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAudit = async () => {
    try {
      const data = await api.getAudit(150);
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
  }, []);

  const events = auditData?.events || [];

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      (evt.event_type && evt.event_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (evt.actor && evt.actor.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (evt.device_id && evt.device_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (evt.details && evt.details.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = filterType === 'ALL' || evt.event_type === filterType;
    const matchesOutcome = filterOutcome === 'ALL' || evt.outcome === filterOutcome;

    return matchesSearch && matchesType && matchesOutcome;
  });

  const uniqueTypes = Array.from(new Set(events.map((e) => e.event_type)));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <ScrollText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Tamper-Evident Forensic Audit Trail
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold">
              Immutable Hash Chain
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Cryptographically verifiable append-only ledger. Modifying any prior record invalidates chain continuity.
          </p>
        </div>

        <button
          onClick={() => { setRefreshing(true); fetchAudit(); }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs transition-colors self-start sm:self-auto shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-600 dark:text-emerald-400' : ''}`} />
          <span>Verify & Refresh Chain</span>
        </button>
      </div>

      {/* Hash Chain Integrity Banner */}
      <div
        className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          auditData?.chain_valid
            ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-200'
            : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/80 text-rose-800 dark:text-rose-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${auditData?.chain_valid ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400'}`}>
            {auditData?.chain_valid ? <ShieldCheck className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2">
              {auditData?.chain_valid
                ? 'Cryptographic Hash Chain: 100% INTACT & VERIFIED'
                : 'SECURITY ALERT: Audit Chain Integrity Broken!'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-mono">
              {auditData?.chain_valid
                ? `Every record's prev_hash verified up to genesis block across ${events.length} chronological events.`
                : `Tampering detected at ledger sequence index #${auditData?.chain_break_index}.`}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            GENESIS SEED
          </span>
          <span className="font-mono text-xs text-slate-600 dark:text-slate-300">
            00000000...0000
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-[#101726] p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search event type, actor, node ID, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 text-xs focus:outline-none focus:border-teal-500 font-sans"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono focus:outline-none"
          >
            <option value="ALL">All Event Types</option>
            {uniqueTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={filterOutcome}
            onChange={(e) => setFilterOutcome(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono focus:outline-none"
          >
            <option value="ALL">All Outcomes</option>
            <option value="ACCEPTED">ACCEPTED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="INFO">INFO</option>
          </select>
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
                <th className="py-3 px-4">Previous Chain Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((evt) => (
                  <tr
                    key={evt.event_id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                      <CopyBadge text={evt.event_id} truncateLength={4} />
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                      {new Date(evt.time).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-semibold">
                      {evt.actor}
                    </td>
                    <td className="py-3 px-4 text-teal-700 dark:text-teal-300 font-bold">
                      {evt.event_type}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {evt.device_id || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge status={evt.outcome}>{evt.outcome}</Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 text-[11px] max-w-xs truncate" title={evt.details}>
                      {evt.details || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <CopyBadge text={evt.prev_hash} truncateLength={4} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                    No matching audit records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
