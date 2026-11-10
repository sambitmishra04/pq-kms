import React, { useState, useEffect, useRef, useMemo } from 'react';

// ─── SVG Icons (Clean, Consistent Stroke, Self-Contained) ─────────────────────
const Icons = {
  shield: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  microscope: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>
    </svg>
  ),
  crosshair: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="6"/><line x1="12" x2="12" y1="18" y2="22"/>
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
      <rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9"/><path d="M15 2v2M9 2v2M20 15h2M20 9h2M9 20v2M15 20v2M2 9h2M2 15h2"/>
    </svg>
  ),
  download: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>
    </svg>
  ),
  x: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/>
    </svg>
  ),
  plus: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  play: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
  fastForward: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polygon points="13 19 22 12 13 5 13 19"/><polygon points="2 19 11 12 2 5 2 19"/>
    </svg>
  ),
  checkCircle: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  ban: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="10"/><line x1="4.93" x2="19.07" y1="4.93" y2="19.07"/>
    </svg>
  ),
};

// ─── Status Badge Component ───────────────────────────────────────────────────
function Badge({ status, label }) {
  const s = (status || '').toUpperCase();
  let cls = 'badge-neutral';
  let dotColor = '#64748b';

  if (['AUTHORIZED', 'ACTIVE', 'ACCEPTED', 'VALID', 'PASS', 'PROTECTED'].includes(s)) {
    cls = 'badge-authorized';
    dotColor = '#16a34a';
  } else if (['REVOKED', 'REJECTED', 'COMPROMISED', 'FAIL', 'BROKEN', 'VULNERABLE'].includes(s)) {
    cls = 'badge-revoked';
    dotColor = '#dc2626';
  } else if (['PENDING', 'DEACTIVATED', 'WARNING'].includes(s)) {
    cls = 'badge-pending';
    dotColor = '#d97706';
  } else if (['DISABLED', 'DESTROYED', 'INFO', 'IDLE'].includes(s)) {
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

// ─── 2D DMFB Physical Biochip Electrode Grid ──────────────────────────────────
function BiochipGridComponent({ simData }) {
  const gridWidth = simData?.grid_size ? simData.grid_size[0] : 8;
  const gridHeight = simData?.grid_size ? simData.grid_size[1] : 8;

  const activeSet = useMemo(() => {
    const s = new Set();
    (simData?.active_electrodes || []).forEach(([x, y]) => s.add(`${x},${y}`));
    return s;
  }, [simData?.active_electrodes]);

  const detectorCoord = simData?.detector_coord || [3, 6];
  const sampleCoord = simData?.dispensers?.sample || [0, 2];
  const reagentCoord = simData?.dispensers?.reagent || [7, 2];
  const wasteCoord = simData?.dispensers?.waste || [7, 7];

  const droplets = simData?.droplets || [];

  // Generate 8x8 cell items (Row 0 to 7, Col 0 to 7)
  const cells = [];
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const isDetector = x === detectorCoord[0] && y === detectorCoord[1];
      const isSample = x === sampleCoord[0] && y === sampleCoord[1];
      const isReagent = x === reagentCoord[0] && y === reagentCoord[1];
      const isWaste = x === wasteCoord[0] && y === wasteCoord[1];
      const isActive = activeSet.has(`${x},${y}`);

      const cellDroplet = droplets.find(d => d.x === x && d.y === y);

      let cellClass = 'biochip-cell';
      if (isActive) cellClass += ' active-electrode';
      if (isDetector) cellClass += ' detector-cell';
      else if (isSample) cellClass += ' sample-cell';
      else if (isReagent) cellClass += ' reagent-cell';
      else if (isWaste) cellClass += ' waste-cell';

      let cellTitle = `Electrode (${x}, ${y})`;
      if (isDetector) cellTitle += ' [Optical Photodiode Sensor]';
      if (isSample) cellTitle += ' [Serum Sample Dispenser]';
      if (isReagent) cellTitle += ' [GOx Reagent Dispenser]';
      if (isWaste) cellTitle += ' [Waste Reservoir]';
      if (cellDroplet) cellTitle += ` — Droplet: ${cellDroplet.label} (${cellDroplet.volume_ul} µL, ${cellDroplet.concentration_mg_dl} mg/dL)`;

      cells.push(
        <div key={`${x}-${y}`} className={cellClass} title={cellTitle}>
          {/* Subtle coordinate watermark in background */}
          <span style={{ position: 'absolute', top: 2, left: 3, fontSize: '0.55rem', color: '#94a3b8', pointerEvents: 'none' }}>
            {x},{y}
          </span>

          {/* Droplet overlay */}
          {cellDroplet && (
            <div
              className="biochip-droplet"
              style={{
                backgroundColor: cellDroplet.color || '#3b82f6',
              }}
            >
              {cellDroplet.id === 'D-SAMPLE' ? 'S' : cellDroplet.id === 'D-REAGENT' ? 'R' : cellDroplet.id === 'D-MIXED' ? 'M' : cellDroplet.id === 'D-TEST' ? 'T' : 'W'}
            </div>
          )}

          {/* Icon indicator for special electrodes if no droplet */}
          {!cellDroplet && isDetector && (
            <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#15803d' }}>
              OPT
            </span>
          )}
          {!cellDroplet && isSample && (
            <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#ef4444' }}>
              IN-S
            </span>
          )}
          {!cellDroplet && isReagent && (
            <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#0284c7' }}>
              IN-R
            </span>
          )}
          {!cellDroplet && isWaste && (
            <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#64748b' }}>
              WST
            </span>
          )}
        </div>
      );
    }
  }

  return (
    <div>
      <div className="biochip-grid">
        {cells}
      </div>

      {/* Grid Legend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 14, marginTop: 12, fontSize: '0.74rem', color: '#64748b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#f0fdf4', border: '1px solid #16a34a' }} />
          <span>Active Electrowetting</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, border: '2px dashed #15803d', backgroundColor: 'rgba(22, 163, 74, 0.1)' }} />
          <span>Photodiode (3,6)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, border: '2px dashed #ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' }} />
          <span>Sample In (0,2)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, border: '2px dashed #0284c7', backgroundColor: 'rgba(2, 132, 199, 0.1)' }} />
          <span>Reagent In (7,2)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, border: '2px dashed #64748b', backgroundColor: 'rgba(100, 116, 139, 0.1)' }} />
          <span>Waste (7,7)</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Application ─────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState('simulator');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefreshSecs, setAutoRefreshSecs] = useState(0);
  const [backendOnline, setBackendOnline] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Data states
  const [info, setInfo] = useState({});
  const [devicesData, setDevicesData] = useState({ total: 0, status_counts: {}, devices: [] });
  const [sessionsData, setSessionsData] = useState({ total: 0, state_counts: {}, sessions: [] });
  const [auditData, setAuditData] = useState({ chain_valid: true, chain_break_index: null, outcome_counts: {}, events: [] });
  const [securityData, setSecurityData] = useState({ security_test_cases: [], test_summary: [], crl: null, message_stats: {} });

  // Biochip Simulator state
  const [simData, setSimData] = useState(null);
  const [simLoading, setSimLoading] = useState(false);
  const [patientGlucoseInput, setPatientGlucoseInput] = useState(220.0);

  // Attack Lab states
  const [attackTab, setAttackTab] = useState('tamper'); // 'tamper' | 'replay' | 'quantum'
  const [tamperTrueGlucose, setTamperTrueGlucose] = useState(220.0);
  const [tamperInjectedGlucose, setTamperInjectedGlucose] = useState(110.0);
  const [tamperLoading, setTamperLoading] = useState(false);
  const [tamperResult, setTamperResult] = useState(null);

  const [replayLoading, setReplayLoading] = useState(false);
  const [replayResult, setReplayResult] = useState(null);

  const [quantumResult, setQuantumResult] = useState(null);
  const [quantumLoading, setQuantumLoading] = useState(false);

  // Filter & Search states
  const [deviceSearch, setDeviceSearch] = useState('');
  const [deviceStatusFilter, setDeviceStatusFilter] = useState('ALL');
  const [sessionSearch, setSessionSearch] = useState('');
  const [sessionStateFilter, setSessionStateFilter] = useState('ALL');
  const [auditFilter, setAuditFilter] = useState('ALL');
  const [auditSearch, setAuditSearch] = useState('');

  // Modals
  const [diagnosticsModalOpen, setDiagnosticsModalOpen] = useState(false);
  const [selectedAuditLog, setSelectedAuditLog] = useState(null);
  const [hashVerificationStatus, setHashVerificationStatus] = useState(null);

  // Device Provisioning State
  const [provisionModalOpen, setProvisionModalOpen] = useState(false);
  const [newDeviceId, setNewDeviceId] = useState('');
  const [newDeviceRole, setNewDeviceRole] = useState('CLINICAL_ANALYZER');
  const [provisionLoading, setProvisionLoading] = useState(false);
  const [provisionResult, setProvisionResult] = useState(null);
  const [provisionError, setProvisionError] = useState(null);

  // Device Revoke / Quarantine State
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [deviceToRevoke, setDeviceToRevoke] = useState('');
  const [revokeReason, setRevokeReason] = useState('Quarantined by clinical biochip administrator');
  const [revokeLoading, setRevokeLoading] = useState(false);
  const [revokeResult, setRevokeResult] = useState(null);
  const [revokeError, setRevokeError] = useState(null);

  // Pagination states
  const [devicePage, setDevicePage] = useState(1);
  const [sessionPage, setSessionPage] = useState(1);
  const [auditPage, setAuditPage] = useState(1);
  const pageSize = 15;

  // ─── Fetch All Data ──────────────────────────────────────────────────────────
  const fetchAllData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const [rInfo, rDev, rSess, rAudit, rSec, rSim] = await Promise.all([
        fetch('/api/info').then(r => r.json()).catch(() => ({})),
        fetch('/api/devices').then(r => r.json()).catch(() => ({ total: 0, status_counts: {}, devices: [] })),
        fetch('/api/sessions').then(r => r.json()).catch(() => ({ total: 0, state_counts: {}, sessions: [] })),
        fetch('/api/audit?limit=500').then(r => r.json()).catch(() => ({ chain_valid: true, chain_break_index: null, outcome_counts: {}, events: [] })),
        fetch('/api/security').then(r => r.json()).catch(() => ({ security_test_cases: [], test_summary: [], crl: null, message_stats: {} })),
        fetch('/api/simulator/state').then(r => r.json()).catch(() => null),
      ]);

      setInfo(rInfo);
      setDevicesData(rDev);
      setSessionsData(rSess);
      setAuditData(rAudit);
      setSecurityData(rSec);
      if (rSim) setSimData(rSim);
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

  // ─── Biochip Simulator Actions ───────────────────────────────────────────────
  const handleLoadAssay = async (glucose) => {
    setSimLoading(true);
    try {
      const res = await fetch('/api/simulator/load', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_glucose: glucose }),
      }).then(r => r.json());
      setSimData(res);
      fetchAllData();
    } catch (err) {
      console.error('Failed to load assay:', err);
    } finally {
      setSimLoading(false);
    }
  };

  const handleStepSimulator = async () => {
    setSimLoading(true);
    try {
      const res = await fetch('/api/simulator/step', { method: 'POST' }).then(r => r.json());
      setSimData(res);
    } catch (err) {
      console.error('Failed to step simulator:', err);
    } finally {
      setSimLoading(false);
    }
  };

  const handleRunAllSimulator = async () => {
    setSimLoading(true);
    try {
      const res = await fetch('/api/simulator/run_all', { method: 'POST' }).then(r => r.json());
      setSimData(res);
    } catch (err) {
      console.error('Failed to run all steps:', err);
    } finally {
      setSimLoading(false);
    }
  };

  const handleResetSimulator = async () => {
    setSimLoading(true);
    try {
      const res = await fetch('/api/simulator/reset', { method: 'POST' }).then(r => r.json());
      setSimData(res);
    } catch (err) {
      console.error('Failed to reset simulator:', err);
    } finally {
      setSimLoading(false);
    }
  };

  // ─── Attack Lab Actions ──────────────────────────────────────────────────────
  const handleRunTamperAttack = async () => {
    setTamperLoading(true);
    try {
      const res = await fetch('/api/attack/tamper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          true_glucose: Number(tamperTrueGlucose),
          falsified_glucose: Number(tamperInjectedGlucose),
        }),
      }).then(r => r.json());
      setTamperResult(res);
      fetchAllData(); // Refresh audit log as attack trigger logs an event!
    } catch (err) {
      console.error('Tamper attack error:', err);
    } finally {
      setTamperLoading(false);
    }
  };

  const handleRunReplayAttack = async () => {
    setReplayLoading(true);
    try {
      const res = await fetch('/api/attack/replay', { method: 'POST' }).then(r => r.json());
      setReplayResult(res);
      fetchAllData();
    } catch (err) {
      console.error('Replay attack error:', err);
    } finally {
      setReplayLoading(false);
    }
  };

  const handleFetchQuantumThreat = async () => {
    if (quantumResult) return;
    setQuantumLoading(true);
    try {
      const res = await fetch('/api/attack/quantum').then(r => r.json());
      setQuantumResult(res);
    } catch (err) {
      console.error('Quantum threat error:', err);
    } finally {
      setQuantumLoading(false);
    }
  };

  // ─── Device Provisioning & Quarantine Actions ────────────────────────────────
  const handleProvisionDevice = async (e) => {
    if (e) e.preventDefault();
    const devId = newDeviceId.trim() || `DMFB-ICU-${Math.floor(100 + Math.random() * 900)}`;
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

  const handleRevokeDevice = async () => {
    if (!deviceToRevoke) return;
    setRevokeLoading(true);
    setRevokeError(null);
    setRevokeResult(null);

    try {
      const res = await fetch('/api/devices/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_id: deviceToRevoke, reason: revokeReason }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to quarantine device');
      }
      setRevokeResult(data);
      fetchAllData();
    } catch (err) {
      setRevokeError(err.message);
    } finally {
      setRevokeLoading(false);
    }
  };

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

  // Filtered devices memo
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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      {/* ─── Production Header Bar ────────────────────────────────────────── */}
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
          {/* Brand & Hospital Subtitle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: 8, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803d' }}>
              <Icons.shield size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#0f172a' }}>
                  PQ-KMS
                </h1>
                <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: 4, backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', fontWeight: 600 }}>
                  Hospital Lab & Biochip Security Console
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 12, marginTop: 2 }}>
                <span>NIST FIPS 203: <strong style={{ color: '#0f172a' }}>{info.kem_alg || 'ML-KEM-768'}</strong></span>
                <span style={{ color: '#cbd5e1' }}>•</span>
                <span>FIPS 204: <strong style={{ color: '#0f172a' }}>{info.sig_alg || 'ML-DSA-65'}</strong></span>
                <span style={{ color: '#cbd5e1' }}>•</span>
                <span>AEAD: <strong style={{ color: '#0f172a' }}>AES-256-GCM</strong></span>
              </div>
            </div>
          </div>

          {/* Controls: Connection Pill, Auto-Refresh, Refresh, Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Status indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 6, backgroundColor: backendOnline ? '#f0fdf4' : '#fef2f2', border: `1px solid ${backendOnline ? '#bbf7d0' : '#fecaca'}`, fontSize: '0.75rem', fontWeight: 600, color: backendOnline ? '#15803d' : '#b91c1c' }}>
              <span className={backendOnline ? 'live-pulse' : ''} style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: backendOnline ? '#16a34a' : '#dc2626' }} />
              {backendOnline ? 'Hospital Gateway Online' : 'Gateway Offline'}
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

            {/* Provision Biochip Primary Action */}
            <button
              onClick={() => { setProvisionModalOpen(true); setProvisionResult(null); setProvisionError(null); }}
              className="btn-primary"
            >
              <Icons.plus size={14} />
              Enrol Biochip
            </button>

            {/* System Specs Button */}
            <button
              onClick={() => setDiagnosticsModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 12px',
                borderRadius: 6,
                backgroundColor: '#ffffff',
                color: '#475569',
                border: '1px solid #cbd5e1',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              title="System Diagnostics & Low-Level Specs"
            >
              <Icons.cpu size={14} />
              Diagnostics
            </button>
          </div>
        </div>

        {/* ─── Production Navigation Tabs ──────────────────────────────────── */}
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 4, overflowX: 'auto' }}>
          {[
            { id: 'simulator', label: 'Biochip Physical Simulator', icon: Icons.microscope },
            { id: 'attack_lab', label: 'Cyber-Physical Threat Sandbox', icon: Icons.crosshair },
            { id: 'devices', label: 'Clinical Biochip Fleet', icon: Icons.device, count: devicesData.total },
            { id: 'sessions', label: 'Active Cryptographic Sessions', icon: Icons.key, count: sessionsData.total },
            { id: 'audit', label: 'Regulatory Compliance Audit', icon: Icons.fileText, count: auditData.events ? auditData.events.length : 0 },
            { id: 'revocations', label: 'Revocation & Quarantine (CRL)', icon: Icons.ban, count: securityData.crl?.device_ids ? securityData.crl.device_ids.length : 0 },
          ].map(tab => {
            const IconCmp = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'attack_lab' && attackTab === 'quantum') {
                    handleFetchQuantumThreat();
                  }
                }}
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
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: BIOCHIP PHYSICAL SIMULATOR                                   */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'simulator' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }}>
              {/* Left Column: Physical Grid & Active Droplets */}
              <div className="surface-card" style={{ padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                      2D EWOD Electrode Array (8 × 8 Cells)
                    </h2>
                    <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Device: <span className="font-mono" style={{ color: '#15803d', fontWeight: 600 }}>{simData?.device_id || 'DMFB-01'}</span> • Electrowetting on Dielectric Physical Microfluidics
                    </p>
                  </div>
                  <Badge status={simData?.status || 'IDLE'} />
                </div>

                {/* 2D Biochip Grid Canvas */}
                <BiochipGridComponent simData={simData} />

                {/* Live Droplet Inventory Table */}
                <div style={{ marginTop: 20 }}>
                  <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: 8 }}>
                    Active Droplets on Substrate
                  </h3>
                  <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 6 }}>
                    <table className="custom-table" style={{ fontSize: '0.78rem' }}>
                      <thead>
                        <tr>
                          <th>Droplet</th>
                          <th>Type</th>
                          <th>Pos (X, Y)</th>
                          <th>Volume</th>
                          <th>Concentration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(simData?.droplets || []).map(d => (
                          <tr key={d.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: d.color }} />
                                <strong style={{ color: '#0f172a' }}>{d.label}</strong>
                              </div>
                            </td>
                            <td><span style={{ color: '#64748b', textTransform: 'capitalize' }}>{d.droplet_type}</span></td>
                            <td className="font-mono">({d.x}, {d.y})</td>
                            <td className="font-mono">{d.volume_ul} µL</td>
                            <td className="font-mono" style={{ fontWeight: 600, color: d.concentration_mg_dl > 0 ? '#15803d' : '#64748b' }}>
                              {d.concentration_mg_dl > 0 ? `${d.concentration_mg_dl} mg/dL` : '—'}
                            </td>
                          </tr>
                        ))}
                        {!simData?.droplets?.length && (
                          <tr>
                            <td colSpan={5} style={{ textAlign: 'center', padding: 16, color: '#94a3b8' }}>
                              No droplets currently on biochip. Click "Load Assay Protocol" to dispense.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column: Execution Controls & Optical Biosensor Readout */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Assay Execution Controls Card */}
                <div className="surface-card" style={{ padding: 22 }}>
                  <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                    Clinical Assay Protocol Execution
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 18 }}>
                    Enzymatic Glucose Oxidase (GOx) bioassay with in-situ optical detection.
                  </p>

                  {/* Patient Glucose Slider */}
                  <div style={{ backgroundColor: '#f8fafc', padding: 14, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                        Patient Blood Glucose:
                      </label>
                      <span className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: patientGlucoseInput >= 200 ? '#b91c1c' : patientGlucoseInput < 70 ? '#b45309' : '#15803d' }}>
                        {patientGlucoseInput} mg/dL
                      </span>
                    </div>

                    <input
                      type="range"
                      min="40"
                      max="450"
                      step="5"
                      value={patientGlucoseInput}
                      onChange={e => setPatientGlucoseInput(Number(e.target.value))}
                      className="slider-input"
                    />

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: 6 }}>
                      <span>40 (Hypo)</span>
                      <span>70–140 (Normal)</span>
                      <span>200+ (Hyperglycemia)</span>
                      <span>450 mg/dL</span>
                    </div>
                  </div>

                  {/* Execution Control Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                    <button
                      onClick={() => handleLoadAssay(patientGlucoseInput)}
                      disabled={simLoading}
                      className="btn-secondary"
                      style={{ padding: '9px 14px' }}
                    >
                      <Icons.refresh size={15} />
                      Reset & Reload Protocol
                    </button>

                    <button
                      onClick={handleStepSimulator}
                      disabled={simLoading || (simData?.current_step_idx || 0) >= (simData?.total_steps || 7)}
                      className="btn-secondary"
                      style={{ padding: '9px 14px', borderColor: '#15803d', color: '#15803d', fontWeight: 700 }}
                    >
                      <Icons.play size={15} />
                      Next Step ▶
                    </button>
                  </div>

                  <button
                    onClick={handleRunAllSimulator}
                    disabled={simLoading || (simData?.current_step_idx || 0) >= (simData?.total_steps || 7)}
                    className="btn-primary"
                    style={{ width: '100%', padding: '10px 14px', marginBottom: 16 }}
                  >
                    <Icons.fastForward size={16} />
                    Run Complete Assay To Photodiode Readout ⏩
                  </button>

                  {/* Step Progress Bar */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#334155', marginBottom: 6 }}>
                      <span style={{ fontWeight: 600 }}>Protocol Progress:</span>
                      <span className="font-mono">Step {simData?.current_step_idx || 0} of {simData?.total_steps || 7}</span>
                    </div>
                    <div style={{ width: '100%', height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${((simData?.current_step_idx || 0) / (simData?.total_steps || 7)) * 100}%`,
                          height: '100%',
                          backgroundColor: '#15803d',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>

                  {/* Current Actuation Step Detail Box */}
                  {simData?.current_step_info && (
                    <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, padding: '12px 14px', fontSize: '0.8rem', color: '#166534' }}>
                      <div style={{ fontWeight: 700, marginBottom: 2 }}>
                        Step {simData.current_step_info.step_num} ({simData.current_step_info.operation}):
                      </div>
                      <div>{simData.current_step_info.description}</div>
                    </div>
                  )}

                  {!simData?.current_step_info && (
                    <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '12px 14px', fontSize: '0.8rem', color: '#64748b' }}>
                      Protocol ready. Click <strong>"Next Step"</strong> to initiate droplet dispensing and electrowetting actuation.
                    </div>
                  )}
                </div>

                {/* Optical Biosensor Readout Card */}
                <div className="surface-card" style={{ padding: 22, borderLeft: simData?.sensor_data?.detected ? '4px solid #15803d' : '4px solid #cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icons.microscope size={20} style={{ color: '#15803d' }} />
                      <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>
                        Optical Biosensor Readout Site (3, 6)
                      </h3>
                    </div>
                    {simData?.sensor_data?.detected ? (
                      <Badge status="VALID" label="ASSAY DETECTED" />
                    ) : (
                      <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontStyle: 'italic' }}>
                        Awaiting droplet at detector
                      </span>
                    )}
                  </div>

                  {simData?.sensor_data?.detected ? (
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                        <div style={{ backgroundColor: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                          <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Optical Absorbance</div>
                          <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                            {simData.sensor_data.absorbance_au} AU
                          </div>
                        </div>
                        <div style={{ backgroundColor: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                          <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Quantified Glucose</div>
                          <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#15803d', marginTop: 2 }}>
                            {simData.sensor_data.glucose_mg_dl} mg/dL
                          </div>
                        </div>
                      </div>

                      <div style={{ backgroundColor: '#f0fdf4', padding: '10px 14px', borderRadius: 6, border: '1px solid #bbf7d0', fontSize: '0.8rem', marginBottom: 12 }}>
                        <span style={{ color: '#64748b' }}>Clinical Evaluation: </span>
                        <strong style={{ color: simData.sensor_data.clinical_status.includes('CRITICAL') ? '#b91c1c' : '#15803d' }}>
                          {simData.sensor_data.clinical_status}
                        </strong>
                      </div>

                      <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#475569' }}>
                        🔒 <strong>Automatic PQC Packaging:</strong> This optical diagnostic telemetry is automatically signed with <strong>ML-DSA-65</strong> and encapsulated via <strong>ML-KEM-768</strong> with an authenticated <strong>AES-256-GCM</strong> payload before wireless dispatch.
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '24px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem', backgroundColor: '#f8fafc', borderRadius: 6, border: '1px dashed #e2e8f0' }}>
                      Photodiode optical absorbance sensor is currently clear.<br />
                      Advance actuation steps to position the reacted assay droplet under electrode (3, 6).
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 2: CYBER-PHYSICAL THREAT & DEFENSE SANDBOX                      */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'attack_lab' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
                Cyber-Physical Attack Sandbox & Adversary Mitigation
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 4 }}>
                Simulate published cyber-physical attack vectors from biomedical microfluidic literature (Ali et al., Guo et al.) and inspect how PQ-KMS prevents clinical harm.
              </p>
            </div>

            {/* Attack Scenario Switcher Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '1px solid #e2e8f0', paddingBottom: 10 }}>
              {[
                { id: 'tamper', label: '1. Glucose Assay Tampering (Ali et al.)', desc: 'In-transit packet modification' },
                { id: 'replay', label: '2. Diagnostic Reading Replay (Guo et al.)', desc: 'Stale telemetry injection' },
                { id: 'quantum', label: '3. Harvest-Now Decrypt-Later', desc: 'Shor algorithm vulnerability' },
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    setAttackTab(s.id);
                    if (s.id === 'quantum') handleFetchQuantumThreat();
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 6,
                    border: '1px solid',
                    borderColor: attackTab === s.id ? '#15803d' : '#cbd5e1',
                    backgroundColor: attackTab === s.id ? '#f0fdf4' : '#ffffff',
                    color: attackTab === s.id ? '#15803d' : '#475569',
                    fontSize: '0.82rem',
                    fontWeight: attackTab === s.id ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* SCENARIO 1: GLUCOSE RESULT TAMPERING */}
            {attackTab === 'tamper' && (
              <div className="surface-card" style={{ padding: 24 }}>
                <div style={{ marginBottom: 18 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                    Scenario 1: In-Transit Medical Assay Result Manipulation
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: 4, lineHeight: 1.5 }}>
                    Ali et al. demonstrated that adversaries intercepting biochip telemetry can flip critical glucose readings (e.g. 220 mg/dL hyperglycemic crisis altered to 110 mg/dL normal) to trick the clinician into withholding insulin therapy.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 20, backgroundColor: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                      True Physical Sensor Reading (mg/dL):
                    </label>
                    <input
                      type="number"
                      value={tamperTrueGlucose}
                      onChange={e => setTamperTrueGlucose(e.target.value)}
                      className="form-input font-mono"
                    />
                    <span style={{ fontSize: '0.72rem', color: '#b91c1c', marginTop: 4, display: 'block' }}>
                      Actual patient state: Severe Hyperglycemia
                    </span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                      Adversary Injected Falsified Value (mg/dL):
                    </label>
                    <input
                      type="number"
                      value={tamperInjectedGlucose}
                      onChange={e => setTamperInjectedGlucose(e.target.value)}
                      className="form-input font-mono"
                    />
                    <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 4, display: 'block' }}>
                      Attacker goal: Mask danger as normal fasting (110 mg/dL)
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <button
                    onClick={handleRunTamperAttack}
                    disabled={tamperLoading}
                    className="btn-primary"
                    style={{ padding: '10px 20px', backgroundColor: '#dc2626', borderColor: '#b91c1c' }}
                  >
                    <Icons.crosshair size={16} />
                    {tamperLoading ? 'Executing In-Transit Attack Simulation...' : 'Launch In-Transit Attack Simulation'}
                  </button>
                </div>

                {tamperResult && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    {/* Unprotected Legacy */}
                    <div style={{ border: '1px solid #fecaca', backgroundColor: '#fef2f2', borderRadius: 8, padding: 18 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#b91c1c' }}>
                          ❌ Legacy Unprotected Biochip (Yao et al. / CRC)
                        </h4>
                        <Badge status="VULNERABLE" label="ATTACK SUCCEEDED" />
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#7f1d1d', lineHeight: 1.6 }}>
                        <div style={{ marginBottom: 8 }}>
                          <strong>Hospital Server Received:</strong>{' '}
                          <span className="font-mono" style={{ fontWeight: 700, color: '#b91c1c' }}>
                            {tamperResult.unprotected_system.received_glucose} mg/dL
                          </span>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <strong>Integrity Check:</strong> None (passed weak CRC-32 / unauthenticated ciphertext).
                        </div>
                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #fca5a5', padding: 10, borderRadius: 6, color: '#991b1b', fontWeight: 500 }}>
                          ⚠️ <strong>Fatal Clinical Impact:</strong> {tamperResult.unprotected_system.clinical_consequence}
                        </div>
                      </div>
                    </div>

                    {/* Protected PQ-KMS */}
                    <div style={{ border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4', borderRadius: 8, padding: 18 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#15803d' }}>
                          🛡️ With PQ-KMS Authenticated Encryption
                        </h4>
                        <Badge status="PROTECTED" label="ATTACK BLOCKED" />
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#166534', lineHeight: 1.6 }}>
                        <div style={{ marginBottom: 8 }}>
                          <strong>Cryptographic Defense:</strong> AES-256-GCM AEAD Tag Verification
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <strong>Error Detail:</strong> <span className="font-mono" style={{ color: '#0f172a' }}>{tamperResult.pqkms_system.error_detail}</span>
                        </div>
                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #86efac', padding: 10, borderRadius: 6, color: '#15803d', fontWeight: 500 }}>
                          ✓ <strong>Patient Safe:</strong> {tamperResult.pqkms_system.clinical_consequence}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SCENARIO 2: DIAGNOSTIC REPLAY */}
            {attackTab === 'replay' && (
              <div className="surface-card" style={{ padding: 24 }}>
                <div style={{ marginBottom: 18 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                    Scenario 2: Diagnostic Message Replay Attack
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: 4, lineHeight: 1.5 }}>
                    Guo et al. highlighted that an attacker eavesdropping on biochip transmissions can record a valid reading from days earlier (when patient vitals were normal) and replay it when the patient enters a critical state.
                  </p>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <button
                    onClick={handleRunReplayAttack}
                    disabled={replayLoading}
                    className="btn-primary"
                    style={{ padding: '10px 20px', backgroundColor: '#dc2626', borderColor: '#b91c1c' }}
                  >
                    <Icons.crosshair size={16} />
                    {replayLoading ? 'Simulating Replay Injection...' : 'Execute Replay Attack Simulation'}
                  </button>
                </div>

                {replayResult && (
                  <div style={{ border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4', borderRadius: 8, padding: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#15803d' }}>
                        🛡️ PQ-KMS Anti-Replay Defense Verified
                      </h4>
                      <Badge status="PROTECTED" label="REPLAY REJECTED" />
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#166534', lineHeight: 1.6 }}>
                      <div style={{ marginBottom: 6 }}>
                        <strong>Replay Detected:</strong> {replayResult.replay_detected ? 'TRUE (Packet dropped immediately)' : 'FALSE'}
                      </div>
                      <div style={{ marginBottom: 6 }}>
                        <strong>Rejection Reason:</strong> <code style={{ backgroundColor: '#ffffff', padding: '2px 6px', borderRadius: 4 }}>{replayResult.rejection_reason}</code>
                      </div>
                      <div style={{ marginBottom: 10 }}>
                        <strong>Security Mitigation:</strong> {replayResult.mitigation}
                      </div>
                      <div style={{ backgroundColor: '#ffffff', border: '1px solid #86efac', padding: 10, borderRadius: 6, color: '#15803d' }}>
                        ✓ <strong>Audit Action:</strong> Security event <code>REPLAY_ATTACK_BLOCKED</code> automatically recorded into immutable hash-chained audit log.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SCENARIO 3: QUANTUM THREAT */}
            {attackTab === 'quantum' && (
              <div className="surface-card" style={{ padding: 24 }}>
                <div style={{ marginBottom: 18 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                    Scenario 3: "Harvest-Now, Decrypt-Later" Quantum Threat Analysis
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: 4, lineHeight: 1.5 }}>
                    Adversaries intercept and archive encrypted clinical data today. When a fault-tolerant quantum computer is deployed, all classical public-key cryptography (RSA, ECDH, ECDSA) will be broken via Shor's algorithm.
                  </p>
                </div>

                {quantumResult ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div style={{ border: '1px solid #fecaca', backgroundColor: '#fef2f2', borderRadius: 8, padding: 18 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#b91c1c' }}>
                          Classical Baseline (ECDH / RSA)
                        </h4>
                        <Badge status="FAIL" label="0 BITS QUANTUM" />
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#7f1d1d', lineHeight: 1.6 }}>
                        <div style={{ marginBottom: 8 }}>
                          <strong>Quantum Security:</strong> {quantumResult.classical_quantum_security}
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <strong>Shor Algorithm Complexity:</strong> Polynomial time {quantumResult.shor_complexity}
                        </div>
                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #fca5a5', padding: 10, borderRadius: 6, color: '#991b1b' }}>
                          ⚠️ <strong>Vulnerability:</strong> All medical data recorded today will be completely exposed when quantum computers arrive.
                        </div>
                      </div>
                    </div>

                    <div style={{ border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4', borderRadius: 8, padding: 18 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#15803d' }}>
                          PQ-KMS (ML-KEM-768 / ML-DSA-65)
                        </h4>
                        <Badge status="PASS" label="CATEGORY 3 QUANTUM" />
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#166534', lineHeight: 1.6 }}>
                        <div style={{ marginBottom: 8 }}>
                          <strong>Quantum Security Margin:</strong> {quantumResult.pqc_quantum_security}
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <strong>Lattice Hardness:</strong> {quantumResult.lattice_hardness}
                        </div>
                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #86efac', padding: 10, borderRadius: 6, color: '#15803d' }}>
                          ✓ <strong>Harvest Resistance:</strong> {quantumResult.harvest_now_decrypt_later_status}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: 20 }}>
                    <button onClick={handleFetchQuantumThreat} className="btn-secondary">
                      Fetch Quantum Cryptanalytic Model Comparison
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 3: CLINICAL BIOCHIP FLEET                                       */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'devices' && (
          <div>
            {/* Metric KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
              <div className="surface-card" style={{ padding: 18, borderLeft: '3px solid #64748b' }}>
                <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Total Biochip Fleet
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#0f172a', marginTop: 4 }}>
                  {devicesData.total}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 4 }}>
                  Registered Clinical Nodes
                </div>
              </div>
              <div className="surface-card" style={{ padding: 18, borderLeft: '3px solid #15803d' }}>
                <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  In-Service Authorized
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#15803d', marginTop: 4 }}>
                  {devicesData.status_counts.AUTHORIZED || 0}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 4 }}>
                  ML-DSA Proof Validated
                </div>
              </div>
              <div className="surface-card" style={{ padding: 18, borderLeft: '3px solid #dc2626' }}>
                <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Quarantined / Revoked
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#b91c1c', marginTop: 4 }}>
                  {devicesData.status_counts.REVOKED || 0}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 4 }}>
                  Published in Signed CRL
                </div>
              </div>
              <div className="surface-card" style={{ padding: 18, borderLeft: '3px solid #d97706' }}>
                <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Pending Activation
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#b45309', marginTop: 4 }}>
                  {(devicesData.status_counts.PENDING || 0) + (devicesData.status_counts.DISABLED || 0)}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 4 }}>
                  Enrolment Code Issued
                </div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="surface-card" style={{ padding: '14px 18px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 260 }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: 360 }}>
                  <Icons.search size={16} style={{ position: 'absolute', left: 12, top: 10, color: '#64748b' }} />
                  <input
                    type="text"
                    placeholder="Search Biochip ID or Station Role..."
                    value={deviceSearch}
                    onChange={e => { setDeviceSearch(e.target.value); setDevicePage(1); }}
                    className="form-input"
                    style={{ paddingLeft: 36 }}
                  />
                </div>

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
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => { setProvisionModalOpen(true); setProvisionResult(null); setProvisionError(null); }}
                  className="btn-primary"
                >
                  <Icons.plus size={14} />
                  Enrol Biochip
                </button>

                <button
                  onClick={() => exportToCsv('clinical_biochips_inventory', filteredDevices)}
                  className="btn-secondary"
                >
                  <Icons.download size={14} />
                  Export Inventory
                </button>
              </div>
            </div>

            {/* Devices Table */}
            <div className="surface-card" style={{ overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto', maxHeight: 520 }}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Biochip Device ID</th>
                      <th>Assigned Clinical Station</th>
                      <th>Status</th>
                      <th>Enrolment Date</th>
                      <th>Last Operational Ping</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
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
                        <td style={{ textAlign: 'right' }}>
                          {dev.status === 'AUTHORIZED' ? (
                            <button
                              onClick={() => {
                                setDeviceToRevoke(dev.device_id);
                                setRevokeResult(null);
                                setRevokeError(null);
                                setRevokeModalOpen(true);
                              }}
                              style={{
                                padding: '4px 10px',
                                borderRadius: 4,
                                backgroundColor: '#ffffff',
                                border: '1px solid #fca5a5',
                                color: '#b91c1c',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              Quarantine Node
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Quarantined</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {!filteredDevices.length && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: 32, color: '#64748b' }}>
                          No devices match current search filter.
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
                    Showing {(devicePage - 1) * pageSize + 1} to {Math.min(devicePage * pageSize, filteredDevices.length)} of {filteredDevices.length} biochips
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

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 4: ACTIVE CRYPTOGRAPHIC SESSIONS                                */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
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
                  Active Encrypted Keys
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#15803d', marginTop: 4 }}>
                  {sessionsData.state_counts.ACTIVE || 0}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 4 }}>
                  AES-256-GCM AEAD Live
                </div>
              </div>
              <div className="surface-card" style={{ padding: 18, borderLeft: '3px solid #d97706' }}>
                <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Rotated / Deactivated
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#b45309', marginTop: 4 }}>
                  {sessionsData.state_counts.DEACTIVATED || 0}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 4 }}>
                  Cryptoperiod Expired
                </div>
              </div>
              <div className="surface-card" style={{ padding: 18, borderLeft: '3px solid #94a3b8' }}>
                <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Zeroized in Memory
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#475569', marginTop: 4 }}>
                  {sessionsData.state_counts.DESTROYED || 0}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 4 }}>
                  RAM Overwritten (Algorithm 4)
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
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => exportToCsv('session_keys_lifecycle', filteredSessions)}
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
                      <th>Transmitted Messages</th>
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
                            {sess.message_count || 0} / 1000
                          </span>
                        </td>
                      </tr>
                    ))}
                    {!filteredSessions.length && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: 32, color: '#64748b' }}>
                          No sessions match filter criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

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

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 5: REGULATORY COMPLIANCE AUDIT                                  */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
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
                    {auditData.chain_valid ? 'FDA 21 CFR Part 11 / Cryptographic Hash Chain: VERIFIED' : `Audit Integrity Corrupted at Block #${auditData.chain_break_index}`}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: auditData.chain_valid ? '#166534' : '#991b1b', marginTop: 2 }}>
                    Sequential SHA-256 chain links: <code>H_i = H(H_{'{i-1}'} || payload_i)</code>. Tampering with any historical audit entry is immediately detected.
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
                  }}
                >
                  <Icons.refresh size={14} />
                  Re-Verify Chain
                </button>
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
                      }}
                    >
                      {out}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => exportToCsv('regulatory_compliance_audit', filteredAudit)}
                className="btn-secondary"
              >
                <Icons.download size={14} />
                Export Audit ({filteredAudit.length})
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
                      <th>Cryptographic Link</th>
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
                          No audit entries match filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

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

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 6: REVOCATION & QUARANTINE REGISTRY (CRL)                      */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'revocations' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
                Certificate Revocation List (CRL) & Incident Quarantine
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 4 }}>
                Algorithm 5: Server-signed revocation list broadcast to clinical edge gateways with NIST FIPS 204 (ML-DSA-65) signatures.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 20 }}>
              {/* CRL Summary Card */}
              <div className="surface-card" style={{ padding: 20, borderLeft: '4px solid #b91c1c' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                    Active Signed CRL Authority
                  </h3>
                  <Badge status="REVOKED" label={`CRL Version ${securityData.crl?.list_version || 1}`} />
                </div>
                <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: '#64748b' }}>Issued Timestamp:</span>
                    <span className="font-mono" style={{ color: '#0f172a' }}>{securityData.crl?.issued_at || '—'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: '#64748b' }}>Total Quarantined Nodes:</span>
                    <span className="font-mono" style={{ color: '#b91c1c', fontWeight: 700 }}>
                      {securityData.crl?.device_ids ? securityData.crl.device_ids.length : 0} devices
                    </span>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <span style={{ color: '#64748b', fontSize: '0.74rem' }}>ML-DSA-65 Digital Signature Preview:</span>
                    <div className="font-mono" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px 10px', borderRadius: 4, fontSize: '0.72rem', color: '#0f172a', overflowX: 'auto', marginTop: 4 }}>
                      {securityData.crl?.signature_preview || 'No CRL signature'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Action Card */}
              <div className="surface-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
                  Quarantine Biochip Node
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 14 }}>
                  Immediately terminate all active session keys for a device, broadcast updated signed CRL, and alert gateway routers.
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => {
                      setDeviceToRevoke('');
                      setRevokeResult(null);
                      setRevokeError(null);
                      setRevokeModalOpen(true);
                    }}
                    className="btn-primary"
                    style={{ backgroundColor: '#dc2626', borderColor: '#b91c1c' }}
                  >
                    <Icons.ban size={15} />
                    Issue Emergency Quarantine
                  </button>
                </div>
              </div>
            </div>

            {/* Quarantined Devices Table */}
            <div className="surface-card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a', marginBottom: 14 }}>
                Quarantined Device Identifiers in CRL
              </h3>
              {securityData.crl?.device_ids?.length ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {securityData.crl.device_ids.map(id => (
                    <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6 }}>
                      <Icons.ban size={14} style={{ color: '#b91c1c' }} />
                      <span className="font-mono" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#991b1b' }}>{id}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: 24, textAlign: 'center', color: '#64748b', fontSize: '0.82rem' }}>
                  No devices currently quarantined. Fleet is fully authorized.
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ─── MODAL: Provision New Biochip Device ──────────────────────────── */}
      {provisionModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="surface-card" style={{ width: '100%', maxWidth: 580, backgroundColor: '#ffffff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.plus size={16} />
                </div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>
                  Enrol & Provision Biochip Node (Algorithm 1)
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
                    Generates an out-of-band one-time enrolment code, generates local <strong>ML-KEM-768</strong> (FIPS 203) & <strong>ML-DSA-65</strong> (FIPS 204) post-quantum keypairs, signs proof-of-possession, and binds the device to the clinical hardware registry.
                  </p>

                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                      Device Identifier (e.g. DMFB-LAB-01, DMFB-ICU-04):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. DMFB-ICU-04"
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
                          Generate Quantum Keys & Enrol
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
                        Biochip Successfully Enrolled & Authorized
                      </div>
                      <div style={{ color: '#166534', fontSize: '0.75rem', marginTop: 2 }}>
                        Bound to hospital hardware registry and hash-chained audit log.
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
                      Done & Return to Fleet
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: Quarantine Biochip Confirmation ───────────────────────── */}
      {revokeModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="surface-card" style={{ width: '100%', maxWidth: 520, backgroundColor: '#ffffff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icons.ban size={20} style={{ color: '#b91c1c' }} />
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>
                  Quarantine Biochip Node
                </h3>
              </div>
              <button onClick={() => setRevokeModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}>
                <Icons.x size={18} />
              </button>
            </div>

            <div style={{ padding: 20 }}>
              {!revokeResult ? (
                <div>
                  <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, marginBottom: 16 }}>
                    Quarantining will mark the biochip as <strong>REVOKED</strong>, destroy all active session keys in memory, and publish an updated <strong>ML-DSA-65 signed CRL</strong> across the hospital network.
                  </p>

                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                      Device ID to Quarantine:
                    </label>
                    <input
                      type="text"
                      value={deviceToRevoke}
                      onChange={e => setDeviceToRevoke(e.target.value)}
                      placeholder="e.g. DMFB-ICU-04"
                      className="form-input font-mono"
                    />
                  </div>

                  <div style={{ marginBottom: 18 }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                      Quarantine Justification:
                    </label>
                    <input
                      type="text"
                      value={revokeReason}
                      onChange={e => setRevokeReason(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  {revokeError && (
                    <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: 10, borderRadius: 6, color: '#b91c1c', fontSize: '0.8rem', marginBottom: 14 }}>
                      {revokeError}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <button onClick={() => setRevokeModalOpen(false)} className="btn-secondary">
                      Cancel
                    </button>
                    <button
                      onClick={handleRevokeDevice}
                      disabled={revokeLoading || !deviceToRevoke}
                      className="btn-primary"
                      style={{ backgroundColor: '#dc2626', borderColor: '#b91c1c' }}
                    >
                      {revokeLoading ? 'Quarantining & Signing CRL...' : 'Confirm Quarantine'}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: 14, borderRadius: 8, marginBottom: 16 }}>
                    <Icons.checkCircle size={22} style={{ color: '#15803d' }} />
                    <div style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 600 }}>
                      {revokeResult.message}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={() => setRevokeModalOpen(false)} className="btn-secondary">
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: System Diagnostics & Technical Specs ──────────────────── */}
      {diagnosticsModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="surface-card" style={{ width: '100%', maxWidth: 580, backgroundColor: '#ffffff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icons.cpu size={20} style={{ color: '#15803d' }} />
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>
                  Gateway Cryptographic Stack & Host Diagnostics
                </h3>
              </div>
              <button onClick={() => setDiagnosticsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}>
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
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Host RAM</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{info.environment?.ram_gb || 16.4} GB</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: 12, borderRadius: 6 }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>liboqs Version</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#15803d', marginTop: 2 }}>{info.environment?.liboqs_version || '0.16.0'}</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: 12, borderRadius: 6 }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Cores (Phys / Log)</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                    {info.environment?.cpu_cores || 10} / {info.environment?.cpu_logical || 12}
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: 12, borderRadius: 6, marginBottom: 12, fontSize: '0.8rem' }}>
                <div style={{ color: '#64748b', marginBottom: 4 }}>Server ML-DSA-65 Verification Key:</div>
                <div className="font-mono" style={{ color: '#15803d', fontSize: '0.72rem', wordBreak: 'break-all' }}>
                  {info.server_vk_preview || 'Loaded from server_keys.json'}
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: 12, borderRadius: 6, fontSize: '0.8rem' }}>
                <div style={{ color: '#64748b', marginBottom: 4 }}>SQLite Registry Database Path:</div>
                <div className="font-mono" style={{ color: '#0f172a', fontSize: '0.74rem' }}>
                  {info.database_path || 'pqkms.db'}
                </div>
              </div>
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid #e2e8f0', textAlign: 'right', backgroundColor: '#f8fafc' }}>
              <button onClick={() => setDiagnosticsModalOpen(false)} className="btn-secondary">
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

      {/* ─── Production Footer ────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid #e2e8f0', backgroundColor: '#ffffff', padding: '16px 24px', textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }}>
        PQ-KMS Post-Quantum Cryptographic Framework • NIST FIPS 203 (ML-KEM-768) • NIST FIPS 204 (ML-DSA-65) • AES-256-GCM AEAD • FDA 21 CFR Part 11 Compliant Audit Log
      </footer>
    </div>
  );
}
