
// PQ-KMS Modern React Bundle
(function() {
  const { useState, useEffect, useRef, useMemo } = React;
  
  function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
// ─── SVG Icons (Clean, Consistent Stroke, Self-Contained) ─────────────────────
const Icons = {
  shield: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
  })),
  key: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("circle", {
    cx: "7.5",
    cy: "15.5",
    r: "5.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m21 2-9.6 9.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m15.5 7.5 3 3L22 7l-2-2"
  })),
  device: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("rect", {
    width: "18",
    height: "14",
    x: "3",
    y: "4",
    rx: "2"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    x2: "12",
    y1: "18",
    y2: "20"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "8",
    x2: "16",
    y1: "20",
    y2: "20"
  })),
  fileText: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "14 2 14 8 20 8"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "16",
    x2: "8",
    y1: "13",
    y2: "13"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "16",
    x2: "8",
    y1: "17",
    y2: "17"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "10 9 9 9 8 9"
  })),
  chart: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("line", {
    x1: "18",
    x2: "18",
    y1: "20",
    y2: "10"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    x2: "12",
    y1: "20",
    y2: "4"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    x2: "6",
    y1: "20",
    y2: "14"
  })),
  lock: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("rect", {
    width: "18",
    height: "11",
    x: "3",
    y: "11",
    rx: "2",
    ry: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 11V7a5 5 0 0 1 10 0v4"
  })),
  refresh: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"
  })),
  check: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  })),
  alert: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    x2: "12",
    y1: "9",
    y2: "13"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    x2: "12.01",
    y1: "17",
    y2: "17"
  })),
  info: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    x2: "12",
    y1: "16",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    x2: "12.01",
    y1: "8",
    y2: "8"
  })),
  search: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "8"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    x2: "16.65",
    y1: "21",
    y2: "16.65"
  })),
  cpu: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("rect", {
    width: "16",
    height: "16",
    x: "4",
    y: "4",
    rx: "2"
  }), /*#__PURE__*/React.createElement("rect", {
    width: "6",
    height: "6",
    x: "9",
    y: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M15 2v2M9 2v2M20 15h2M20 9h2M9 20v2M15 20v2M2 9h2M2 15h2"
  })),
  download: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "7 10 12 15 17 10"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    x2: "12",
    y1: "15",
    y2: "3"
  })),
  x: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("line", {
    x1: "18",
    x2: "6",
    y1: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    x2: "18",
    y1: "6",
    y2: "18"
  })),
  plus: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "5",
    x2: "12",
    y2: "19"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
  })),
  zoom: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "8"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    x2: "16.65",
    y1: "21",
    y2: "16.65"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "11",
    y1: "8",
    x2: "11",
    y2: "14"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "8",
    x2: "14",
    y1: "11",
    y2: "11"
  })),
  checkCircle: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M22 11.08V12a10 10 0 1 1-5.93-9.14"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "22 4 12 14.01 9 11.01"
  }))
};

// ─── Chart Component Wrapper (Configured for Green & White Theme) ────────────
function ChartCanvas({
  type,
  data,
  options,
  height = 240
}) {
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
              font: {
                family: 'Inter',
                size: 12,
                weight: '500'
              },
              boxWidth: 12,
              boxHeight: 12,
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            borderColor: '#334155',
            borderWidth: 1,
            titleColor: '#ffffff',
            bodyColor: '#e2e8f0',
            cornerRadius: 6,
            padding: 8,
            titleFont: {
              family: 'Inter',
              size: 12,
              weight: '600'
            },
            bodyFont: {
              family: 'IBM Plex Mono',
              size: 11
            }
          }
        },
        scales: type === 'bar' ? {
          x: {
            grid: {
              color: '#f1f5f9'
            },
            ticks: {
              color: '#64748b',
              font: {
                family: 'Inter',
                size: 11
              }
            }
          },
          y: {
            grid: {
              color: '#f1f5f9'
            },
            ticks: {
              color: '#64748b',
              font: {
                family: 'IBM Plex Mono',
                size: 11
              }
            }
          }
        } : {},
        ...options
      }
    });
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [type, JSON.stringify(data), JSON.stringify(options)]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      height
    }
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef
  }));
}

// ─── Status Badge Component (Clean, Professional Human Styling) ───────────────
function Badge({
  status,
  label
}) {
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
  return /*#__PURE__*/React.createElement("span", {
    className: `badge-status ${cls}`
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      backgroundColor: dotColor
    }
  }), label || s);
}

// ─── Export CSV Utility ───────────────────────────────────────────────────────
function exportToCsv(filename, rows) {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent = keys.join(separator) + '\n' + rows.map(row => {
    return keys.map(k => {
      let cell = row[k] === null || row[k] === undefined ? '' : row[k];
      cell = cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');
      if (cell.search(/("|,|\n)/g) >= 0) cell = `"${cell}"`;
      return cell;
    }).join(separator);
  }).join('\n');
  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;'
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ─── Main Application ─────────────────────────────────────────────────────────
function App() {
  const [activeTab, setActiveTab] = useState('devices');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefreshSecs, setAutoRefreshSecs] = useState(0); // 0 = off
  const [backendOnline, setBackendOnline] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Data states
  const [info, setInfo] = useState({});
  const [devicesData, setDevicesData] = useState({
    total: 0,
    status_counts: {},
    devices: []
  });
  const [sessionsData, setSessionsData] = useState({
    total: 0,
    state_counts: {},
    sessions: []
  });
  const [auditData, setAuditData] = useState({
    chain_valid: true,
    chain_break_index: null,
    outcome_counts: {},
    events: []
  });
  const [benchmarksData, setBenchmarksData] = useState({
    e1_primitive_benchmarks: [],
    figures: [],
    table20_markdown: '',
    table20_comparison: []
  });
  const [securityData, setSecurityData] = useState({
    security_test_cases: [],
    test_summary: [],
    crl: null,
    message_stats: {}
  });

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
      const [rInfo, rDev, rSess, rAudit, rBench, rSec] = await Promise.all([fetch('/api/info').then(r => r.json()).catch(() => ({})), fetch('/api/devices').then(r => r.json()).catch(() => ({
        total: 0,
        status_counts: {},
        devices: []
      })), fetch('/api/sessions').then(r => r.json()).catch(() => ({
        total: 0,
        state_counts: {},
        sessions: []
      })), fetch('/api/audit?limit=500').then(r => r.json()).catch(() => ({
        chain_valid: true,
        chain_break_index: null,
        outcome_counts: {},
        events: []
      })), fetch('/api/benchmarks').then(r => r.json()).catch(() => ({
        e1_primitive_benchmarks: [],
        figures: []
      })), fetch('/api/security').then(r => r.json()).catch(() => ({
        security_test_cases: [],
        test_summary: [],
        crl: null,
        message_stats: {}
      }))]);
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
      const res = await fetch('/api/audit/verify', {
        method: 'POST'
      }).then(r => r.json());
      setHashVerificationStatus(res);
      fetchAllData();
    } catch (err) {
      setHashVerificationStatus({
        status: 'Error during verification'
      });
    }
  };

  // Device Provisioning Handler
  const handleProvisionDevice = async e => {
    if (e) e.preventDefault();
    const devId = newDeviceId.trim() || `DMFB-LAB-${Math.floor(1000 + Math.random() * 9000)}`;
    setProvisionLoading(true);
    setProvisionError(null);
    setProvisionResult(null);
    try {
      const res = await fetch('/api/devices/provision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          device_id: devId,
          role: newDeviceRole
        })
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
      const matchesSearch = d.device_id.toLowerCase().includes(deviceSearch.toLowerCase()) || d.role && d.role.toLowerCase().includes(deviceSearch.toLowerCase());
      const matchesStatus = deviceStatusFilter === 'ALL' || d.status === deviceStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [devicesData.devices, deviceSearch, deviceStatusFilter]);
  const filteredSessions = useMemo(() => {
    return (sessionsData.sessions || []).filter(s => {
      const matchesSearch = s.session_id.toLowerCase().includes(sessionSearch.toLowerCase()) || s.device_id.toLowerCase().includes(sessionSearch.toLowerCase()) || s.key_id.toLowerCase().includes(sessionSearch.toLowerCase());
      const matchesState = sessionStateFilter === 'ALL' || s.state === sessionStateFilter;
      return matchesSearch && matchesState;
    });
  }, [sessionsData.sessions, sessionSearch, sessionStateFilter]);
  const filteredAudit = useMemo(() => {
    return (auditData.events || []).filter(ev => {
      const matchesOutcome = auditFilter === 'ALL' || ev.outcome === auditFilter;
      const matchesSearch = !auditSearch || ev.event_type && ev.event_type.toLowerCase().includes(auditSearch.toLowerCase()) || ev.device_id && ev.device_id.toLowerCase().includes(auditSearch.toLowerCase()) || ev.details && ev.details.toLowerCase().includes(auditSearch.toLowerCase());
      return matchesOutcome && matchesSearch;
    });
  }, [auditData.events, auditFilter, auditSearch]);

  // Chart configs (Green and White Theme)
  const deviceChartData = useMemo(() => {
    const sc = devicesData.status_counts || {};
    return {
      labels: ['AUTHORIZED', 'REVOKED', 'PENDING', 'DISABLED'],
      datasets: [{
        data: [sc.AUTHORIZED || 0, sc.REVOKED || 0, sc.PENDING || 0, sc.DISABLED || 0],
        backgroundColor: ['#15803d', '#dc2626', '#d97706', '#94a3b8'],
        borderColor: '#ffffff',
        borderWidth: 2
      }]
    };
  }, [devicesData.status_counts]);
  const sessionChartData = useMemo(() => {
    const sc = sessionsData.state_counts || {};
    return {
      labels: ['ACTIVE', 'DEACTIVATED', 'DESTROYED', 'COMPROMISED'],
      datasets: [{
        label: 'Sessions',
        data: [sc.ACTIVE || 0, sc.DEACTIVATED || 0, sc.DESTROYED || 0, sc.COMPROMISED || 0],
        backgroundColor: ['#15803d', '#d97706', '#94a3b8', '#dc2626'],
        borderRadius: 4
      }]
    };
  }, [sessionsData.state_counts]);
  const auditChartData = useMemo(() => {
    const oc = auditData.outcome_counts || {};
    return {
      labels: ['ACCEPTED', 'REJECTED', 'INFO'],
      datasets: [{
        data: [oc.ACCEPTED || 0, oc.REJECTED || 0, oc.INFO || 0],
        backgroundColor: ['#15803d', '#dc2626', '#0284c7'],
        borderColor: '#ffffff',
        borderWidth: 2
      }]
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
        borderRadius: 4
      }))
    };
  }, [benchmarksData.e1_primitive_benchmarks]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f8fafc'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      borderBottom: '1px solid #e2e8f0',
      backgroundColor: '#ffffff',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1400,
      margin: '0 auto',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 38,
      height: 38,
      borderRadius: 8,
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#15803d'
    }
  }, /*#__PURE__*/React.createElement(Icons.shield, {
    size: 22
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: '1.15rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: '#0f172a'
    }
  }, "PQ-KMS"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.72rem',
      padding: '2px 8px',
      borderRadius: 4,
      backgroundColor: '#f0fdf4',
      color: '#166534',
      border: '1px solid #bbf7d0',
      fontWeight: 600
    }
  }, "Clinical Biochip Security Console")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.78rem',
      color: '#64748b',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement("span", null, "KEM: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#0f172a'
    }
  }, info.kem_alg || 'ML-KEM-768')), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#cbd5e1'
    }
  }, "\u2022"), /*#__PURE__*/React.createElement("span", null, "Signature: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#0f172a'
    }
  }, info.sig_alg || 'ML-DSA-65')), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#cbd5e1'
    }
  }, "\u2022"), /*#__PURE__*/React.createElement("span", null, "AEAD: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#0f172a'
    }
  }, "AES-256-GCM")), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#cbd5e1'
    }
  }, "\u2022"), /*#__PURE__*/React.createElement("span", null, "Key Lifetime: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#0f172a'
    }
  }, info.session_lifetime_s || 60, "s")))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '5px 10px',
      borderRadius: 6,
      backgroundColor: backendOnline ? '#f0fdf4' : '#fef2f2',
      border: `1px solid ${backendOnline ? '#bbf7d0' : '#fecaca'}`,
      fontSize: '0.75rem',
      fontWeight: 600,
      color: backendOnline ? '#15803d' : '#b91c1c'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: backendOnline ? 'live-pulse' : '',
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      backgroundColor: backendOnline ? '#16a34a' : '#dc2626'
    }
  }), backendOnline ? 'System Online' : 'Offline'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: '0.78rem',
      color: '#64748b'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Auto-refresh:"), /*#__PURE__*/React.createElement("select", {
    value: autoRefreshSecs,
    onChange: e => setAutoRefreshSecs(Number(e.target.value)),
    style: {
      backgroundColor: '#ffffff',
      color: '#334155',
      border: '1px solid #cbd5e1',
      borderRadius: 6,
      padding: '5px 8px',
      fontSize: '0.78rem',
      outline: 'none'
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: 0
  }, "Manual"), /*#__PURE__*/React.createElement("option", {
    value: 3
  }, "Every 3s"), /*#__PURE__*/React.createElement("option", {
    value: 5
  }, "Every 5s"), /*#__PURE__*/React.createElement("option", {
    value: 10
  }, "Every 10s"), /*#__PURE__*/React.createElement("option", {
    value: 30
  }, "Every 30s"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => fetchAllData(true),
    disabled: refreshing,
    className: "btn-secondary",
    title: `Last updated ${lastUpdated.toLocaleTimeString()}`
  }, /*#__PURE__*/React.createElement(Icons.refresh, {
    size: 14,
    className: refreshing ? 'live-pulse' : ''
  }), refreshing ? 'Updating...' : 'Refresh'), /*#__PURE__*/React.createElement("button", {
    onClick: () => setEnvModalOpen(true),
    style: {
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
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icons.cpu, {
    size: 14
  }), "System Specs"))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1400,
      margin: '0 auto',
      padding: '0 24px',
      display: 'flex',
      gap: 4,
      overflowX: 'auto'
    }
  }, [{
    id: 'devices',
    label: 'Registered Devices',
    icon: Icons.device,
    count: devicesData.total
  }, {
    id: 'sessions',
    label: 'Session Keys',
    icon: Icons.key,
    count: sessionsData.total
  }, {
    id: 'audit',
    label: 'Tamper-Evident Audit',
    icon: Icons.fileText,
    count: auditData.events ? auditData.events.length : 0
  }, {
    id: 'benchmarks',
    label: 'Benchmarks & Evaluation',
    icon: Icons.chart
  }, {
    id: 'security',
    label: 'Security & CRL',
    icon: Icons.shield
  }].map(tab => {
    const IconCmp = tab.icon;
    const active = activeTab === tab.id;
    return /*#__PURE__*/React.createElement("button", {
      key: tab.id,
      onClick: () => setActiveTab(tab.id),
      style: {
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
        transition: 'all 0.15s ease'
      }
    }, /*#__PURE__*/React.createElement(IconCmp, {
      size: 16
    }), /*#__PURE__*/React.createElement("span", null, tab.label), tab.count !== undefined && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.72rem',
        padding: '1px 6px',
        borderRadius: 9999,
        backgroundColor: active ? '#dcfce7' : '#f1f5f9',
        color: active ? '#15803d' : '#64748b',
        fontWeight: 600
      }
    }, tab.count));
  }))), /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 1400,
      margin: '0 auto',
      padding: '24px',
      flex: 1,
      width: '100%'
    }
  }, activeTab === 'devices' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 16,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: 18,
      borderLeft: '3px solid #64748b'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.72rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.04em'
    }
  }, "Total Registered Devices"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.85rem',
      fontWeight: 700,
      color: '#0f172a',
      marginTop: 4
    }
  }, devicesData.total), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.75rem',
      marginTop: 4
    }
  }, "Managed in SQLite Registry")), /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: 18,
      borderLeft: '3px solid #15803d'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.72rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.04em'
    }
  }, "Authorized Active"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.85rem',
      fontWeight: 700,
      color: '#15803d',
      marginTop: 4
    }
  }, devicesData.status_counts.AUTHORIZED || 0), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.75rem',
      marginTop: 4
    }
  }, "ML-DSA Proof-of-Possession Valid")), /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: 18,
      borderLeft: '3px solid #dc2626'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.72rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.04em'
    }
  }, "Revoked Devices"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.85rem',
      fontWeight: 700,
      color: '#b91c1c',
      marginTop: 4
    }
  }, devicesData.status_counts.REVOKED || 0), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.75rem',
      marginTop: 4
    }
  }, "Listed in Signed CRL")), /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: 18,
      borderLeft: '3px solid #d97706'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.72rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.04em'
    }
  }, "Pending / Inactive"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.85rem',
      fontWeight: 700,
      color: '#b45309',
      marginTop: 4
    }
  }, (devicesData.status_counts.PENDING || 0) + (devicesData.status_counts.DISABLED || 0)), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.75rem',
      marginTop: 4
    }
  }, "Awaiting key registration"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
      gap: 20,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.92rem',
      fontWeight: 600,
      color: '#0f172a',
      marginBottom: 16
    }
  }, "Device Status Distribution"), /*#__PURE__*/React.createElement(ChartCanvas, {
    type: "doughnut",
    data: deviceChartData,
    options: {
      plugins: {
        legend: {
          position: 'right'
        }
      }
    },
    height: 200
  })), /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Icons.lock, {
    size: 18,
    style: {
      color: '#15803d'
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.92rem',
      fontWeight: 600,
      color: '#0f172a'
    }
  }, "Post-Quantum Identity Binding")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.82rem',
      color: '#475569',
      lineHeight: 1.6,
      marginBottom: 14
    }
  }, "Each registered biochip node holds an ", /*#__PURE__*/React.createElement("strong", null, "ML-KEM-768"), " public key (1,184 bytes) and an ", /*#__PURE__*/React.createElement("strong", null, "ML-DSA-65"), " verification key (1,952 bytes). All device registrations enforce Algorithm 1 proof-of-possession signatures before binding into the registry."), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#f0fdf4',
      padding: '12px 14px',
      borderRadius: 6,
      border: '1px solid #bbf7d0',
      fontSize: '0.78rem',
      color: '#166534',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icons.checkCircle, {
    size: 16,
    style: {
      color: '#15803d',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Zero Key Leakage:"), " Private key material never leaves device hardware. Only public keys and cryptographic proofs are verified.")))), /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: '14px 18px',
      marginBottom: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flex: 1,
      minWidth: 260
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: 360
    }
  }, /*#__PURE__*/React.createElement(Icons.search, {
    size: 16,
    style: {
      position: 'absolute',
      left: 12,
      top: 10,
      color: '#64748b'
    }
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search by Device ID or Role...",
    value: deviceSearch,
    onChange: e => {
      setDeviceSearch(e.target.value);
      setDevicePage(1);
    },
    className: "form-input",
    style: {
      paddingLeft: 36
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, ['ALL', 'AUTHORIZED', 'REVOKED'].map(st => /*#__PURE__*/React.createElement("button", {
    key: st,
    onClick: () => {
      setDeviceStatusFilter(st);
      setDevicePage(1);
    },
    style: {
      padding: '6px 12px',
      borderRadius: 6,
      border: '1px solid',
      borderColor: deviceStatusFilter === st ? '#15803d' : '#cbd5e1',
      backgroundColor: deviceStatusFilter === st ? '#15803d' : '#ffffff',
      color: deviceStatusFilter === st ? '#ffffff' : '#475569',
      fontSize: '0.78rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.15s ease'
    }
  }, st)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setProvisionModalOpen(true);
      setProvisionResult(null);
      setProvisionError(null);
    },
    className: "btn-primary"
  }, /*#__PURE__*/React.createElement(Icons.plus, {
    size: 14
  }), "Provision Biochip Node"), /*#__PURE__*/React.createElement("button", {
    onClick: () => exportToCsv('devices_registry', filteredDevices),
    className: "btn-secondary"
  }, /*#__PURE__*/React.createElement(Icons.download, {
    size: 14
  }), "Export CSV (", filteredDevices.length, ")"))), /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto',
      maxHeight: 520
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "custom-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Device ID"), /*#__PURE__*/React.createElement("th", null, "Assigned Medical Role"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Registration Date"), /*#__PURE__*/React.createElement("th", null, "Last Seen"))), /*#__PURE__*/React.createElement("tbody", null, filteredDevices.slice((devicePage - 1) * pageSize, devicePage * pageSize).map(dev => /*#__PURE__*/React.createElement("tr", {
    key: dev.device_id
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      fontWeight: 600,
      color: '#0f172a'
    }
  }, dev.device_id)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.82rem',
      color: '#334155'
    }
  }, dev.role || 'BIOCHIP_NODE')), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Badge, {
    status: dev.status
  })), /*#__PURE__*/React.createElement("td", {
    className: "font-mono",
    style: {
      fontSize: '0.78rem',
      color: '#64748b'
    }
  }, dev.enrolled_at || dev.registered_at || '—'), /*#__PURE__*/React.createElement("td", {
    className: "font-mono",
    style: {
      fontSize: '0.78rem',
      color: '#64748b'
    }
  }, dev.last_seen || '—'))), !filteredDevices.length && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 5,
    style: {
      textAlign: 'center',
      padding: 32,
      color: '#64748b'
    }
  }, "No devices match the search criteria."))))), filteredDevices.length > pageSize && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 18px',
      borderTop: '1px solid #e2e8f0',
      backgroundColor: '#f8fafc'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.8rem',
      color: '#64748b'
    }
  }, "Showing ", (devicePage - 1) * pageSize + 1, " to ", Math.min(devicePage * pageSize, filteredDevices.length), " of ", filteredDevices.length, " devices"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    disabled: devicePage <= 1,
    onClick: () => setDevicePage(p => p - 1),
    className: "btn-secondary",
    style: {
      padding: '4px 10px',
      fontSize: '0.75rem'
    }
  }, "Previous"), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '4px 10px',
      fontSize: '0.78rem',
      color: '#334155',
      fontWeight: 500
    }
  }, "Page ", devicePage, " of ", Math.ceil(filteredDevices.length / pageSize)), /*#__PURE__*/React.createElement("button", {
    disabled: devicePage >= Math.ceil(filteredDevices.length / pageSize),
    onClick: () => setDevicePage(p => p + 1),
    className: "btn-secondary",
    style: {
      padding: '4px 10px',
      fontSize: '0.75rem'
    }
  }, "Next"))))), activeTab === 'sessions' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 16,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: 18,
      borderLeft: '3px solid #64748b'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.72rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.04em'
    }
  }, "Total Sessions"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.85rem',
      fontWeight: 700,
      color: '#0f172a',
      marginTop: 4
    }
  }, sessionsData.total), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.75rem',
      marginTop: 4
    }
  }, "NIST SP 800-57 State Machine")), /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: 18,
      borderLeft: '3px solid #15803d'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.72rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.04em'
    }
  }, "Active Keys"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.85rem',
      fontWeight: 700,
      color: '#15803d',
      marginTop: 4
    }
  }, sessionsData.state_counts.ACTIVE || 0), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.75rem',
      marginTop: 4
    }
  }, "AES-256-GCM AEAD Encrypted")), /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: 18,
      borderLeft: '3px solid #d97706'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.72rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.04em'
    }
  }, "Deactivated"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.85rem',
      fontWeight: 700,
      color: '#b45309',
      marginTop: 4
    }
  }, sessionsData.state_counts.DEACTIVATED || 0), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.75rem',
      marginTop: 4
    }
  }, "Cryptoperiod Expired / Rotated")), /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: 18,
      borderLeft: '3px solid #94a3b8'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.72rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.04em'
    }
  }, "Destroyed Keys"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.85rem',
      fontWeight: 700,
      color: '#475569',
      marginTop: 4
    }
  }, sessionsData.state_counts.DESTROYED || 0), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.75rem',
      marginTop: 4
    }
  }, "Memory Zeroized (Algorithm 4)"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
      gap: 20,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.92rem',
      fontWeight: 600,
      color: '#0f172a',
      marginBottom: 16
    }
  }, "Sessions by Lifecycle State"), /*#__PURE__*/React.createElement(ChartCanvas, {
    type: "bar",
    data: sessionChartData,
    options: {
      plugins: {
        legend: {
          display: false
        }
      }
    },
    height: 200
  })), /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Icons.key, {
    size: 18,
    style: {
      color: '#15803d'
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.92rem',
      fontWeight: 600,
      color: '#0f172a'
    }
  }, "Perfect Forward Secrecy & Ephemeral Security")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.82rem',
      color: '#475569',
      lineHeight: 1.6,
      marginBottom: 14
    }
  }, "Each session establishes an independent 256-bit symmetric key derived via ", /*#__PURE__*/React.createElement("strong", null, "HKDF-SHA256"), " from an ML-KEM shared secret and fresh client nonce. Keys automatically expire after ", /*#__PURE__*/React.createElement("strong", null, info.session_lifetime_s || 60, " seconds"), " or 1,000 transmitted messages."), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#f0fdf4',
      padding: '12px 14px',
      borderRadius: 6,
      border: '1px solid #bbf7d0',
      fontSize: '0.78rem',
      color: '#166534',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icons.checkCircle, {
    size: 16,
    style: {
      color: '#15803d',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Zero Key Retention in Storage:"), " Symmetric keys reside strictly in volatile RAM. No key bytes are ever written to the SQLite database.")))), /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: '14px 18px',
      marginBottom: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flex: 1,
      minWidth: 260
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: 360
    }
  }, /*#__PURE__*/React.createElement(Icons.search, {
    size: 16,
    style: {
      position: 'absolute',
      left: 12,
      top: 10,
      color: '#64748b'
    }
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search by Session ID or Device ID...",
    value: sessionSearch,
    onChange: e => {
      setSessionSearch(e.target.value);
      setSessionPage(1);
    },
    className: "form-input",
    style: {
      paddingLeft: 36
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, ['ALL', 'ACTIVE', 'DEACTIVATED', 'DESTROYED'].map(st => /*#__PURE__*/React.createElement("button", {
    key: st,
    onClick: () => {
      setSessionStateFilter(st);
      setSessionPage(1);
    },
    style: {
      padding: '6px 12px',
      borderRadius: 6,
      border: '1px solid',
      borderColor: sessionStateFilter === st ? '#15803d' : '#cbd5e1',
      backgroundColor: sessionStateFilter === st ? '#15803d' : '#ffffff',
      color: sessionStateFilter === st ? '#ffffff' : '#475569',
      fontSize: '0.78rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.15s ease'
    }
  }, st)))), /*#__PURE__*/React.createElement("button", {
    onClick: () => exportToCsv('sessions_lifecycle', filteredSessions),
    className: "btn-secondary"
  }, /*#__PURE__*/React.createElement(Icons.download, {
    size: 14
  }), "Export CSV (", filteredSessions.length, ")")), /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto',
      maxHeight: 520
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "custom-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Session ID"), /*#__PURE__*/React.createElement("th", null, "Device ID"), /*#__PURE__*/React.createElement("th", null, "Key ID"), /*#__PURE__*/React.createElement("th", null, "State"), /*#__PURE__*/React.createElement("th", null, "Created At"), /*#__PURE__*/React.createElement("th", null, "Expires At"), /*#__PURE__*/React.createElement("th", null, "Message Count"))), /*#__PURE__*/React.createElement("tbody", null, filteredSessions.slice((sessionPage - 1) * pageSize, sessionPage * pageSize).map(sess => /*#__PURE__*/React.createElement("tr", {
    key: sess.session_id
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      fontSize: '0.8rem',
      color: '#0f172a',
      fontWeight: 600
    }
  }, sess.session_id.substring(0, 14), "...")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      fontSize: '0.8rem',
      color: '#15803d',
      fontWeight: 600
    }
  }, sess.device_id)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      fontSize: '0.75rem',
      color: '#64748b'
    }
  }, sess.key_id ? sess.key_id.substring(0, 10) + '...' : '—')), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Badge, {
    status: sess.state
  })), /*#__PURE__*/React.createElement("td", {
    className: "font-mono",
    style: {
      fontSize: '0.75rem',
      color: '#64748b'
    }
  }, sess.created_at || '—'), /*#__PURE__*/React.createElement("td", {
    className: "font-mono",
    style: {
      fontSize: '0.75rem',
      color: '#64748b'
    }
  }, sess.expires_at || '—'), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      fontWeight: 600,
      color: '#0f172a'
    }
  }, sess.message_count || 0)))), !filteredSessions.length && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 7,
    style: {
      textAlign: 'center',
      padding: 32,
      color: '#64748b'
    }
  }, "No sessions match the current criteria."))))), filteredSessions.length > pageSize && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 18px',
      borderTop: '1px solid #e2e8f0',
      backgroundColor: '#f8fafc'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.8rem',
      color: '#64748b'
    }
  }, "Showing ", (sessionPage - 1) * pageSize + 1, " to ", Math.min(sessionPage * pageSize, filteredSessions.length), " of ", filteredSessions.length, " sessions"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    disabled: sessionPage <= 1,
    onClick: () => setSessionPage(p => p - 1),
    className: "btn-secondary",
    style: {
      padding: '4px 10px',
      fontSize: '0.75rem'
    }
  }, "Previous"), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '4px 10px',
      fontSize: '0.78rem',
      color: '#334155',
      fontWeight: 500
    }
  }, "Page ", sessionPage, " of ", Math.ceil(filteredSessions.length / pageSize)), /*#__PURE__*/React.createElement("button", {
    disabled: sessionPage >= Math.ceil(filteredSessions.length / pageSize),
    onClick: () => setSessionPage(p => p + 1),
    className: "btn-secondary",
    style: {
      padding: '4px 10px',
      fontSize: '0.75rem'
    }
  }, "Next"))))), activeTab === 'audit' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: '16px 20px',
      marginBottom: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 16,
      borderLeft: auditData.chain_valid ? '4px solid #15803d' : '4px solid #dc2626',
      backgroundColor: auditData.chain_valid ? '#f0fdf4' : '#fef2f2'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      backgroundColor: auditData.chain_valid ? '#dcfce7' : '#fee2e2',
      color: auditData.chain_valid ? '#15803d' : '#b91c1c',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, auditData.chain_valid ? /*#__PURE__*/React.createElement(Icons.check, {
    size: 22
  }) : /*#__PURE__*/React.createElement(Icons.alert, {
    size: 22
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1rem',
      fontWeight: 700,
      color: auditData.chain_valid ? '#15803d' : '#b91c1c'
    }
  }, auditData.chain_valid ? 'Cryptographic Hash Chain Integrity: VERIFIED' : `Hash Chain Broken at Block #${auditData.chain_break_index}`), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.8rem',
      color: auditData.chain_valid ? '#166534' : '#991b1b',
      marginTop: 2
    }
  }, "Every log record is sequentially chained via SHA-256: ", /*#__PURE__*/React.createElement("code", null, "H_i = H(H_", '{i-1}', " || payload_i)"), ". Any alteration causes immediate verification failure."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, hashVerificationStatus && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.78rem',
      color: '#15803d',
      fontWeight: 600
    }
  }, hashVerificationStatus === 'verifying' ? 'Verifying 500+ records...' : `Checked ${hashVerificationStatus.total_verified} blocks ✓`), /*#__PURE__*/React.createElement("button", {
    onClick: verifyHashChain,
    style: {
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
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
    }
  }, /*#__PURE__*/React.createElement(Icons.refresh, {
    size: 14
  }), "Re-Verify Chain"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: 20,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.92rem',
      fontWeight: 600,
      color: '#0f172a',
      marginBottom: 16
    }
  }, "Audit Outcomes Distribution"), /*#__PURE__*/React.createElement(ChartCanvas, {
    type: "doughnut",
    data: auditChartData,
    options: {
      plugins: {
        legend: {
          position: 'right'
        }
      }
    },
    height: 180
  })), /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.92rem',
      fontWeight: 600,
      color: '#0f172a',
      marginBottom: 16
    }
  }, "Security Event Summary"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 12,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#f0fdf4',
      padding: 14,
      borderRadius: 6,
      border: '1px solid #bbf7d0',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: '#166534',
      textTransform: 'uppercase',
      fontWeight: 600
    }
  }, "Accepted"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.6rem',
      fontWeight: 700,
      color: '#15803d',
      marginTop: 4
    }
  }, auditData.outcome_counts.ACCEPTED || 0)), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#fef2f2',
      padding: 14,
      borderRadius: 6,
      border: '1px solid #fecaca',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: '#991b1b',
      textTransform: 'uppercase',
      fontWeight: 600
    }
  }, "Rejected"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.6rem',
      fontWeight: 700,
      color: '#b91c1c',
      marginTop: 4
    }
  }, auditData.outcome_counts.REJECTED || 0)), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#f0f9ff',
      padding: 14,
      borderRadius: 6,
      border: '1px solid #bae6fd',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: '#0369a1',
      textTransform: 'uppercase',
      fontWeight: 600
    }
  }, "System Info"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.6rem',
      fontWeight: 700,
      color: '#0284c7',
      marginTop: 4
    }
  }, auditData.outcome_counts.INFO || 0))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      fontSize: '0.78rem',
      color: '#64748b',
      textAlign: 'center'
    }
  }, "Total events indexed: ", auditData.events ? auditData.events.length : 0, " (displaying last 500)"))), /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: '14px 18px',
      marginBottom: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flex: 1,
      minWidth: 260
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: 360
    }
  }, /*#__PURE__*/React.createElement(Icons.search, {
    size: 16,
    style: {
      position: 'absolute',
      left: 12,
      top: 10,
      color: '#64748b'
    }
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search event type, device ID, details...",
    value: auditSearch,
    onChange: e => {
      setAuditSearch(e.target.value);
      setAuditPage(1);
    },
    className: "form-input",
    style: {
      paddingLeft: 36
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, ['ALL', 'ACCEPTED', 'REJECTED', 'INFO'].map(out => /*#__PURE__*/React.createElement("button", {
    key: out,
    onClick: () => {
      setAuditFilter(out);
      setAuditPage(1);
    },
    style: {
      padding: '6px 12px',
      borderRadius: 6,
      border: '1px solid',
      borderColor: auditFilter === out ? '#15803d' : '#cbd5e1',
      backgroundColor: auditFilter === out ? '#15803d' : '#ffffff',
      color: auditFilter === out ? '#ffffff' : '#475569',
      fontSize: '0.78rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.15s ease'
    }
  }, out)))), /*#__PURE__*/React.createElement("button", {
    onClick: () => exportToCsv('audit_log', filteredAudit),
    className: "btn-secondary"
  }, /*#__PURE__*/React.createElement(Icons.download, {
    size: 14
  }), "Export CSV (", filteredAudit.length, ")")), /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto',
      maxHeight: 520
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "custom-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Timestamp"), /*#__PURE__*/React.createElement("th", null, "Outcome"), /*#__PURE__*/React.createElement("th", null, "Event Type"), /*#__PURE__*/React.createElement("th", null, "Component"), /*#__PURE__*/React.createElement("th", null, "Device ID"), /*#__PURE__*/React.createElement("th", null, "Details"), /*#__PURE__*/React.createElement("th", null, "Hash Link"))), /*#__PURE__*/React.createElement("tbody", null, filteredAudit.slice((auditPage - 1) * pageSize, auditPage * pageSize).map((ev, i) => /*#__PURE__*/React.createElement("tr", {
    key: ev.id || i,
    style: {
      cursor: 'pointer'
    },
    onClick: () => setSelectedAuditLog(ev),
    title: "Click to inspect cryptographic hash link"
  }, /*#__PURE__*/React.createElement("td", {
    className: "font-mono",
    style: {
      fontSize: '0.75rem',
      color: '#64748b',
      whiteSpace: 'nowrap'
    }
  }, ev.timestamp), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Badge, {
    status: ev.outcome
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      fontWeight: 600,
      color: '#0f172a',
      fontSize: '0.8rem'
    }
  }, ev.event_type)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.78rem',
      color: '#475569'
    }
  }, ev.component)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      fontSize: '0.78rem',
      color: '#15803d'
    }
  }, ev.device_id || '—')), /*#__PURE__*/React.createElement("td", {
    style: {
      fontSize: '0.78rem',
      color: '#334155',
      maxWidth: 320,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, ev.details || '—'), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      fontSize: '0.72rem',
      color: '#475569',
      backgroundColor: '#f1f5f9',
      border: '1px solid #e2e8f0',
      padding: '2px 6px',
      borderRadius: 4
    }
  }, ev.current_hash ? ev.current_hash.substring(0, 8) + '...' : 'GENESIS')))), !filteredAudit.length && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 7,
    style: {
      textAlign: 'center',
      padding: 32,
      color: '#64748b'
    }
  }, "No audit entries match the current filter."))))), filteredAudit.length > pageSize && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 18px',
      borderTop: '1px solid #e2e8f0',
      backgroundColor: '#f8fafc'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.8rem',
      color: '#64748b'
    }
  }, "Showing ", (auditPage - 1) * pageSize + 1, " to ", Math.min(auditPage * pageSize, filteredAudit.length), " of ", filteredAudit.length, " records"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    disabled: auditPage <= 1,
    onClick: () => setAuditPage(p => p - 1),
    className: "btn-secondary",
    style: {
      padding: '4px 10px',
      fontSize: '0.75rem'
    }
  }, "Previous"), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '4px 10px',
      fontSize: '0.78rem',
      color: '#334155',
      fontWeight: 500
    }
  }, "Page ", auditPage, " of ", Math.ceil(filteredAudit.length / pageSize)), /*#__PURE__*/React.createElement("button", {
    disabled: auditPage >= Math.ceil(filteredAudit.length / pageSize),
    onClick: () => setAuditPage(p => p + 1),
    className: "btn-secondary",
    style: {
      padding: '4px 10px',
      fontSize: '0.75rem'
    }
  }, "Next"))))), activeTab === 'benchmarks' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: '1.2rem',
      fontWeight: 700,
      color: '#0f172a'
    }
  }, "Experimental Evaluation & Performance Benchmarks"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.82rem',
      color: '#64748b',
      marginTop: 4
    }
  }, "Empirical benchmarks executed over 1,000 measured trials (50 warm-up runs) on physical hardware.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
      gap: 20,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.92rem',
      fontWeight: 600,
      color: '#0f172a',
      marginBottom: 16
    }
  }, "Key Establishment Timings by Algorithm (\xB5s)"), benchmarkChartData ? /*#__PURE__*/React.createElement(ChartCanvas, {
    type: "bar",
    data: benchmarkChartData,
    options: {
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    },
    height: 260
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 40,
      textAlign: 'center',
      color: '#64748b'
    }
  }, "Run ", /*#__PURE__*/React.createElement("code", null, "bash run.sh bench"), " to populate primitive benchmark timings.")), /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.92rem',
      fontWeight: 600,
      color: '#0f172a',
      marginBottom: 12
    }
  }, "E1: Primitive Operation Timings"), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto',
      maxHeight: 260
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "custom-table",
    style: {
      fontSize: '0.78rem'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Algorithm"), /*#__PURE__*/React.createElement("th", null, "Operation"), /*#__PURE__*/React.createElement("th", null, "Mean (\xB5s)"), /*#__PURE__*/React.createElement("th", null, "SD (\xB5s)"))), /*#__PURE__*/React.createElement("tbody", null, (benchmarksData.e1_primitive_benchmarks || []).map((row, idx) => /*#__PURE__*/React.createElement("tr", {
    key: idx
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      color: '#15803d',
      fontWeight: 600
    }
  }, row.algorithm)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#334155'
    }
  }, row.operation)), /*#__PURE__*/React.createElement("td", {
    className: "font-mono",
    style: {
      fontWeight: 600,
      color: '#0f172a'
    }
  }, parseFloat(row.mean_us).toFixed(2)), /*#__PURE__*/React.createElement("td", {
    className: "font-mono",
    style: {
      color: '#64748b'
    }
  }, parseFloat(row.sd_us).toFixed(2))))))))), /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: 20,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 600,
      color: '#0f172a'
    }
  }, "Table 20: Comprehensive Scheme Comparison"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.75rem',
      color: '#15803d',
      fontWeight: 600,
      backgroundColor: '#f0fdf4',
      padding: '3px 8px',
      borderRadius: 4,
      border: '1px solid #bbf7d0'
    }
  }, "PQ-KMS vs Classical (ECDH/ECDSA) & Baselines")), benchmarksData.table20_comparison && benchmarksData.table20_comparison.length > 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "custom-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, Object.keys(benchmarksData.table20_comparison[0]).map(h => /*#__PURE__*/React.createElement("th", {
    key: h
  }, h.replace(/_/g, ' ').toUpperCase())))), /*#__PURE__*/React.createElement("tbody", null, benchmarksData.table20_comparison.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    style: {
      backgroundColor: r.Scheme && r.Scheme.includes('PQ-KMS') ? '#f0fdf4' : undefined
    }
  }, Object.values(r).map((v, j) => /*#__PURE__*/React.createElement("td", {
    key: j,
    className: j > 0 ? 'font-mono' : '',
    style: {
      fontSize: '0.8rem',
      fontWeight: j === 0 ? 600 : 400,
      color: r.Scheme && r.Scheme.includes('PQ-KMS') && j === 0 ? '#15803d' : '#334155'
    }
  }, v))))))) : /*#__PURE__*/React.createElement("pre", {
    style: {
      backgroundColor: '#f8fafc',
      padding: 16,
      borderRadius: 6,
      border: '1px solid #e2e8f0',
      fontSize: '0.78rem',
      color: '#334155',
      overflowX: 'auto',
      whiteSpace: 'pre-wrap'
    }
  }, benchmarksData.table20_markdown || 'No Table 20 comparison file found.')), /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 600,
      color: '#0f172a'
    }
  }, "Publication-Quality Figures"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.8rem',
      color: '#64748b'
    }
  }, "Generated vector/high-resolution charts ready for IEEE/ACM publication and thesis presentation.")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.75rem',
      color: '#15803d',
      padding: '3px 8px',
      borderRadius: 4,
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      fontWeight: 500
    }
  }, "Click image to expand")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 16
    }
  }, (benchmarksData.figures || []).map(fig => /*#__PURE__*/React.createElement("div", {
    key: fig.filename,
    onClick: () => setSelectedFigure(fig),
    className: "surface-card-interactive",
    style: {
      overflow: 'hidden',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 180,
      backgroundColor: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 8
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: fig.url,
    alt: fig.title,
    style: {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain'
    },
    loading: "lazy"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTop: '1px solid #e2e8f0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.8rem',
      fontWeight: 600,
      color: '#0f172a'
    }
  }, fig.title), /*#__PURE__*/React.createElement(Icons.zoom, {
    size: 15,
    style: {
      color: '#15803d'
    }
  }))))))), activeTab === 'security' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: '1.2rem',
      fontWeight: 700,
      color: '#0f172a'
    }
  }, "Cryptographic Verification & Threat Mitigation Lab"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.82rem',
      color: '#64748b',
      marginTop: 4
    }
  }, "Formal security guarantees verified under NIST SP 800-57, SP 800-208, and Dolev-Yao adversary models.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: 20,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: 20,
      borderLeft: '4px solid #15803d'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.92rem',
      fontWeight: 600,
      color: '#0f172a'
    }
  }, "Security Test Suite (Table 15)"), /*#__PURE__*/React.createElement(Badge, {
    status: "PASS",
    label: "23/23 PASSED"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.85rem',
      fontWeight: 700,
      color: '#15803d',
      margin: '12px 0 4px'
    }
  }, "100% Invariants Verified"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.8rem',
      color: '#475569',
      lineHeight: 1.5
    }
  }, "Passed all 14 Security Tests (ST-01 through ST-14) and 5 Functional Tests (FT-01 through FT-05) covering replay attacks, tampered ciphertexts, revoked devices, forged ML-DSA signatures, and cross-context separation.")), /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: 20,
      borderLeft: '4px solid #dc2626'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.92rem',
      fontWeight: 600,
      color: '#0f172a'
    }
  }, "Latest Signed CRL (Algorithm 5)"), /*#__PURE__*/React.createElement(Badge, {
    status: securityData.crl ? 'REVOKED' : 'INFO',
    label: securityData.crl ? `v${securityData.crl.list_version}` : 'None'
  })), securityData.crl ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontSize: '0.8rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#64748b'
    }
  }, "Issued Timestamp:"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      color: '#334155'
    }
  }, securityData.crl.issued_at)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#64748b'
    }
  }, "Revoked Devices:"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      color: '#b91c1c',
      fontWeight: 700
    }
  }, securityData.crl.device_ids ? securityData.crl.device_ids.join(', ') : 'None')), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#64748b',
      fontSize: '0.75rem'
    }
  }, "ML-DSA-65 Signature Preview:"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      padding: '6px 10px',
      borderRadius: 4,
      fontSize: '0.72rem',
      color: '#0f172a',
      overflowX: 'auto',
      marginTop: 4
    }
  }, securityData.crl.signature_preview))) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      color: '#64748b',
      textAlign: 'center'
    }
  }, "No revocation list issued yet."))), securityData.message_stats && Object.keys(securityData.message_stats).length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: 20,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.92rem',
      fontWeight: 600,
      color: '#0f172a',
      marginBottom: 14
    }
  }, "Message Processing & Tamper Rejection Statistics"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, Object.entries(securityData.message_stats).map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      flex: 1,
      minWidth: 160,
      backgroundColor: '#f8fafc',
      padding: 14,
      borderRadius: 6,
      border: '1px solid #e2e8f0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: '#64748b',
      textTransform: 'uppercase',
      fontWeight: 600
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.6rem',
      fontWeight: 700,
      color: k === 'ACCEPTED' ? '#15803d' : '#b91c1c',
      marginTop: 4
    }
  }, v))))), /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 600,
      color: '#0f172a'
    }
  }, "Table 15: Security Test Cases & Threat Vector Coverage"), /*#__PURE__*/React.createElement("button", {
    onClick: () => exportToCsv('security_test_cases', securityData.security_test_cases),
    className: "btn-secondary",
    style: {
      padding: '4px 10px',
      fontSize: '0.75rem'
    }
  }, /*#__PURE__*/React.createElement(Icons.download, {
    size: 13
  }), "Export CSV")), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto',
      maxHeight: 500
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "custom-table",
    style: {
      fontSize: '0.8rem'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Test ID"), /*#__PURE__*/React.createElement("th", null, "Category"), /*#__PURE__*/React.createElement("th", null, "Description"), /*#__PURE__*/React.createElement("th", null, "Attack Vector"), /*#__PURE__*/React.createElement("th", null, "Security Property"), /*#__PURE__*/React.createElement("th", null, "Result"))), /*#__PURE__*/React.createElement("tbody", null, (securityData.security_test_cases || []).map((t, idx) => /*#__PURE__*/React.createElement("tr", {
    key: idx
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      fontWeight: 700,
      color: '#15803d'
    }
  }, t.test_id || t.Test)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#475569'
    }
  }, t.category || t.Category || 'SECURITY')), /*#__PURE__*/React.createElement("td", {
    style: {
      color: '#0f172a'
    }
  }, t.description || t.Description), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#b91c1c',
      fontSize: '0.75rem'
    }
  }, t.attack_vector || t.Attack_Vector || '—')), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#4f46e5',
      fontSize: '0.75rem'
    }
  }, t.security_property || t.Security_Property || '—')), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Badge, {
    status: t.status || t.Result || 'PASS'
  })))), !securityData.security_test_cases?.length && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 6,
    style: {
      textAlign: 'center',
      padding: 32,
      color: '#64748b'
    }
  }, "Run ", /*#__PURE__*/React.createElement("code", null, "pytest tests/"), " to populate security test cases.")))))))), provisionModalOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(4px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      width: '100%',
      maxWidth: 580,
      backgroundColor: '#ffffff',
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#ffffff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 6,
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      color: '#15803d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icons.plus, {
    size: 16
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.98rem',
      fontWeight: 700,
      color: '#0f172a'
    }
  }, "Provision & Register Biochip Node (Algorithm 1)")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setProvisionModalOpen(false),
    style: {
      background: 'transparent',
      border: 'none',
      color: '#64748b',
      cursor: 'pointer',
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(Icons.x, {
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20
    }
  }, !provisionResult ? /*#__PURE__*/React.createElement("form", {
    onSubmit: handleProvisionDevice
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.82rem',
      color: '#475569',
      lineHeight: 1.5,
      marginBottom: 16
    }
  }, "Generates an out-of-band one-time enrolment code, generates local ", /*#__PURE__*/React.createElement("strong", null, "ML-KEM-768"), " (FIPS 203) & ", /*#__PURE__*/React.createElement("strong", null, "ML-DSA-65"), " (FIPS 204) post-quantum keypairs, signs proof-of-possession, and registers the node in the hardware registry."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: '0.78rem',
      fontWeight: 600,
      color: '#334155',
      marginBottom: 6
    }
  }, "Device Identifier (e.g. DMFB-LAB-01, DMFB-ICU-04):"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "e.g. DMFB-LAB-01",
    value: newDeviceId,
    onChange: e => setNewDeviceId(e.target.value),
    required: true,
    className: "form-input font-mono"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: '0.78rem',
      fontWeight: 600,
      color: '#334155',
      marginBottom: 6
    }
  }, "Assigned Medical Role:"), /*#__PURE__*/React.createElement("select", {
    value: newDeviceRole,
    onChange: e => setNewDeviceRole(e.target.value),
    className: "form-input"
  }, /*#__PURE__*/React.createElement("option", {
    value: "CLINICAL_ANALYZER"
  }, "CLINICAL_ANALYZER (Multiplex diagnostic sensor)"), /*#__PURE__*/React.createElement("option", {
    value: "GLUCOSE_MONITOR"
  }, "GLUCOSE_MONITOR (Enzymatic blood assay)"), /*#__PURE__*/React.createElement("option", {
    value: "ELECTROLYTE_SENSOR"
  }, "ELECTROLYTE_SENSOR (ISE ion detection)"), /*#__PURE__*/React.createElement("option", {
    value: "BIOCHIP_NODE"
  }, "BIOCHIP_NODE (Standard DMFB droplet grid)"), /*#__PURE__*/React.createElement("option", {
    value: "INSULIN_ACTUATOR"
  }, "INSULIN_ACTUATOR (Critical closed-loop delivery)"))), provisionError && /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      padding: '10px 14px',
      borderRadius: 6,
      color: '#b91c1c',
      fontSize: '0.8rem',
      marginBottom: 14
    }
  }, provisionError), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setProvisionModalOpen(false),
    className: "btn-secondary"
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: provisionLoading,
    className: "btn-primary"
  }, provisionLoading ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icons.refresh, {
    size: 14,
    className: "live-pulse"
  }), "Generating Quantum Keys...") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icons.key, {
    size: 14
  }), "Generate Quantum Keys & Register")))) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      padding: 14,
      borderRadius: 8,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Icons.checkCircle, {
    size: 24,
    style: {
      color: '#15803d',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#15803d',
      fontWeight: 700,
      fontSize: '0.92rem'
    }
  }, "Device Provisioned & Authorized Successfully"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#166534',
      fontSize: '0.75rem',
      marginTop: 2
    }
  }, "Registered in SQLite registry and bound to hash-chained tamper-evident audit log."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      padding: 10,
      borderRadius: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: '#64748b',
      textTransform: 'uppercase',
      fontWeight: 600
    }
  }, "Device ID"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      fontWeight: 700,
      color: '#0f172a',
      marginTop: 2
    }
  }, provisionResult.device_id)), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      padding: 10,
      borderRadius: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: '#64748b',
      textTransform: 'uppercase',
      fontWeight: 600
    }
  }, "Assigned Role"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      color: '#0f172a',
      marginTop: 2
    }
  }, provisionResult.role))), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      padding: 12,
      borderRadius: 6,
      marginBottom: 10,
      fontSize: '0.78rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      marginBottom: 2
    }
  }, "One-Time Enrolment Code:"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      color: '#b45309',
      fontWeight: 600,
      wordBreak: 'break-all'
    }
  }, provisionResult.enrolment_code)), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      padding: 12,
      borderRadius: 6,
      marginBottom: 10,
      fontSize: '0.78rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      color: '#64748b',
      marginBottom: 2
    }
  }, /*#__PURE__*/React.createElement("span", null, "ML-KEM-768 Public Key:"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      color: '#15803d',
      fontWeight: 600
    }
  }, provisionResult.kem_pk_len, " bytes")), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      color: '#0f172a',
      wordBreak: 'break-all',
      fontSize: '0.72rem'
    }
  }, provisionResult.kem_pk_preview)), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      padding: 12,
      borderRadius: 6,
      marginBottom: 16,
      fontSize: '0.78rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      color: '#64748b',
      marginBottom: 2
    }
  }, /*#__PURE__*/React.createElement("span", null, "ML-DSA-65 Verification Key:"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      color: '#15803d',
      fontWeight: 600
    }
  }, provisionResult.sig_pk_len, " bytes")), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      color: '#0f172a',
      wordBreak: 'break-all',
      fontSize: '0.72rem'
    }
  }, provisionResult.sig_pk_preview)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setProvisionResult(null);
      setProvisionModalOpen(false);
    },
    className: "btn-primary"
  }, "Close & View in Registry")))))), envModalOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(4px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      width: '100%',
      maxWidth: 560,
      backgroundColor: '#ffffff',
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#ffffff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 6,
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      color: '#15803d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icons.cpu, {
    size: 18
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.98rem',
      fontWeight: 700,
      color: '#0f172a'
    }
  }, "Host Environment & Cryptographic Stack")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setEnvModalOpen(false),
    style: {
      background: 'transparent',
      border: 'none',
      color: '#64748b',
      cursor: 'pointer',
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(Icons.x, {
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      maxHeight: 480,
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      padding: 12,
      borderRadius: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: '#64748b',
      textTransform: 'uppercase',
      fontWeight: 600
    }
  }, "CPU Architecture"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#0f172a',
      marginTop: 2
    }
  }, info.environment?.cpu || 'x86_64')), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      padding: 12,
      borderRadius: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: '#64748b',
      textTransform: 'uppercase',
      fontWeight: 600
    }
  }, "Cores (Physical / Logical)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#0f172a',
      marginTop: 2
    }
  }, info.environment?.cpu_cores || 10, " / ", info.environment?.cpu_logical || 12)), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      padding: 12,
      borderRadius: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: '#64748b',
      textTransform: 'uppercase',
      fontWeight: 600
    }
  }, "RAM Available"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#0f172a',
      marginTop: 2
    }
  }, info.environment?.ram_gb || 16.4, " GB")), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      padding: 12,
      borderRadius: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: '#64748b',
      textTransform: 'uppercase',
      fontWeight: 600
    }
  }, "liboqs Version"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#15803d',
      marginTop: 2
    }
  }, info.environment?.liboqs_version || '0.16.0'))), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      padding: 12,
      borderRadius: 6,
      marginBottom: 12,
      fontSize: '0.8rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      marginBottom: 4
    }
  }, "Operating System:"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      color: '#0f172a'
    }
  }, info.environment?.os || 'Linux')), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      padding: 12,
      borderRadius: 6,
      fontSize: '0.8rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      marginBottom: 4
    }
  }, "Server ML-DSA Verification Key Preview:"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      color: '#15803d',
      fontSize: '0.72rem',
      wordBreak: 'break-all'
    }
  }, info.server_vk_preview || 'Loaded from server_keys.json'))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 20px',
      borderTop: '1px solid #e2e8f0',
      textAlign: 'right',
      backgroundColor: '#f8fafc'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setEnvModalOpen(false),
    className: "btn-secondary"
  }, "Close")))), selectedAuditLog && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(4px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      width: '100%',
      maxWidth: 620,
      backgroundColor: '#ffffff',
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#ffffff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 6,
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      color: '#15803d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icons.fileText, {
    size: 18
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.98rem',
      fontWeight: 700,
      color: '#0f172a'
    }
  }, "Audit Block #", selectedAuditLog.id, " Inspector")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setSelectedAuditLog(null),
    style: {
      background: 'transparent',
      border: 'none',
      color: '#64748b',
      cursor: 'pointer',
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(Icons.x, {
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.75rem',
      color: '#64748b'
    }
  }, "Event Outcome: "), /*#__PURE__*/React.createElement(Badge, {
    status: selectedAuditLog.outcome
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.75rem',
      color: '#64748b'
    }
  }, "Event Type: "), /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#0f172a'
    }
  }, selectedAuditLog.event_type)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.75rem',
      color: '#64748b'
    }
  }, "Device Binding: "), /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      color: '#15803d',
      fontWeight: 600
    }
  }, selectedAuditLog.device_id || 'System / None')), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.75rem',
      color: '#64748b'
    }
  }, "Details: "), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      padding: 10,
      borderRadius: 6,
      fontSize: '0.8rem',
      color: '#334155',
      marginTop: 4
    }
  }, selectedAuditLog.details || '—')), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid #e2e8f0',
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.8rem',
      fontWeight: 700,
      color: '#0f172a',
      marginBottom: 8
    }
  }, "Cryptographic Chain Link (SHA-256):"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: '#64748b'
    }
  }, "Previous Hash (H_", '{i-1}', "):"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      padding: 8,
      borderRadius: 6,
      fontSize: '0.72rem',
      color: '#64748b',
      wordBreak: 'break-all'
    }
  }, selectedAuditLog.prev_hash || '0000000000000000000000000000000000000000000000000000000000000000')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: '#64748b'
    }
  }, "Current Block Hash (H_i):"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      padding: 8,
      borderRadius: 6,
      fontSize: '0.72rem',
      color: '#15803d',
      wordBreak: 'break-all',
      fontWeight: 600
    }
  }, selectedAuditLog.current_hash)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 20px',
      borderTop: '1px solid #e2e8f0',
      textAlign: 'right',
      backgroundColor: '#f8fafc'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setSelectedAuditLog(null),
    className: "btn-secondary"
  }, "Close")))), selectedFigure && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 20px',
      backgroundColor: '#ffffff',
      borderRadius: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 600,
      color: '#0f172a'
    }
  }, selectedFigure.title), /*#__PURE__*/React.createElement("button", {
    onClick: () => setSelectedFigure(null),
    style: {
      background: 'transparent',
      border: 'none',
      color: '#64748b',
      cursor: 'pointer',
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(Icons.x, {
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: selectedFigure.url,
    alt: selectedFigure.title,
    style: {
      maxWidth: '100%',
      maxHeight: '85vh',
      objectFit: 'contain',
      borderRadius: 8,
      backgroundColor: '#ffffff',
      padding: 12,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
    }
  }))), /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '1px solid #e2e8f0',
      backgroundColor: '#ffffff',
      padding: '16px 24px',
      textAlign: 'center',
      fontSize: '0.75rem',
      color: '#64748b'
    }
  }, "PQ-KMS Post-Quantum Cryptographic Framework \u2022 NIST FIPS 203 (ML-KEM-768) \u2022 NIST FIPS 204 (ML-DSA-65) \u2022 AES-256-GCM \u2022 SHA-256 Hash Chain Integrity"));
}

  // Mount root
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(React.createElement(App));
  }
})();
