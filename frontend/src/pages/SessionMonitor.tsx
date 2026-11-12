import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  RefreshCw,
  Clock,
  ShieldCheck,
  AlertOctagon,
  ArrowRight,
  Database,
  Lock,
  Layers,
} from 'lucide-react';
import { api } from '../api/client';
import { Badge } from '../components/common/Badge';
import { CopyBadge } from '../components/common/CopyBadge';
import type { Session } from '../types';

export const SessionMonitor: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSessions = async () => {
    try {
      const state = await api.getState();
      setSessions(state.sessions);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeSessions = sessions.filter((s) => s.state === 'ACTIVE').length;
  const deactivatedSessions = sessions.filter((s) => s.state === 'DEACTIVATED').length;
  const destroyedSessions = sessions.filter((s) => s.state === 'DESTROYED').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-purple-600 dark:text-purple-400" /> Ephemeral Key Lifecycle Monitor
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated cryptoperiod enforcement • Volatile memory isolation • Anti-replay counter sequencing.
          </p>
        </div>

        <button
          onClick={() => { setRefreshing(true); fetchSessions(); }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs transition-colors self-start sm:self-auto shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-purple-600 dark:text-purple-400' : ''}`} />
          <span>Auto-Polling (5s)</span>
        </button>
      </div>

      {/* Lifecycle State Machine Banner */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0f1728] border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Ephemeral Cryptoperiod State Machine
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            Rotation interval: 60s / 1000 messages
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 dark:text-slate-500 block text-[10px]">STAGE 1</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">CREATED</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Handshake Complete</span>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
            <span className="text-emerald-700 dark:text-emerald-400 block text-[10px]">STAGE 2 (ACTIVE)</span>
            <span className="font-bold text-emerald-800 dark:text-emerald-300">ACTIVE ({activeSessions})</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400/70 block mt-0.5">Authenticated Encrypt & Decrypt</span>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
            <span className="text-amber-700 dark:text-amber-400 block text-[10px]">STAGE 3 (GRACE)</span>
            <span className="font-bold text-amber-800 dark:text-amber-300">DEACTIVATED ({deactivatedSessions})</span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400/70 block mt-0.5">Decrypt-Only (In-Transit)</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-rose-950/30 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 dark:text-slate-500 block text-[10px]">FINAL STAGE</span>
            <span className="font-bold text-slate-600 dark:text-slate-400">DESTROYED ({destroyedSessions})</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">RAM Sanitized</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-600 dark:text-slate-400">
          <Database className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>
            <strong>Volatile Key Isolation:</strong> Active session keys reside strictly in transient memory. Zero key material is ever committed to persistent storage or disk.
          </span>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm dark:shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0d131f] text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                <th className="py-3 px-4">Session & Key Identifier</th>
                <th className="py-3 px-4">Device Binding</th>
                <th className="py-3 px-4">Lifecycle State</th>
                <th className="py-3 px-4">AEAD Message Counter</th>
                <th className="py-3 px-4">Established At</th>
                <th className="py-3 px-4">Cryptoperiod Expiry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-xs">
              {sessions.length > 0 ? (
                sessions.map((sess) => {
                  const isExpired = new Date(sess.expires_at) < new Date();
                  return (
                    <tr
                      key={sess.session_id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors font-mono"
                    >
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <CopyBadge
                            text={sess.session_id}
                            label="SID"
                            truncateLength={6}
                          />
                          <span className="text-[10px] text-slate-500">
                            Key ID: {sess.key_id.slice(0, 8)}...
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {sess.device_id}
                      </td>
                      <td className="py-3 px-4">
                        <Badge status={sess.state}>{sess.state}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-800 dark:text-slate-200 font-bold">{sess.msg_count}</span>
                          <span className="text-[10px] text-slate-500">
                            (Ctr: {sess.last_counter})
                          </span>
                          {sess.msg_count >= 1000 && (
                            <span className="text-[9px] px-1 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                              Max Limit
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                        {new Date(sess.created_at).toLocaleTimeString()}
                      </td>
                      <td className="py-3 px-4 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Clock className={`w-3.5 h-3.5 ${isExpired ? 'text-slate-400 dark:text-slate-500' : 'text-teal-600 dark:text-teal-400'}`} />
                          <span className={isExpired ? 'text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300 font-semibold'}>
                            {new Date(sess.expires_at).toLocaleTimeString()}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No active cryptographic sessions. Devices will establish a session automatically when sending telemetry.
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
