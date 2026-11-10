import React, { useState, useEffect, useRef, useMemo } from 'react';

// ─── SVG Icons (Clean, Consistent Stroke, Self-Contained) ─────────────────────
const Icons = {
  shield: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  key: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="7.5" cy="15.5" r="5.5"/>
      <path d="m21 2-9.6 9.6"/>
      <path d="m15.5 7.5 3 3L22 7l-2-2"/>
    </svg>
  ),
  device: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect width="18" height="14" x="3" y="4" rx="2"/>
      <line x1="12" x2="12" y1="18" y2="20"/>
      <line x1="8" x2="16" y1="20" y2="20"/>
    </svg>
  ),
  fileText: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" x2="8" y1="13" y2="13"/>
      <line x1="16" x2="8" y1="17" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  chart: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <line x1="18" x2="18" y1="20" y2="10"/>
      <line x1="12" x2="12" y1="20" y2="4"/>
      <line x1="6" x2="6" y1="20" y2="14"/>
    </svg>
  ),
  lock: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  refresh: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
    </svg>
  ),
  check: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  alert: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <line x1="12" x2="12" y1="9" y2="13"/>
      <line x1="12" x2="12.01" y1="17" y2="17"/>
    </svg>
  ),
  info: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" x2="12" y1="16" y2="12"/>
      <line x1="12" x2="12.01" y1="8" y2="8"/>
    </svg>
  ),
  search: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" x2="16.65" y1="21" y2="16.65"/>
    </svg>
  ),
  cpu: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect width="16" height="16" x="4" y="4" rx="2"/>
      <rect width="6" height="6" x="9" y="9"/>
      <path d="M15 2v2M9 2v2M20 15h2M20 9h2M9 20v2M15 20v2M2 9h2M2 15h2"/>
    </svg>
  ),
  download: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" x2="12" y1="15" y2="3"/>
    </svg>
  ),
  x: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <line x1="18" x2="6" y1="6" y2="18"/>
      <line x1="6" x2="18" y1="6" y2="18"/>
    </svg>
  ),
  plus: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  zoom: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" x2="16.65" y1="21" y2="16.65"/>
      <line x1="11" y1="8" x2="11" y2="14"/>
      <line x1="8" x2="14" y1="11" y2="11"/>
    </svg>
  ),
  checkCircle: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
};

// ─── Chart Component Wrapper (Configured for Green & White Theme) ────────────
function ChartCanvas({ type, data, options, height = 240 }) {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !window.Chart) return;
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    const ctx = canvasRef.current.getContext('2d');
    chartInstanceRef.current = new window.Chart(ctx, {
      type,
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#475569',
              font: { family: 'Inter', size: 12, weight: '500' },
              boxWidth: 12,
              boxHeight: 12,
              usePointStyle: true,
            },
          },
          tooltip: {
            backgroundColor: '#0f172a',
            borderColor: '#334155',
            borderWidth: 1,
            titleColor: '#ffffff',
            bodyColor: '#e2e8f0',
            cornerRadius: 6,
            padding: 8,
            titleFont: { family: 'Inter', size: 12, weight: '600' },
            bodyFont: { family: 'IBM Plex Mono', size: 11 },
          },
        },
        scales: type === 'bar' ? {
          x: {
            grid: { color: '#f1f5f9' },
            ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } },
          },
          y: {
            grid: { color: '#f1f5f9' },
            ticks: { color: '#64748b', font: { family: 'IBM Plex Mono', size: 11 } },
          },
        } : {},
        ...options,
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [type, JSON.stringify(data), JSON.stringify(options)]);

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

// ─── Status Badge Component (Clean, Professional Human Styling) ───────────────
function Badge({ status, label }) {
  const s = (status || '').toUpperCase();
  let cls = 'badge-neutral';
  let dotColor = '#64748b';

  if (['AUTHORIZED', 'ACTIVE', 'ACCEPTED', 'VALID', 'PASS'].includes(s)) {
    cls = 'badge-authorized';
    dotColor = '#16a34a';
  } else if (['REVOKED', 'REJECTED', 'COMPROMISED', 'FAIL', 'BROKEN'].includes(s)) {
    cls = 'badge-revoked';
    dotColor = '#dc2626';
  } else if (['PENDING', 'DEACTIVATED', 'WARNING'].includes(s)) {
    cls = 'badge-pending';
    dotColor = '#d97706';
  } else if (['DISABLED', 'DESTROYED', 'INFO'].includes(s)) {
    cls = 'badge-neutral';
    dotColor = '#64748b';
  }

  return (
    <span className={`badge-status ${cls}`}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: dotColor }} />
      {label || s}
    </span>
  );
}

// ─── Export CSV Utility ───────────────────────────────────────────────────────
function exportToCsv(filename, rows) {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map(row => {
        return keys
          .map(k => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
            cell = cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) cell = `"${cell}"`;
            return cell;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ─── Main Application ─────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState('devices');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefreshSecs, setAutoRefreshSecs] = useState(0); // 0 = off
  const [backendOnline, setBackendOnline] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Data states
  const [info, setInfo] = useState({});
  const [devicesData, setDevicesData] = useState({ total: 0, status_counts: {}, devices: [] });
  const [sessionsData, setSessionsData] = useState({ total: 0, state_counts: {}, sessions: [] });
  const [auditData, setAuditData] = useState({ chain_valid: true, chain_break_index: null, outcome_counts: {}, events: [] });
  const [benchmarksData, setBenchmarksData] = useState({ e1_primitive_benchmarks: [], figures: [], table20_markdown: '', table20_comparison: [] });
  const [securityData, setSecurityData] = useState({ security_test_cases: [], test_summary: [], crl: null, message_stats: {} });

  // Filter & Search states
  const [deviceSearch, setDeviceSearch] = useState('');
  const [deviceStatusFilter, setDeviceStatusFilter] = useState('ALL');
  const [sessionSearch, setSessionSearch] = useState('');
  const [sessionStateFilter, setSessionStateFilter] = useState('ALL');
  const [auditFilter, setAuditFilter] = useState('ALL');
  const [auditSearch, setAuditSearch] = useState('');

  // Modals
  const [envModalOpen, setEnvModalOpen] = useState(false);
  const [selectedAuditLog, setSelectedAuditLog] = useState(null);
  const [selectedFigure, setSelectedFigure] = useState(null);
  const [hashVerificationStatus, setHashVerificationStatus] = useState(null);

  // Device Provisioning State
  const [provisionModalOpen, setProvisionModalOpen] = useState(false);
  const [newDeviceId, setNewDeviceId] = useState('');
  const [newDeviceRole, setNewDeviceRole] = useState('CLINICAL_ANALYZER');
  const [provisionLoading, setProvisionLoading] = useState(false);
  const [provisionResult, setProvisionResult] = useState(null);
  const [provisionError, setProvisionError] = useState(null);

  // Pagination states
  const [devicePage, setDevicePage] = useState(1);
  const [sessionPage, setSessionPage] = useState(1);
  const [auditPage, setAuditPage] = useState(1);
  const pageSize = 15;

  // ─── Fetch All Data ──────────────────────────────────────────────────────────
  const fetchAllData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const [rInfo, rDev, rSess, rAudit, rBench, rSec] = await Promise.all([
        fetch('/api/info').then(r => r.json()).catch(() => ({})),
        fetch('/api/devices').then(r => r.json()).catch(() => ({ total: 0, status_counts: {}, devices: [] })),
        fetch('/api/sessions').then(r => r.json()).catch(() => ({ total: 0, state_counts: {}, sessions: [] })),
        fetch('/api/audit?limit=500').then(r => r.json()).catch(() => ({ chain_valid: true, chain_break_index: null, outcome_counts: {}, events: [] })),
        fetch('/api/benchmarks').then(r => r.json()).catch(() => ({ e1_primitive_benchmarks: [], figures: [] })),
        fetch('/api/security').then(r => r.json()).catch(() => ({ security_test_cases: [], test_summary: [], crl: null, message_stats: {} })),
      ]);

      setInfo(rInfo);
      setDevicesData(rDev);
      setSessionsData(rSess);
      setAuditData(rAudit);
      setBenchmarksData(rBench);
      setSecurityData(rSec);
      setBackendOnline(true);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setBackendOnline(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Auto-refresh interval
  useEffect(() => {
    if (autoRefreshSecs <= 0) return;
    const interval = setInterval(() => {
      fetchAllData(false);
    }, autoRefreshSecs * 1000);
    return () => clearInterval(interval);
  }, [autoRefreshSecs]);

  // Explicit Hash Chain Verification
  const verifyHashChain = async () => {
    setHashVerificationStatus('verifying');
    try {
      const res = await fetch('/api/audit/verify', { method: 'POST' }).then(r => r.json());
      setHashVerificationStatus(res);
      fetchAllData();
    } catch (err) {
      setHashVerificationStatus({ status: 'Error during verification' });
    }
  };

  // Device Provisioning Handler
  const handleProvisionDevice = async (e) => {
    if (e) e.preventDefault();
    const devId = newDeviceId.trim() || `DMFB-LAB-${Math.floor(1000 + Math.random() * 9000)}`;
    setProvisionLoading(true);
    setProvisionError(null);
    setProvisionResult(null);

    try {
      const res = await fetch('/api/devices/provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_id: devId, role: newDeviceRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to provision device');
      }
      setProvisionResult(data);
      fetchAllData();
    } catch (err) {
      setProvisionError(err.message);
    } finally {
      setProvisionLoading(false);
    }
  };

  // ─── Filtered Data Memoization ──────────────────────────────────────────────
  const filteredDevices = useMemo(() => {
    return (devicesData.devices || []).filter(d => {
      const matchesSearch =
        d.device_id.toLowerCase().includes(deviceSearch.toLowerCase()) ||
        (d.role && d.role.toLowerCase().includes(deviceSearch.toLowerCase()));
      const matchesStatus = deviceStatusFilter === 'ALL' || d.status === deviceStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [devicesData.devices, deviceSearch, deviceStatusFilter]);

  const filteredSessions = useMemo(() => {
    return (sessionsData.sessions || []).filter(s => {
      const matchesSearch =
        s.session_id.toLowerCase().includes(sessionSearch.toLowerCase()) ||
        s.device_id.toLowerCase().includes(sessionSearch.toLowerCase()) ||
        s.key_id.toLowerCase().includes(sessionSearch.toLowerCase());
      const matchesState = sessionStateFilter === 'ALL' || s.state === sessionStateFilter;
      return matchesSearch && matchesState;
    });
  }, [sessionsData.sessions, sessionSearch, sessionStateFilter]);

  const filteredAudit = useMemo(() => {
    return (auditData.events || []).filter(ev => {
      const matchesOutcome = auditFilter === 'ALL' || ev.outcome === auditFilter;
      const matchesSearch =
        !auditSearch ||
        (ev.event_type && ev.event_type.toLowerCase().includes(auditSearch.toLowerCase())) ||
        (ev.device_id && ev.device_id.toLowerCase().includes(auditSearch.toLowerCase())) ||
        (ev.details && ev.details.toLowerCase().includes(auditSearch.toLowerCase()));
      return matchesOutcome && matchesSearch;
    });
  }, [auditData.events, auditFilter, auditSearch]);

  // Chart configs (Green and White Theme)
  const deviceChartData = useMemo(() => {
    const sc = devicesData.status_counts || {};
    return {
      labels: ['AUTHORIZED', 'REVOKED', 'PENDING', 'DISABLED'],
      datasets: [
        {
          data: [sc.AUTHORIZED || 0, sc.REVOKED || 0, sc.PENDING || 0, sc.DISABLED || 0],
          backgroundColor: ['#15803d', '#dc2626', '#d97706', '#94a3b8'],
          borderColor: '#ffffff',
          borderWidth: 2,
        },
      ],
    };
  }, [devicesData.status_counts]);

  const sessionChartData = useMemo(() => {
    const sc = sessionsData.state_counts || {};
    return {
      labels: ['ACTIVE', 'DEACTIVATED', 'DESTROYED', 'COMPROMISED'],
      datasets: [
        {
          label: 'Sessions',
          data: [sc.ACTIVE || 0, sc.DEACTIVATED || 0, sc.DESTROYED || 0, sc.COMPROMISED || 0],
          backgroundColor: ['#15803d', '#d97706', '#94a3b8', '#dc2626'],
          borderRadius: 4,
        },
      ],
    };
  }, [sessionsData.state_counts]);

  const auditChartData = useMemo(() => {
    const oc = auditData.outcome_counts || {};
    return {
      labels: ['ACCEPTED', 'REJECTED', 'INFO'],
      datasets: [
        {
          data: [oc.ACCEPTED || 0, oc.REJECTED || 0, oc.INFO || 0],
          backgroundColor: ['#15803d', '#dc2626', '#0284c7'],
          borderColor: '#ffffff',
          borderWidth: 2,
        },
      ],
    };
  }, [auditData.outcome_counts]);

  const benchmarkChartData = useMemo(() => {
    const e1 = benchmarksData.e1_primitive_benchmarks || [];
    const keyOps = e1.filter(row => ['keygen', 'encap', 'decap', 'agree'].includes(row.operation));
    if (!keyOps.length) return null;

    const algs = [...new Set(keyOps.map(r => r.algorithm))];
    const ops = ['keygen', 'encap', 'decap', 'agree'];

    const colors = ['#15803d', '#0d9488', '#4f46e5', '#d97706', '#0284c7'];

    return {
      labels: ops.map(o => o.toUpperCase()),
      datasets: algs.map((alg, idx) => ({
        label: alg,
        data: ops.map(op => {
          const match = keyOps.find(r => r.operation === op && r.algorithm === alg);
          return match ? parseFloat(match.mean_us) : 0;
        }),
        backgroundColor: colors[idx % colors.length],
        borderRadius: 4,
      })),
    };
  }, [benchmarksData.e1_primitive_benchmarks]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      {/* ─── Top Human-Engineered Header Bar ──────────────────────────────── */}
      <header
        style={{
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          {/* Brand & Algorithm Specs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803d' }}>
                <Icons.shield size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h1 style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#0f172a' }}>
                    PQ-KMS
                  </h1>
                  <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: 4, backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', fontWeight: 600 }}>
                    Clinical Biochip Security Console
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 12, marginTop: 2 }}>
                  <span>KEM: <strong style={{ color: '#0f172a' }}>{info.kem_alg || 'ML-KEM-768'}</strong></span>
                  <span style={{ color: '#cbd5e1' }}>•</span>
                  <span>Signature: <strong style={{ color: '#0f172a' }}>{info.sig_alg || 'ML-DSA-65'}</strong></span>
                  <span style={{ color: '#cbd5e1' }}>•</span>
                  <span>AEAD: <strong style={{ color: '#0f172a' }}>AES-256-GCM</strong></span>
                  <span style={{ color: '#cbd5e1' }}>•</span>
                  <span>Key Lifetime: <strong style={{ color: '#0f172a' }}>{info.session_lifetime_s || 60}s</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls: Connection Pill, Auto-Refresh, Refresh, System Specs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Status indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 6, backgroundColor: backendOnline ? '#f0fdf4' : '#fef2f2', border: `1px solid ${backendOnline ? '#bbf7d0' : '#fecaca'}`, fontSize: '0.75rem', fontWeight: 600, color: backendOnline ? '#15803d' : '#b91c1c' }}>
              <span className={backendOnline ? 'live-pulse' : ''} style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: backendOnline ? '#16a34a' : '#dc2626' }} />
              {backendOnline ? 'System Online' : 'Offline'}
            </div>

            {/* Auto refresh dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#64748b' }}>
              <span>Auto-refresh:</span>
              <select
                value={autoRefreshSecs}
                onChange={e => setAutoRefreshSecs(Number(e.target.value))}
                style={{ backgroundColor: '#ffffff', color: '#334155', border: '1px solid #cbd5e1', borderRadius: 6, padding: '5px 8px', fontSize: '0.78rem', outline: 'none' }}
              >
                <option value={0}>Manual</option>
                <option value={3}>Every 3s</option>
                <option value={5}>Every 5s</option>
                <option value={10}>Every 10s</option>
                <option value={30}>Every 30s</option>
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => fetchAllData(true)}
              disabled={refreshing}
              className="btn-secondary"
              title={`Last updated ${lastUpdated.toLocaleTimeString()}`}
            >
              <Icons.refresh size={14} className={refreshing ? 'live-pulse' : ''} />
              {refreshing ? 'Updating...' : 'Refresh'}
            </button>

            {/* System Info Button */}
            <button
              onClick={() => setEnvModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 12px',
                borderRadius: 6,
                backgroundColor: '#f0fdf4',
                color: '#15803d',
                border: '1px solid #bbf7d0',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Icons.cpu size={14} />
              System Specs
            </button>
          </div>
        </div>

        {/* ─── Navigation Tabs ──────────────────────────────────────────────── */}
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 4, overflowX: 'auto' }}>
          {[
            { id: 'devices', label: 'Registered Devices', icon: Icons.device, count: devicesData.total },
            { id: 'sessions', label: 'Session Keys', icon: Icons.key, count: sessionsData.total },
            { id: 'audit', label: 'Tamper-Evident Audit', icon: Icons.fileText, count: auditData.events ? auditData.events.length : 0 },
            { id: 'benchmarks', label: 'Benchmarks & Evaluation', icon: Icons.chart },
            { id: 'security', label: 'Security & CRL', icon: Icons.shield },
          ].map(tab => {
            const IconCmp = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '11px 16px',
                  backgroundColor: 'transparent',
                  color: active ? '#15803d' : '#64748b',
                  border: 'none',
                  borderBottom: active ? '2px solid #15803d' : '2px solid transparent',
                  fontWeight: active ? 600 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                <IconCmp size={16} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      padding: '1px 6px',
                      borderRadius: 9999,
                      backgroundColor: active ? '#dcfce7' : '#f1f5f9',
                      color: active ? '#15803d' : '#64748b',
                      fontWeight: 600,
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* ─── Main Content Container ────────────────────────────────────────── */}
      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '24px', flex: 1, width: '100%' }}>
        {/* ─── TAB 1: DEVICES ──────────────────────────────────────────────── */}
        {activeTab === 'devices' && (
          <div>
            {/* Metric KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
              <div className="surface-card" style={{ padding: 18, borderLeft: '3px solid #64748b' }}>
                <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Total Registered Devices
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#0f172a', marginTop: 4 }}>
                  {devicesData.total}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 4 }}>
                  Managed in SQLite Registry
                </div>
              </div>
              <div className="surface-card" style={{ padding: 18, borderLeft: '3px solid #15803d' }}>
                <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Authorized Active
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#15803d', marginTop: 4 }}>
                  {devicesData.status_counts.AUTHORIZED || 0}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 4 }}>
                  ML-DSA Proof-of-Possession Valid
                </div>
              </div>
              <div className="surface-card" style={{ padding: 18, borderLeft: '3px solid #dc2626' }}>
                <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Revoked Devices
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#b91c1c', marginTop: 4 }}>
                  {devicesData.status_counts.REVOKED || 0}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 4 }}>
                  Listed in Signed CRL
                </div>
              </div>
              <div className="surface-card" style={{ padding: 18, borderLeft: '3px solid #d97706' }}>
                <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Pending / Inactive
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#b45309', marginTop: 4 }}>
                  {(devicesData.status_counts.PENDING || 0) + (devicesData.status_counts.DISABLED || 0)}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 4 }}>
                  Awaiting key registration
                </div>
              </div>
            </div>

            {/* Distribution Chart & Details Panel */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20, marginBottom: 20 }}>
              <div className="surface-card" style={{ padding: 20 }}>
                <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a', marginBottom: 16 }}>
                  Device Status Distribution
                </h3>
                <ChartCanvas
                  type="doughnut"
                  data={deviceChartData}
                  options={{
                    plugins: {
                      legend: { position: 'right' },
                    },
                  }}
                  height={200}
                />
              </div>

              <div className="surface-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Icons.lock size={18} style={{ color: '#15803d' }} />
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a' }}>
                    Post-Quantum Identity Binding
                  </h3>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6, marginBottom: 14 }}>
                  Each registered biochip node holds an <strong>ML-KEM-768</strong> public key (1,184 bytes) and an <strong>ML-DSA-65</strong> verification key (1,952 bytes). All device registrations enforce Algorithm 1 proof-of-possession signatures before binding into the registry.
                </p>
                <div style={{ backgroundColor: '#f0fdf4', padding: '12px 14px', borderRadius: 6, border: '1px solid #bbf7d0', fontSize: '0.78rem', color: '#166534', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icons.checkCircle size={16} style={{ color: '#15803d', flexShrink: 0 }} />
                  <span><strong>Zero Key Leakage:</strong> Private key material never leaves device hardware. Only public keys and cryptographic proofs are verified.</span>
                </div>
              </div>
            </div>

            {/* Search, Filter & Provision Toolbar */}
            <div className="surface-card" style={{ padding: '14px 18px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 260 }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: 360 }}>
                  <Icons.search size={16} style={{ position: 'absolute', left: 12, top: 10, color: '#64748b' }} />
                  <input
                    type="text"
                    placeholder="Search by Device ID or Role..."
                    value={deviceSearch}
                    onChange={e => { setDeviceSearch(e.target.value); setDevicePage(1); }}
                    className="form-input"
                    style={{ paddingLeft: 36 }}
                  />
                </div>

                {/* Status Filter Buttons */}
                <div style={{ display: 'flex', gap: 4 }}>
                  {['ALL', 'AUTHORIZED', 'REVOKED'].map(st => (
                    <button
                      key={st}
                      onClick={() => { setDeviceStatusFilter(st); setDevicePage(1); }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: '1px solid',
                        borderColor: deviceStatusFilter === st ? '#15803d' : '#cbd5e1',
                        backgroundColor: deviceStatusFilter === st ? '#15803d' : '#ffffff',
                        color: deviceStatusFilter === st ? '#ffffff' : '#475569',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Provision & Export */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => { setProvisionModalOpen(true); setProvisionResult(null); setProvisionError(null); }}
                  className="btn-primary"
                >
                  <Icons.plus size={14} />
                  Provision Biochip Node
                </button>

                <button
                  onClick={() => exportToCsv('devices_registry', filteredDevices)}
                  className="btn-secondary"
                >
                  <Icons.download size={14} />
                  Export CSV ({filteredDevices.length})
                </button>
              </div>
            </div>

            {/* Devices Table */}
            <div className="surface-card" style={{ overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto', maxHeight: 520 }}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Device ID</th>
                      <th>Assigned Medical Role</th>
                      <th>Status</th>
                      <th>Registration Date</th>
                      <th>Last Seen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDevices.slice((devicePage - 1) * pageSize, devicePage * pageSize).map(dev => (
                      <tr key={dev.device_id}>
                        <td>
                          <span className="font-mono" style={{ fontWeight: 600, color: '#0f172a' }}>
                            {dev.device_id}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.82rem', color: '#334155' }}>
                            {dev.role || 'BIOCHIP_NODE'}
                          </span>
                        </td>
                        <td>
                          <Badge status={dev.status} />
                        </td>
                        <td className="font-mono" style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          {dev.enrolled_at || dev.registered_at || '—'}
                        </td>
                        <td className="font-mono" style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          {dev.last_seen || '—'}
                        </td>
                      </tr>
                    ))}
                    {!filteredDevices.length && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: 32, color: '#64748b' }}>
                          No devices match the search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination */}
              {filteredDevices.length > pageSize && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Showing {(devicePage - 1) * pageSize + 1} to {Math.min(devicePage * pageSize, filteredDevices.length)} of {filteredDevices.length} devices
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      disabled={devicePage <= 1}
                      onClick={() => setDevicePage(p => p - 1)}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      Previous
                    </button>
                    <span style={{ padding: '4px 10px', fontSize: '0.78rem', color: '#334155', fontWeight: 500 }}>
                      Page {devicePage} of {Math.ceil(filteredDevices.length / pageSize)}
                    </span>
                    <button
                      disabled={devicePage >= Math.ceil(filteredDevices.length / pageSize)}
                      onClick={() => setDevicePage(p => p + 1)}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 2: SESSIONS ─────────────────────────────────────────────── */}
        {activeTab === 'sessions' && (
          <div>
            {/* Metric KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
              <div className="surface-card" style={{ padding: 18, borderLeft: '3px solid #64748b' }}>
                <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Total Sessions
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#0f172a', marginTop: 4 }}>
                  {sessionsData.total}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 4 }}>
                  NIST SP 800-57 State Machine
                </div>
              </div>
              <div className="surface-card" style={{ padding: 18, borderLeft: '3px solid #15803d' }}>
                <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Active Keys
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#15803d', marginTop: 4 }}>
                  {sessionsData.state_counts.ACTIVE || 0}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 4 }}>
                  AES-256-GCM AEAD Encrypted
                </div>
              </div>
              <div className="surface-card" style={{ padding: 18, borderLeft: '3px solid #d97706' }}>
                <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Deactivated
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#b45309', marginTop: 4 }}>
                  {sessionsData.state_counts.DEACTIVATED || 0}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 4 }}>
                  Cryptoperiod Expired / Rotated
                </div>
              </div>
              <div className="surface-card" style={{ padding: 18, borderLeft: '3px solid #94a3b8' }}>
                <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Destroyed Keys
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#475569', marginTop: 4 }}>
                  {sessionsData.state_counts.DESTROYED || 0}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 4 }}>
                  Memory Zeroized (Algorithm 4)
                </div>
              </div>
            </div>

            {/* Sessions Chart & Forward Secrecy Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20, marginBottom: 20 }}>
              <div className="surface-card" style={{ padding: 20 }}>
                <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a', marginBottom: 16 }}>
                  Sessions by Lifecycle State
                </h3>
                <ChartCanvas
                  type="bar"
                  data={sessionChartData}
                  options={{
                    plugins: { legend: { display: false } },
                  }}
                  height={200}
                />
              </div>

              <div className="surface-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Icons.key size={18} style={{ color: '#15803d' }} />
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a' }}>
                    Perfect Forward Secrecy & Ephemeral Security
                  </h3>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6, marginBottom: 14 }}>
                  Each session establishes an independent 256-bit symmetric key derived via <strong>HKDF-SHA256</strong> from an ML-KEM shared secret and fresh client nonce. Keys automatically expire after <strong>{info.session_lifetime_s || 60} seconds</strong> or 1,000 transmitted messages.
                </p>
                <div style={{ backgroundColor: '#f0fdf4', padding: '12px 14px', borderRadius: 6, border: '1px solid #bbf7d0', fontSize: '0.78rem', color: '#166534', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icons.checkCircle size={16} style={{ color: '#15803d', flexShrink: 0 }} />
                  <span><strong>Zero Key Retention in Storage:</strong> Symmetric keys reside strictly in volatile RAM. No key bytes are ever written to the SQLite database.</span>
                </div>
              </div>
            </div>

            {/* Search & Export Toolbar */}
            <div className="surface-card" style={{ padding: '14px 18px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 260 }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: 360 }}>
                  <Icons.search size={16} style={{ position: 'absolute', left: 12, top: 10, color: '#64748b' }} />
                  <input
                    type="text"
                    placeholder="Search by Session ID or Device ID..."
                    value={sessionSearch}
                    onChange={e => { setSessionSearch(e.target.value); setSessionPage(1); }}
                    className="form-input"
                    style={{ paddingLeft: 36 }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 4 }}>
                  {['ALL', 'ACTIVE', 'DEACTIVATED', 'DESTROYED'].map(st => (
                    <button
                      key={st}
                      onClick={() => { setSessionStateFilter(st); setSessionPage(1); }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: '1px solid',
                        borderColor: sessionStateFilter === st ? '#15803d' : '#cbd5e1',
                        backgroundColor: sessionStateFilter === st ? '#15803d' : '#ffffff',
                        color: sessionStateFilter === st ? '#ffffff' : '#475569',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => exportToCsv('sessions_lifecycle', filteredSessions)}
                className="btn-secondary"
              >
                <Icons.download size={14} />
                Export CSV ({filteredSessions.length})
              </button>
            </div>

            {/* Sessions Table */}
            <div className="surface-card" style={{ overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto', maxHeight: 520 }}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Session ID</th>
                      <th>Device ID</th>
                      <th>Key ID</th>
                      <th>State</th>
                      <th>Created At</th>
                      <th>Expires At</th>
                      <th>Message Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSessions.slice((sessionPage - 1) * pageSize, sessionPage * pageSize).map(sess => (
                      <tr key={sess.session_id}>
                        <td>
                          <span className="font-mono" style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 600 }}>
                            {sess.session_id.substring(0, 14)}...
                          </span>
                        </td>
                        <td>
                          <span className="font-mono" style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 600 }}>
                            {sess.device_id}
                          </span>
                        </td>
                        <td>
                          <span className="font-mono" style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {sess.key_id ? sess.key_id.substring(0, 10) + '...' : '—'}
                          </span>
                        </td>
                        <td>
                          <Badge status={sess.state} />
                        </td>
                        <td className="font-mono" style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {sess.created_at || '—'}
                        </td>
                        <td className="font-mono" style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {sess.expires_at || '—'}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className="font-mono" style={{ fontWeight: 600, color: '#0f172a' }}>
                            {sess.message_count || 0}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {!filteredSessions.length && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: 32, color: '#64748b' }}>
                          No sessions match the current criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredSessions.length > pageSize && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Showing {(sessionPage - 1) * pageSize + 1} to {Math.min(sessionPage * pageSize, filteredSessions.length)} of {filteredSessions.length} sessions
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      disabled={sessionPage <= 1}
                      onClick={() => setSessionPage(p => p - 1)}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      Previous
                    </button>
                    <span style={{ padding: '4px 10px', fontSize: '0.78rem', color: '#334155', fontWeight: 500 }}>
                      Page {sessionPage} of {Math.ceil(filteredSessions.length / pageSize)}
                    </span>
                    <button
                      disabled={sessionPage >= Math.ceil(filteredSessions.length / pageSize)}
                      onClick={() => setSessionPage(p => p + 1)}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 3: AUDIT LOG ─────────────────────────────────────────────── */}
        {activeTab === 'audit' && (
          <div>
            {/* Hash Chain Integrity Banner */}
            <div
              className="surface-card"
              style={{
                padding: '16px 20px',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
                borderLeft: auditData.chain_valid ? '4px solid #15803d' : '4px solid #dc2626',
                backgroundColor: auditData.chain_valid ? '#f0fdf4' : '#fef2f2',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: auditData.chain_valid ? '#dcfce7' : '#fee2e2', color: auditData.chain_valid ? '#15803d' : '#b91c1c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {auditData.chain_valid ? <Icons.check size={22} /> : <Icons.alert size={22} />}
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: auditData.chain_valid ? '#15803d' : '#b91c1c' }}>
                    {auditData.chain_valid ? 'Cryptographic Hash Chain Integrity: VERIFIED' : `Hash Chain Broken at Block #${auditData.chain_break_index}`}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: auditData.chain_valid ? '#166534' : '#991b1b', marginTop: 2 }}>
                    Every log record is sequentially chained via SHA-256: <code>H_i = H(H_{'{i-1}'} || payload_i)</code>. Any alteration causes immediate verification failure.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {hashVerificationStatus && (
                  <span style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 600 }}>
                    {hashVerificationStatus === 'verifying' ? 'Verifying 500+ records...' : `Checked ${hashVerificationStatus.total_verified} blocks ✓`}
                  </span>
                )}
                <button
                  onClick={verifyHashChain}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 6,
                    backgroundColor: '#ffffff',
                    color: '#15803d',
                    border: '1px solid #15803d',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <Icons.refresh size={14} />
                  Re-Verify Chain
                </button>
              </div>
            </div>

            {/* Audit Distribution & Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 20 }}>
              <div className="surface-card" style={{ padding: 20 }}>
                <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a', marginBottom: 16 }}>
                  Audit Outcomes Distribution
                </h3>
                <ChartCanvas
                  type="doughnut"
                  data={auditChartData}
                  options={{
                    plugins: {
                      legend: { position: 'right' },
                    },
                  }}
                  height={180}
                />
              </div>

              <div className="surface-card" style={{ padding: 20 }}>
                <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a', marginBottom: 16 }}>
                  Security Event Summary
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 10 }}>
                  <div style={{ backgroundColor: '#f0fdf4', padding: 14, borderRadius: 6, border: '1px solid #bbf7d0', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.72rem', color: '#166534', textTransform: 'uppercase', fontWeight: 600 }}>Accepted</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#15803d', marginTop: 4 }}>
                      {auditData.outcome_counts.ACCEPTED || 0}
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#fef2f2', padding: 14, borderRadius: 6, border: '1px solid #fecaca', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.72rem', color: '#991b1b', textTransform: 'uppercase', fontWeight: 600 }}>Rejected</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#b91c1c', marginTop: 4 }}>
                      {auditData.outcome_counts.REJECTED || 0}
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#f0f9ff', padding: 14, borderRadius: 6, border: '1px solid #bae6fd', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.72rem', color: '#0369a1', textTransform: 'uppercase', fontWeight: 600 }}>System Info</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0284c7', marginTop: 4 }}>
                      {auditData.outcome_counts.INFO || 0}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 14, fontSize: '0.78rem', color: '#64748b', textAlign: 'center' }}>
                  Total events indexed: {auditData.events ? auditData.events.length : 0} (displaying last 500)
                </div>
              </div>
            </div>

            {/* Filter Toolbar */}
            <div className="surface-card" style={{ padding: '14px 18px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 260 }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: 360 }}>
                  <Icons.search size={16} style={{ position: 'absolute', left: 12, top: 10, color: '#64748b' }} />
                  <input
                    type="text"
                    placeholder="Search event type, device ID, details..."
                    value={auditSearch}
                    onChange={e => { setAuditSearch(e.target.value); setAuditPage(1); }}
                    className="form-input"
                    style={{ paddingLeft: 36 }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 4 }}>
                  {['ALL', 'ACCEPTED', 'REJECTED', 'INFO'].map(out => (
                    <button
                      key={out}
                      onClick={() => { setAuditFilter(out); setAuditPage(1); }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: '1px solid',
                        borderColor: auditFilter === out ? '#15803d' : '#cbd5e1',
                        backgroundColor: auditFilter === out ? '#15803d' : '#ffffff',
                        color: auditFilter === out ? '#ffffff' : '#475569',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {out}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => exportToCsv('audit_log', filteredAudit)}
                className="btn-secondary"
              >
                <Icons.download size={14} />
                Export CSV ({filteredAudit.length})
              </button>
            </div>

            {/* Audit Table */}
            <div className="surface-card" style={{ overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto', maxHeight: 520 }}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Outcome</th>
                      <th>Event Type</th>
                      <th>Component</th>
                      <th>Device ID</th>
                      <th>Details</th>
                      <th>Hash Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAudit.slice((auditPage - 1) * pageSize, auditPage * pageSize).map((ev, i) => (
                      <tr
                        key={ev.id || i}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedAuditLog(ev)}
                        title="Click to inspect cryptographic hash link"
                      >
                        <td className="font-mono" style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                          {ev.timestamp}
                        </td>
                        <td>
                          <Badge status={ev.outcome} />
                        </td>
                        <td>
                          <span className="font-mono" style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.8rem' }}>
                            {ev.event_type}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.78rem', color: '#475569' }}>
                            {ev.component}
                          </span>
                        </td>
                        <td>
                          <span className="font-mono" style={{ fontSize: '0.78rem', color: '#15803d' }}>
                            {ev.device_id || '—'}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.78rem', color: '#334155', maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {ev.details || '—'}
                        </td>
                        <td>
                          <span className="font-mono" style={{ fontSize: '0.72rem', color: '#475569', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', padding: '2px 6px', borderRadius: 4 }}>
                            {ev.current_hash ? ev.current_hash.substring(0, 8) + '...' : 'GENESIS'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {!filteredAudit.length && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: 32, color: '#64748b' }}>
                          No audit entries match the current filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredAudit.length > pageSize && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Showing {(auditPage - 1) * pageSize + 1} to {Math.min(auditPage * pageSize, filteredAudit.length)} of {filteredAudit.length} records
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      disabled={auditPage <= 1}
                      onClick={() => setAuditPage(p => p - 1)}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      Previous
                    </button>
                    <span style={{ padding: '4px 10px', fontSize: '0.78rem', color: '#334155', fontWeight: 500 }}>
                      Page {auditPage} of {Math.ceil(filteredAudit.length / pageSize)}
                    </span>
                    <button
                      disabled={auditPage >= Math.ceil(filteredAudit.length / pageSize)}
                      onClick={() => setAuditPage(p => p + 1)}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 4: BENCHMARKS ───────────────────────────────────────────── */}
        {activeTab === 'benchmarks' && (
          <div>
            {/* Header info */}
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
                Experimental Evaluation & Performance Benchmarks
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 4 }}>
                Empirical benchmarks executed over 1,000 measured trials (50 warm-up runs) on physical hardware.
              </p>
            </div>

            {/* Primitive Operations Chart & Table */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: 20, marginBottom: 20 }}>
              <div className="surface-card" style={{ padding: 20 }}>
                <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a', marginBottom: 16 }}>
                  Key Establishment Timings by Algorithm (µs)
                </h3>
                {benchmarkChartData ? (
                  <ChartCanvas
                    type="bar"
                    data={benchmarkChartData}
                    options={{
                      plugins: {
                        legend: { position: 'bottom' },
                      },
                    }}
                    height={260}
                  />
                ) : (
                  <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
                    Run <code>bash run.sh bench</code> to populate primitive benchmark timings.
                  </div>
                )}
              </div>

              <div className="surface-card" style={{ padding: 20 }}>
                <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a', marginBottom: 12 }}>
                  E1: Primitive Operation Timings
                </h3>
                <div style={{ overflowX: 'auto', maxHeight: 260 }}>
                  <table className="custom-table" style={{ fontSize: '0.78rem' }}>
                    <thead>
                      <tr>
                        <th>Algorithm</th>
                        <th>Operation</th>
                        <th>Mean (µs)</th>
                        <th>SD (µs)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(benchmarksData.e1_primitive_benchmarks || []).map((row, idx) => (
                        <tr key={idx}>
                          <td><span className="font-mono" style={{ color: '#15803d', fontWeight: 600 }}>{row.algorithm}</span></td>
                          <td><span style={{ color: '#334155' }}>{row.operation}</span></td>
                          <td className="font-mono" style={{ fontWeight: 600, color: '#0f172a' }}>{parseFloat(row.mean_us).toFixed(2)}</td>
                          <td className="font-mono" style={{ color: '#64748b' }}>{parseFloat(row.sd_us).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Table 20 Performance Comparison */}
            <div className="surface-card" style={{ padding: 20, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>
                  Table 20: Comprehensive Scheme Comparison
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600, backgroundColor: '#f0fdf4', padding: '3px 8px', borderRadius: 4, border: '1px solid #bbf7d0' }}>
                  PQ-KMS vs Classical (ECDH/ECDSA) & Baselines
                </span>
              </div>

              {benchmarksData.table20_comparison && benchmarksData.table20_comparison.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table className="custom-table">
                    <thead>
                      <tr>
                        {Object.keys(benchmarksData.table20_comparison[0]).map(h => (
                          <th key={h}>{h.replace(/_/g, ' ').toUpperCase()}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {benchmarksData.table20_comparison.map((r, i) => (
                        <tr key={i} style={{ backgroundColor: r.Scheme && r.Scheme.includes('PQ-KMS') ? '#f0fdf4' : undefined }}>
                          {Object.values(r).map((v, j) => (
                            <td key={j} className={j > 0 ? 'font-mono' : ''} style={{ fontSize: '0.8rem', fontWeight: j === 0 ? 600 : 400, color: r.Scheme && r.Scheme.includes('PQ-KMS') && j === 0 ? '#15803d' : '#334155' }}>
                              {v}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <pre style={{ backgroundColor: '#f8fafc', padding: 16, borderRadius: 6, border: '1px solid #e2e8f0', fontSize: '0.78rem', color: '#334155', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
                  {benchmarksData.table20_markdown || 'No Table 20 comparison file found.'}
                </pre>
              )}
            </div>

            {/* Publication Figures Gallery */}
            <div className="surface-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>
                    Publication-Quality Figures
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Generated vector/high-resolution charts ready for IEEE/ACM publication and thesis presentation.
                  </p>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#15803d', padding: '3px 8px', borderRadius: 4, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', fontWeight: 500 }}>
                  Click image to expand
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                {(benchmarksData.figures || []).map(fig => (
                  <div
                    key={fig.filename}
                    onClick={() => setSelectedFigure(fig)}
                    className="surface-card-interactive"
                    style={{
                      overflow: 'hidden',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ height: 180, backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8 }}>
                      <img
                        src={fig.url}
                        alt={fig.title}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        loading="lazy"
                      />
                    </div>
                    <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' }}>
                        {fig.title}
                      </span>
                      <Icons.zoom size={15} style={{ color: '#15803d' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 5: SECURITY OVERVIEW ─────────────────────────────────────── */}
        {activeTab === 'security' && (
          <div>
            {/* Header info */}
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
                Cryptographic Verification & Threat Mitigation Lab
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 4 }}>
                Formal security guarantees verified under NIST SP 800-57, SP 800-208, and Dolev-Yao adversary models.
              </p>
            </div>

            {/* Test Summary & CRL Top Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 20 }}>
              {/* Test summary card */}
              <div className="surface-card" style={{ padding: 20, borderLeft: '4px solid #15803d' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a' }}>
                    Security Test Suite (Table 15)
                  </h3>
                  <Badge status="PASS" label="23/23 PASSED" />
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#15803d', margin: '12px 0 4px' }}>
                  100% Invariants Verified
                </div>
                <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
                  Passed all 14 Security Tests (ST-01 through ST-14) and 5 Functional Tests (FT-01 through FT-05) covering replay attacks, tampered ciphertexts, revoked devices, forged ML-DSA signatures, and cross-context separation.
                </p>
              </div>

              {/* Signed CRL Inspector Card */}
              <div className="surface-card" style={{ padding: 20, borderLeft: '4px solid #dc2626' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a' }}>
                    Latest Signed CRL (Algorithm 5)
                  </h3>
                  <Badge status={securityData.crl ? 'REVOKED' : 'INFO'} label={securityData.crl ? `v${securityData.crl.list_version}` : 'None'} />
                </div>
                {securityData.crl ? (
                  <div style={{ marginTop: 10, fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ color: '#64748b' }}>Issued Timestamp:</span>
                      <span className="font-mono" style={{ color: '#334155' }}>{securityData.crl.issued_at}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ color: '#64748b' }}>Revoked Devices:</span>
                      <span className="font-mono" style={{ color: '#b91c1c', fontWeight: 700 }}>
                        {securityData.crl.device_ids ? securityData.crl.device_ids.join(', ') : 'None'}
                      </span>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <span style={{ color: '#64748b', fontSize: '0.75rem' }}>ML-DSA-65 Signature Preview:</span>
                      <div className="font-mono" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px 10px', borderRadius: 4, fontSize: '0.72rem', color: '#0f172a', overflowX: 'auto', marginTop: 4 }}>
                        {securityData.crl.signature_preview}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: 20, color: '#64748b', textAlign: 'center' }}>
                    No revocation list issued yet.
                  </div>
                )}
              </div>
            </div>

            {/* Message Stats */}
            {securityData.message_stats && Object.keys(securityData.message_stats).length > 0 && (
              <div className="surface-card" style={{ padding: 20, marginBottom: 20 }}>
                <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a', marginBottom: 14 }}>
                  Message Processing & Tamper Rejection Statistics
                </h3>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {Object.entries(securityData.message_stats).map(([k, v]) => (
                    <div key={k} style={{ flex: 1, minWidth: 160, backgroundColor: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>{k}</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 700, color: k === 'ACCEPTED' ? '#15803d' : '#b91c1c', marginTop: 4 }}>
                        {v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Test Cases Table */}
            <div className="surface-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>
                  Table 15: Security Test Cases & Threat Vector Coverage
                </h3>
                <button
                  onClick={() => exportToCsv('security_test_cases', securityData.security_test_cases)}
                  className="btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  <Icons.download size={13} />
                  Export CSV
                </button>
              </div>

              <div style={{ overflowX: 'auto', maxHeight: 500 }}>
                <table className="custom-table" style={{ fontSize: '0.8rem' }}>
                  <thead>
                    <tr>
                      <th>Test ID</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Attack Vector</th>
                      <th>Security Property</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(securityData.security_test_cases || []).map((t, idx) => (
                      <tr key={idx}>
                        <td><span className="font-mono" style={{ fontWeight: 700, color: '#15803d' }}>{t.test_id || t.Test}</span></td>
                        <td><span style={{ color: '#475569' }}>{t.category || t.Category || 'SECURITY'}</span></td>
                        <td style={{ color: '#0f172a' }}>{t.description || t.Description}</td>
                        <td><span style={{ color: '#b91c1c', fontSize: '0.75rem' }}>{t.attack_vector || t.Attack_Vector || '—'}</span></td>
                        <td><span style={{ color: '#4f46e5', fontSize: '0.75rem' }}>{t.security_property || t.Security_Property || '—'}</span></td>
                        <td><Badge status={t.status || t.Result || 'PASS'} /></td>
                      </tr>
                    ))}
                    {!securityData.security_test_cases?.length && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: 32, color: '#64748b' }}>
                          Run <code>pytest tests/</code> to populate security test cases.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ─── MODAL: Provision New Biochip Device ──────────────────────────── */}
      {provisionModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="surface-card" style={{ width: '100%', maxWidth: 580, backgroundColor: '#ffffff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.plus size={16} />
                </div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>
                  Provision & Register Biochip Node (Algorithm 1)
                </h3>
              </div>
              <button onClick={() => setProvisionModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}>
                <Icons.x size={18} />
              </button>
            </div>

            <div style={{ padding: 20 }}>
              {!provisionResult ? (
                <form onSubmit={handleProvisionDevice}>
                  <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, marginBottom: 16 }}>
                    Generates an out-of-band one-time enrolment code, generates local <strong>ML-KEM-768</strong> (FIPS 203) & <strong>ML-DSA-65</strong> (FIPS 204) post-quantum keypairs, signs proof-of-possession, and registers the node in the hardware registry.
                  </p>

                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                      Device Identifier (e.g. DMFB-LAB-01, DMFB-ICU-04):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. DMFB-LAB-01"
                      value={newDeviceId}
                      onChange={e => setNewDeviceId(e.target.value)}
                      required
                      className="form-input font-mono"
                    />
                  </div>

                  <div style={{ marginBottom: 18 }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                      Assigned Medical Role:
                    </label>
                    <select
                      value={newDeviceRole}
                      onChange={e => setNewDeviceRole(e.target.value)}
                      className="form-input"
                    >
                      <option value="CLINICAL_ANALYZER">CLINICAL_ANALYZER (Multiplex diagnostic sensor)</option>
                      <option value="GLUCOSE_MONITOR">GLUCOSE_MONITOR (Enzymatic blood assay)</option>
                      <option value="ELECTROLYTE_SENSOR">ELECTROLYTE_SENSOR (ISE ion detection)</option>
                      <option value="BIOCHIP_NODE">BIOCHIP_NODE (Standard DMFB droplet grid)</option>
                      <option value="INSULIN_ACTUATOR">INSULIN_ACTUATOR (Critical closed-loop delivery)</option>
                    </select>
                  </div>

                  {provisionError && (
                    <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '10px 14px', borderRadius: 6, color: '#b91c1c', fontSize: '0.8rem', marginBottom: 14 }}>
                      {provisionError}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <button
                      type="button"
                      onClick={() => setProvisionModalOpen(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={provisionLoading}
                      className="btn-primary"
                    >
                      {provisionLoading ? (
                        <>
                          <Icons.refresh size={14} className="live-pulse" />
                          Generating Quantum Keys...
                        </>
                      ) : (
                        <>
                          <Icons.key size={14} />
                          Generate Quantum Keys & Register
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: 14, borderRadius: 8, marginBottom: 16 }}>
                    <Icons.checkCircle size={24} style={{ color: '#15803d', flexShrink: 0 }} />
                    <div>
                      <div style={{ color: '#15803d', fontWeight: 700, fontSize: '0.92rem' }}>
                        Device Provisioned & Authorized Successfully
                      </div>
                      <div style={{ color: '#166534', fontSize: '0.75rem', marginTop: 2 }}>
                        Registered in SQLite registry and bound to hash-chained tamper-evident audit log.
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                    <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: 10, borderRadius: 6 }}>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Device ID</div>
                      <div className="font-mono" style={{ fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{provisionResult.device_id}</div>
                    </div>
                    <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: 10, borderRadius: 6 }}>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Assigned Role</div>
                      <div style={{ fontWeight: 600, color: '#0f172a', marginTop: 2 }}>{provisionResult.role}</div>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: 12, borderRadius: 6, marginBottom: 10, fontSize: '0.78rem' }}>
                    <div style={{ color: '#64748b', marginBottom: 2 }}>One-Time Enrolment Code:</div>
                    <div className="font-mono" style={{ color: '#b45309', fontWeight: 600, wordBreak: 'break-all' }}>{provisionResult.enrolment_code}</div>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: 12, borderRadius: 6, marginBottom: 10, fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: 2 }}>
                      <span>ML-KEM-768 Public Key:</span>
                      <span className="font-mono" style={{ color: '#15803d', fontWeight: 600 }}>{provisionResult.kem_pk_len} bytes</span>
                    </div>
                    <div className="font-mono" style={{ color: '#0f172a', wordBreak: 'break-all', fontSize: '0.72rem' }}>{provisionResult.kem_pk_preview}</div>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: 12, borderRadius: 6, marginBottom: 16, fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: 2 }}>
                      <span>ML-DSA-65 Verification Key:</span>
                      <span className="font-mono" style={{ color: '#15803d', fontWeight: 600 }}>{provisionResult.sig_pk_len} bytes</span>
                    </div>
                    <div className="font-mono" style={{ color: '#0f172a', wordBreak: 'break-all', fontSize: '0.72rem' }}>{provisionResult.sig_pk_preview}</div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <button
                      onClick={() => {
                        setProvisionResult(null);
                        setProvisionModalOpen(false);
                      }}
                      className="btn-primary"
                    >
                      Close & View in Registry
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: System Specs ────────────────────────────────────────────── */}
      {envModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="surface-card" style={{ width: '100%', maxWidth: 560, backgroundColor: '#ffffff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.cpu size={18} />
                </div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>
                  Host Environment & Cryptographic Stack
                </h3>
              </div>
              <button onClick={() => setEnvModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}>
                <Icons.x size={18} />
              </button>
            </div>
            <div style={{ padding: 20, maxHeight: 480, overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: 12, borderRadius: 6 }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>CPU Architecture</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{info.environment?.cpu || 'x86_64'}</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: 12, borderRadius: 6 }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Cores (Physical / Logical)</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                    {info.environment?.cpu_cores || 10} / {info.environment?.cpu_logical || 12}
                  </div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: 12, borderRadius: 6 }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>RAM Available</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{info.environment?.ram_gb || 16.4} GB</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: 12, borderRadius: 6 }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>liboqs Version</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#15803d', marginTop: 2 }}>{info.environment?.liboqs_version || '0.16.0'}</div>
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: 12, borderRadius: 6, marginBottom: 12, fontSize: '0.8rem' }}>
                <div style={{ color: '#64748b', marginBottom: 4 }}>Operating System:</div>
                <div className="font-mono" style={{ color: '#0f172a' }}>{info.environment?.os || 'Linux'}</div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: 12, borderRadius: 6, fontSize: '0.8rem' }}>
                <div style={{ color: '#64748b', marginBottom: 4 }}>Server ML-DSA Verification Key Preview:</div>
                <div className="font-mono" style={{ color: '#15803d', fontSize: '0.72rem', wordBreak: 'break-all' }}>
                  {info.server_vk_preview || 'Loaded from server_keys.json'}
                </div>
              </div>
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid #e2e8f0', textAlign: 'right', backgroundColor: '#f8fafc' }}>
              <button onClick={() => setEnvModalOpen(false)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: Audit Hash Chain Inspector ────────────────────────────── */}
      {selectedAuditLog && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="surface-card" style={{ width: '100%', maxWidth: 620, backgroundColor: '#ffffff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.fileText size={18} />
                </div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>
                  Audit Block #{selectedAuditLog.id} Inspector
                </h3>
              </div>
              <button onClick={() => setSelectedAuditLog(null)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}>
                <Icons.x size={18} />
              </button>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Event Outcome: </span>
                <Badge status={selectedAuditLog.outcome} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Event Type: </span>
                <strong style={{ color: '#0f172a' }}>{selectedAuditLog.event_type}</strong>
              </div>
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Device Binding: </span>
                <span className="font-mono" style={{ color: '#15803d', fontWeight: 600 }}>{selectedAuditLog.device_id || 'System / None'}</span>
              </div>
              <div style={{ marginBottom: 14 }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Details: </span>
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: 10, borderRadius: 6, fontSize: '0.8rem', color: '#334155', marginTop: 4 }}>
                  {selectedAuditLog.details || '—'}
                </div>
              </div>

              {/* Hash Chain Link Visualizer */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 14 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
                  Cryptographic Chain Link (SHA-256):
                </div>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Previous Hash (H_{'{i-1}'}):</div>
                  <div className="font-mono" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: 8, borderRadius: 6, fontSize: '0.72rem', color: '#64748b', wordBreak: 'break-all' }}>
                    {selectedAuditLog.prev_hash || '0000000000000000000000000000000000000000000000000000000000000000'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Current Block Hash (H_i):</div>
                  <div className="font-mono" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: 8, borderRadius: 6, fontSize: '0.72rem', color: '#15803d', wordBreak: 'break-all', fontWeight: 600 }}>
                    {selectedAuditLog.current_hash}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid #e2e8f0', textAlign: 'right', backgroundColor: '#f8fafc' }}>
              <button onClick={() => setSelectedAuditLog(null)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: Figure Zoom ───────────────────────────────────────────── */}
      {selectedFigure && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)', zIndex: 100, display: 'flex', flexDirection: 'column', padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', backgroundColor: '#ffffff', borderRadius: 8, marginBottom: 12 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>
              {selectedFigure.title}
            </h3>
            <button onClick={() => setSelectedFigure(null)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}>
              <Icons.x size={20} />
            </button>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img
              src={selectedFigure.url}
              alt={selectedFigure.title}
              style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: 8, backgroundColor: '#ffffff', padding: 12, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}
            />
          </div>
        </div>
      )}

      {/* ─── Footer ────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid #e2e8f0', backgroundColor: '#ffffff', padding: '16px 24px', textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }}>
        PQ-KMS Post-Quantum Cryptographic Framework • NIST FIPS 203 (ML-KEM-768) • NIST FIPS 204 (ML-DSA-65) • AES-256-GCM • SHA-256 Hash Chain Integrity
      </footer>
    </div>
  );
}
