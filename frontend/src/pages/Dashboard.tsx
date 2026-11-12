import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Cpu,
  KeyRound,
  Pipette,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Lock,
  Zap,
  Activity,
  Layers,
} from 'lucide-react';
import { api } from '../api/client';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { CopyBadge } from '../components/common/CopyBadge';
import type { StateSummary, AuditResponse, SystemHealth } from '../types';

export const Dashboard: React.FC = () => {
  const [state, setState] = useState<StateSummary | null>(null);
  const [audit, setAudit] = useState<AuditResponse | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [stateData, auditData, healthData] = await Promise.all([
        api.getState(),
        api.getAudit(12),
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

  const totalDevices = state?.devices.length || 0;
  const authorizedDevices = state?.devices.filter((d) => d.status === 'AUTHORIZED').length || 0;
  const activeSessions = state?.sessions.filter((s) => s.state === 'ACTIVE').length || 0;
  const acceptedMsgs = state?.message_stats.accepted || 0;
  const rejectedMsgs = state?.message_stats.rejected || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Medical IoT Security Operations Console
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time post-quantum key distribution and cyber-physical integrity for Digital Microfluidic Biochips.
          </p>
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

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Edge Biochip Nodes"
          value={totalDevices}
          subtitle={`${authorizedDevices} Authorized • ${state?.revoked_devices.length || 0} Revoked`}
          trend={`${authorizedDevices}/${totalDevices} Active`}
          variant="teal"
          icon={<Cpu className="w-5 h-5" />}
        />
        <StatCard
          title="In-Memory Ephemeral Keys"
          value={activeSessions}
          subtitle="Volatile memory • Zero disk retention"
          trend="Automated 60s cryptoperiod"
          variant="purple"
          icon={<KeyRound className="w-5 h-5" />}
        />
        <StatCard
          title="AEAD Message Frames"
          value={acceptedMsgs}
          subtitle={`${rejectedMsgs} Tampered/Replay blocked`}
          trend="Authenticated Encryption"
          variant="blue"
          icon={<ShieldCheck className="w-5 h-5" />}
        />
        <StatCard
          title="Tamper-Evident Audit Chain"
          value={audit?.chain_valid ? 'INTACT' : 'CORRUPTED'}
          subtitle={`Cryptographically sealed • ${audit?.events.length || 0} records`}
          trend={audit?.chain_valid ? '100% Cryptographic Proof' : 'Break Detected'}
          variant={audit?.chain_valid ? 'teal' : 'crimson'}
          icon={<Layers className="w-5 h-5" />}
        />
      </div>

      {/* Post-Quantum Security Perimeter Status */}
      <div className="rounded-xl p-5 bg-gradient-to-r from-teal-50/80 via-white to-purple-50/60 dark:from-teal-950/40 dark:via-slate-900 dark:to-purple-950/30 border border-teal-200 dark:border-teal-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-lg bg-teal-100 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/30 text-teal-700 dark:text-teal-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              Post-Quantum Active Defense Perimeter
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                ACTIVE MONITORING
              </span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
              Quantum-resistant key encapsulation (0.060 ms) and digital signature verification protect biochip droplet actuation commands across all edge channels.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/dmfb"
            className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Pipette className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Biochip Digital Twin</span>
          </Link>
          <Link
            to="/devices"
            className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <span>Enrol Device</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Grid: Live Devices Snapshot + Live Audit Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Registered Biochip Devices */}
        <div className="bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm dark:shadow-lg flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Biochip Device Fleet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Authorized edge nodes executing assays</p>
            </div>
            <Link
              to="/devices"
              className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium flex items-center gap-1"
            >
              Manage Fleet <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5 flex-1">
            {state?.devices && state.devices.length > 0 ? (
              state.devices.slice(0, 5).map((device) => (
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
              <div className="text-center py-8 text-slate-400 text-xs">
                No biochip devices registered yet. Click "Enrol Device" to provision a token.
              </div>
            )}
          </div>
        </div>

        {/* Right: Tamper-Evident Audit Feed */}
        <div className="bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm dark:shadow-lg flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Tamper-Evident Audit Trail
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Cryptographically chained event stream</p>
            </div>
            <Link
              to="/audit"
              className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium flex items-center gap-1"
            >
              Full Log <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto max-h-[340px]">
            {audit?.events && audit.events.length > 0 ? (
              audit.events.slice(0, 6).map((evt) => (
                <div
                  key={evt.event_id}
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0d131f] border border-slate-200 dark:border-slate-800/80 text-xs flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-slate-800 dark:text-slate-300">
                        {evt.event_type}
                      </span>
                      <Badge status={evt.outcome}>{evt.outcome}</Badge>
                      <span className="text-[10px] text-slate-500 font-mono">
                        by {evt.actor}
                      </span>
                    </div>
                    {evt.details && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate mt-0.5 font-mono">
                        {evt.details}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                    {new Date(evt.time).toLocaleTimeString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                No audit events recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
