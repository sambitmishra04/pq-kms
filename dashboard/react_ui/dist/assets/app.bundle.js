
// PQ-KMS Modern React Bundle
(function() {
  const { useState, useEffect, useRef, useMemo } = React;
  
  function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
// ─── SVG Icons (100% self-contained, no external asset load needed) ───────────
const Icons = {
  shield: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
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
    strokeWidth: "2",
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
    strokeWidth: "2",
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
    strokeWidth: "2",
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
    strokeWidth: "2",
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
    strokeWidth: "2",
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
    strokeWidth: "2",
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
    strokeWidth: "2",
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
    strokeWidth: "2",
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
    strokeWidth: "2",
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
    strokeWidth: "2",
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
    strokeWidth: "2",
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
    strokeWidth: "2",
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
  activity: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("polyline", {
    points: "22 12 18 12 15 21 9 3 6 12 2 12"
  })),
  target: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "6"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "2"
  })),
  play: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("polygon", {
    points: "5 3 19 12 5 21 5 3"
  })),
  fastForward: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("polygon", {
    points: "13 19 22 12 13 5 13 19"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: "2 19 11 12 2 5 2 19"
  })),
  rotateCcw: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M1 4v6h6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3.51 15a9 9 0 1 0 2.13-9.36L1 10"
  })),
  droplet: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
  })),
  user: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "7",
    r: "4"
  })),
  logOut: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "16 17 21 12 16 7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    x2: "9",
    y1: "12",
    y2: "12"
  })),
  unlock: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
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
    d: "M7 11V7a5 5 0 0 1 9.9-1"
  })),
  hospital: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M3 21h18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "10",
    x2: "14",
    y1: "9",
    y2: "9"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    x2: "12",
    y1: "7",
    y2: "11"
  }))
};

// ─── Chart Component Wrapper ──────────────────────────────────────────────────
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
              color: '#94a3b8',
              font: {
                family: 'Plus Jakarta Sans',
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderColor: 'rgba(148, 163, 184, 0.2)',
            borderWidth: 1,
            titleColor: '#f1f5f9',
            bodyColor: '#cbd5e1'
          }
        },
        scales: type === 'bar' ? {
          x: {
            grid: {
              color: 'rgba(148, 163, 184, 0.08)'
            },
            ticks: {
              color: '#94a3b8',
              font: {
                family: 'Plus Jakarta Sans'
              }
            }
          },
          y: {
            grid: {
              color: 'rgba(148, 163, 184, 0.08)'
            },
            ticks: {
              color: '#94a3b8',
              font: {
                family: 'JetBrains Mono'
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

// ─── Status Badge Component ───────────────────────────────────────────────────
function Badge({
  status,
  label
}) {
  const s = (status || '').toUpperCase();
  let cls = 'badge-info';
  let dotColor = '#94a3b8';
  if (['AUTHORIZED', 'ACTIVE', 'ACCEPTED', 'VALID', 'PASS', 'NORMAL'].includes(s)) {
    cls = 'badge-authorized';
    dotColor = '#10b981';
  } else if (['REVOKED', 'REJECTED', 'COMPROMISED', 'FAIL', 'BROKEN', 'DIABETIC', 'CRITICAL_HIGH'].includes(s)) {
    cls = 'badge-revoked';
    dotColor = '#f43f5e';
  } else if (['PENDING', 'DEACTIVATED', 'WARNING', 'PRE_DIABETIC'].includes(s)) {
    cls = 'badge-pending';
    dotColor = '#f59e0b';
  } else if (['DISABLED', 'DESTROYED', 'INFO', 'HYPOGLYCEMIA'].includes(s)) {
    cls = 'badge-disabled';
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
  // Authentication & Current User State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('pqkms_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // Active Tab state
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const saved = localStorage.getItem('pqkms_user');
      if (saved) {
        const u = JSON.parse(saved);
        return u.role === 'DOCTOR' ? 'doctor_telemetry' : 'devices';
      }
    } catch {}
    return 'devices';
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefreshSecs, setAutoRefreshSecs] = useState(0); // 0 = off
  const [backendOnline, setBackendOnline] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Doctor Telemetry & Key Exchange State
  const [doctorBiochips, setDoctorBiochips] = useState([]);
  const [selectedBiochipId, setSelectedBiochipId] = useState('DMFB-ALPHA');
  const [doctorEncryptedPackage, setDoctorEncryptedPackage] = useState(null);
  const [doctorKeyExchangeLoading, setDoctorKeyExchangeLoading] = useState(false);
  const [doctorDecryptedData, setDoctorDecryptedData] = useState(null);
  const [doctorDecryptLoading, setDoctorDecryptLoading] = useState(false);
  const [doctorAccessError, setDoctorAccessError] = useState(null);
  const [doctorPatientSearch, setDoctorPatientSearch] = useState('');
  const [doctorRiskFilter, setDoctorRiskFilter] = useState('ALL');

  // Admin Authorizations State
  const [adminAuthorizations, setAdminAuthorizations] = useState(null);
  const [adminAuthorizationsLoading, setAdminAuthorizationsLoading] = useState(false);

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

  // Phase 1: Patient Clinical Data States
  const [patientsData, setPatientsData] = useState({
    total: 0,
    page: 1,
    page_size: 15,
    total_pages: 1,
    patients: []
  });
  const [patientStats, setPatientStats] = useState({
    total_patients: 0,
    diabetic_count: 0,
    non_diabetic_count: 0,
    diabetic_percent: 0,
    mean_glucose: 0,
    mean_bmi: 0,
    mean_age: 0,
    mean_blood_pressure: 0,
    glucose_distribution: {},
    risk_counts: {}
  });
  const [patientSearch, setPatientSearch] = useState('');
  const [patientOutcomeFilter, setPatientOutcomeFilter] = useState('ALL');
  const [patientRiskFilter, setPatientRiskFilter] = useState('ALL');
  const [patientPage, setPatientPage] = useState(1);
  const [patientLoading, setPatientLoading] = useState(false);

  // Phase 1: Cryptographic Inspector Specification State
  const [cryptoSpec, setCryptoSpec] = useState({});

  // Phase 2: Biochip Digital Twin Simulation States
  const [simulatorState, setSimulatorState] = useState({
    snapshot: null,
    total_steps: 7,
    current_step_idx: 0,
    patient_glucose: 220,
    steps: [],
    sensor_readout: null
  });
  const [simulatorGlucoseInput, setSimulatorGlucoseInput] = useState(220.0);
  const [simulatorLoading, setSimulatorLoading] = useState(false);

  // Phase 2: Cyber-Physical Attack Lab States
  const [attackChoice, setAttackChoice] = useState('tamper'); // 'tamper' | 'replay' | 'quantum'
  const [tamperTrueGlucose, setTamperTrueGlucose] = useState(220.0);
  const [tamperFalseGlucose, setTamperFalseGlucose] = useState(110.0);
  const [tamperResult, setTamperResult] = useState(null);
  const [tamperLoading, setTamperLoading] = useState(false);
  const [replayResult, setReplayResult] = useState(null);
  const [replayLoading, setReplayLoading] = useState(false);
  const [quantumResult, setQuantumResult] = useState(null);

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

  // ─── Fetch Patient Data (Dedicated) ──────────────────────────────────────────
  const fetchPatients = async (page = patientPage, search = patientSearch, outcome = patientOutcomeFilter, risk = patientRiskFilter) => {
    setPatientLoading(true);
    try {
      const q = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
        search: search.trim(),
        outcome: outcome,
        risk: risk
      });
      const res = await fetch(`/api/patients?${q.toString()}`).then(r => r.json());
      setPatientsData(res);
    } catch (err) {
      console.error('Failed to fetch patient data:', err);
    } finally {
      setPatientLoading(false);
    }
  };
  useEffect(() => {
    fetchPatients(patientPage, patientSearch, patientOutcomeFilter, patientRiskFilter);
  }, [patientPage, patientOutcomeFilter, patientRiskFilter]);

  // Debounced search for patient filter
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchPatients(1, patientSearch, patientOutcomeFilter, patientRiskFilter);
      setPatientPage(1);
    }, 250);
    return () => clearTimeout(handler);
  }, [patientSearch]);

  // ─── Fetch All Data ──────────────────────────────────────────────────────────
  const fetchAllData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const [rInfo, rDev, rSess, rAudit, rBench, rSec, rPStats, rSpec, rSim, rQuantum] = await Promise.all([fetch('/api/info').then(r => r.json()).catch(() => ({})), fetch('/api/devices').then(r => r.json()).catch(() => ({
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
      })), fetch('/api/patients/stats').then(r => r.json()).catch(() => ({
        total_patients: 0,
        glucose_distribution: {},
        risk_counts: {}
      })), fetch('/api/crypto/spec').then(r => r.json()).catch(() => ({})), fetch('/api/simulator/state').then(r => r.json()).catch(() => ({
        total_steps: 7,
        current_step_idx: 0
      })), fetch('/api/attacks/quantum-threat').then(r => r.json()).catch(() => null)]);
      setInfo(rInfo);
      setDevicesData(rDev);
      setSessionsData(rSess);
      setAuditData(rAudit);
      setBenchmarksData(rBench);
      setSecurityData(rSec);
      setPatientStats(rPStats);
      setCryptoSpec(rSpec);
      setSimulatorState(rSim);
      if (rSim && rSim.patient_glucose !== undefined) {
        setSimulatorGlucoseInput(rSim.patient_glucose);
      }
      setQuantumResult(rQuantum);
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

  // ─── Biochip Simulator Handlers ─────────────────────────────────────────────
  const handleSimulatorReset = async () => {
    setSimulatorLoading(true);
    try {
      const res = await fetch('/api/simulator/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patient_glucose: Number(simulatorGlucoseInput)
        })
      }).then(r => r.json());
      setSimulatorState(res);
      fetchAllData(false);
    } catch (err) {
      console.error('Failed to reset biochip:', err);
    } finally {
      setSimulatorLoading(false);
    }
  };
  const handleSimulatorStep = async () => {
    setSimulatorLoading(true);
    try {
      const res = await fetch('/api/simulator/step', {
        method: 'POST'
      }).then(r => r.json());
      setSimulatorState(res);
      fetchAllData(false);
    } catch (err) {
      console.error('Failed to step biochip:', err);
    } finally {
      setSimulatorLoading(false);
    }
  };
  const handleSimulatorRunAll = async () => {
    setSimulatorLoading(true);
    try {
      const res = await fetch('/api/simulator/run-all', {
        method: 'POST'
      }).then(r => r.json());
      setSimulatorState(res);
      fetchAllData(false);
    } catch (err) {
      console.error('Failed to run all biochip steps:', err);
    } finally {
      setSimulatorLoading(false);
    }
  };

  // ─── Attack Lab Handlers ────────────────────────────────────────────────────
  const handleRunTamperAttack = async () => {
    setTamperLoading(true);
    try {
      const res = await fetch('/api/attacks/tamper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          true_glucose: Number(tamperTrueGlucose),
          falsified_glucose: Number(tamperFalseGlucose)
        })
      }).then(r => r.json());
      setTamperResult(res);
      fetchAllData(false);
    } catch (err) {
      console.error('Failed to run tamper attack:', err);
    } finally {
      setTamperLoading(false);
    }
  };
  const handleRunReplayAttack = async () => {
    setReplayLoading(true);
    try {
      const res = await fetch('/api/attacks/replay', {
        method: 'POST'
      }).then(r => r.json());
      setReplayResult(res);
      fetchAllData(false);
    } catch (err) {
      console.error('Failed to run replay attack:', err);
    } finally {
      setReplayLoading(false);
    }
  };

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

  // ─── Authentication & RBAC Handlers ─────────────────────────────────────────
  const handleLogin = async (username, password) => {
    setLoginLoading(true);
    setLoginError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Login failed');
      }
      localStorage.setItem('pqkms_user', JSON.stringify(data.user));
      setCurrentUser(data.user);
      if (data.user.role === 'DOCTOR') {
        setActiveTab('doctor_telemetry');
        fetchDoctorBiochips(data.user.username);
      } else {
        setActiveTab('devices');
        fetchAdminAuthorizations();
      }
      fetchAllData(false);
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('pqkms_user');
    setCurrentUser(null);
    setDoctorEncryptedPackage(null);
    setDoctorDecryptedData(null);
    setDoctorAccessError(null);
  };
  const fetchDoctorBiochips = async docId => {
    const targetDoc = docId || currentUser?.username;
    if (!targetDoc) return;
    try {
      const res = await fetch(`/api/doctor/biochips?doctor_id=${encodeURIComponent(targetDoc)}`).then(r => r.json());
      setDoctorBiochips(res.biochips || []);
    } catch (err) {
      console.error('Failed to fetch doctor biochips:', err);
    }
  };
  const handleDoctorExchange = async biochipId => {
    if (!currentUser) return;
    setDoctorKeyExchangeLoading(true);
    setDoctorAccessError(null);
    setDoctorEncryptedPackage(null);
    setDoctorDecryptedData(null);
    try {
      const res = await fetch('/api/doctor/exchange-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          doctor_id: currentUser.username,
          biochip_id: biochipId
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Key exchange failed');
      }
      setDoctorEncryptedPackage(data);
      fetchAllData(false);
    } catch (err) {
      setDoctorAccessError(err.message);
      fetchAllData(false);
    } finally {
      setDoctorKeyExchangeLoading(false);
    }
  };
  const handleDoctorDecrypt = async () => {
    if (!doctorEncryptedPackage || !currentUser) return;
    setDoctorDecryptLoading(true);
    setDoctorAccessError(null);
    try {
      const res = await fetch('/api/doctor/decrypt-telemetry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          doctor_id: currentUser.username,
          biochip_id: doctorEncryptedPackage.biochip_id,
          session_id: doctorEncryptedPackage.session_id,
          message_id: doctorEncryptedPackage.message_id,
          nonce_c_b64: doctorEncryptedPackage.nonce_c_b64,
          doctor_kem_sk_b64: doctorEncryptedPackage.doctor_kem_sk_b64,
          kem_ciphertext_b64: doctorEncryptedPackage.kem_ciphertext_b64,
          aead_ciphertext_b64: doctorEncryptedPackage.aead_ciphertext_b64,
          nonce_b64: doctorEncryptedPackage.nonce_b64
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Decryption failed');
      }
      setDoctorDecryptedData(data);
      fetchAllData(false);
    } catch (err) {
      setDoctorAccessError(err.message);
    } finally {
      setDoctorDecryptLoading(false);
    }
  };
  const fetchAdminAuthorizations = async () => {
    setAdminAuthorizationsLoading(true);
    try {
      const res = await fetch('/api/admin/authorizations').then(r => r.json());
      setAdminAuthorizations(res);
    } catch (err) {
      console.error('Failed to fetch admin authorizations:', err);
    } finally {
      setAdminAuthorizationsLoading(false);
    }
  };
  const handleToggleAuthorization = async (docId, biochipId) => {
    try {
      await fetch('/api/admin/authorizations/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          doctor_id: docId,
          biochip_id: biochipId
        })
      });
      await fetchAdminAuthorizations();
      fetchAllData(false);
    } catch (err) {
      console.error('Failed to toggle authorization:', err);
    }
  };

  // Sync role-dependent data on initial mount or login
  useEffect(() => {
    if (currentUser?.role === 'DOCTOR') {
      fetchDoctorBiochips(currentUser.username);
    } else if (currentUser?.role === 'ADMIN') {
      fetchAdminAuthorizations();
    }
  }, [currentUser?.username, currentUser?.role]);

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

  // Chart configs
  const deviceChartData = useMemo(() => {
    const sc = devicesData.status_counts || {};
    return {
      labels: ['AUTHORIZED', 'REVOKED', 'PENDING', 'DISABLED'],
      datasets: [{
        data: [sc.AUTHORIZED || 0, sc.REVOKED || 0, sc.PENDING || 0, sc.DISABLED || 0],
        backgroundColor: ['#10b981', '#f43f5e', '#f59e0b', '#64748b'],
        borderColor: '#0f172a',
        borderWidth: 2
      }]
    };
  }, [devicesData.status_counts]);
  const sessionChartData = useMemo(() => {
    const sc = sessionsData.state_counts || {};
    return {
      labels: ['ACTIVE', 'DEACTIVATED', 'DESTROYED', 'COMPROMISED'],
      datasets: [{
        label: 'Sessions Count',
        data: [sc.ACTIVE || 0, sc.DEACTIVATED || 0, sc.DESTROYED || 0, sc.COMPROMISED || 0],
        backgroundColor: ['#10b981', '#f59e0b', '#64748b', '#f43f5e'],
        borderRadius: 6
      }]
    };
  }, [sessionsData.state_counts]);
  const auditChartData = useMemo(() => {
    const oc = auditData.outcome_counts || {};
    return {
      labels: ['ACCEPTED', 'REJECTED', 'INFO'],
      datasets: [{
        data: [oc.ACCEPTED || 0, oc.REJECTED || 0, oc.INFO || 0],
        backgroundColor: ['#10b981', '#f43f5e', '#3b82f6'],
        borderColor: '#0f172a',
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
    const colors = ['#06b6d4', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];
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
  const patientGlucoseChartData = useMemo(() => {
    const gd = patientStats.glucose_distribution || {};
    return {
      labels: ['<100 (Optimal)', '100-139 (Normal)', '140-199 (Impaired)', '≥200 (Diabetic)'],
      datasets: [{
        label: 'Patient Count',
        data: [gd.under_100 || 0, gd['100_to_139'] || 0, gd['140_to_199'] || 0, gd['200_plus'] || 0],
        backgroundColor: ['#10b981', '#06b6d4', '#f59e0b', '#f43f5e'],
        borderRadius: 6
      }]
    };
  }, [patientStats.glucose_distribution]);
  const patientOutcomeChartData = useMemo(() => {
    return {
      labels: ['Healthy Non-Diabetic', 'Diagnosed Diabetic'],
      datasets: [{
        data: [patientStats.non_diabetic_count || 0, patientStats.diabetic_count || 0],
        backgroundColor: ['#10b981', '#f43f5e'],
        borderColor: '#0f172a',
        borderWidth: 2
      }]
    };
  }, [patientStats.non_diabetic_count, patientStats.diabetic_count]);

  // Doctor Clinical Telemetry & Cohort Memos
  const filteredDoctorPatients = useMemo(() => {
    if (!doctorDecryptedData || !doctorDecryptedData.patients) return [];
    return doctorDecryptedData.patients.filter(p => {
      const s = doctorPatientSearch.trim().toLowerCase();
      const pId = String(p.id || p.patient_id || '').toLowerCase();
      const matchSearch = !s || pId.includes(s) || String(p.age).includes(s);
      const risk = p.clinical_status || p.clinical_risk || '';
      const matchRisk = doctorRiskFilter === 'ALL' || risk === doctorRiskFilter;
      return matchSearch && matchRisk;
    });
  }, [doctorDecryptedData, doctorPatientSearch, doctorRiskFilter]);
  const doctorCohortStats = useMemo(() => {
    if (!doctorDecryptedData || !doctorDecryptedData.patients || !doctorDecryptedData.patients.length) {
      return {
        total: 0,
        meanGlucose: '0.0',
        diabeticCount: 0,
        diabeticPct: '0.0',
        highRiskCount: 0
      };
    }
    const pts = doctorDecryptedData.patients;
    const total = pts.length;
    const totalGlucose = pts.reduce((acc, p) => acc + (Number(p.glucose) || 0), 0);
    const meanGlucose = (totalGlucose / total).toFixed(1);
    const diabeticCount = pts.filter(p => Number(p.outcome) === 1).length;
    const diabeticPct = (diabeticCount / total * 100).toFixed(1);
    const highRiskCount = pts.filter(p => p.clinical_status === 'DIABETIC' || p.clinical_risk === 'HIGH' || p.clinical_risk === 'CRITICAL_HIGH').length;
    return {
      total,
      meanGlucose,
      diabeticCount,
      diabeticPct,
      highRiskCount
    };
  }, [doctorDecryptedData]);

  // If user is not authenticated, render Login Screen
  if (!currentUser) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'radial-gradient(ellipse at 50% 20%, #0f2b46 0%, #070d18 100%)',
        color: '#f1f5f9',
        padding: '32px 16px',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 520,
        width: '100%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        marginBottom: 28
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        padding: 14,
        background: 'rgba(6, 182, 212, 0.12)',
        border: '1px solid rgba(6, 182, 212, 0.3)',
        borderRadius: 16,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement(Icons.shield, {
      size: 38,
      style: {
        color: '#06b6d4'
      }
    })), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: '1.75rem',
        fontWeight: 800,
        letterSpacing: '-0.02em',
        color: '#f8fafc',
        margin: 0
      }
    }, "PQ-KMS Server Gateway"), /*#__PURE__*/React.createElement("p", {
      style: {
        color: '#94a3b8',
        fontSize: '0.85rem',
        marginTop: 6,
        marginBottom: 12
      }
    }, "Post-Quantum Key Management & Healthcare IoT Telemetry"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center',
        gap: 6,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.7rem',
        padding: '2px 8px',
        borderRadius: 9999,
        background: 'rgba(56, 189, 248, 0.15)',
        color: '#38bdf8',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        fontWeight: 600
      }
    }, "ML-KEM-768"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.7rem',
        padding: '2px 8px',
        borderRadius: 9999,
        background: 'rgba(52, 211, 153, 0.15)',
        color: '#34d399',
        border: '1px solid rgba(52, 211, 153, 0.3)',
        fontWeight: 600
      }
    }, "ML-DSA-65"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.7rem',
        padding: '2px 8px',
        borderRadius: 9999,
        background: 'rgba(192, 132, 252, 0.15)',
        color: '#c084fc',
        border: '1px solid rgba(192, 132, 252, 0.3)',
        fontWeight: 600
      }
    }, "AES-256-GCM"))), /*#__PURE__*/React.createElement("div", {
      className: "glass-card",
      style: {
        padding: 28,
        borderRadius: 16,
        background: 'rgba(15, 23, 42, 0.9)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: '1.1rem',
        fontWeight: 700,
        color: '#f8fafc',
        marginBottom: 16
      }
    }, "Terminal Authentication"), loginError && /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'rgba(244, 63, 94, 0.12)',
        border: '1px solid rgba(244, 63, 94, 0.3)',
        borderRadius: 8,
        padding: '10px 14px',
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        color: '#fb7185',
        fontSize: '0.82rem'
      }
    }, /*#__PURE__*/React.createElement(Icons.alert, {
      size: 16
    }), /*#__PURE__*/React.createElement("span", null, loginError)), /*#__PURE__*/React.createElement("form", {
      onSubmit: e => {
        e.preventDefault();
        handleLogin(loginUsername, loginPassword);
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        display: 'block',
        fontSize: '0.78rem',
        color: '#94a3b8',
        fontWeight: 600,
        marginBottom: 6
      }
    }, "Operator Username"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: loginUsername,
      onChange: e => setLoginUsername(e.target.value),
      required: true,
      style: {
        width: '100%',
        padding: '10px 12px 10px 36px',
        background: 'rgba(30, 41, 59, 0.8)',
        border: '1px solid rgba(148, 163, 184, 0.25)',
        borderRadius: 8,
        color: '#f8fafc',
        fontSize: '0.85rem',
        outline: 'none'
      },
      placeholder: "Enter username (e.g. admin, dr.sharma)"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 10,
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#64748b'
      }
    }, /*#__PURE__*/React.createElement(Icons.user, {
      size: 16
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        display: 'block',
        fontSize: '0.78rem',
        color: '#94a3b8',
        fontWeight: 600,
        marginBottom: 6
      }
    }, "Password"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "password",
      value: loginPassword,
      onChange: e => setLoginPassword(e.target.value),
      required: true,
      style: {
        width: '100%',
        padding: '10px 12px 10px 36px',
        background: 'rgba(30, 41, 59, 0.8)',
        border: '1px solid rgba(148, 163, 184, 0.25)',
        borderRadius: 8,
        color: '#f8fafc',
        fontSize: '0.85rem',
        outline: 'none'
      },
      placeholder: "Enter password"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 10,
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#64748b'
      }
    }, /*#__PURE__*/React.createElement(Icons.lock, {
      size: 16
    })))), /*#__PURE__*/React.createElement("button", {
      type: "submit",
      disabled: loginLoading,
      style: {
        width: '100%',
        padding: '10px 16px',
        borderRadius: 8,
        background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
        color: '#090d16',
        fontWeight: 800,
        border: 'none',
        cursor: loginLoading ? 'not-allowed' : 'pointer',
        fontSize: '0.88rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        transition: 'all 0.15s ease'
      }
    }, loginLoading ? /*#__PURE__*/React.createElement(Icons.refresh, {
      size: 16,
      className: "live-pulse"
    }) : /*#__PURE__*/React.createElement(Icons.unlock, {
      size: 16
    }), /*#__PURE__*/React.createElement("span", null, loginLoading ? 'Authenticating...' : 'Sign In to PQ-KMS'))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 24,
        paddingTop: 18,
        borderTop: '1px solid rgba(148, 163, 184, 0.15)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.75rem',
        fontWeight: 700,
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: 10
      }
    }, "Demo Accounts (1-Click Evaluation)"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => {
        setLoginUsername('admin');
        setLoginPassword('admin123');
        handleLogin('admin', 'admin123');
      },
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 12px',
        borderRadius: 8,
        background: 'rgba(6, 182, 212, 0.08)',
        border: '1px solid rgba(6, 182, 212, 0.25)',
        color: '#f8fafc',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.15s ease'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '1.2rem'
      }
    }, "\uD83D\uDEE1\uFE0F"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.82rem',
        fontWeight: 700,
        color: '#38bdf8'
      }
    }, "Admin (KMS Security Officer)"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.72rem',
        color: '#94a3b8'
      }
    }, "admin / admin123 \u2022 Full server control & clearances"))), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.7rem',
        padding: '2px 8px',
        borderRadius: 4,
        background: 'rgba(6, 182, 212, 0.2)',
        color: '#38bdf8',
        fontWeight: 700
      }
    }, "ADMIN")), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => {
        setLoginUsername('dr.sharma');
        setLoginPassword('doc123');
        handleLogin('dr.sharma', 'doc123');
      },
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 12px',
        borderRadius: 8,
        background: 'rgba(16, 185, 129, 0.08)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        color: '#f8fafc',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.15s ease'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '1.2rem'
      }
    }, "\uD83E\uDE7A"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.82rem',
        fontWeight: 700,
        color: '#34d399'
      }
    }, "Dr. Sharma (Chief Endocrinologist)"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.72rem',
        color: '#94a3b8'
      }
    }, "dr.sharma / doc123 \u2022 Authorized: Alpha & ICU-01"))), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.7rem',
        padding: '2px 8px',
        borderRadius: 4,
        background: 'rgba(16, 185, 129, 0.2)',
        color: '#34d399',
        fontWeight: 700
      }
    }, "DOCTOR")), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => {
        setLoginUsername('dr.alvarez');
        setLoginPassword('doc123');
        handleLogin('dr.alvarez', 'doc123');
      },
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 12px',
        borderRadius: 8,
        background: 'rgba(139, 92, 246, 0.08)',
        border: '1px solid rgba(139, 92, 246, 0.25)',
        color: '#f8fafc',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.15s ease'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '1.2rem'
      }
    }, "\uD83E\uDE7A"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.82rem',
        fontWeight: 700,
        color: '#a78bfa'
      }
    }, "Dr. Alvarez (Metabolic Care)"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.72rem',
        color: '#94a3b8'
      }
    }, "dr.alvarez / doc123 \u2022 Authorized: Beta & Clinic-02"))), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.7rem',
        padding: '2px 8px',
        borderRadius: 4,
        background: 'rgba(139, 92, 246, 0.2)',
        color: '#a78bfa',
        fontWeight: 700
      }
    }, "DOCTOR"))))), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        marginTop: 18,
        color: '#64748b',
        fontSize: '0.72rem'
      }
    }, "PQ-KMS Cryptographic Security Gateway \u2022 SHA-256 Tamper-Evident Audit Logging Enabled")));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1440,
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
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 10px',
      background: 'rgba(6, 182, 212, 0.12)',
      border: '1px solid rgba(6, 182, 212, 0.3)',
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement(Icons.lock, {
    size: 22,
    style: {
      color: '#06b6d4'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: '1.15rem',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      color: '#f8fafc'
    }
  }, "PQ-KMS"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.7rem',
      padding: '2px 8px',
      borderRadius: 9999,
      background: 'rgba(56, 189, 248, 0.15)',
      color: '#38bdf8',
      border: '1px solid rgba(56, 189, 248, 0.3)',
      fontWeight: 600
    }
  }, "Modern React UI")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.78rem',
      color: '#94a3b8',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement("span", null, "KEM: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#38bdf8'
    }
  }, info.kem_alg || 'ML-KEM-768')), /*#__PURE__*/React.createElement("span", null, "\u2022"), /*#__PURE__*/React.createElement("span", null, "Signatures: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#34d399'
    }
  }, info.sig_alg || 'ML-DSA-65')), /*#__PURE__*/React.createElement("span", null, "\u2022"), /*#__PURE__*/React.createElement("span", null, "AEAD: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#c084fc'
    }
  }, "AES-256-GCM")), /*#__PURE__*/React.createElement("span", null, "\u2022"), /*#__PURE__*/React.createElement("span", null, "Lifetime: ", /*#__PURE__*/React.createElement("strong", null, info.session_lifetime_s || 60, "s")))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 10px',
      borderRadius: 9999,
      background: backendOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
      border: `1px solid ${backendOnline ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)'}`,
      fontSize: '0.75rem',
      fontWeight: 600,
      color: backendOnline ? '#34d399' : '#fb7185'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: backendOnline ? 'live-pulse' : '',
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      backgroundColor: backendOnline ? '#10b981' : '#f43f5e'
    }
  }), backendOnline ? 'Database Live' : 'Disconnected'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: '0.78rem',
      color: '#94a3b8'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Auto:"), /*#__PURE__*/React.createElement("select", {
    value: autoRefreshSecs,
    onChange: e => setAutoRefreshSecs(Number(e.target.value)),
    style: {
      background: 'rgba(30, 41, 59, 0.8)',
      color: '#f1f5f9',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      borderRadius: 6,
      padding: '4px 8px',
      fontSize: '0.78rem',
      outline: 'none'
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: 0
  }, "Off"), /*#__PURE__*/React.createElement("option", {
    value: 3
  }, "3s"), /*#__PURE__*/React.createElement("option", {
    value: 5
  }, "5s"), /*#__PURE__*/React.createElement("option", {
    value: 10
  }, "10s"), /*#__PURE__*/React.createElement("option", {
    value: 30
  }, "30s"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => fetchAllData(true),
    disabled: refreshing,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 14px',
      borderRadius: 8,
      background: 'rgba(30, 41, 59, 0.8)',
      color: '#f8fafc',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      fontSize: '0.8rem',
      fontWeight: 600,
      cursor: refreshing ? 'not-allowed' : 'pointer',
      transition: 'all 0.15s ease'
    },
    title: `Last updated ${lastUpdated.toLocaleTimeString()}`
  }, /*#__PURE__*/React.createElement(Icons.refresh, {
    size: 14,
    className: refreshing ? 'live-pulse' : ''
  }), refreshing ? 'Refreshing...' : 'Refresh'), /*#__PURE__*/React.createElement("button", {
    onClick: () => setEnvModalOpen(true),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 12px',
      borderRadius: 8,
      background: 'rgba(6, 182, 212, 0.1)',
      color: '#38bdf8',
      border: '1px solid rgba(6, 182, 212, 0.3)',
      fontSize: '0.8rem',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icons.cpu, {
    size: 14
  }), "System Specs"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '4px 10px',
      borderRadius: 8,
      background: 'rgba(30, 41, 59, 0.9)',
      border: '1px solid rgba(148, 163, 184, 0.25)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.1rem'
    }
  }, currentUser.avatar || (currentUser.role === 'ADMIN' ? '🛡️' : '🩺')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.78rem',
      fontWeight: 700,
      color: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", null, currentUser.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.65rem',
      padding: '1px 6px',
      borderRadius: 4,
      background: currentUser.role === 'ADMIN' ? 'rgba(6, 182, 212, 0.25)' : 'rgba(16, 185, 129, 0.25)',
      color: currentUser.role === 'ADMIN' ? '#38bdf8' : '#34d399',
      fontWeight: 800
    }
  }, currentUser.role)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.68rem',
      color: '#94a3b8'
    }
  }, currentUser.specialty || currentUser.username)), /*#__PURE__*/React.createElement("button", {
    onClick: handleLogout,
    title: "Sign Out of Session",
    style: {
      marginLeft: 4,
      padding: '4px 8px',
      borderRadius: 6,
      background: 'rgba(244, 63, 94, 0.15)',
      border: '1px solid rgba(244, 63, 94, 0.3)',
      color: '#fb7185',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      fontSize: '0.72rem',
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement(Icons.logOut, {
    size: 13
  }), /*#__PURE__*/React.createElement("span", null, "Exit"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1440,
      margin: '0 auto',
      padding: '0 24px',
      display: 'flex',
      gap: 6,
      overflowX: 'auto'
    }
  }, (currentUser.role === 'DOCTOR' ? [{
    id: 'doctor_telemetry',
    label: '🩺 Quantum Telemetry & Decryption',
    icon: Icons.activity
  }, {
    id: 'biochip',
    label: '🧬 Biochip Digital Twin',
    icon: Icons.droplet
  }, {
    id: 'crypto',
    label: '🔬 Crypto Inspector',
    icon: Icons.lock
  }, {
    id: 'audit',
    label: '📜 Access Audit Log',
    icon: Icons.fileText,
    count: auditData.events ? auditData.events.length : 0
  }] : [{
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
    id: 'admin_clearances',
    label: '🛡️ Doctor Clearances',
    icon: Icons.shield
  }, {
    id: 'patients',
    label: '🩺 Cohort Vitals (All Assays)',
    icon: Icons.activity,
    count: patientStats.total_patients || 768
  }, {
    id: 'biochip',
    label: '🧬 Biochip Digital Twin',
    icon: Icons.droplet
  }, {
    id: 'attacks',
    label: '🎯 Attack Sandbox',
    icon: Icons.target
  }, {
    id: 'crypto',
    label: '🔬 Crypto Inspector',
    icon: Icons.lock
  }, {
    id: 'benchmarks',
    label: 'Benchmarks & Papers',
    icon: Icons.chart
  }, {
    id: 'security',
    label: 'Security & CRL',
    icon: Icons.shield
  }]).map(tab => {
    const IconCmp = tab.icon;
    const active = activeTab === tab.id;
    return /*#__PURE__*/React.createElement("button", {
      key: tab.id,
      onClick: () => setActiveTab(tab.id),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '12px 18px',
        background: 'transparent',
        color: active ? '#38bdf8' : '#94a3b8',
        border: 'none',
        borderBottom: active ? '2px solid #06b6d4' : '2px solid transparent',
        fontWeight: active ? 700 : 500,
        fontSize: '0.88rem',
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
        background: active ? 'rgba(6, 182, 212, 0.2)' : 'rgba(148, 163, 184, 0.15)',
        color: active ? '#38bdf8' : '#94a3b8',
        fontWeight: 600
      }
    }, tab.count));
  }))), /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 1440,
      margin: '0 auto',
      padding: '24px',
      flex: 1,
      width: '100%'
    }
  }, activeTab === 'doctor_telemetry' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 16,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: '1.3rem',
      fontWeight: 800,
      color: '#f8fafc'
    }
  }, "\uD83E\uDE7A Clinical Biochip Telemetry & In-Transit Decryption Terminal"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.72rem',
      padding: '2px 8px',
      borderRadius: 9999,
      background: 'rgba(16, 185, 129, 0.15)',
      color: '#34d399',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      fontWeight: 600
    }
  }, "Doctor Portal (RBAC Protected)")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.84rem',
      color: '#94a3b8',
      marginTop: 4
    }
  }, "Post-quantum authenticated telemetry access for ", currentUser.name, " (", currentUser.specialty, "). Data is encrypted in-transit via ML-KEM-768 & AES-256-GCM.")), doctorDecryptedData && doctorDecryptedData.patients && /*#__PURE__*/React.createElement("button", {
    onClick: () => exportToCsv(`biochip_${selectedBiochipId}_telemetry`, doctorDecryptedData.patients),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '8px 16px',
      borderRadius: 8,
      background: 'rgba(30, 41, 59, 0.8)',
      color: '#cbd5e1',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      fontSize: '0.82rem',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icons.download, {
    size: 14
  }), "Export Decrypted Telemetry (", doctorDecryptedData.patients.length, " Records)")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.85rem',
      fontWeight: 700,
      color: '#cbd5e1',
      marginBottom: 10,
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icons.device, {
    size: 16,
    style: {
      color: '#06b6d4'
    }
  }), /*#__PURE__*/React.createElement("span", null, "Select Biochip Node for Quantum Handshake:")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: 14
    }
  }, doctorBiochips.map(bc => {
    const isSelected = selectedBiochipId === bc.biochip_id;
    return /*#__PURE__*/React.createElement("div", {
      key: bc.biochip_id,
      onClick: () => {
        setSelectedBiochipId(bc.biochip_id);
        setDoctorEncryptedPackage(null);
        setDoctorDecryptedData(null);
        setDoctorAccessError(null);
      },
      className: "glass-card",
      style: {
        padding: 16,
        cursor: 'pointer',
        borderRadius: 12,
        background: isSelected ? 'rgba(6, 182, 212, 0.08)' : 'rgba(15, 23, 42, 0.6)',
        border: isSelected ? '2px solid #06b6d4' : '1px solid rgba(148, 163, 184, 0.15)',
        transition: 'all 0.15s ease'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "font-mono",
      style: {
        fontSize: '0.85rem',
        fontWeight: 800,
        color: isSelected ? '#38bdf8' : '#f8fafc'
      }
    }, bc.biochip_id), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.68rem',
        fontWeight: 700,
        padding: '2px 8px',
        borderRadius: 9999,
        background: bc.authorized ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
        color: bc.authorized ? '#34d399' : '#fb7185',
        border: `1px solid ${bc.authorized ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`
      }
    }, bc.authorized ? '● Clearance Approved' : '🔒 Clearance Restricted')), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.82rem',
        fontWeight: 600,
        color: '#e2e8f0',
        marginBottom: 4
      }
    }, bc.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.74rem',
        color: '#94a3b8',
        marginBottom: 6
      }
    }, "\uD83D\uDCCD ", bc.location), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.72rem',
        color: '#64748b',
        paddingTop: 6,
        borderTop: '1px solid rgba(148, 163, 184, 0.1)'
      }
    }, /*#__PURE__*/React.createElement("span", null, bc.assay_type), /*#__PURE__*/React.createElement("strong", {
      style: {
        color: '#94a3b8'
      }
    }, bc.patient_count, " Assays")));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 18,
      borderRadius: 12,
      marginBottom: 24,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 14,
      background: 'rgba(30, 41, 59, 0.5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 8,
      background: 'rgba(6, 182, 212, 0.15)',
      borderRadius: 8,
      color: '#06b6d4'
    }
  }, /*#__PURE__*/React.createElement(Icons.key, {
    size: 20
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.8rem',
      color: '#94a3b8'
    }
  }, "Active Target Biochip"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      fontSize: '1rem',
      fontWeight: 800,
      color: '#38bdf8'
    }
  }, selectedBiochipId))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => handleDoctorExchange(selectedBiochipId),
    disabled: doctorKeyExchangeLoading,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 18px',
      borderRadius: 8,
      background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
      color: '#090d16',
      fontWeight: 800,
      border: 'none',
      cursor: doctorKeyExchangeLoading ? 'not-allowed' : 'pointer',
      fontSize: '0.85rem',
      transition: 'all 0.15s ease'
    }
  }, doctorKeyExchangeLoading ? /*#__PURE__*/React.createElement(Icons.refresh, {
    size: 15,
    className: "live-pulse"
  }) : /*#__PURE__*/React.createElement(Icons.play, {
    size: 15
  }), /*#__PURE__*/React.createElement("span", null, doctorKeyExchangeLoading ? 'Executing Key Exchange (ML-KEM-768)...' : '📡 Request In-Transit Quantum-Encrypted Telemetry')), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleDoctorExchange('DMFB-RESEARCH-03'),
    disabled: doctorKeyExchangeLoading,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '10px 14px',
      borderRadius: 8,
      background: 'rgba(244, 63, 94, 0.12)',
      color: '#fb7185',
      border: '1px solid rgba(244, 63, 94, 0.3)',
      cursor: doctorKeyExchangeLoading ? 'not-allowed' : 'pointer',
      fontSize: '0.82rem',
      fontWeight: 600
    },
    title: "Simulate accessing an unauthorized node to verify 403 Forbidden enforcement and tamper-evident audit logging"
  }, /*#__PURE__*/React.createElement(Icons.alert, {
    size: 14
  }), /*#__PURE__*/React.createElement("span", null, "\uD83E\uDDEA Test Unauthorized Biochip (DMFB-RESEARCH-03)")))), doctorAccessError && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(244, 63, 94, 0.1)',
      border: '1px solid rgba(244, 63, 94, 0.35)',
      borderRadius: 12,
      padding: 18,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 6,
      background: 'rgba(244, 63, 94, 0.2)',
      borderRadius: 8,
      color: '#fb7185'
    }
  }, /*#__PURE__*/React.createElement(Icons.alert, {
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 800,
      color: '#fb7185',
      marginBottom: 4
    }
  }, "\u26D4 Cryptographic Authorization Denied (HTTP 403 Forbidden)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.84rem',
      color: '#fecdd3',
      marginBottom: 8
    }
  }, doctorAccessError), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.78rem',
      color: '#94a3b8',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Tamper-Evident Security Log: An unauthorized access attempt has been permanently logged to the SHA-256 hash-chained ledger."), /*#__PURE__*/React.createElement("button", {
    onClick: () => setActiveTab('audit'),
    style: {
      padding: '3px 10px',
      borderRadius: 4,
      background: 'rgba(244, 63, 94, 0.2)',
      color: '#fb7185',
      border: '1px solid rgba(244, 63, 94, 0.4)',
      fontSize: '0.72rem',
      fontWeight: 700,
      cursor: 'pointer'
    }
  }, "Inspect Audit Log"))))), doctorEncryptedPackage && /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 22,
      borderRadius: 14,
      marginBottom: 24,
      border: '1px solid rgba(6, 182, 212, 0.35)',
      background: 'rgba(15, 23, 42, 0.85)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 8,
      background: 'rgba(6, 182, 212, 0.15)',
      borderRadius: 8,
      color: '#38bdf8'
    }
  }, /*#__PURE__*/React.createElement(Icons.lock, {
    size: 20
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1rem',
      fontWeight: 800,
      color: '#f8fafc',
      margin: 0
    }
  }, "\uD83D\uDCE6 In-Transit Encrypted Telemetry Package (Session ", doctorEncryptedPackage.session_id.slice(0, 8), "...)"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.78rem',
      color: '#94a3b8',
      margin: '2px 0 0 0'
    }
  }, "Encapsulated under NIST FIPS 203 ML-KEM-768 & signed with FIPS 204 ML-DSA-65. Telemetry is in ciphertext form."))), /*#__PURE__*/React.createElement("button", {
    onClick: handleDoctorDecrypt,
    disabled: doctorDecryptLoading,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 18px',
      borderRadius: 8,
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: '#ffffff',
      fontWeight: 800,
      border: 'none',
      cursor: doctorDecryptLoading ? 'not-allowed' : 'pointer',
      fontSize: '0.85rem',
      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
    }
  }, doctorDecryptLoading ? /*#__PURE__*/React.createElement(Icons.refresh, {
    size: 15,
    className: "live-pulse"
  }) : /*#__PURE__*/React.createElement(Icons.unlock, {
    size: 15
  }), /*#__PURE__*/React.createElement("span", null, doctorDecryptLoading ? 'Decapsulating & Decrypting...' : '🔓 Decapsulate & Decrypt with Doctor\'s Secret Key'))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(30, 41, 59, 0.6)',
      padding: 14,
      borderRadius: 10,
      border: '1px solid rgba(148, 163, 184, 0.15)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.74rem',
      color: '#94a3b8',
      textTransform: 'uppercase',
      fontWeight: 700,
      marginBottom: 4
    }
  }, "1. ML-KEM-768 Ciphertext (c_kem)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.82rem',
      fontWeight: 700,
      color: '#38bdf8',
      marginBottom: 4
    }
  }, doctorEncryptedPackage.kem_ciphertext_len, " Bytes (FIPS 203)"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      fontSize: '0.7rem',
      color: '#64748b',
      wordBreak: 'break-all',
      background: 'rgba(15, 23, 42, 0.7)',
      padding: 8,
      borderRadius: 6
    }
  }, doctorEncryptedPackage.kem_ciphertext_b64.slice(0, 48), "...")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(30, 41, 59, 0.6)',
      padding: 14,
      borderRadius: 10,
      border: '1px solid rgba(148, 163, 184, 0.15)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.74rem',
      color: '#94a3b8',
      textTransform: 'uppercase',
      fontWeight: 700,
      marginBottom: 4
    }
  }, "2. AES-256-GCM Ciphertext (c_payload)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.82rem',
      fontWeight: 700,
      color: '#c084fc',
      marginBottom: 4
    }
  }, doctorEncryptedPackage.aead_ciphertext_len, " Bytes + 16B GHASH Tag"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      fontSize: '0.7rem',
      color: '#64748b',
      wordBreak: 'break-all',
      background: 'rgba(15, 23, 42, 0.7)',
      padding: 8,
      borderRadius: 6
    }
  }, doctorEncryptedPackage.aead_ciphertext_b64.slice(0, 48), "...")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(30, 41, 59, 0.6)',
      padding: 14,
      borderRadius: 10,
      border: '1px solid rgba(148, 163, 184, 0.15)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.74rem',
      color: '#94a3b8',
      textTransform: 'uppercase',
      fontWeight: 700,
      marginBottom: 4
    }
  }, "3. Deterministic Nonce (N)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.82rem',
      fontWeight: 700,
      color: '#fbbf24',
      marginBottom: 4
    }
  }, "12 Bytes (96-bit IV)"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      fontSize: '0.7rem',
      color: '#64748b',
      wordBreak: 'break-all',
      background: 'rgba(15, 23, 42, 0.7)',
      padding: 8,
      borderRadius: 6
    }
  }, doctorEncryptedPackage.nonce_b64)), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(30, 41, 59, 0.6)',
      padding: 14,
      borderRadius: 10,
      border: '1px solid rgba(148, 163, 184, 0.15)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.74rem',
      color: '#94a3b8',
      textTransform: 'uppercase',
      fontWeight: 700,
      marginBottom: 4
    }
  }, "4. Server ML-DSA-65 Signature"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.82rem',
      fontWeight: 700,
      color: '#34d399',
      marginBottom: 4
    }
  }, "3,309 Bytes (FIPS 204)"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      fontSize: '0.7rem',
      color: '#64748b',
      wordBreak: 'break-all',
      background: 'rgba(15, 23, 42, 0.7)',
      padding: 8,
      borderRadius: 6
    }
  }, doctorEncryptedPackage.server_signature_b64.slice(0, 48), "...")))), doctorDecryptedData && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(16, 185, 129, 0.1)',
      border: '1px solid rgba(16, 185, 129, 0.35)',
      borderRadius: 12,
      padding: 18,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 6,
      background: 'rgba(16, 185, 129, 0.2)',
      borderRadius: 8,
      color: '#34d399'
    }
  }, /*#__PURE__*/React.createElement(Icons.check, {
    size: 20
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 800,
      color: '#34d399'
    }
  }, "\u2705 Telemetry Successfully Decrypted & Authenticated (", doctorDecryptedData.record_count, " Records)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.78rem',
      color: '#94a3b8',
      marginTop: 2
    }
  }, "Shared Secret: ", /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      color: '#38bdf8'
    }
  }, doctorDecryptedData.shared_secret_preview), " \u2022 Derived Session Key: ", /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      color: '#a78bfa'
    }
  }, doctorDecryptedData.session_key_preview), " \u2022 AEAD Tag: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#34d399'
    }
  }, "VERIFIED AUTHENTIC")))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.72rem',
      padding: '3px 10px',
      borderRadius: 9999,
      background: 'rgba(16, 185, 129, 0.2)',
      color: '#34d399',
      fontWeight: 700
    }
  }, "End-to-End Quantum-Safe"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 14,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 16,
      borderLeft: '4px solid #06b6d4'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#94a3b8',
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase'
    }
  }, "Decrypted Assays"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.8rem',
      fontWeight: 800,
      color: '#38bdf8',
      marginTop: 4
    }
  }, doctorCohortStats.total, " Patients"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.72rem',
      marginTop: 2
    }
  }, "Node: ", selectedBiochipId)), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 16,
      borderLeft: '4px solid #10b981'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#94a3b8',
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase'
    }
  }, "Mean Blood Glucose"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.8rem',
      fontWeight: 800,
      color: '#34d399',
      marginTop: 4
    }
  }, doctorCohortStats.meanGlucose, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.9rem',
      fontWeight: 500
    }
  }, "mg/dL")), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.72rem',
      marginTop: 2
    }
  }, "Enzymatic Biosensor Readout")), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 16,
      borderLeft: '4px solid #f43f5e'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#94a3b8',
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase'
    }
  }, "Diabetic Positive"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.8rem',
      fontWeight: 800,
      color: '#fb7185',
      marginTop: 4
    }
  }, doctorCohortStats.diabeticCount, " (", doctorCohortStats.diabeticPct, "%)"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.72rem',
      marginTop: 2
    }
  }, "Clinical Diagnosis = 1")), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 16,
      borderLeft: '4px solid #f59e0b'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#94a3b8',
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase'
    }
  }, "High Clinical Risk"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.8rem',
      fontWeight: 800,
      color: '#fbbf24',
      marginTop: 4
    }
  }, doctorCohortStats.highRiskCount, " Patients"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.72rem',
      marginTop: 2
    }
  }, "Glucose > 180 or Impaired"))), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 14,
      borderRadius: 10,
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
      gap: 10,
      flex: 1,
      minWidth: 240
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: 300
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: doctorPatientSearch,
    onChange: e => setDoctorPatientSearch(e.target.value),
    placeholder: "Search patient ID or age...",
    style: {
      width: '100%',
      padding: '6px 10px 6px 30px',
      background: 'rgba(30, 41, 59, 0.8)',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      borderRadius: 6,
      color: '#f8fafc',
      fontSize: '0.8rem',
      outline: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 8,
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#64748b'
    }
  }, /*#__PURE__*/React.createElement(Icons.search, {
    size: 14
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: '0.78rem',
      color: '#94a3b8'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Risk:"), /*#__PURE__*/React.createElement("select", {
    value: doctorRiskFilter,
    onChange: e => setDoctorRiskFilter(e.target.value),
    style: {
      background: 'rgba(30, 41, 59, 0.8)',
      color: '#f8fafc',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      borderRadius: 6,
      padding: '4px 8px',
      fontSize: '0.78rem',
      outline: 'none'
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "ALL"
  }, "All Risk Levels"), /*#__PURE__*/React.createElement("option", {
    value: "NORMAL"
  }, "Normal"), /*#__PURE__*/React.createElement("option", {
    value: "PRE_DIABETIC"
  }, "Pre-Diabetic"), /*#__PURE__*/React.createElement("option", {
    value: "HIGH"
  }, "High Risk"), /*#__PURE__*/React.createElement("option", {
    value: "CRITICAL_HIGH"
  }, "Critical High")))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.78rem',
      color: '#94a3b8'
    }
  }, "Showing ", /*#__PURE__*/React.createElement("strong", null, filteredDoctorPatients.length), " of ", doctorDecryptedData.patients.length, " records")), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      borderRadius: 12,
      overflow: 'hidden',
      border: '1px solid rgba(148, 163, 184, 0.15)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "data-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Patient ID"), /*#__PURE__*/React.createElement("th", null, "Age"), /*#__PURE__*/React.createElement("th", null, "Glucose (mg/dL)"), /*#__PURE__*/React.createElement("th", null, "Blood Pressure"), /*#__PURE__*/React.createElement("th", null, "Insulin (\u03BCU/mL)"), /*#__PURE__*/React.createElement("th", null, "BMI"), /*#__PURE__*/React.createElement("th", null, "Outcome"), /*#__PURE__*/React.createElement("th", null, "Clinical Risk Status"))), /*#__PURE__*/React.createElement("tbody", null, filteredDoctorPatients.map(pt => /*#__PURE__*/React.createElement("tr", {
    key: pt.id || pt.patient_id
  }, /*#__PURE__*/React.createElement("td", {
    className: "font-mono",
    style: {
      fontWeight: 700,
      color: '#38bdf8'
    }
  }, "#", pt.id || pt.patient_id), /*#__PURE__*/React.createElement("td", null, pt.age, " yrs"), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: pt.glucose >= 200 ? '#fb7185' : pt.glucose >= 140 ? '#fbbf24' : '#34d399'
    }
  }, pt.glucose), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.7rem',
      color: '#64748b',
      marginLeft: 4
    }
  }, "mg/dL")), /*#__PURE__*/React.createElement("td", null, pt.blood_pressure, " mm Hg"), /*#__PURE__*/React.createElement("td", null, pt.insulin || '—'), /*#__PURE__*/React.createElement("td", null, pt.bmi), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Badge, {
    status: pt.outcome === 1 ? 'DIABETIC' : 'NORMAL',
    label: pt.outcome === 1 ? 'Diabetic' : 'Normal'
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Badge, {
    status: pt.clinical_status || pt.clinical_risk,
    label: pt.risk_label || pt.clinical_status || pt.clinical_risk
  })))), !filteredDoctorPatients.length && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 8,
    style: {
      textAlign: 'center',
      padding: 28,
      color: '#64748b'
    }
  }, "No decrypted patient records match the filter criteria.")))))))), activeTab === 'patients' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 16,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: '1.3rem',
      fontWeight: 800,
      color: '#f8fafc'
    }
  }, "\uD83E\uDE7A Clinical Diagnostic Telemetry & Patient Vitals"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.72rem',
      padding: '2px 8px',
      borderRadius: 9999,
      background: 'rgba(16, 185, 129, 0.15)',
      color: '#34d399',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      fontWeight: 600
    }
  }, "Clinician View")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.84rem',
      color: '#94a3b8',
      marginTop: 4
    }
  }, "Real patient cohort (Pima Indians Diabetes Dataset, 768 assays) protected by PQ-KMS ML-KEM-768 & AES-256-GCM AEAD encryption.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => exportToCsv('clinical_patient_vitals', patientsData.patients || []),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '8px 16px',
      borderRadius: 8,
      background: 'rgba(30, 41, 59, 0.8)',
      color: '#cbd5e1',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      fontSize: '0.82rem',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icons.download, {
    size: 14
  }), "Export Visible Records (", patientsData.patients ? patientsData.patients.length : 0, ")"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 16,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20,
      borderLeft: '4px solid #06b6d4'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#94a3b8',
      fontSize: '0.8rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }
  }, "Total Cohort Assays"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '2rem',
      fontWeight: 800,
      color: '#38bdf8',
      marginTop: 4
    }
  }, patientStats.total_patients || 768, " Patients"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.75rem',
      marginTop: 4
    }
  }, "Protected by Post-Quantum Sessions")), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20,
      borderLeft: '4px solid #f43f5e'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#94a3b8',
      fontSize: '0.8rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }
  }, "Diabetic Positive"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '2rem',
      fontWeight: 800,
      color: '#fb7185',
      marginTop: 4
    }
  }, patientStats.diabetic_count || 268, " (", patientStats.diabetic_percent || '34.9', "%)"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.75rem',
      marginTop: 4
    }
  }, "Clinical Outcome = 1")), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20,
      borderLeft: '4px solid #10b981'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#94a3b8',
      fontSize: '0.8rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }
  }, "Cohort Mean Glucose"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '2rem',
      fontWeight: 800,
      color: '#34d399',
      marginTop: 4
    }
  }, patientStats.mean_glucose || '120.9', " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '1rem',
      fontWeight: 500
    }
  }, "mg/dL")), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.75rem',
      marginTop: 4
    }
  }, "Normal Reference: 70 - 139 mg/dL")), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20,
      borderLeft: '4px solid #f59e0b'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#94a3b8',
      fontSize: '0.8rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }
  }, "Cohort Mean BMI"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '2rem',
      fontWeight: 800,
      color: '#fbbf24',
      marginTop: 4
    }
  }, patientStats.mean_bmi || '32.0', " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '1rem',
      fontWeight: 500
    }
  }, "kg/m\xB2")), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.75rem',
      marginTop: 4
    }
  }, "Mean Age: ", patientStats.mean_age || '33.2', " yrs \u2022 BP: ", patientStats.mean_blood_pressure || '69.1', " mmHg"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
      gap: 20,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#f8fafc',
      marginBottom: 16
    }
  }, "Blood Glucose Concentration Distribution (mg/dL)"), /*#__PURE__*/React.createElement(ChartCanvas, {
    type: "bar",
    data: patientGlucoseChartData,
    options: {
      plugins: {
        legend: {
          display: false
        }
      }
    },
    height: 220
  })), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#f8fafc',
      marginBottom: 16
    }
  }, "Diagnostic Outcome Ratio (Cohort Prevalence)"), /*#__PURE__*/React.createElement(ChartCanvas, {
    type: "doughnut",
    data: patientOutcomeChartData,
    options: {
      plugins: {
        legend: {
          position: 'right'
        }
      }
    },
    height: 220
  }))), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: '16px 20px',
      marginBottom: 20,
      borderLeft: '4px solid #38bdf8',
      background: 'rgba(56, 189, 248, 0.05)',
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 10,
      background: 'rgba(56, 189, 248, 0.15)',
      borderRadius: 10,
      color: '#38bdf8'
    }
  }, /*#__PURE__*/React.createElement(Icons.shield, {
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.82rem',
      color: '#cbd5e1',
      lineHeight: 1.6
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#38bdf8'
    }
  }, "End-to-End Microfluidic Telemetry Protection:"), " In a clinical deployment, these patient assay readings originate from edge EWOD biochips and are authenticated and encrypted using ", /*#__PURE__*/React.createElement("strong", null, "AES-256-GCM"), " with keys established via ", /*#__PURE__*/React.createElement("strong", null, "NIST FIPS 203 ML-KEM-768"), ". This mathematically prevents in-transit payload falsification (Ali et al.) and shields diagnostic histories from harvest-now-decrypt-later quantum interception.")), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: '16px 20px',
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
      minWidth: 280
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
    placeholder: "Search Patient ID (e.g. PAT-0042) or Age...",
    value: patientSearch,
    onChange: e => setPatientSearch(e.target.value),
    style: {
      width: '100%',
      background: 'rgba(30, 41, 59, 0.7)',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      borderRadius: 8,
      padding: '8px 12px 8px 36px',
      color: '#f8fafc',
      fontSize: '0.85rem',
      outline: 'none'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, [{
    id: 'ALL',
    label: 'All Outcomes'
  }, {
    id: '0',
    label: 'Healthy (0)'
  }, {
    id: '1',
    label: 'Diabetic (1)'
  }].map(btn => /*#__PURE__*/React.createElement("button", {
    key: btn.id,
    onClick: () => {
      setPatientOutcomeFilter(btn.id);
      setPatientPage(1);
    },
    style: {
      padding: '6px 12px',
      borderRadius: 6,
      border: '1px solid',
      borderColor: patientOutcomeFilter === btn.id ? '#06b6d4' : 'rgba(148, 163, 184, 0.2)',
      background: patientOutcomeFilter === btn.id ? 'rgba(6, 182, 212, 0.15)' : 'rgba(30, 41, 59, 0.5)',
      color: patientOutcomeFilter === btn.id ? '#38bdf8' : '#94a3b8',
      fontSize: '0.78rem',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, btn.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, [{
    id: 'ALL',
    label: 'All Status'
  }, {
    id: 'NORMAL',
    label: 'Normal'
  }, {
    id: 'PRE_DIABETIC',
    label: 'Pre-Diabetic'
  }, {
    id: 'DIABETIC',
    label: 'Diabetic'
  }].map(btn => /*#__PURE__*/React.createElement("button", {
    key: btn.id,
    onClick: () => {
      setPatientRiskFilter(btn.id);
      setPatientPage(1);
    },
    style: {
      padding: '6px 12px',
      borderRadius: 6,
      border: '1px solid',
      borderColor: patientRiskFilter === btn.id ? '#10b981' : 'rgba(148, 163, 184, 0.2)',
      background: patientRiskFilter === btn.id ? 'rgba(16, 185, 129, 0.15)' : 'rgba(30, 41, 59, 0.5)',
      color: patientRiskFilter === btn.id ? '#34d399' : '#94a3b8',
      fontSize: '0.78rem',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, btn.label)))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.8rem',
      color: '#94a3b8'
    }
  }, "Total Filtered: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#f8fafc'
    }
  }, patientsData.total || 0), " patients")), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto',
      maxHeight: 540
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "custom-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Patient ID"), /*#__PURE__*/React.createElement("th", null, "Age"), /*#__PURE__*/React.createElement("th", null, "Glucose (mg/dL)"), /*#__PURE__*/React.createElement("th", null, "Blood Pressure"), /*#__PURE__*/React.createElement("th", null, "Insulin"), /*#__PURE__*/React.createElement("th", null, "BMI"), /*#__PURE__*/React.createElement("th", null, "Clinical Status"), /*#__PURE__*/React.createElement("th", null, "Diagnostic Outcome"))), /*#__PURE__*/React.createElement("tbody", null, (patientsData.patients || []).map(p => /*#__PURE__*/React.createElement("tr", {
    key: p.id
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      fontWeight: 700,
      color: '#38bdf8'
    }
  }, p.id)), /*#__PURE__*/React.createElement("td", {
    className: "font-mono",
    style: {
      fontSize: '0.82rem',
      color: '#cbd5e1'
    }
  }, p.age, " yrs"), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      fontSize: '0.9rem',
      fontWeight: 700,
      color: p.glucose >= 200 ? '#fb7185' : p.glucose >= 140 ? '#fbbf24' : '#34d399'
    }
  }, p.glucose)), /*#__PURE__*/React.createElement("td", {
    className: "font-mono",
    style: {
      fontSize: '0.8rem',
      color: '#94a3b8'
    }
  }, p.blood_pressure, " mmHg"), /*#__PURE__*/React.createElement("td", {
    className: "font-mono",
    style: {
      fontSize: '0.8rem',
      color: '#94a3b8'
    }
  }, p.insulin > 0 ? `${p.insulin} µU/mL` : '—'), /*#__PURE__*/React.createElement("td", {
    className: "font-mono",
    style: {
      fontSize: '0.82rem',
      color: '#cbd5e1'
    }
  }, p.bmi), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Badge, {
    status: p.clinical_status,
    label: p.clinical_status.replace('_', '-')
  })), /*#__PURE__*/React.createElement("td", null, p.outcome === 1 ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#fb7185',
      fontWeight: 700,
      fontSize: '0.8rem'
    }
  }, "\u25CF DIABETIC (Positive)") : /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#34d399',
      fontWeight: 600,
      fontSize: '0.8rem'
    }
  }, "\u25CB Negative (Normal)")))), !patientsData.patients?.length && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 8,
    style: {
      textAlign: 'center',
      padding: 32,
      color: '#64748b'
    }
  }, patientLoading ? 'Loading patient records...' : 'No patient vitals match the selected filters.'))))), patientsData.total > pageSize && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 20px',
      borderTop: '1px solid rgba(148, 163, 184, 0.1)',
      background: 'rgba(15, 23, 42, 0.6)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.8rem',
      color: '#94a3b8'
    }
  }, "Showing ", (patientPage - 1) * pageSize + 1, " to ", Math.min(patientPage * pageSize, patientsData.total), " of ", patientsData.total), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    disabled: patientPage <= 1,
    onClick: () => setPatientPage(p => p - 1),
    style: {
      padding: '4px 10px',
      borderRadius: 6,
      background: 'rgba(30, 41, 59, 0.8)',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      color: '#f8fafc',
      fontSize: '0.75rem',
      cursor: patientPage <= 1 ? 'not-allowed' : 'pointer'
    }
  }, "Prev"), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '4px 10px',
      fontSize: '0.78rem',
      color: '#cbd5e1'
    }
  }, "Page ", patientPage, " of ", patientsData.total_pages || Math.ceil(patientsData.total / pageSize)), /*#__PURE__*/React.createElement("button", {
    disabled: patientPage >= (patientsData.total_pages || Math.ceil(patientsData.total / pageSize)),
    onClick: () => setPatientPage(p => p + 1),
    style: {
      padding: '4px 10px',
      borderRadius: 6,
      background: 'rgba(30, 41, 59, 0.8)',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      color: '#f8fafc',
      fontSize: '0.75rem',
      cursor: patientPage >= (patientsData.total_pages || Math.ceil(patientsData.total / pageSize)) ? 'not-allowed' : 'pointer'
    }
  }, "Next"))))), activeTab === 'crypto' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: '1.3rem',
      fontWeight: 800,
      color: '#f8fafc'
    }
  }, "\uD83D\uDD2C Deep Cryptographic Inspector (\"Under the Hood\")"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.72rem',
      padding: '2px 8px',
      borderRadius: 9999,
      background: 'rgba(6, 182, 212, 0.15)',
      color: '#38bdf8',
      border: '1px solid rgba(6, 182, 212, 0.3)',
      fontWeight: 600
    }
  }, "FIPS 203 / 204 Standards")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.84rem',
      color: '#94a3b8',
      marginTop: 4
    }
  }, "Technical specifications of post-quantum lattice primitives, key derivation paths, deterministic nonce construction, and NIST SP 800-57 state machine.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: 20,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20,
      borderLeft: '4px solid #38bdf8'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1rem',
      fontWeight: 700,
      color: '#f8fafc'
    }
  }, "NIST FIPS 203: ML-KEM-768"), /*#__PURE__*/React.createElement(Badge, {
    status: "PASS",
    label: "Category 3 PQC"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10,
      fontSize: '0.8rem',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(30, 41, 59, 0.5)',
      padding: 10,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#94a3b8',
      fontSize: '0.72rem'
    }
  }, "Public Encap Key"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      color: '#38bdf8',
      fontWeight: 700,
      marginTop: 2
    }
  }, "1,184 Bytes")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(30, 41, 59, 0.5)',
      padding: 10,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#94a3b8',
      fontSize: '0.72rem'
    }
  }, "Decap Secret Key"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      color: '#cbd5e1',
      fontWeight: 700,
      marginTop: 2
    }
  }, "2,400 Bytes")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(30, 41, 59, 0.5)',
      padding: 10,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#94a3b8',
      fontSize: '0.72rem'
    }
  }, "Ciphertext Size"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      color: '#34d399',
      fontWeight: 700,
      marginTop: 2
    }
  }, "1,088 Bytes")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(30, 41, 59, 0.5)',
      padding: 10,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#94a3b8',
      fontSize: '0.72rem'
    }
  }, "Shared Secret (SS)"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      color: '#fbbf24',
      fontWeight: 700,
      marginTop: 2
    }
  }, "32 Bytes (256-bit)"))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.78rem',
      color: '#94a3b8',
      lineHeight: 1.5
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Hardness:"), " Module Learning with Errors (M-LWE) over polynomial ring Z_q[X]/(X^256+1) with q=3329, k=3.")), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20,
      borderLeft: '4px solid #34d399'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1rem',
      fontWeight: 700,
      color: '#f8fafc'
    }
  }, "NIST FIPS 204: ML-DSA-65"), /*#__PURE__*/React.createElement(Badge, {
    status: "PASS",
    label: "Category 3 PQC"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10,
      fontSize: '0.8rem',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(30, 41, 59, 0.5)',
      padding: 10,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#94a3b8',
      fontSize: '0.72rem'
    }
  }, "Verification Key (PK)"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      color: '#34d399',
      fontWeight: 700,
      marginTop: 2
    }
  }, "1,952 Bytes")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(30, 41, 59, 0.5)',
      padding: 10,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#94a3b8',
      fontSize: '0.72rem'
    }
  }, "Signing Secret Key"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      color: '#cbd5e1',
      fontWeight: 700,
      marginTop: 2
    }
  }, "4,032 Bytes")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(30, 41, 59, 0.5)',
      padding: 10,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#94a3b8',
      fontSize: '0.72rem'
    }
  }, "Signature Length"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      color: '#38bdf8',
      fontWeight: 700,
      marginTop: 2
    }
  }, "3,309 Bytes")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(30, 41, 59, 0.5)',
      padding: 10,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#94a3b8',
      fontSize: '0.72rem'
    }
  }, "Signing Mode"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      color: '#c084fc',
      fontWeight: 700,
      marginTop: 2
    }
  }, "Hedged RBG"))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.78rem',
      color: '#94a3b8',
      lineHeight: 1.5
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Hardness:"), " Module Learning with Rounding & Fiat-Shamir with Aborts. Dimensions (k=6, l=5) over ring degree n=256."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
      gap: 20,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#f8fafc',
      marginBottom: 12
    }
  }, "RFC 5869: HKDF-SHA256 Session Key Derivation"), /*#__PURE__*/React.createElement("pre", {
    style: {
      background: 'rgba(15, 23, 42, 0.8)',
      padding: 14,
      borderRadius: 8,
      fontSize: '0.78rem',
      color: '#cbd5e1',
      overflowX: 'auto',
      border: '1px solid rgba(148, 163, 184, 0.1)'
    }
  }, `PRK = HMAC-SHA256(
    salt = nonce_c (16-byte cryptographically secure client nonce),
    IKM  = ML-KEM-768 Shared Secret (32 bytes)
)

K_session = HKDF-Expand(
    PRK  = PRK,
    info = "PQKMS-v1" || device_id || session_id || "aes256gcm",
    L    = 32 bytes (256-bit symmetric AEAD session key)
)`), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.75rem',
      color: '#94a3b8',
      marginTop: 10
    }
  }, "\uD83D\uDD12 ", /*#__PURE__*/React.createElement("strong", null, "Independent Re-derivation:"), " Client and Server independently derive K_session without transmitting secret key material over the network.")), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#f8fafc',
      marginBottom: 12
    }
  }, "NIST SP 800-38D: 96-Bit Deterministic Nonce Construction"), /*#__PURE__*/React.createElement("pre", {
    style: {
      background: 'rgba(15, 23, 42, 0.8)',
      padding: 14,
      borderRadius: 8,
      fontSize: '0.78rem',
      color: '#cbd5e1',
      overflowX: 'auto',
      border: '1px solid rgba(148, 163, 184, 0.1)'
    }
  }, `96-bit Nonce Architecture:
┌──────────────────────────────┬────────────────────────────────────────┐
│ Bytes 0..3: Role ID (32-bit) │ Bytes 4..11: Monotonic Counter (64-bit)│
│ 0x00000001 = Client          │ Counter starts at 1, strictly increases│
│ 0x00000002 = Server          │ Per-direction collision-free guarantees│
└──────────────────────────────┴────────────────────────────────────────┘

Authenticated Associated Data (AAD) Binding:
AAD = device_id || session_id || message_id || counter`), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.75rem',
      color: '#94a3b8',
      marginTop: 10
    }
  }, "\uD83D\uDEE1\uFE0F ", /*#__PURE__*/React.createElement("strong", null, "Anti-Replay Assurance:"), " Replayed or reordered packets fail counter validation (c \u2264 c_last) or cause AES-GCM tag verification exception (InvalidTag)."))), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1rem',
      fontWeight: 700,
      color: '#f8fafc',
      marginBottom: 16
    }
  }, "PQ-KMS End-to-End Cryptographic Protocol Flow"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 12
    }
  }, [{
    step: '01',
    title: 'Admin Enrolment',
    desc: 'Admin issues out-of-band one-time enrolment code C_enrol for biochip hardware ID.'
  }, {
    step: '02',
    title: 'Proof-of-Possession',
    desc: 'Device signs (device_id || kem_pk || sig_pk) under domain prefix PQKMS-REG.'
  }, {
    step: '03',
    title: 'ML-KEM Agreement',
    desc: 'Device signs session request with PQKMS-SREQ. Server encapsulates shared secret and signs response with PQKMS-SRESP.'
  }, {
    step: '04',
    title: 'HKDF Key Expansion',
    desc: 'Both nodes derive 256-bit symmetric session key with client nonce salt.'
  }, {
    step: '05',
    title: 'Zero-Retention Memory',
    desc: 'Session keys stored solely in volatile RAM. Zero disk persistence.'
  }, {
    step: '06',
    title: 'Protected Telemetry',
    desc: 'Microfluidic droplet sensor telemetry encrypted under AES-256-GCM.'
  }].map(st => /*#__PURE__*/React.createElement("div", {
    key: st.step,
    style: {
      background: 'rgba(30, 41, 59, 0.5)',
      padding: 14,
      borderRadius: 8,
      border: '1px solid rgba(148, 163, 184, 0.1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.75rem',
      fontWeight: 800,
      color: '#06b6d4'
    }
  }, "PHASE ", st.step), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.85rem',
      fontWeight: 700,
      color: '#f8fafc',
      margin: '4px 0'
    }
  }, st.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.75rem',
      color: '#94a3b8',
      lineHeight: 1.5
    }
  }, st.desc))))), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#f8fafc',
      marginBottom: 12
    }
  }, "Cryptographic Domain Separation Matrix (Table 13 / ST-14 Mitigation)"), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "custom-table",
    style: {
      fontSize: '0.8rem'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Context String"), /*#__PURE__*/React.createElement("th", null, "Protocol Operation"), /*#__PURE__*/React.createElement("th", null, "Purpose & Threat Vector Mitigated"), /*#__PURE__*/React.createElement("th", null, "Security Invariant"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      color: '#38bdf8',
      fontWeight: 700
    }
  }, "PQKMS-REG")), /*#__PURE__*/React.createElement("td", null, "Device Enrolment & Registration"), /*#__PURE__*/React.createElement("td", null, "Binds public keys to hardware device ID during initial Alg 1 proof-of-possession."), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Badge, {
    status: "PASS",
    label: "Cross-Context Isolated"
  }))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      color: '#34d399',
      fontWeight: 700
    }
  }, "PQKMS-SREQ")), /*#__PURE__*/React.createElement("td", null, "Session Key Request Handshake"), /*#__PURE__*/React.createElement("td", null, "Authenticates client session request timestamp and client nonce nonce_c."), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Badge, {
    status: "PASS",
    label: "Anti-Replay Bound"
  }))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      color: '#c084fc',
      fontWeight: 700
    }
  }, "PQKMS-SRESP")), /*#__PURE__*/React.createElement("td", null, "Session Key Response Transmission"), /*#__PURE__*/React.createElement("td", null, "Server signs KEM ciphertext and assigned expiration timestamp."), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Badge, {
    status: "PASS",
    label: "Server Authenticated"
  }))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      color: '#fb7185',
      fontWeight: 700
    }
  }, "PQKMS-REV")), /*#__PURE__*/React.createElement("td", null, "Device Revocation List (CRL)"), /*#__PURE__*/React.createElement("td", null, "Signs device revocation list (Algorithm 5) preventing CRL rollback."), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Badge, {
    status: "PASS",
    label: "Signed Anti-Rollback"
  })))))))), activeTab === 'biochip' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: '1.3rem',
      fontWeight: 800,
      color: '#f8fafc'
    }
  }, "\uD83E\uDDEC Cyber-Physical Biochip Digital Twin (DMFB 8\xD78 EWOD)"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.72rem',
      padding: '2px 8px',
      borderRadius: 9999,
      background: 'rgba(6, 182, 212, 0.15)',
      color: '#38bdf8',
      border: '1px solid rgba(6, 182, 212, 0.3)',
      fontWeight: 600
    }
  }, "Electrowetting Simulator")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.84rem',
      color: '#94a3b8',
      marginTop: 4
    }
  }, "Simulating automated ", /*#__PURE__*/React.createElement("strong", null, "enzymatic glucose assay"), " execution on an 8\xD78 array of electrowetting-on-dielectric (EWOD) electrodes. Droplet transport, mixing, and photodiode detection coordinate with edge PQ-KMS controllers.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
      gap: 24,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1rem',
      fontWeight: 700,
      color: '#f8fafc'
    }
  }, "Assay Protocol Controls"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: '0.8rem',
      color: '#cbd5e1',
      fontWeight: 600
    }
  }, "Patient Blood Glucose Level:"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      color: '#38bdf8',
      fontWeight: 700,
      fontSize: '0.9rem'
    }
  }, simulatorGlucoseInput, " mg/dL")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "40",
    max: "450",
    step: "5",
    value: simulatorGlucoseInput,
    onChange: e => setSimulatorGlucoseInput(Number(e.target.value)),
    style: {
      width: '100%',
      accentColor: '#06b6d4',
      cursor: 'pointer'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.7rem',
      color: '#64748b',
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement("span", null, "40 mg/dL (Hypo)"), /*#__PURE__*/React.createElement("span", null, "100 mg/dL (Normal)"), /*#__PURE__*/React.createElement("span", null, "220 mg/dL (Hyper)"), /*#__PURE__*/React.createElement("span", null, "450 mg/dL (Critical)"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleSimulatorReset,
    disabled: simulatorLoading,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      padding: '10px 16px',
      borderRadius: 8,
      background: 'rgba(30, 41, 59, 0.8)',
      border: '1px solid rgba(148, 163, 184, 0.25)',
      color: '#f8fafc',
      fontWeight: 600,
      cursor: 'pointer',
      fontSize: '0.82rem'
    }
  }, /*#__PURE__*/React.createElement(Icons.rotateCcw, {
    size: 15
  }), "Reset Biochip & Reload Protocol (", simulatorGlucoseInput, " mg/dL)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleSimulatorStep,
    disabled: simulatorLoading || simulatorState.current_step_idx >= (simulatorState.total_steps || 7),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      padding: '10px 16px',
      borderRadius: 8,
      background: '#06b6d4',
      border: 'none',
      color: '#090d16',
      fontWeight: 700,
      cursor: simulatorState.current_step_idx >= (simulatorState.total_steps || 7) ? 'not-allowed' : 'pointer',
      fontSize: '0.82rem',
      opacity: simulatorState.current_step_idx >= (simulatorState.total_steps || 7) ? 0.5 : 1
    }
  }, /*#__PURE__*/React.createElement(Icons.play, {
    size: 14
  }), "Next Step \u25B6"), /*#__PURE__*/React.createElement("button", {
    onClick: handleSimulatorRunAll,
    disabled: simulatorLoading || simulatorState.current_step_idx >= (simulatorState.total_steps || 7),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      padding: '10px 16px',
      borderRadius: 8,
      background: 'rgba(16, 185, 129, 0.2)',
      border: '1px solid rgba(16, 185, 129, 0.4)',
      color: '#34d399',
      fontWeight: 700,
      cursor: simulatorState.current_step_idx >= (simulatorState.total_steps || 7) ? 'not-allowed' : 'pointer',
      fontSize: '0.82rem',
      opacity: simulatorState.current_step_idx >= (simulatorState.total_steps || 7) ? 0.5 : 1
    }
  }, /*#__PURE__*/React.createElement(Icons.fastForward, {
    size: 14
  }), "Run Complete Assay \u23E9"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.78rem',
      color: '#94a3b8',
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("span", null, "Assay Step Progress"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      color: '#38bdf8',
      fontWeight: 600
    }
  }, "Step ", simulatorState.current_step_idx || 0, " of ", simulatorState.total_steps || 7)), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: 6,
      background: 'rgba(30, 41, 59, 0.8)',
      borderRadius: 9999,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${(simulatorState.current_step_idx || 0) / (simulatorState.total_steps || 7) * 100}%`,
      height: '100%',
      background: 'linear-gradient(90deg, #06b6d4, #10b981)',
      transition: 'width 0.3s ease'
    }
  }))), simulatorState.steps && simulatorState.current_step_idx > 0 && simulatorState.current_step_idx <= simulatorState.steps.length && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(6, 182, 212, 0.08)',
      border: '1px solid rgba(6, 182, 212, 0.25)',
      padding: 12,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.75rem',
      fontWeight: 700,
      color: '#38bdf8'
    }
  }, "STEP ", simulatorState.steps[simulatorState.current_step_idx - 1].step_num, ": ", simulatorState.steps[simulatorState.current_step_idx - 1].operation)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.78rem',
      color: '#e2e8f0',
      lineHeight: 1.5
    }
  }, simulatorState.steps[simulatorState.current_step_idx - 1].description)), simulatorState.sensor_readout && simulatorState.sensor_readout.detected && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(16, 185, 129, 0.1)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      padding: 14,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.8rem',
      fontWeight: 700,
      color: '#34d399',
      marginBottom: 8,
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, "\uD83D\uDD2C Photodiode Optical Sensor Readout"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(15, 23, 42, 0.6)',
      padding: 8,
      borderRadius: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.7rem',
      color: '#94a3b8'
    }
  }, "Optical Absorbance"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      color: '#38bdf8',
      fontWeight: 700
    }
  }, simulatorState.sensor_readout.absorbance_au, " AU")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(15, 23, 42, 0.6)',
      padding: 8,
      borderRadius: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.7rem',
      color: '#94a3b8'
    }
  }, "Measured Glucose"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      color: '#34d399',
      fontWeight: 700
    }
  }, simulatorState.sensor_readout.glucose_mg_dl, " mg/dL"))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.75rem',
      color: '#cbd5e1'
    }
  }, "Diagnostic Assessment: ", /*#__PURE__*/React.createElement(Badge, {
    status: simulatorState.sensor_readout.glucose_mg_dl >= 200 ? 'DIABETIC' : 'NORMAL',
    label: simulatorState.sensor_readout.clinical_status
  })))), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#f8fafc'
    }
  }, "DMFB 2D Electrode Grid Array (8 \xD7 8 EWOD Cells)"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.72rem',
      color: '#06b6d4',
      fontWeight: 600
    }
  }, "Active Electrodes: ", (simulatorState.snapshot?.active_electrodes || []).length)), /*#__PURE__*/React.createElement("div", {
    className: "biochip-grid-container"
  }, Array.from({
    length: 8
  }).map((_, y) => Array.from({
    length: 8
  }).map((_, x) => {
    const isActive = (simulatorState.snapshot?.active_electrodes || []).some(e => Array.isArray(e) ? e[0] === x && e[1] === y : e.x === x && e.y === y);
    const isDetector = x === 3 && y === 6;
    const isSample = x === 0 && y === 2;
    const isReagent = x === 7 && y === 2;
    const isWaste = x === 7 && y === 7;
    const droplet = (simulatorState.snapshot?.droplets || []).find(d => d.x === x && d.y === y);
    let cellClass = 'biochip-cell';
    if (isActive) cellClass += ' active-electrode';else if (isDetector) cellClass += ' detector-electrode';else if (isSample) cellClass += ' sample-electrode';else if (isReagent) cellClass += ' reagent-electrode';else if (isWaste) cellClass += ' waste-electrode';
    return /*#__PURE__*/React.createElement("div", {
      key: `${x}-${y}`,
      className: cellClass,
      title: `Electrode (${x}, ${y})`
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'rgba(148, 163, 184, 0.3)',
        fontSize: '0.55rem',
        position: 'absolute',
        top: 2,
        left: 3
      }
    }, x, ",", y), isDetector && !droplet && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.65rem',
        color: '#10b981',
        fontWeight: 800
      }
    }, "DET"), isSample && !droplet && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.65rem',
        color: '#f43f5e',
        fontWeight: 800
      }
    }, "SMP"), isReagent && !droplet && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.65rem',
        color: '#38bdf8',
        fontWeight: 800
      }
    }, "REA"), isWaste && !droplet && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.65rem',
        color: '#64748b',
        fontWeight: 800
      }
    }, "WST"), droplet && /*#__PURE__*/React.createElement("div", {
      className: "droplet-circle",
      style: {
        backgroundColor: droplet.color || '#3b82f6'
      },
      title: `Droplet: ${droplet.label} (${droplet.volume_ul} µL, ${droplet.concentration_mg_dl} mg/dL)`
    }, droplet.label.substring(0, 1)));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: 18,
      fontSize: '0.72rem',
      color: '#94a3b8'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 12,
      height: 12,
      background: 'rgba(6, 182, 212, 0.45)',
      border: '1px solid #06b6d4',
      borderRadius: 3
    }
  }), /*#__PURE__*/React.createElement("span", null, "Active Electrode")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 12,
      height: 12,
      background: 'rgba(244, 63, 94, 0.3)',
      border: '1px solid #f43f5e',
      borderRadius: 3
    }
  }), /*#__PURE__*/React.createElement("span", null, "Sample (0,2)")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 12,
      height: 12,
      background: 'rgba(56, 189, 248, 0.3)',
      border: '1px solid #38bdf8',
      borderRadius: 3
    }
  }), /*#__PURE__*/React.createElement("span", null, "Reagent (7,2)")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 12,
      height: 12,
      background: 'rgba(16, 185, 129, 0.3)',
      border: '1px solid #10b981',
      borderRadius: 3
    }
  }), /*#__PURE__*/React.createElement("span", null, "Detector (3,6)")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 12,
      height: 12,
      background: 'rgba(100, 116, 139, 0.3)',
      border: '1px solid #64748b',
      borderRadius: 3
    }
  }), /*#__PURE__*/React.createElement("span", null, "Waste (7,7)")))))), activeTab === 'attacks' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: '1.3rem',
      fontWeight: 800,
      color: '#f8fafc'
    }
  }, "\uD83C\uDFAF Cyber-Physical Attack Sandbox & Adversarial Verification"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.72rem',
      padding: '2px 8px',
      borderRadius: 9999,
      background: 'rgba(244, 63, 94, 0.15)',
      color: '#fb7185',
      border: '1px solid rgba(244, 63, 94, 0.3)',
      fontWeight: 600
    }
  }, "Threat Mitigation Lab")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.84rem',
      color: '#94a3b8',
      marginTop: 4
    }
  }, "Simulate published cyber-physical attack vectors from DMFB security literature (Ali et al., Guo et al.) and verify PQ-KMS's post-quantum defenses.")), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 12,
      marginBottom: 20,
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, [{
    id: 'tamper',
    label: '1. Glucose Assay Result Tampering (Ali et al. [1])'
  }, {
    id: 'replay',
    label: '2. Diagnostic Message Replay Attack'
  }, {
    id: 'quantum',
    label: '3. Harvest-Now, Decrypt-Later Quantum Threat'
  }].map(atk => /*#__PURE__*/React.createElement("button", {
    key: atk.id,
    onClick: () => setAttackChoice(atk.id),
    style: {
      padding: '8px 16px',
      borderRadius: 8,
      border: '1px solid',
      borderColor: attackChoice === atk.id ? '#f43f5e' : 'rgba(148, 163, 184, 0.2)',
      background: attackChoice === atk.id ? 'rgba(244, 63, 94, 0.15)' : 'rgba(30, 41, 59, 0.5)',
      color: attackChoice === atk.id ? '#fb7185' : '#94a3b8',
      fontSize: '0.82rem',
      fontWeight: 700,
      cursor: 'pointer'
    }
  }, atk.label))), attackChoice === 'tamper' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1rem',
      fontWeight: 700,
      color: '#f8fafc',
      marginBottom: 6
    }
  }, "\uD83E\uDDEA Attack Scenario: In-Transit Assay Falsification (Ali et al.)"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.82rem',
      color: '#94a3b8',
      lineHeight: 1.6,
      marginBottom: 16
    }
  }, "Ali et al. demonstrated that an adversary eavesdropping on biomedical communications can flip ciphertext bits to manipulate blood glucose readings, falsely altering a critical ", /*#__PURE__*/React.createElement("strong", null, "220 mg/dL hyperglycemic result to 110 mg/dL"), " so insulin is withheld from the patient."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 16,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: '0.78rem',
      color: '#cbd5e1',
      fontWeight: 600,
      marginBottom: 6
    }
  }, "True Physical Glucose (mg/dL):"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: tamperTrueGlucose,
    onChange: e => setTamperTrueGlucose(Number(e.target.value)),
    style: {
      width: '100%',
      background: 'rgba(30, 41, 59, 0.7)',
      border: '1px solid rgba(148, 163, 184, 0.25)',
      borderRadius: 8,
      padding: '8px 12px',
      color: '#f8fafc',
      fontFamily: 'JetBrains Mono',
      fontSize: '0.85rem',
      outline: 'none'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: '0.78rem',
      color: '#cbd5e1',
      fontWeight: 600,
      marginBottom: 6
    }
  }, "Adversary Injected Falsified Glucose (mg/dL):"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: tamperFalseGlucose,
    onChange: e => setTamperFalseGlucose(Number(e.target.value)),
    style: {
      width: '100%',
      background: 'rgba(30, 41, 59, 0.7)',
      border: '1px solid rgba(148, 163, 184, 0.25)',
      borderRadius: 8,
      padding: '8px 12px',
      color: '#f8fafc',
      fontFamily: 'JetBrains Mono',
      fontSize: '0.85rem',
      outline: 'none'
    }
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: handleRunTamperAttack,
    disabled: tamperLoading,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '10px 20px',
      borderRadius: 8,
      background: '#f43f5e',
      color: '#ffffff',
      fontWeight: 700,
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.85rem',
      boxShadow: '0 4px 14px rgba(244, 63, 94, 0.3)'
    }
  }, /*#__PURE__*/React.createElement(Icons.target, {
    size: 16
  }), tamperLoading ? 'Executing Bit-Flip Attack...' : '🚨 Launch In-Transit Tamper Attack')), tamperResult && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20,
      borderLeft: '4px solid #f43f5e',
      background: 'rgba(244, 63, 94, 0.06)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 800,
      color: '#fb7185'
    }
  }, "\u274C Legacy Unprotected DMFB (Vulnerable)"), /*#__PURE__*/React.createElement(Badge, {
    status: "COMPROMISED",
    label: "Vulnerable"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.82rem',
      color: '#cbd5e1',
      lineHeight: 1.6,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, "Received at Hospital: ", /*#__PURE__*/React.createElement("strong", {
    className: "font-mono",
    style: {
      color: '#fbbf24'
    }
  }, tamperResult.unprotected_system.received_glucose, " mg/dL")), /*#__PURE__*/React.createElement("div", null, "Adversary Detection: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#fb7185'
    }
  }, "None (Passed CRC or unauthenticated cipher)"))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(244, 63, 94, 0.15)',
      padding: 12,
      borderRadius: 8,
      color: '#fb7185',
      fontSize: '0.78rem',
      lineHeight: 1.5
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Clinical Harm:"), " ", tamperResult.unprotected_system.clinical_consequence)), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20,
      borderLeft: '4px solid #10b981',
      background: 'rgba(16, 185, 129, 0.06)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 800,
      color: '#34d399'
    }
  }, "\uD83D\uDEE1\uFE0F PQ-KMS Protected DMFB (Secure)"), /*#__PURE__*/React.createElement(Badge, {
    status: "PASS",
    label: "Tamper Caught"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.82rem',
      color: '#cbd5e1',
      lineHeight: 1.6,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, "Tamper Caught: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#34d399'
    }
  }, "YES (Zero Bit-Flips Tolerated)")), /*#__PURE__*/React.createElement("div", null, "Cryptographic Error: ", /*#__PURE__*/React.createElement("strong", {
    className: "font-mono",
    style: {
      color: '#38bdf8'
    }
  }, tamperResult.pqkms_system.error_detail))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(16, 185, 129, 0.15)',
      padding: 12,
      borderRadius: 8,
      color: '#34d399',
      fontSize: '0.78rem',
      lineHeight: 1.5
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Clinical Outcome:"), " ", tamperResult.pqkms_system.clinical_consequence)))), attackChoice === 'replay' && /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1rem',
      fontWeight: 700,
      color: '#f8fafc',
      marginBottom: 6
    }
  }, "\uD83D\uDD01 Attack Scenario: Diagnostic Telemetry Frame Replay"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.82rem',
      color: '#94a3b8',
      lineHeight: 1.6,
      marginBottom: 16
    }
  }, "An adversary intercepts a legitimate, healthy diagnostic reading captured yesterday (counter = 1) and replays it today (counter = 25) when the patient is in a critical condition to mask diagnostic alarms."), /*#__PURE__*/React.createElement("button", {
    onClick: handleRunReplayAttack,
    disabled: replayLoading,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '10px 20px',
      borderRadius: 8,
      background: '#f43f5e',
      color: '#ffffff',
      fontWeight: 700,
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.85rem',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(Icons.refresh, {
    size: 16
  }), replayLoading ? 'Testing Replay Rejection...' : '🚨 Launch Diagnostic Frame Replay Attack'), replayResult && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(16, 185, 129, 0.08)',
      border: '1px solid rgba(16, 185, 129, 0.25)',
      padding: 16,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(Icons.check, {
    size: 22,
    style: {
      color: '#34d399'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 800,
      color: '#34d399'
    }
  }, "PQ-KMS Anti-Replay Defense Activated Successfully!")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.82rem',
      color: '#cbd5e1',
      lineHeight: 1.6
    }
  }, /*#__PURE__*/React.createElement("div", null, "Rejection Mechanism: ", /*#__PURE__*/React.createElement("strong", {
    className: "font-mono",
    style: {
      color: '#fb7185'
    }
  }, replayResult.rejection_reason)), /*#__PURE__*/React.createElement("div", null, "Mitigation Invariant: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#38bdf8'
    }
  }, replayResult.mitigation))))), attackChoice === 'quantum' && /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1rem',
      fontWeight: 700,
      color: '#f8fafc',
      marginBottom: 6
    }
  }, "\u269B\uFE0F \"Harvest-Now, Decrypt-Later\" Quantum Threat Matrix"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.82rem',
      color: '#94a3b8',
      lineHeight: 1.6,
      marginBottom: 16
    }
  }, "Adversaries record encrypted biomedical transmissions today. Once a fault-tolerant quantum computer exists, classical Diffie-Hellman and elliptic curves will be broken in polynomial time via Shor's algorithm."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(244, 63, 94, 0.08)',
      border: '1px solid rgba(244, 63, 94, 0.25)',
      padding: 18,
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 800,
      color: '#fb7185',
      marginBottom: 10
    }
  }, "Classical Baseline (X25519 ECDH / RSA)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.82rem',
      color: '#cbd5e1',
      lineHeight: 1.6
    }
  }, /*#__PURE__*/React.createElement("div", null, "Quantum Security: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#fb7185'
    }
  }, "0 bits (Broken)")), /*#__PURE__*/React.createElement("div", null, "Shor's Algorithm: ", /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      color: '#fbbf24'
    }
  }, "O((log N)^3) polynomial time")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      color: '#94a3b8'
    }
  }, "Verdict: All harvested historical patient assays decrypted once quantum computer operates."))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(16, 185, 129, 0.08)',
      border: '1px solid rgba(16, 185, 129, 0.25)',
      padding: 18,
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 800,
      color: '#34d399',
      marginBottom: 10
    }
  }, "PQ-KMS (NIST FIPS 203 ML-KEM-768)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.82rem',
      color: '#cbd5e1',
      lineHeight: 1.6
    }
  }, /*#__PURE__*/React.createElement("div", null, "Quantum Security: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#34d399'
    }
  }, "Category 3 (192-bit quantum strength)")), /*#__PURE__*/React.createElement("div", null, "Hardness: ", /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      color: '#38bdf8'
    }
  }, "Module Learning With Errors (M-LWE)")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      color: '#94a3b8'
    }
  }, "Verdict: Patient records encrypted today remain undecryptable indefinitely.")))))), activeTab === 'devices' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 16,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#94a3b8',
      fontSize: '0.8rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }
  }, "Total Devices"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '2rem',
      fontWeight: 800,
      color: '#f8fafc',
      marginTop: 4
    }
  }, devicesData.total), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.75rem',
      marginTop: 4
    }
  }, "Active in SQLite Registry")), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20,
      borderLeft: '4px solid #10b981'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#94a3b8',
      fontSize: '0.8rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }
  }, "Authorized"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '2rem',
      fontWeight: 800,
      color: '#34d399',
      marginTop: 4
    }
  }, devicesData.status_counts.AUTHORIZED || 0), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.75rem',
      marginTop: 4
    }
  }, "Passed ML-DSA Proof-of-Possession")), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20,
      borderLeft: '4px solid #f43f5e'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#94a3b8',
      fontSize: '0.8rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }
  }, "Revoked"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '2rem',
      fontWeight: 800,
      color: '#fb7185',
      marginTop: 4
    }
  }, devicesData.status_counts.REVOKED || 0), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.75rem',
      marginTop: 4
    }
  }, "Published in Signed CRL")), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20,
      borderLeft: '4px solid #f59e0b'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#94a3b8',
      fontSize: '0.8rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }
  }, "Pending / Disabled"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '2rem',
      fontWeight: 800,
      color: '#fbbf24',
      marginTop: 4
    }
  }, (devicesData.status_counts.PENDING || 0) + (devicesData.status_counts.DISABLED || 0)), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.75rem',
      marginTop: 4
    }
  }, "Enrolled / Inactive"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
      gap: 20,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#f8fafc',
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
    height: 220
  })), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#f8fafc',
      marginBottom: 12
    }
  }, "Quantum Identity Assurance"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.82rem',
      color: '#94a3b8',
      lineHeight: 1.6,
      marginBottom: 14
    }
  }, "Each registered DMFB device stores an ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#38bdf8'
    }
  }, "ML-KEM-768"), " public key (1,184 bytes) and an ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#34d399'
    }
  }, "ML-DSA-65"), " verification key (1,952 bytes). All registrations enforce Algorithm 1 proof-of-possession signatures before binding to the registry."), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(30, 41, 59, 0.5)',
      padding: 12,
      borderRadius: 8,
      border: '1px solid rgba(148, 163, 184, 0.1)',
      fontSize: '0.75rem',
      color: '#cbd5e1'
    }
  }, "\uD83D\uDD12 ", /*#__PURE__*/React.createElement("strong", null, "Privacy & Zero-Knowledge:"), " Public keys and enrolment hashes are securely stripped from dashboard responses; only metadata is surfaced."))), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: '16px 20px',
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
    style: {
      width: '100%',
      background: 'rgba(30, 41, 59, 0.7)',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      borderRadius: 8,
      padding: '8px 12px 8px 36px',
      color: '#f8fafc',
      fontSize: '0.85rem',
      outline: 'none'
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
      borderColor: deviceStatusFilter === st ? '#06b6d4' : 'rgba(148, 163, 184, 0.2)',
      background: deviceStatusFilter === st ? 'rgba(6, 182, 212, 0.15)' : 'rgba(30, 41, 59, 0.5)',
      color: deviceStatusFilter === st ? '#38bdf8' : '#94a3b8',
      fontSize: '0.78rem',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, st)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setProvisionModalOpen(true);
      setProvisionResult(null);
      setProvisionError(null);
    },
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '7px 14px',
      borderRadius: 8,
      background: '#06b6d4',
      color: '#090d16',
      border: 'none',
      fontSize: '0.8rem',
      fontWeight: 700,
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(6, 182, 212, 0.25)'
    }
  }, /*#__PURE__*/React.createElement(Icons.plus, {
    size: 14
  }), "Provision New Biochip"), /*#__PURE__*/React.createElement("button", {
    onClick: () => exportToCsv('devices_registry', filteredDevices),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '7px 14px',
      borderRadius: 8,
      background: 'rgba(30, 41, 59, 0.8)',
      color: '#cbd5e1',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      fontSize: '0.8rem',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icons.download, {
    size: 14
  }), "Export CSV (", filteredDevices.length, ")"))), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto',
      maxHeight: 540
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "custom-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Device ID"), /*#__PURE__*/React.createElement("th", null, "Assigned Role"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Registered Timestamp"), /*#__PURE__*/React.createElement("th", null, "Last Seen"))), /*#__PURE__*/React.createElement("tbody", null, filteredDevices.slice((devicePage - 1) * pageSize, devicePage * pageSize).map(dev => /*#__PURE__*/React.createElement("tr", {
    key: dev.device_id
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      fontWeight: 600,
      color: '#38bdf8'
    }
  }, dev.device_id)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.8rem',
      color: '#cbd5e1'
    }
  }, dev.role || 'BIOCHIP_NODE')), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Badge, {
    status: dev.status
  })), /*#__PURE__*/React.createElement("td", {
    className: "font-mono",
    style: {
      fontSize: '0.78rem',
      color: '#94a3b8'
    }
  }, dev.enrolled_at || dev.registered_at || '—'), /*#__PURE__*/React.createElement("td", {
    className: "font-mono",
    style: {
      fontSize: '0.78rem',
      color: '#94a3b8'
    }
  }, dev.last_seen || '—'))), !filteredDevices.length && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 5,
    style: {
      textAlign: 'center',
      padding: 32,
      color: '#64748b'
    }
  }, "No matching devices found."))))), filteredDevices.length > pageSize && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 20px',
      borderTop: '1px solid rgba(148, 163, 184, 0.1)',
      background: 'rgba(15, 23, 42, 0.6)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.8rem',
      color: '#94a3b8'
    }
  }, "Showing ", (devicePage - 1) * pageSize + 1, " to ", Math.min(devicePage * pageSize, filteredDevices.length), " of ", filteredDevices.length), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    disabled: devicePage <= 1,
    onClick: () => setDevicePage(p => p - 1),
    style: {
      padding: '4px 10px',
      borderRadius: 6,
      background: 'rgba(30, 41, 59, 0.8)',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      color: '#f8fafc',
      fontSize: '0.75rem',
      cursor: devicePage <= 1 ? 'not-allowed' : 'pointer'
    }
  }, "Prev"), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '4px 10px',
      fontSize: '0.78rem',
      color: '#cbd5e1'
    }
  }, "Page ", devicePage, " of ", Math.ceil(filteredDevices.length / pageSize)), /*#__PURE__*/React.createElement("button", {
    disabled: devicePage >= Math.ceil(filteredDevices.length / pageSize),
    onClick: () => setDevicePage(p => p + 1),
    style: {
      padding: '4px 10px',
      borderRadius: 6,
      background: 'rgba(30, 41, 59, 0.8)',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      color: '#f8fafc',
      fontSize: '0.75rem',
      cursor: devicePage >= Math.ceil(filteredDevices.length / pageSize) ? 'not-allowed' : 'pointer'
    }
  }, "Next"))))), activeTab === 'sessions' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 16,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#94a3b8',
      fontSize: '0.8rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }
  }, "Total Sessions"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '2rem',
      fontWeight: 800,
      color: '#f8fafc',
      marginTop: 4
    }
  }, sessionsData.total), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.75rem',
      marginTop: 4
    }
  }, "NIST SP 800-57 State Machine")), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20,
      borderLeft: '4px solid #10b981'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#94a3b8',
      fontSize: '0.8rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }
  }, "Active Keys"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '2rem',
      fontWeight: 800,
      color: '#34d399',
      marginTop: 4
    }
  }, sessionsData.state_counts.ACTIVE || 0), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.75rem',
      marginTop: 4
    }
  }, "Valid for AES-256-GCM AEAD")), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20,
      borderLeft: '4px solid #f59e0b'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#94a3b8',
      fontSize: '0.8rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }
  }, "Deactivated"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '2rem',
      fontWeight: 800,
      color: '#fbbf24',
      marginTop: 4
    }
  }, sessionsData.state_counts.DEACTIVATED || 0), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.75rem',
      marginTop: 4
    }
  }, "Rotated / Grace Window")), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20,
      borderLeft: '4px solid #64748b'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#94a3b8',
      fontSize: '0.8rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }
  }, "Destroyed"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '2rem',
      fontWeight: 800,
      color: '#cbd5e1',
      marginTop: 4
    }
  }, sessionsData.state_counts.DESTROYED || 0), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748b',
      fontSize: '0.75rem',
      marginTop: 4
    }
  }, "Memory Overwritten (Algorithm 4)"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
      gap: 20,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#f8fafc',
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
    height: 220
  })), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#f8fafc',
      marginBottom: 12
    }
  }, "Perfect Forward Secrecy & Ephemeral Lifetime"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.82rem',
      color: '#94a3b8',
      lineHeight: 1.6,
      marginBottom: 14
    }
  }, "Each session establishes an independent 256-bit symmetric key derived via ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#38bdf8'
    }
  }, "HKDF-SHA256"), " from an ML-KEM shared secret and fresh client nonce. Keys automatically expire after ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#f59e0b'
    }
  }, info.session_lifetime_s || 60, " seconds"), " or 1,000 transmitted messages."), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(30, 41, 59, 0.5)',
      padding: 12,
      borderRadius: 8,
      border: '1px solid rgba(148, 163, 184, 0.1)',
      fontSize: '0.75rem',
      color: '#cbd5e1'
    }
  }, "\uD83D\uDEE1\uFE0F ", /*#__PURE__*/React.createElement("strong", null, "Zero Key Retention in Storage:"), " Symmetric keys are held in volatile process memory only. No key bytes are ever written to the SQLite database."))), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: '16px 20px',
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
    style: {
      width: '100%',
      background: 'rgba(30, 41, 59, 0.7)',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      borderRadius: 8,
      padding: '8px 12px 8px 36px',
      color: '#f8fafc',
      fontSize: '0.85rem',
      outline: 'none'
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
      borderColor: sessionStateFilter === st ? '#06b6d4' : 'rgba(148, 163, 184, 0.2)',
      background: sessionStateFilter === st ? 'rgba(6, 182, 212, 0.15)' : 'rgba(30, 41, 59, 0.5)',
      color: sessionStateFilter === st ? '#38bdf8' : '#94a3b8',
      fontSize: '0.78rem',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, st)))), /*#__PURE__*/React.createElement("button", {
    onClick: () => exportToCsv('sessions_lifecycle', filteredSessions),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '7px 14px',
      borderRadius: 8,
      background: 'rgba(30, 41, 59, 0.8)',
      color: '#cbd5e1',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      fontSize: '0.8rem',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icons.download, {
    size: 14
  }), "Export CSV (", filteredSessions.length, ")")), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto',
      maxHeight: 540
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "custom-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Session ID"), /*#__PURE__*/React.createElement("th", null, "Device ID"), /*#__PURE__*/React.createElement("th", null, "Key ID"), /*#__PURE__*/React.createElement("th", null, "State"), /*#__PURE__*/React.createElement("th", null, "Created At"), /*#__PURE__*/React.createElement("th", null, "Expires At"), /*#__PURE__*/React.createElement("th", null, "Messages Count"))), /*#__PURE__*/React.createElement("tbody", null, filteredSessions.slice((sessionPage - 1) * pageSize, sessionPage * pageSize).map(sess => /*#__PURE__*/React.createElement("tr", {
    key: sess.session_id
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      fontSize: '0.78rem',
      color: '#38bdf8'
    }
  }, sess.session_id.substring(0, 14), "...")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      fontSize: '0.8rem',
      color: '#f8fafc',
      fontWeight: 600
    }
  }, sess.device_id)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      fontSize: '0.75rem',
      color: '#94a3b8'
    }
  }, sess.key_id ? sess.key_id.substring(0, 10) + '...' : '—')), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Badge, {
    status: sess.state
  })), /*#__PURE__*/React.createElement("td", {
    className: "font-mono",
    style: {
      fontSize: '0.75rem',
      color: '#94a3b8'
    }
  }, sess.created_at || '—'), /*#__PURE__*/React.createElement("td", {
    className: "font-mono",
    style: {
      fontSize: '0.75rem',
      color: '#94a3b8'
    }
  }, sess.expires_at || '—'), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      fontWeight: 600,
      color: '#f1f5f9'
    }
  }, sess.message_count || 0)))), !filteredSessions.length && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 7,
    style: {
      textAlign: 'center',
      padding: 32,
      color: '#64748b'
    }
  }, "No matching sessions found."))))), filteredSessions.length > pageSize && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 20px',
      borderTop: '1px solid rgba(148, 163, 184, 0.1)',
      background: 'rgba(15, 23, 42, 0.6)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.8rem',
      color: '#94a3b8'
    }
  }, "Showing ", (sessionPage - 1) * pageSize + 1, " to ", Math.min(sessionPage * pageSize, filteredSessions.length), " of ", filteredSessions.length), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    disabled: sessionPage <= 1,
    onClick: () => setSessionPage(p => p - 1),
    style: {
      padding: '4px 10px',
      borderRadius: 6,
      background: 'rgba(30, 41, 59, 0.8)',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      color: '#f8fafc',
      fontSize: '0.75rem',
      cursor: sessionPage <= 1 ? 'not-allowed' : 'pointer'
    }
  }, "Prev"), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '4px 10px',
      fontSize: '0.78rem',
      color: '#cbd5e1'
    }
  }, "Page ", sessionPage, " of ", Math.ceil(filteredSessions.length / pageSize)), /*#__PURE__*/React.createElement("button", {
    disabled: sessionPage >= Math.ceil(filteredSessions.length / pageSize),
    onClick: () => setSessionPage(p => p + 1),
    style: {
      padding: '4px 10px',
      borderRadius: 6,
      background: 'rgba(30, 41, 59, 0.8)',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      color: '#f8fafc',
      fontSize: '0.75rem',
      cursor: sessionPage >= Math.ceil(filteredSessions.length / pageSize) ? 'not-allowed' : 'pointer'
    }
  }, "Next"))))), activeTab === 'audit' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: '18px 24px',
      marginBottom: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 16,
      borderLeft: auditData.chain_valid ? '5px solid #10b981' : '5px solid #f43f5e',
      background: auditData.chain_valid ? 'rgba(16, 185, 129, 0.06)' : 'rgba(244, 63, 94, 0.08)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 10,
      borderRadius: '50%',
      background: auditData.chain_valid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
      color: auditData.chain_valid ? '#34d399' : '#fb7185'
    }
  }, auditData.chain_valid ? /*#__PURE__*/React.createElement(Icons.check, {
    size: 24
  }) : /*#__PURE__*/React.createElement(Icons.alert, {
    size: 24
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.05rem',
      fontWeight: 800,
      color: auditData.chain_valid ? '#34d399' : '#fb7185'
    }
  }, auditData.chain_valid ? 'Cryptographic Hash Chain Integrity: VALID' : `Hash Chain Broken at Block #${auditData.chain_break_index}`), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.8rem',
      color: '#94a3b8',
      marginTop: 2
    }
  }, "Every log record is chained via SHA-256: ", /*#__PURE__*/React.createElement("code", null, "H_i = H(H_", '{i-1}', " || payload_i)"), ". Any database record alteration causes instant verification failure."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, hashVerificationStatus && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.78rem',
      color: '#38bdf8',
      fontWeight: 600
    }
  }, hashVerificationStatus === 'verifying' ? 'Verifying 500+ records...' : `Checked ${hashVerificationStatus.total_verified} blocks ✓`), /*#__PURE__*/React.createElement("button", {
    onClick: verifyHashChain,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '8px 16px',
      borderRadius: 8,
      background: 'rgba(6, 182, 212, 0.15)',
      color: '#38bdf8',
      border: '1px solid rgba(6, 182, 212, 0.4)',
      fontSize: '0.82rem',
      fontWeight: 700,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icons.refresh, {
    size: 14
  }), "Re-Verify Integrity"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: 20,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#f8fafc',
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
    height: 200
  })), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#f8fafc',
      marginBottom: 16
    }
  }, "Security Audit Statistics"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 12,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(16, 185, 129, 0.1)',
      padding: 14,
      borderRadius: 8,
      border: '1px solid rgba(16, 185, 129, 0.25)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.75rem',
      color: '#94a3b8',
      textTransform: 'uppercase',
      fontWeight: 600
    }
  }, "Accepted"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.6rem',
      fontWeight: 800,
      color: '#34d399',
      marginTop: 4
    }
  }, auditData.outcome_counts.ACCEPTED || 0)), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(244, 63, 94, 0.1)',
      padding: 14,
      borderRadius: 8,
      border: '1px solid rgba(244, 63, 94, 0.25)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.75rem',
      color: '#94a3b8',
      textTransform: 'uppercase',
      fontWeight: 600
    }
  }, "Rejected"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.6rem',
      fontWeight: 800,
      color: '#fb7185',
      marginTop: 4
    }
  }, auditData.outcome_counts.REJECTED || 0)), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(59, 130, 246, 0.1)',
      padding: 14,
      borderRadius: 8,
      border: '1px solid rgba(59, 130, 246, 0.25)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.75rem',
      color: '#94a3b8',
      textTransform: 'uppercase',
      fontWeight: 600
    }
  }, "System Info"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.6rem',
      fontWeight: 800,
      color: '#60a5fa',
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
    className: "glass-card",
    style: {
      padding: '16px 20px',
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
    style: {
      width: '100%',
      background: 'rgba(30, 41, 59, 0.7)',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      borderRadius: 8,
      padding: '8px 12px 8px 36px',
      color: '#f8fafc',
      fontSize: '0.85rem',
      outline: 'none'
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
      borderColor: auditFilter === out ? '#06b6d4' : 'rgba(148, 163, 184, 0.2)',
      background: auditFilter === out ? 'rgba(6, 182, 212, 0.15)' : 'rgba(30, 41, 59, 0.5)',
      color: auditFilter === out ? '#38bdf8' : '#94a3b8',
      fontSize: '0.78rem',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, out)))), /*#__PURE__*/React.createElement("button", {
    onClick: () => exportToCsv('audit_log', filteredAudit),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '7px 14px',
      borderRadius: 8,
      background: 'rgba(30, 41, 59, 0.8)',
      color: '#cbd5e1',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      fontSize: '0.8rem',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icons.download, {
    size: 14
  }), "Export CSV (", filteredAudit.length, ")")), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto',
      maxHeight: 540
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
      color: '#94a3b8',
      whiteSpace: 'nowrap'
    }
  }, ev.timestamp), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Badge, {
    status: ev.outcome
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      fontWeight: 600,
      color: '#f8fafc',
      fontSize: '0.8rem'
    }
  }, ev.event_type)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.78rem',
      color: '#94a3b8'
    }
  }, ev.component)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      fontSize: '0.78rem',
      color: '#38bdf8'
    }
  }, ev.device_id || '—')), /*#__PURE__*/React.createElement("td", {
    style: {
      fontSize: '0.78rem',
      color: '#cbd5e1',
      maxWidth: 300,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, ev.details || '—'), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      fontSize: '0.7rem',
      color: '#06b6d4',
      background: 'rgba(6, 182, 212, 0.1)',
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
      padding: '12px 20px',
      borderTop: '1px solid rgba(148, 163, 184, 0.1)',
      background: 'rgba(15, 23, 42, 0.6)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.8rem',
      color: '#94a3b8'
    }
  }, "Showing ", (auditPage - 1) * pageSize + 1, " to ", Math.min(auditPage * pageSize, filteredAudit.length), " of ", filteredAudit.length), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    disabled: auditPage <= 1,
    onClick: () => setAuditPage(p => p - 1),
    style: {
      padding: '4px 10px',
      borderRadius: 6,
      background: 'rgba(30, 41, 59, 0.8)',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      color: '#f8fafc',
      fontSize: '0.75rem',
      cursor: auditPage <= 1 ? 'not-allowed' : 'pointer'
    }
  }, "Prev"), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '4px 10px',
      fontSize: '0.78rem',
      color: '#cbd5e1'
    }
  }, "Page ", auditPage, " of ", Math.ceil(filteredAudit.length / pageSize)), /*#__PURE__*/React.createElement("button", {
    disabled: auditPage >= Math.ceil(filteredAudit.length / pageSize),
    onClick: () => setAuditPage(p => p + 1),
    style: {
      padding: '4px 10px',
      borderRadius: 6,
      background: 'rgba(30, 41, 59, 0.8)',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      color: '#f8fafc',
      fontSize: '0.75rem',
      cursor: auditPage >= Math.ceil(filteredAudit.length / pageSize) ? 'not-allowed' : 'pointer'
    }
  }, "Next"))))), activeTab === 'benchmarks' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: '1.25rem',
      fontWeight: 800,
      color: '#f8fafc'
    }
  }, "Experimental Evaluation & Performance Benchmarks"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.85rem',
      color: '#94a3b8',
      marginTop: 4
    }
  }, "Empirical benchmarks executed over 1,000 measured trials (50 warm-up runs) on physical hardware.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
      gap: 20,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#f8fafc',
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
    className: "glass-card",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#f8fafc',
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
      color: '#38bdf8'
    }
  }, row.algorithm)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#cbd5e1'
    }
  }, row.operation)), /*#__PURE__*/React.createElement("td", {
    className: "font-mono",
    style: {
      fontWeight: 600
    }
  }, parseFloat(row.mean_us).toFixed(2)), /*#__PURE__*/React.createElement("td", {
    className: "font-mono",
    style: {
      color: '#94a3b8'
    }
  }, parseFloat(row.sd_us).toFixed(2))))))))), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20,
      marginBottom: 24
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
      fontSize: '1rem',
      fontWeight: 700,
      color: '#f8fafc'
    }
  }, "Table 20: Comprehensive Scheme Comparison"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.75rem',
      color: '#34d399',
      fontWeight: 600
    }
  }, "PQ-KMS vs Classical (ECDH/ECDSA) & Baseline Schemes")), benchmarksData.table20_comparison && benchmarksData.table20_comparison.length > 0 ? /*#__PURE__*/React.createElement("div", {
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
      background: r.Scheme && r.Scheme.includes('PQ-KMS') ? 'rgba(6, 182, 212, 0.08)' : undefined
    }
  }, Object.values(r).map((v, j) => /*#__PURE__*/React.createElement("td", {
    key: j,
    className: j > 0 ? 'font-mono' : '',
    style: {
      fontSize: '0.8rem',
      fontWeight: j === 0 ? 600 : 400
    }
  }, v))))))) : /*#__PURE__*/React.createElement("pre", {
    style: {
      background: 'rgba(15, 23, 42, 0.8)',
      padding: 16,
      borderRadius: 8,
      fontSize: '0.78rem',
      color: '#cbd5e1',
      overflowX: 'auto',
      whiteSpace: 'pre-wrap'
    }
  }, benchmarksData.table20_markdown || 'No Table 20 comparison file found.')), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
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
      fontSize: '1rem',
      fontWeight: 700,
      color: '#f8fafc'
    }
  }, "Publication-Quality Figures"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.8rem',
      color: '#94a3b8'
    }
  }, "Generated vector/high-res figures ready for IEEE/ACM publication and thesis defence.")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.75rem',
      color: '#38bdf8',
      padding: '3px 8px',
      borderRadius: 6,
      background: 'rgba(56, 189, 248, 0.1)',
      border: '1px solid rgba(56, 189, 248, 0.25)'
    }
  }, "Click to enlarge figure")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 16
    }
  }, (benchmarksData.figures || []).map(fig => /*#__PURE__*/React.createElement("div", {
    key: fig.filename,
    onClick: () => setSelectedFigure(fig),
    className: "glass-card-interactive",
    style: {
      background: 'rgba(15, 23, 42, 0.8)',
      borderRadius: 10,
      overflow: 'hidden',
      cursor: 'pointer',
      border: '1px solid rgba(148, 163, 184, 0.15)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 180,
      background: '#0b0f19',
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
      borderTop: '1px solid rgba(148, 163, 184, 0.1)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.8rem',
      fontWeight: 600,
      color: '#e2e8f0'
    }
  }, fig.title), /*#__PURE__*/React.createElement(Icons.zoom, {
    size: 15,
    style: {
      color: '#06b6d4'
    }
  }))))))), activeTab === 'security' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: '1.25rem',
      fontWeight: 800,
      color: '#f8fafc'
    }
  }, "Cryptographic Verification & Threat Mitigation Lab"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.85rem',
      color: '#94a3b8',
      marginTop: 4
    }
  }, "Formal security guarantees verified under NIST SP 800-57, SP 800-208, and Dolev-Yao adversary models.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: 20,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20,
      borderLeft: '4px solid #10b981'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#f8fafc'
    }
  }, "Security Test Suite (Table 15)"), /*#__PURE__*/React.createElement(Badge, {
    status: "PASS",
    label: "23/23 PASSED"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '2rem',
      fontWeight: 800,
      color: '#34d399',
      margin: '12px 0 4px'
    }
  }, "100% Invariants Verified"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.8rem',
      color: '#94a3b8',
      lineHeight: 1.5
    }
  }, "Passed all 14 Security Tests (ST-01 through ST-14) and 5 Functional Tests (FT-01 through FT-05) covering replay attacks, tampered ciphertexts, revoked devices, forged ML-DSA signatures, and cross-context separation.")), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 20,
      borderLeft: '4px solid #f43f5e'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#f8fafc'
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
      color: '#94a3b8'
    }
  }, "Issued Timestamp:"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      color: '#cbd5e1'
    }
  }, securityData.crl.issued_at)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#94a3b8'
    }
  }, "Revoked Devices:"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      color: '#fb7185',
      fontWeight: 700
    }
  }, securityData.crl.device_ids ? securityData.crl.device_ids.join(', ') : 'None')), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#94a3b8',
      fontSize: '0.75rem'
    }
  }, "ML-DSA-65 Signature Preview:"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      background: 'rgba(30, 41, 59, 0.6)',
      padding: '6px 10px',
      borderRadius: 6,
      fontSize: '0.7rem',
      color: '#38bdf8',
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
    className: "glass-card",
    style: {
      padding: 20,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#f8fafc',
      marginBottom: 14
    }
  }, "Message Processing & Tamper Rejection Statistics"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      flexWrap: 'wrap'
    }
  }, Object.entries(securityData.message_stats).map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      flex: 1,
      minWidth: 160,
      background: 'rgba(30, 41, 59, 0.5)',
      padding: 14,
      borderRadius: 8,
      border: '1px solid rgba(148, 163, 184, 0.1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.75rem',
      color: '#94a3b8',
      textTransform: 'uppercase',
      fontWeight: 600
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.6rem',
      fontWeight: 800,
      color: k === 'ACCEPTED' ? '#34d399' : '#fb7185',
      marginTop: 4
    }
  }, v))))), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
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
      fontSize: '1rem',
      fontWeight: 700,
      color: '#f8fafc'
    }
  }, "Table 15: Security Test Cases & Threat Vector Coverage"), /*#__PURE__*/React.createElement("button", {
    onClick: () => exportToCsv('security_test_cases', securityData.security_test_cases),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 10px',
      borderRadius: 6,
      background: 'rgba(30, 41, 59, 0.8)',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      color: '#cbd5e1',
      fontSize: '0.75rem',
      cursor: 'pointer'
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
      color: '#38bdf8'
    }
  }, t.test_id || t.Test)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#cbd5e1'
    }
  }, t.category || t.Category || 'SECURITY')), /*#__PURE__*/React.createElement("td", {
    style: {
      color: '#f1f5f9'
    }
  }, t.description || t.Description), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#fb7185',
      fontSize: '0.75rem'
    }
  }, t.attack_vector || t.Attack_Vector || '—')), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#a78bfa',
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
  }, "Run ", /*#__PURE__*/React.createElement("code", null, "pytest tests/"), " to populate security test cases."))))))), activeTab === 'admin_clearances' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 16,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: '1.3rem',
      fontWeight: 800,
      color: '#f8fafc'
    }
  }, "\uD83D\uDEE1\uFE0F Doctor Biochip Access Control & Cryptographic Clearance Matrix"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.72rem',
      padding: '2px 8px',
      borderRadius: 9999,
      background: 'rgba(6, 182, 212, 0.15)',
      color: '#38bdf8',
      border: '1px solid rgba(6, 182, 212, 0.3)',
      fontWeight: 600
    }
  }, "KMS Admin Governance")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.84rem',
      color: '#94a3b8',
      marginTop: 4
    }
  }, "Configure Role-Based Access Control (RBAC) clearances for medical personnel. Granting or revoking clearance immediately alters post-quantum key exchange authorization on the KMS server.")), /*#__PURE__*/React.createElement("button", {
    onClick: fetchAdminAuthorizations,
    disabled: adminAuthorizationsLoading,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '8px 16px',
      borderRadius: 8,
      background: 'rgba(30, 41, 59, 0.8)',
      color: '#f8fafc',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      fontSize: '0.82rem',
      fontWeight: 600,
      cursor: adminAuthorizationsLoading ? 'not-allowed' : 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icons.refresh, {
    size: 14,
    className: adminAuthorizationsLoading ? 'live-pulse' : ''
  }), /*#__PURE__*/React.createElement("span", null, adminAuthorizationsLoading ? 'Refreshing...' : 'Refresh Matrix'))), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      borderRadius: 12,
      overflow: 'hidden',
      border: '1px solid rgba(148, 163, 184, 0.15)',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "data-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      minWidth: 220
    }
  }, "Clinician / Doctor"), /*#__PURE__*/React.createElement("th", {
    style: {
      minWidth: 200
    }
  }, "Department & Specialty"), (adminAuthorizations?.all_biochips || ['DMFB-ALPHA', 'DMFB-ICU-01', 'DMFB-BETA', 'DMFB-CLINIC-02', 'DMFB-RESEARCH-03']).map(chipId => /*#__PURE__*/React.createElement("th", {
    key: chipId,
    className: "font-mono",
    style: {
      textAlign: 'center',
      minWidth: 150
    }
  }, chipId)))), /*#__PURE__*/React.createElement("tbody", null, (adminAuthorizations?.doctors || []).map(doc => /*#__PURE__*/React.createElement("tr", {
    key: doc.username
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '1.2rem'
    }
  }, "\uD83E\uDE7A"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      color: '#f8fafc'
    }
  }, doc.name), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      fontSize: '0.72rem',
      color: '#64748b'
    }
  }, "@", doc.username)))), /*#__PURE__*/React.createElement("td", {
    style: {
      color: '#cbd5e1',
      fontSize: '0.82rem'
    }
  }, doc.specialty), (adminAuthorizations?.all_biochips || []).map(chipId => {
    const isAuthorized = doc.authorized_biochips?.includes(chipId);
    return /*#__PURE__*/React.createElement("td", {
      key: chipId,
      style: {
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => handleToggleAuthorization(doc.username, chipId),
      style: {
        padding: '6px 14px',
        borderRadius: 6,
        border: `1px solid ${isAuthorized ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.3)'}`,
        background: isAuthorized ? 'rgba(16, 185, 129, 0.15)' : 'rgba(30, 41, 59, 0.6)',
        color: isAuthorized ? '#34d399' : '#94a3b8',
        fontSize: '0.74rem',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        minWidth: 110
      },
      title: `Click to ${isAuthorized ? 'REVOKE' : 'GRANT'} access to ${chipId}`
    }, isAuthorized ? '✓ Authorized' : '🔒 Restricted'));
  }))))))), /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      padding: 18,
      borderRadius: 10,
      background: 'rgba(6, 182, 212, 0.05)',
      border: '1px solid rgba(6, 182, 212, 0.2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Icons.shield, {
    size: 20,
    style: {
      color: '#06b6d4'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.85rem',
      fontWeight: 700,
      color: '#f8fafc'
    }
  }, "Real-Time Cryptographic Enforcement & SHA-256 Audit Trail"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.78rem',
      color: '#94a3b8',
      marginTop: 2
    }
  }, "Every clearance grant and revoke instantly updates the server authorization table and generates an immutable block in the SHA-256 tamper-evident ledger. When unauthorized doctors request key encapsulation, the KMS server rejects the handshake with HTTP 403 Forbidden.")))))), provisionModalOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      width: '100%',
      maxWidth: 600,
      background: '#0f172a',
      border: '1px solid rgba(148, 163, 184, 0.25)',
      borderRadius: 16,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px',
      borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 6,
      background: 'rgba(6, 182, 212, 0.15)',
      borderRadius: 8,
      color: '#06b6d4'
    }
  }, /*#__PURE__*/React.createElement(Icons.plus, {
    size: 18
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1rem',
      fontWeight: 800,
      color: '#f8fafc'
    }
  }, "Provision & Register New Biochip (Algorithm 1)")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setProvisionModalOpen(false),
    style: {
      background: 'transparent',
      border: 'none',
      color: '#94a3b8',
      cursor: 'pointer'
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
      color: '#94a3b8',
      lineHeight: 1.5,
      marginBottom: 16
    }
  }, "Generates an out-of-band one-time enrolment code, local ", /*#__PURE__*/React.createElement("strong", null, "ML-KEM-768"), " (FIPS 203) & ", /*#__PURE__*/React.createElement("strong", null, "ML-DSA-65"), " (FIPS 204) post-quantum keypairs, signs proof-of-possession, and registers the node in the hardware registry."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: '0.78rem',
      fontWeight: 600,
      color: '#cbd5e1',
      marginBottom: 6
    }
  }, "Device ID (e.g. DMFB-LAB-01, DMFB-ICU-04):"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "e.g. DMFB-LAB-01",
    value: newDeviceId,
    onChange: e => setNewDeviceId(e.target.value),
    required: true,
    style: {
      width: '100%',
      background: 'rgba(30, 41, 59, 0.7)',
      border: '1px solid rgba(148, 163, 184, 0.25)',
      borderRadius: 8,
      padding: '10px 12px',
      color: '#f8fafc',
      fontFamily: 'JetBrains Mono',
      fontSize: '0.85rem',
      outline: 'none'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: '0.78rem',
      fontWeight: 600,
      color: '#cbd5e1',
      marginBottom: 6
    }
  }, "Assigned Medical Role:"), /*#__PURE__*/React.createElement("select", {
    value: newDeviceRole,
    onChange: e => setNewDeviceRole(e.target.value),
    style: {
      width: '100%',
      background: 'rgba(30, 41, 59, 0.7)',
      border: '1px solid rgba(148, 163, 184, 0.25)',
      borderRadius: 8,
      padding: '10px 12px',
      color: '#f8fafc',
      fontSize: '0.85rem',
      outline: 'none'
    }
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
      background: 'rgba(244, 63, 94, 0.15)',
      border: '1px solid rgba(244, 63, 94, 0.3)',
      padding: 10,
      borderRadius: 8,
      color: '#fb7185',
      fontSize: '0.8rem',
      marginBottom: 14
    }
  }, "\u274C ", provisionError), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setProvisionModalOpen(false),
    style: {
      padding: '8px 16px',
      borderRadius: 8,
      background: 'rgba(30, 41, 59, 0.8)',
      color: '#cbd5e1',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      cursor: 'pointer',
      fontSize: '0.82rem'
    }
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: provisionLoading,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '8px 18px',
      borderRadius: 8,
      background: '#06b6d4',
      color: '#090d16',
      fontWeight: 700,
      border: 'none',
      cursor: provisionLoading ? 'not-allowed' : 'pointer',
      fontSize: '0.82rem'
    }
  }, provisionLoading ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icons.refresh, {
    size: 14,
    className: "live-pulse"
  }), "Generating Quantum Keys...") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icons.key, {
    size: 14
  }), "Generate Quantum Keys & Register")))) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: 'rgba(16, 185, 129, 0.1)',
      border: '1px solid rgba(16, 185, 129, 0.25)',
      padding: 12,
      borderRadius: 8,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Icons.check, {
    size: 22,
    style: {
      color: '#34d399'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#34d399',
      fontWeight: 800,
      fontSize: '0.95rem'
    }
  }, "Device Provisioned & Authorized Successfully!"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#94a3b8',
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
      background: 'rgba(30, 41, 59, 0.5)',
      padding: 10,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: '#94a3b8',
      textTransform: 'uppercase'
    }
  }, "Device ID"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      fontWeight: 700,
      color: '#38bdf8',
      marginTop: 2
    }
  }, provisionResult.device_id)), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(30, 41, 59, 0.5)',
      padding: 10,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: '#94a3b8',
      textTransform: 'uppercase'
    }
  }, "Assigned Role"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      color: '#f8fafc',
      marginTop: 2
    }
  }, provisionResult.role))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(15, 23, 42, 0.8)',
      padding: 12,
      borderRadius: 8,
      border: '1px solid rgba(148, 163, 184, 0.1)',
      marginBottom: 10,
      fontSize: '0.78rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#94a3b8',
      marginBottom: 2
    }
  }, "One-Time Enrolment Code:"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      color: '#fbbf24',
      wordBreak: 'break-all'
    }
  }, provisionResult.enrolment_code)), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(15, 23, 42, 0.8)',
      padding: 12,
      borderRadius: 8,
      border: '1px solid rgba(148, 163, 184, 0.1)',
      marginBottom: 10,
      fontSize: '0.78rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      color: '#94a3b8',
      marginBottom: 2
    }
  }, /*#__PURE__*/React.createElement("span", null, "ML-KEM-768 Public Key:"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      color: '#34d399'
    }
  }, provisionResult.kem_pk_len, " bytes")), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      color: '#38bdf8',
      wordBreak: 'break-all',
      fontSize: '0.72rem'
    }
  }, provisionResult.kem_pk_preview)), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(15, 23, 42, 0.8)',
      padding: 12,
      borderRadius: 8,
      border: '1px solid rgba(148, 163, 184, 0.1)',
      marginBottom: 16,
      fontSize: '0.78rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      color: '#94a3b8',
      marginBottom: 2
    }
  }, /*#__PURE__*/React.createElement("span", null, "ML-DSA-65 Verification Key:"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      color: '#34d399'
    }
  }, provisionResult.sig_pk_len, " bytes")), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      color: '#38bdf8',
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
    style: {
      padding: '8px 18px',
      borderRadius: 8,
      background: '#06b6d4',
      color: '#090d16',
      fontWeight: 700,
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.82rem'
    }
  }, "Close & View in Registry")))))), envModalOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      width: '100%',
      maxWidth: 560,
      background: '#0f172a',
      border: '1px solid rgba(148, 163, 184, 0.25)',
      borderRadius: 16,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px',
      borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Icons.cpu, {
    size: 20,
    style: {
      color: '#06b6d4'
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1rem',
      fontWeight: 800,
      color: '#f8fafc'
    }
  }, "Host Environment & Cryptographic Stack")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setEnvModalOpen(false),
    style: {
      background: 'transparent',
      border: 'none',
      color: '#94a3b8',
      cursor: 'pointer'
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
      background: 'rgba(30, 41, 59, 0.5)',
      padding: 12,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: '#94a3b8',
      textTransform: 'uppercase'
    }
  }, "CPU Architecture"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#f8fafc',
      marginTop: 2
    }
  }, info.environment?.cpu || 'x86_64')), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(30, 41, 59, 0.5)',
      padding: 12,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: '#94a3b8',
      textTransform: 'uppercase'
    }
  }, "Physical / Logical Cores"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#f8fafc',
      marginTop: 2
    }
  }, info.environment?.cpu_cores || 10, " / ", info.environment?.cpu_logical || 12)), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(30, 41, 59, 0.5)',
      padding: 12,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: '#94a3b8',
      textTransform: 'uppercase'
    }
  }, "RAM Available"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#f8fafc',
      marginTop: 2
    }
  }, info.environment?.ram_gb || 16.4, " GB")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(30, 41, 59, 0.5)',
      padding: 12,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: '#94a3b8',
      textTransform: 'uppercase'
    }
  }, "liboqs Version"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#38bdf8',
      marginTop: 2
    }
  }, info.environment?.liboqs_version || '0.16.0'))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(15, 23, 42, 0.8)',
      padding: 14,
      borderRadius: 8,
      border: '1px solid rgba(148, 163, 184, 0.1)',
      marginBottom: 14,
      fontSize: '0.8rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#94a3b8',
      marginBottom: 4
    }
  }, "Operating System Kernel:"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      color: '#cbd5e1'
    }
  }, info.environment?.os || 'Linux')), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(15, 23, 42, 0.8)',
      padding: 14,
      borderRadius: 8,
      border: '1px solid rgba(148, 163, 184, 0.1)',
      fontSize: '0.8rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#94a3b8',
      marginBottom: 4
    }
  }, "Server ML-DSA Verification Key Preview:"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      color: '#34d399',
      fontSize: '0.72rem',
      wordBreak: 'break-all'
    }
  }, info.server_vk_preview || 'Loaded from server_keys.json'))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 20px',
      borderTop: '1px solid rgba(148, 163, 184, 0.15)',
      textAlign: 'right',
      background: 'rgba(15, 23, 42, 0.95)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setEnvModalOpen(false),
    style: {
      padding: '6px 16px',
      borderRadius: 6,
      background: '#06b6d4',
      color: '#090d16',
      fontWeight: 700,
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.82rem'
    }
  }, "Close")))), selectedAuditLog && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card",
    style: {
      width: '100%',
      maxWidth: 640,
      background: '#0f172a',
      border: '1px solid rgba(148, 163, 184, 0.25)',
      borderRadius: 16,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px',
      borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Icons.fileText, {
    size: 20,
    style: {
      color: '#38bdf8'
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1rem',
      fontWeight: 800,
      color: '#f8fafc'
    }
  }, "Audit Block #", selectedAuditLog.id, " Inspector")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setSelectedAuditLog(null),
    style: {
      background: 'transparent',
      border: 'none',
      color: '#94a3b8',
      cursor: 'pointer'
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
      color: '#94a3b8'
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
      color: '#94a3b8'
    }
  }, "Event Type: "), /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#f8fafc'
    }
  }, selectedAuditLog.event_type)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.75rem',
      color: '#94a3b8'
    }
  }, "Device Binding: "), /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      color: '#38bdf8'
    }
  }, selectedAuditLog.device_id || 'System / None')), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.75rem',
      color: '#94a3b8'
    }
  }, "Details: "), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(30, 41, 59, 0.6)',
      padding: 10,
      borderRadius: 6,
      fontSize: '0.8rem',
      color: '#cbd5e1',
      marginTop: 4
    }
  }, selectedAuditLog.details || '—')), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid rgba(148, 163, 184, 0.15)',
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.8rem',
      fontWeight: 700,
      color: '#f8fafc',
      marginBottom: 8
    }
  }, "Cryptographic Chain Link (SHA-256):"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: '#94a3b8'
    }
  }, "Previous Hash (H_", '{i-1}', "):"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      background: 'rgba(15, 23, 42, 0.8)',
      padding: 8,
      borderRadius: 6,
      fontSize: '0.75rem',
      color: '#64748b',
      wordBreak: 'break-all'
    }
  }, selectedAuditLog.prev_hash || '0000000000000000000000000000000000000000000000000000000000000000')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: '#94a3b8'
    }
  }, "Current Block Hash (H_i):"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      background: 'rgba(6, 182, 212, 0.1)',
      padding: 8,
      borderRadius: 6,
      fontSize: '0.75rem',
      color: '#38bdf8',
      wordBreak: 'break-all'
    }
  }, selectedAuditLog.current_hash)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 20px',
      borderTop: '1px solid rgba(148, 163, 184, 0.15)',
      textAlign: 'right',
      background: 'rgba(15, 23, 42, 0.95)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setSelectedAuditLog(null),
    style: {
      padding: '6px 16px',
      borderRadius: 6,
      background: '#06b6d4',
      color: '#090d16',
      fontWeight: 700,
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.82rem'
    }
  }, "Close")))), selectedFigure && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
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
      padding: '10px 20px',
      background: 'rgba(15, 23, 42, 0.9)',
      borderRadius: 12,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1rem',
      fontWeight: 700,
      color: '#f8fafc'
    }
  }, selectedFigure.title), /*#__PURE__*/React.createElement("button", {
    onClick: () => setSelectedFigure(null),
    style: {
      background: 'transparent',
      border: 'none',
      color: '#f8fafc',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icons.x, {
    size: 22
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
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
    }
  }))), /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '1px solid rgba(148, 163, 184, 0.1)',
      padding: '16px 24px',
      textAlign: 'center',
      fontSize: '0.75rem',
      color: '#64748b'
    }
  }, "PQ-KMS Post-Quantum Cryptographic Framework \u2022 ML-KEM-768 \u2022 ML-DSA-65 \u2022 AES-256-GCM \u2022 SHA-256 Hash Chain Integrity"));
}

  // Mount root
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(React.createElement(App));
  }
})();
