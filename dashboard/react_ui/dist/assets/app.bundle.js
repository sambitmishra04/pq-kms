
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
  microscope: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M6 18h8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 22h18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 22a7 7 0 1 0 0-14h-1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 14h2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"
  })),
  crosshair: p => /*#__PURE__*/React.createElement("svg", _extends({
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
    x1: "22",
    x2: "18",
    y1: "12",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    x2: "2",
    y1: "12",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    x2: "12",
    y1: "2",
    y2: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    x2: "12",
    y1: "18",
    y2: "22"
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
  })),
  ban: p => /*#__PURE__*/React.createElement("svg", _extends({
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
    x1: "4.93",
    x2: "19.07",
    y1: "4.93",
    y2: "19.07"
  }))
};

// ─── Status Badge Component ───────────────────────────────────────────────────
function Badge({
  status,
  label
}) {
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

// ─── 2D DMFB Physical Biochip Electrode Grid ──────────────────────────────────
function BiochipGridComponent({
  simData
}) {
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
      if (isDetector) cellClass += ' detector-cell';else if (isSample) cellClass += ' sample-cell';else if (isReagent) cellClass += ' reagent-cell';else if (isWaste) cellClass += ' waste-cell';
      let cellTitle = `Electrode (${x}, ${y})`;
      if (isDetector) cellTitle += ' [Optical Photodiode Sensor]';
      if (isSample) cellTitle += ' [Serum Sample Dispenser]';
      if (isReagent) cellTitle += ' [GOx Reagent Dispenser]';
      if (isWaste) cellTitle += ' [Waste Reservoir]';
      if (cellDroplet) cellTitle += ` — Droplet: ${cellDroplet.label} (${cellDroplet.volume_ul} µL, ${cellDroplet.concentration_mg_dl} mg/dL)`;
      cells.push( /*#__PURE__*/React.createElement("div", {
        key: `${x}-${y}`,
        className: cellClass,
        title: cellTitle
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'absolute',
          top: 2,
          left: 3,
          fontSize: '0.55rem',
          color: '#94a3b8',
          pointerEvents: 'none'
        }
      }, x, ",", y), cellDroplet && /*#__PURE__*/React.createElement("div", {
        className: "biochip-droplet",
        style: {
          backgroundColor: cellDroplet.color || '#3b82f6'
        }
      }, cellDroplet.id === 'D-SAMPLE' ? 'S' : cellDroplet.id === 'D-REAGENT' ? 'R' : cellDroplet.id === 'D-MIXED' ? 'M' : cellDroplet.id === 'D-TEST' ? 'T' : 'W'), !cellDroplet && isDetector && /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: '0.62rem',
          fontWeight: 700,
          color: '#15803d'
        }
      }, "OPT"), !cellDroplet && isSample && /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: '0.62rem',
          fontWeight: 700,
          color: '#ef4444'
        }
      }, "IN-S"), !cellDroplet && isReagent && /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: '0.62rem',
          fontWeight: 700,
          color: '#0284c7'
        }
      }, "IN-R"), !cellDroplet && isWaste && /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: '0.62rem',
          fontWeight: 700,
          color: '#64748b'
        }
      }, "WST")));
    }
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "biochip-grid"
  }, cells), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: 14,
      marginTop: 12,
      fontSize: '0.74rem',
      color: '#64748b'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 2,
      backgroundColor: '#f0fdf4',
      border: '1px solid #16a34a'
    }
  }), /*#__PURE__*/React.createElement("span", null, "Active Electrowetting")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 2,
      border: '2px dashed #15803d',
      backgroundColor: 'rgba(22, 163, 74, 0.1)'
    }
  }), /*#__PURE__*/React.createElement("span", null, "Photodiode (3,6)")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 2,
      border: '2px dashed #ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)'
    }
  }), /*#__PURE__*/React.createElement("span", null, "Sample In (0,2)")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 2,
      border: '2px dashed #0284c7',
      backgroundColor: 'rgba(2, 132, 199, 0.1)'
    }
  }), /*#__PURE__*/React.createElement("span", null, "Reagent In (7,2)")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 2,
      border: '2px dashed #64748b',
      backgroundColor: 'rgba(100, 116, 139, 0.1)'
    }
  }), /*#__PURE__*/React.createElement("span", null, "Waste (7,7)"))));
}

// ─── Main Application ─────────────────────────────────────────────────────────
function App() {
  const [activeTab, setActiveTab] = useState('simulator');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefreshSecs, setAutoRefreshSecs] = useState(0);
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
  const [securityData, setSecurityData] = useState({
    security_test_cases: [],
    test_summary: [],
    crl: null,
    message_stats: {}
  });

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
      const [rInfo, rDev, rSess, rAudit, rSec, rSim] = await Promise.all([fetch('/api/info').then(r => r.json()).catch(() => ({})), fetch('/api/devices').then(r => r.json()).catch(() => ({
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
      })), fetch('/api/security').then(r => r.json()).catch(() => ({
        security_test_cases: [],
        test_summary: [],
        crl: null,
        message_stats: {}
      })), fetch('/api/simulator/state').then(r => r.json()).catch(() => null)]);
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
  const handleLoadAssay = async glucose => {
    setSimLoading(true);
    try {
      const res = await fetch('/api/simulator/load', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patient_glucose: glucose
        })
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
      const res = await fetch('/api/simulator/step', {
        method: 'POST'
      }).then(r => r.json());
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
      const res = await fetch('/api/simulator/run_all', {
        method: 'POST'
      }).then(r => r.json());
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
      const res = await fetch('/api/simulator/reset', {
        method: 'POST'
      }).then(r => r.json());
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          true_glucose: Number(tamperTrueGlucose),
          falsified_glucose: Number(tamperInjectedGlucose)
        })
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
      const res = await fetch('/api/attack/replay', {
        method: 'POST'
      }).then(r => r.json());
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
  const handleProvisionDevice = async e => {
    if (e) e.preventDefault();
    const devId = newDeviceId.trim() || `DMFB-ICU-${Math.floor(100 + Math.random() * 900)}`;
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
  const handleRevokeDevice = async () => {
    if (!deviceToRevoke) return;
    setRevokeLoading(true);
    setRevokeError(null);
    setRevokeResult(null);
    try {
      const res = await fetch('/api/devices/revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          device_id: deviceToRevoke,
          reason: revokeReason
        })
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

  // Filtered devices memo
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
      gap: 14
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
  }, "Hospital Lab & Biochip Security Console")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.78rem',
      color: '#64748b',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement("span", null, "NIST FIPS 203: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#0f172a'
    }
  }, info.kem_alg || 'ML-KEM-768')), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#cbd5e1'
    }
  }, "\u2022"), /*#__PURE__*/React.createElement("span", null, "FIPS 204: ", /*#__PURE__*/React.createElement("strong", {
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
  }, "AES-256-GCM"))))), /*#__PURE__*/React.createElement("div", {
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
  }), backendOnline ? 'Hospital Gateway Online' : 'Gateway Offline'), /*#__PURE__*/React.createElement("div", {
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
  }, "Every 10s"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => fetchAllData(true),
    disabled: refreshing,
    className: "btn-secondary",
    title: `Last updated ${lastUpdated.toLocaleTimeString()}`
  }, /*#__PURE__*/React.createElement(Icons.refresh, {
    size: 14,
    className: refreshing ? 'live-pulse' : ''
  }), refreshing ? 'Updating...' : 'Refresh'), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setProvisionModalOpen(true);
      setProvisionResult(null);
      setProvisionError(null);
    },
    className: "btn-primary"
  }, /*#__PURE__*/React.createElement(Icons.plus, {
    size: 14
  }), "Enrol Biochip"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setDiagnosticsModalOpen(true),
    style: {
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
      cursor: 'pointer'
    },
    title: "System Diagnostics & Low-Level Specs"
  }, /*#__PURE__*/React.createElement(Icons.cpu, {
    size: 14
  }), "Diagnostics"))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1400,
      margin: '0 auto',
      padding: '0 24px',
      display: 'flex',
      gap: 4,
      overflowX: 'auto'
    }
  }, [{
    id: 'simulator',
    label: 'Biochip Physical Simulator',
    icon: Icons.microscope
  }, {
    id: 'attack_lab',
    label: 'Cyber-Physical Threat Sandbox',
    icon: Icons.crosshair
  }, {
    id: 'devices',
    label: 'Clinical Biochip Fleet',
    icon: Icons.device,
    count: devicesData.total
  }, {
    id: 'sessions',
    label: 'Active Cryptographic Sessions',
    icon: Icons.key,
    count: sessionsData.total
  }, {
    id: 'audit',
    label: 'Regulatory Compliance Audit',
    icon: Icons.fileText,
    count: auditData.events ? auditData.events.length : 0
  }, {
    id: 'revocations',
    label: 'Revocation & Quarantine (CRL)',
    icon: Icons.ban,
    count: securityData.crl?.device_ids ? securityData.crl.device_ids.length : 0
  }].map(tab => {
    const IconCmp = tab.icon;
    const active = activeTab === tab.id;
    return /*#__PURE__*/React.createElement("button", {
      key: tab.id,
      onClick: () => {
        setActiveTab(tab.id);
        if (tab.id === 'attack_lab' && attackTab === 'quantum') {
          handleFetchQuantumThreat();
        }
      },
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
  }, activeTab === 'simulator' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: 24,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: '1.05rem',
      fontWeight: 700,
      color: '#0f172a'
    }
  }, "2D EWOD Electrode Array (8 \xD7 8 Cells)"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.78rem',
      color: '#64748b'
    }
  }, "Device: ", /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      color: '#15803d',
      fontWeight: 600
    }
  }, simData?.device_id || 'DMFB-01'), " \u2022 Electrowetting on Dielectric Physical Microfluidics")), /*#__PURE__*/React.createElement(Badge, {
    status: simData?.status || 'IDLE'
  })), /*#__PURE__*/React.createElement(BiochipGridComponent, {
    simData: simData
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.85rem',
      fontWeight: 600,
      color: '#334155',
      marginBottom: 8
    }
  }, "Active Droplets on Substrate"), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto',
      border: '1px solid #e2e8f0',
      borderRadius: 6
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "custom-table",
    style: {
      fontSize: '0.78rem'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Droplet"), /*#__PURE__*/React.createElement("th", null, "Type"), /*#__PURE__*/React.createElement("th", null, "Pos (X, Y)"), /*#__PURE__*/React.createElement("th", null, "Volume"), /*#__PURE__*/React.createElement("th", null, "Concentration"))), /*#__PURE__*/React.createElement("tbody", null, (simData?.droplets || []).map(d => /*#__PURE__*/React.createElement("tr", {
    key: d.id
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      backgroundColor: d.color
    }
  }), /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#0f172a'
    }
  }, d.label))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#64748b',
      textTransform: 'capitalize'
    }
  }, d.droplet_type)), /*#__PURE__*/React.createElement("td", {
    className: "font-mono"
  }, "(", d.x, ", ", d.y, ")"), /*#__PURE__*/React.createElement("td", {
    className: "font-mono"
  }, d.volume_ul, " \xB5L"), /*#__PURE__*/React.createElement("td", {
    className: "font-mono",
    style: {
      fontWeight: 600,
      color: d.concentration_mg_dl > 0 ? '#15803d' : '#64748b'
    }
  }, d.concentration_mg_dl > 0 ? `${d.concentration_mg_dl} mg/dL` : '—'))), !simData?.droplets?.length && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 5,
    style: {
      textAlign: 'center',
      padding: 16,
      color: '#94a3b8'
    }
  }, "No droplets currently on biochip. Click \"Load Assay Protocol\" to dispense."))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: 22
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: '1.05rem',
      fontWeight: 700,
      color: '#0f172a',
      marginBottom: 4
    }
  }, "Clinical Assay Protocol Execution"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.8rem',
      color: '#64748b',
      marginBottom: 18
    }
  }, "Enzymatic Glucose Oxidase (GOx) bioassay with in-situ optical detection."), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#f8fafc',
      padding: 14,
      borderRadius: 8,
      border: '1px solid #e2e8f0',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: '0.82rem',
      fontWeight: 600,
      color: '#334155'
    }
  }, "Patient Blood Glucose:"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      fontSize: '1.1rem',
      fontWeight: 700,
      color: patientGlucoseInput >= 200 ? '#b91c1c' : patientGlucoseInput < 70 ? '#b45309' : '#15803d'
    }
  }, patientGlucoseInput, " mg/dL")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "40",
    max: "450",
    step: "5",
    value: patientGlucoseInput,
    onChange: e => setPatientGlucoseInput(Number(e.target.value)),
    className: "slider-input"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.72rem',
      color: '#64748b',
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("span", null, "40 (Hypo)"), /*#__PURE__*/React.createElement("span", null, "70\u2013140 (Normal)"), /*#__PURE__*/React.createElement("span", null, "200+ (Hyperglycemia)"), /*#__PURE__*/React.createElement("span", null, "450 mg/dL"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => handleLoadAssay(patientGlucoseInput),
    disabled: simLoading,
    className: "btn-secondary",
    style: {
      padding: '9px 14px'
    }
  }, /*#__PURE__*/React.createElement(Icons.refresh, {
    size: 15
  }), "Reset & Reload Protocol"), /*#__PURE__*/React.createElement("button", {
    onClick: handleStepSimulator,
    disabled: simLoading || (simData?.current_step_idx || 0) >= (simData?.total_steps || 7),
    className: "btn-secondary",
    style: {
      padding: '9px 14px',
      borderColor: '#15803d',
      color: '#15803d',
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement(Icons.play, {
    size: 15
  }), "Next Step \u25B6")), /*#__PURE__*/React.createElement("button", {
    onClick: handleRunAllSimulator,
    disabled: simLoading || (simData?.current_step_idx || 0) >= (simData?.total_steps || 7),
    className: "btn-primary",
    style: {
      width: '100%',
      padding: '10px 14px',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Icons.fastForward, {
    size: 16
  }), "Run Complete Assay To Photodiode Readout \u23E9"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.78rem',
      color: '#334155',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600
    }
  }, "Protocol Progress:"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono"
  }, "Step ", simData?.current_step_idx || 0, " of ", simData?.total_steps || 7)), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: 8,
      backgroundColor: '#e2e8f0',
      borderRadius: 4,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${(simData?.current_step_idx || 0) / (simData?.total_steps || 7) * 100}%`,
      height: '100%',
      backgroundColor: '#15803d',
      transition: 'width 0.3s ease'
    }
  }))), simData?.current_step_info && /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      borderRadius: 6,
      padding: '12px 14px',
      fontSize: '0.8rem',
      color: '#166534'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      marginBottom: 2
    }
  }, "Step ", simData.current_step_info.step_num, " (", simData.current_step_info.operation, "):"), /*#__PURE__*/React.createElement("div", null, simData.current_step_info.description)), !simData?.current_step_info && /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: 6,
      padding: '12px 14px',
      fontSize: '0.8rem',
      color: '#64748b'
    }
  }, "Protocol ready. Click ", /*#__PURE__*/React.createElement("strong", null, "\"Next Step\""), " to initiate droplet dispensing and electrowetting actuation.")), /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: 22,
      borderLeft: simData?.sensor_data?.detected ? '4px solid #15803d' : '4px solid #cbd5e1'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icons.microscope, {
    size: 20,
    style: {
      color: '#15803d'
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.98rem',
      fontWeight: 700,
      color: '#0f172a'
    }
  }, "Optical Biosensor Readout Site (3, 6)")), simData?.sensor_data?.detected ? /*#__PURE__*/React.createElement(Badge, {
    status: "VALID",
    label: "ASSAY DETECTED"
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.74rem',
      color: '#94a3b8',
      fontStyle: 'italic'
    }
  }, "Awaiting droplet at detector")), simData?.sensor_data?.detected ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#f8fafc',
      padding: 12,
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
  }, "Optical Absorbance"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      fontSize: '1.4rem',
      fontWeight: 700,
      color: '#0f172a',
      marginTop: 2
    }
  }, simData.sensor_data.absorbance_au, " AU")), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#f8fafc',
      padding: 12,
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
  }, "Quantified Glucose"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      fontSize: '1.4rem',
      fontWeight: 700,
      color: '#15803d',
      marginTop: 2
    }
  }, simData.sensor_data.glucose_mg_dl, " mg/dL"))), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#f0fdf4',
      padding: '10px 14px',
      borderRadius: 6,
      border: '1px solid #bbf7d0',
      fontSize: '0.8rem',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#64748b'
    }
  }, "Clinical Evaluation: "), /*#__PURE__*/React.createElement("strong", {
    style: {
      color: simData.sensor_data.clinical_status.includes('CRITICAL') ? '#b91c1c' : '#15803d'
    }
  }, simData.sensor_data.clinical_status)), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#f8fafc',
      padding: '10px 12px',
      borderRadius: 6,
      border: '1px solid #e2e8f0',
      fontSize: '0.75rem',
      color: '#475569'
    }
  }, "\uD83D\uDD12 ", /*#__PURE__*/React.createElement("strong", null, "Automatic PQC Packaging:"), " This optical diagnostic telemetry is automatically signed with ", /*#__PURE__*/React.createElement("strong", null, "ML-DSA-65"), " and encapsulated via ", /*#__PURE__*/React.createElement("strong", null, "ML-KEM-768"), " with an authenticated ", /*#__PURE__*/React.createElement("strong", null, "AES-256-GCM"), " payload before wireless dispatch.")) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 16px',
      textAlign: 'center',
      color: '#94a3b8',
      fontSize: '0.82rem',
      backgroundColor: '#f8fafc',
      borderRadius: 6,
      border: '1px dashed #e2e8f0'
    }
  }, "Photodiode optical absorbance sensor is currently clear.", /*#__PURE__*/React.createElement("br", null), "Advance actuation steps to position the reacted assay droplet under electrode (3, 6)."))))), activeTab === 'attack_lab' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: '1.2rem',
      fontWeight: 700,
      color: '#0f172a'
    }
  }, "Cyber-Physical Attack Sandbox & Adversary Mitigation"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.82rem',
      color: '#64748b',
      marginTop: 4
    }
  }, "Simulate published cyber-physical attack vectors from biomedical microfluidic literature (Ali et al., Guo et al.) and inspect how PQ-KMS prevents clinical harm.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 20,
      borderBottom: '1px solid #e2e8f0',
      paddingBottom: 10
    }
  }, [{
    id: 'tamper',
    label: '1. Glucose Assay Tampering (Ali et al.)',
    desc: 'In-transit packet modification'
  }, {
    id: 'replay',
    label: '2. Diagnostic Reading Replay (Guo et al.)',
    desc: 'Stale telemetry injection'
  }, {
    id: 'quantum',
    label: '3. Harvest-Now Decrypt-Later',
    desc: 'Shor algorithm vulnerability'
  }].map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    onClick: () => {
      setAttackTab(s.id);
      if (s.id === 'quantum') handleFetchQuantumThreat();
    },
    style: {
      padding: '8px 16px',
      borderRadius: 6,
      border: '1px solid',
      borderColor: attackTab === s.id ? '#15803d' : '#cbd5e1',
      backgroundColor: attackTab === s.id ? '#f0fdf4' : '#ffffff',
      color: attackTab === s.id ? '#15803d' : '#475569',
      fontSize: '0.82rem',
      fontWeight: attackTab === s.id ? 700 : 500,
      cursor: 'pointer',
      transition: 'all 0.15s ease'
    }
  }, s.label))), attackTab === 'tamper' && /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1rem',
      fontWeight: 700,
      color: '#0f172a'
    }
  }, "Scenario 1: In-Transit Medical Assay Result Manipulation"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.82rem',
      color: '#475569',
      marginTop: 4,
      lineHeight: 1.5
    }
  }, "Ali et al. demonstrated that adversaries intercepting biochip telemetry can flip critical glucose readings (e.g. 220 mg/dL hyperglycemic crisis altered to 110 mg/dL normal) to trick the clinician into withholding insulin therapy.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: 16,
      marginBottom: 20,
      backgroundColor: '#f8fafc',
      padding: 16,
      borderRadius: 8,
      border: '1px solid #e2e8f0'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: '0.78rem',
      fontWeight: 600,
      color: '#334155',
      marginBottom: 6
    }
  }, "True Physical Sensor Reading (mg/dL):"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: tamperTrueGlucose,
    onChange: e => setTamperTrueGlucose(e.target.value),
    className: "form-input font-mono"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.72rem',
      color: '#b91c1c',
      marginTop: 4,
      display: 'block'
    }
  }, "Actual patient state: Severe Hyperglycemia")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: '0.78rem',
      fontWeight: 600,
      color: '#334155',
      marginBottom: 6
    }
  }, "Adversary Injected Falsified Value (mg/dL):"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: tamperInjectedGlucose,
    onChange: e => setTamperInjectedGlucose(e.target.value),
    className: "form-input font-mono"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.72rem',
      color: '#64748b',
      marginTop: 4,
      display: 'block'
    }
  }, "Attacker goal: Mask danger as normal fasting (110 mg/dL)"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleRunTamperAttack,
    disabled: tamperLoading,
    className: "btn-primary",
    style: {
      padding: '10px 20px',
      backgroundColor: '#dc2626',
      borderColor: '#b91c1c'
    }
  }, /*#__PURE__*/React.createElement(Icons.crosshair, {
    size: 16
  }), tamperLoading ? 'Executing In-Transit Attack Simulation...' : 'Launch In-Transit Attack Simulation')), tamperResult && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid #fecaca',
      backgroundColor: '#fef2f2',
      borderRadius: 8,
      padding: 18
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
      fontSize: '0.92rem',
      fontWeight: 700,
      color: '#b91c1c'
    }
  }, "\u274C Legacy Unprotected Biochip (Yao et al. / CRC)"), /*#__PURE__*/React.createElement(Badge, {
    status: "VULNERABLE",
    label: "ATTACK SUCCEEDED"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.82rem',
      color: '#7f1d1d',
      lineHeight: 1.6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Hospital Server Received:"), ' ', /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      fontWeight: 700,
      color: '#b91c1c'
    }
  }, tamperResult.unprotected_system.received_glucose, " mg/dL")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Integrity Check:"), " None (passed weak CRC-32 / unauthenticated ciphertext)."), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#ffffff',
      border: '1px solid #fca5a5',
      padding: 10,
      borderRadius: 6,
      color: '#991b1b',
      fontWeight: 500
    }
  }, "\u26A0\uFE0F ", /*#__PURE__*/React.createElement("strong", null, "Fatal Clinical Impact:"), " ", tamperResult.unprotected_system.clinical_consequence))), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid #bbf7d0',
      backgroundColor: '#f0fdf4',
      borderRadius: 8,
      padding: 18
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
      fontSize: '0.92rem',
      fontWeight: 700,
      color: '#15803d'
    }
  }, "\uD83D\uDEE1\uFE0F With PQ-KMS Authenticated Encryption"), /*#__PURE__*/React.createElement(Badge, {
    status: "PROTECTED",
    label: "ATTACK BLOCKED"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.82rem',
      color: '#166534',
      lineHeight: 1.6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Cryptographic Defense:"), " AES-256-GCM AEAD Tag Verification"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Error Detail:"), " ", /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      color: '#0f172a'
    }
  }, tamperResult.pqkms_system.error_detail)), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#ffffff',
      border: '1px solid #86efac',
      padding: 10,
      borderRadius: 6,
      color: '#15803d',
      fontWeight: 500
    }
  }, "\u2713 ", /*#__PURE__*/React.createElement("strong", null, "Patient Safe:"), " ", tamperResult.pqkms_system.clinical_consequence))))), attackTab === 'replay' && /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1rem',
      fontWeight: 700,
      color: '#0f172a'
    }
  }, "Scenario 2: Diagnostic Message Replay Attack"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.82rem',
      color: '#475569',
      marginTop: 4,
      lineHeight: 1.5
    }
  }, "Guo et al. highlighted that an attacker eavesdropping on biochip transmissions can record a valid reading from days earlier (when patient vitals were normal) and replay it when the patient enters a critical state.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleRunReplayAttack,
    disabled: replayLoading,
    className: "btn-primary",
    style: {
      padding: '10px 20px',
      backgroundColor: '#dc2626',
      borderColor: '#b91c1c'
    }
  }, /*#__PURE__*/React.createElement(Icons.crosshair, {
    size: 16
  }), replayLoading ? 'Simulating Replay Injection...' : 'Execute Replay Attack Simulation')), replayResult && /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid #bbf7d0',
      backgroundColor: '#f0fdf4',
      borderRadius: 8,
      padding: 18
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
      fontSize: '0.92rem',
      fontWeight: 700,
      color: '#15803d'
    }
  }, "\uD83D\uDEE1\uFE0F PQ-KMS Anti-Replay Defense Verified"), /*#__PURE__*/React.createElement(Badge, {
    status: "PROTECTED",
    label: "REPLAY REJECTED"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.82rem',
      color: '#166534',
      lineHeight: 1.6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Replay Detected:"), " ", replayResult.replay_detected ? 'TRUE (Packet dropped immediately)' : 'FALSE'), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Rejection Reason:"), " ", /*#__PURE__*/React.createElement("code", {
    style: {
      backgroundColor: '#ffffff',
      padding: '2px 6px',
      borderRadius: 4
    }
  }, replayResult.rejection_reason)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Security Mitigation:"), " ", replayResult.mitigation), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#ffffff',
      border: '1px solid #86efac',
      padding: 10,
      borderRadius: 6,
      color: '#15803d'
    }
  }, "\u2713 ", /*#__PURE__*/React.createElement("strong", null, "Audit Action:"), " Security event ", /*#__PURE__*/React.createElement("code", null, "REPLAY_ATTACK_BLOCKED"), " automatically recorded into immutable hash-chained audit log.")))), attackTab === 'quantum' && /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1rem',
      fontWeight: 700,
      color: '#0f172a'
    }
  }, "Scenario 3: \"Harvest-Now, Decrypt-Later\" Quantum Threat Analysis"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.82rem',
      color: '#475569',
      marginTop: 4,
      lineHeight: 1.5
    }
  }, "Adversaries intercept and archive encrypted clinical data today. When a fault-tolerant quantum computer is deployed, all classical public-key cryptography (RSA, ECDH, ECDSA) will be broken via Shor's algorithm.")), quantumResult ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid #fecaca',
      backgroundColor: '#fef2f2',
      borderRadius: 8,
      padding: 18
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
      fontSize: '0.92rem',
      fontWeight: 700,
      color: '#b91c1c'
    }
  }, "Classical Baseline (ECDH / RSA)"), /*#__PURE__*/React.createElement(Badge, {
    status: "FAIL",
    label: "0 BITS QUANTUM"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.82rem',
      color: '#7f1d1d',
      lineHeight: 1.6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Quantum Security:"), " ", quantumResult.classical_quantum_security), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Shor Algorithm Complexity:"), " Polynomial time ", quantumResult.shor_complexity), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#ffffff',
      border: '1px solid #fca5a5',
      padding: 10,
      borderRadius: 6,
      color: '#991b1b'
    }
  }, "\u26A0\uFE0F ", /*#__PURE__*/React.createElement("strong", null, "Vulnerability:"), " All medical data recorded today will be completely exposed when quantum computers arrive."))), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid #bbf7d0',
      backgroundColor: '#f0fdf4',
      borderRadius: 8,
      padding: 18
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
      fontSize: '0.92rem',
      fontWeight: 700,
      color: '#15803d'
    }
  }, "PQ-KMS (ML-KEM-768 / ML-DSA-65)"), /*#__PURE__*/React.createElement(Badge, {
    status: "PASS",
    label: "CATEGORY 3 QUANTUM"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.82rem',
      color: '#166534',
      lineHeight: 1.6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Quantum Security Margin:"), " ", quantumResult.pqc_quantum_security), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Lattice Hardness:"), " ", quantumResult.lattice_hardness), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#ffffff',
      border: '1px solid #86efac',
      padding: 10,
      borderRadius: 6,
      color: '#15803d'
    }
  }, "\u2713 ", /*#__PURE__*/React.createElement("strong", null, "Harvest Resistance:"), " ", quantumResult.harvest_now_decrypt_later_status)))) : /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleFetchQuantumThreat,
    className: "btn-secondary"
  }, "Fetch Quantum Cryptanalytic Model Comparison")))), activeTab === 'devices' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
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
  }, "Total Biochip Fleet"), /*#__PURE__*/React.createElement("div", {
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
  }, "Registered Clinical Nodes")), /*#__PURE__*/React.createElement("div", {
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
  }, "In-Service Authorized"), /*#__PURE__*/React.createElement("div", {
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
  }, "ML-DSA Proof Validated")), /*#__PURE__*/React.createElement("div", {
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
  }, "Quarantined / Revoked"), /*#__PURE__*/React.createElement("div", {
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
  }, "Published in Signed CRL")), /*#__PURE__*/React.createElement("div", {
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
  }, "Pending Activation"), /*#__PURE__*/React.createElement("div", {
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
  }, "Enrolment Code Issued"))), /*#__PURE__*/React.createElement("div", {
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
    placeholder: "Search Biochip ID or Station Role...",
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
      cursor: 'pointer'
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
  }), "Enrol Biochip"), /*#__PURE__*/React.createElement("button", {
    onClick: () => exportToCsv('clinical_biochips_inventory', filteredDevices),
    className: "btn-secondary"
  }, /*#__PURE__*/React.createElement(Icons.download, {
    size: 14
  }), "Export Inventory"))), /*#__PURE__*/React.createElement("div", {
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
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Biochip Device ID"), /*#__PURE__*/React.createElement("th", null, "Assigned Clinical Station"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Enrolment Date"), /*#__PURE__*/React.createElement("th", null, "Last Operational Ping"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right'
    }
  }, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, filteredDevices.slice((devicePage - 1) * pageSize, devicePage * pageSize).map(dev => /*#__PURE__*/React.createElement("tr", {
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
  }, dev.last_seen || '—'), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: 'right'
    }
  }, dev.status === 'AUTHORIZED' ? /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setDeviceToRevoke(dev.device_id);
      setRevokeResult(null);
      setRevokeError(null);
      setRevokeModalOpen(true);
    },
    style: {
      padding: '4px 10px',
      borderRadius: 4,
      backgroundColor: '#ffffff',
      border: '1px solid #fca5a5',
      color: '#b91c1c',
      fontSize: '0.75rem',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "Quarantine Node") : /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.75rem',
      color: '#94a3b8'
    }
  }, "Quarantined")))), !filteredDevices.length && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 6,
    style: {
      textAlign: 'center',
      padding: 32,
      color: '#64748b'
    }
  }, "No devices match current search filter."))))), filteredDevices.length > pageSize && /*#__PURE__*/React.createElement("div", {
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
  }, "Showing ", (devicePage - 1) * pageSize + 1, " to ", Math.min(devicePage * pageSize, filteredDevices.length), " of ", filteredDevices.length, " biochips"), /*#__PURE__*/React.createElement("div", {
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
  }, "Active Encrypted Keys"), /*#__PURE__*/React.createElement("div", {
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
  }, "AES-256-GCM AEAD Live")), /*#__PURE__*/React.createElement("div", {
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
  }, "Rotated / Deactivated"), /*#__PURE__*/React.createElement("div", {
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
  }, "Cryptoperiod Expired")), /*#__PURE__*/React.createElement("div", {
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
  }, "Zeroized in Memory"), /*#__PURE__*/React.createElement("div", {
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
  }, "RAM Overwritten (Algorithm 4)"))), /*#__PURE__*/React.createElement("div", {
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
      cursor: 'pointer'
    }
  }, st)))), /*#__PURE__*/React.createElement("button", {
    onClick: () => exportToCsv('session_keys_lifecycle', filteredSessions),
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
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Session ID"), /*#__PURE__*/React.createElement("th", null, "Device ID"), /*#__PURE__*/React.createElement("th", null, "Key ID"), /*#__PURE__*/React.createElement("th", null, "State"), /*#__PURE__*/React.createElement("th", null, "Created At"), /*#__PURE__*/React.createElement("th", null, "Expires At"), /*#__PURE__*/React.createElement("th", null, "Transmitted Messages"))), /*#__PURE__*/React.createElement("tbody", null, filteredSessions.slice((sessionPage - 1) * pageSize, sessionPage * pageSize).map(sess => /*#__PURE__*/React.createElement("tr", {
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
  }, sess.message_count || 0, " / 1000")))), !filteredSessions.length && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 7,
    style: {
      textAlign: 'center',
      padding: 32,
      color: '#64748b'
    }
  }, "No sessions match filter criteria."))))), filteredSessions.length > pageSize && /*#__PURE__*/React.createElement("div", {
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
  }, auditData.chain_valid ? 'FDA 21 CFR Part 11 / Cryptographic Hash Chain: VERIFIED' : `Audit Integrity Corrupted at Block #${auditData.chain_break_index}`), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.8rem',
      color: auditData.chain_valid ? '#166534' : '#991b1b',
      marginTop: 2
    }
  }, "Sequential SHA-256 chain links: ", /*#__PURE__*/React.createElement("code", null, "H_i = H(H_", '{i-1}', " || payload_i)"), ". Tampering with any historical audit entry is immediately detected."))), /*#__PURE__*/React.createElement("div", {
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
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icons.refresh, {
    size: 14
  }), "Re-Verify Chain"))), /*#__PURE__*/React.createElement("div", {
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
      cursor: 'pointer'
    }
  }, out)))), /*#__PURE__*/React.createElement("button", {
    onClick: () => exportToCsv('regulatory_compliance_audit', filteredAudit),
    className: "btn-secondary"
  }, /*#__PURE__*/React.createElement(Icons.download, {
    size: 14
  }), "Export Audit (", filteredAudit.length, ")")), /*#__PURE__*/React.createElement("div", {
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
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Timestamp"), /*#__PURE__*/React.createElement("th", null, "Outcome"), /*#__PURE__*/React.createElement("th", null, "Event Type"), /*#__PURE__*/React.createElement("th", null, "Component"), /*#__PURE__*/React.createElement("th", null, "Device ID"), /*#__PURE__*/React.createElement("th", null, "Details"), /*#__PURE__*/React.createElement("th", null, "Cryptographic Link"))), /*#__PURE__*/React.createElement("tbody", null, filteredAudit.slice((auditPage - 1) * pageSize, auditPage * pageSize).map((ev, i) => /*#__PURE__*/React.createElement("tr", {
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
  }, "No audit entries match filter."))))), filteredAudit.length > pageSize && /*#__PURE__*/React.createElement("div", {
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
  }, "Next"))))), activeTab === 'revocations' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: '1.2rem',
      fontWeight: 700,
      color: '#0f172a'
    }
  }, "Certificate Revocation List (CRL) & Incident Quarantine"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.82rem',
      color: '#64748b',
      marginTop: 4
    }
  }, "Algorithm 5: Server-signed revocation list broadcast to clinical edge gateways with NIST FIPS 204 (ML-DSA-65) signatures.")), /*#__PURE__*/React.createElement("div", {
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
      borderLeft: '4px solid #b91c1c'
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
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#0f172a'
    }
  }, "Active Signed CRL Authority"), /*#__PURE__*/React.createElement(Badge, {
    status: "REVOKED",
    label: `CRL Version ${securityData.crl?.list_version || 1}`
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.82rem',
      color: '#475569',
      lineHeight: 1.6
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
      color: '#0f172a'
    }
  }, securityData.crl?.issued_at || '—')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#64748b'
    }
  }, "Total Quarantined Nodes:"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      color: '#b91c1c',
      fontWeight: 700
    }
  }, securityData.crl?.device_ids ? securityData.crl.device_ids.length : 0, " devices")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#64748b',
      fontSize: '0.74rem'
    }
  }, "ML-DSA-65 Digital Signature Preview:"), /*#__PURE__*/React.createElement("div", {
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
  }, securityData.crl?.signature_preview || 'No CRL signature')))), /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
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
      color: '#0f172a',
      marginBottom: 8
    }
  }, "Quarantine Biochip Node"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.8rem',
      color: '#64748b',
      marginBottom: 14
    }
  }, "Immediately terminate all active session keys for a device, broadcast updated signed CRL, and alert gateway routers."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setDeviceToRevoke('');
      setRevokeResult(null);
      setRevokeError(null);
      setRevokeModalOpen(true);
    },
    className: "btn-primary",
    style: {
      backgroundColor: '#dc2626',
      borderColor: '#b91c1c'
    }
  }, /*#__PURE__*/React.createElement(Icons.ban, {
    size: 15
  }), "Issue Emergency Quarantine")))), /*#__PURE__*/React.createElement("div", {
    className: "surface-card",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.92rem',
      fontWeight: 600,
      color: '#0f172a',
      marginBottom: 14
    }
  }, "Quarantined Device Identifiers in CRL"), securityData.crl?.device_ids?.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10
    }
  }, securityData.crl.device_ids.map(id => /*#__PURE__*/React.createElement("div", {
    key: id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 12px',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: 6
    }
  }, /*#__PURE__*/React.createElement(Icons.ban, {
    size: 14,
    style: {
      color: '#b91c1c'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-mono",
    style: {
      fontSize: '0.82rem',
      fontWeight: 700,
      color: '#991b1b'
    }
  }, id)))) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      textAlign: 'center',
      color: '#64748b',
      fontSize: '0.82rem'
    }
  }, "No devices currently quarantined. Fleet is fully authorized.")))), provisionModalOpen && /*#__PURE__*/React.createElement("div", {
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
  }, /*#__PURE__*/React.createElement(Icons.plus, {
    size: 16
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.98rem',
      fontWeight: 700,
      color: '#0f172a'
    }
  }, "Enrol & Provision Biochip Node (Algorithm 1)")), /*#__PURE__*/React.createElement("button", {
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
  }, "Generates an out-of-band one-time enrolment code, generates local ", /*#__PURE__*/React.createElement("strong", null, "ML-KEM-768"), " (FIPS 203) & ", /*#__PURE__*/React.createElement("strong", null, "ML-DSA-65"), " (FIPS 204) post-quantum keypairs, signs proof-of-possession, and binds the device to the clinical hardware registry."), /*#__PURE__*/React.createElement("div", {
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
    placeholder: "e.g. DMFB-ICU-04",
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
  }), "Generate Quantum Keys & Enrol")))) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
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
  }, "Biochip Successfully Enrolled & Authorized"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#166534',
      fontSize: '0.75rem',
      marginTop: 2
    }
  }, "Bound to hospital hardware registry and hash-chained audit log."))), /*#__PURE__*/React.createElement("div", {
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
  }, "Done & Return to Fleet")))))), revokeModalOpen && /*#__PURE__*/React.createElement("div", {
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
      maxWidth: 520,
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
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Icons.ban, {
    size: 20,
    style: {
      color: '#b91c1c'
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.98rem',
      fontWeight: 700,
      color: '#0f172a'
    }
  }, "Quarantine Biochip Node")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setRevokeModalOpen(false),
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
  }, !revokeResult ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.82rem',
      color: '#475569',
      lineHeight: 1.5,
      marginBottom: 16
    }
  }, "Quarantining will mark the biochip as ", /*#__PURE__*/React.createElement("strong", null, "REVOKED"), ", destroy all active session keys in memory, and publish an updated ", /*#__PURE__*/React.createElement("strong", null, "ML-DSA-65 signed CRL"), " across the hospital network."), /*#__PURE__*/React.createElement("div", {
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
  }, "Device ID to Quarantine:"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: deviceToRevoke,
    onChange: e => setDeviceToRevoke(e.target.value),
    placeholder: "e.g. DMFB-ICU-04",
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
  }, "Quarantine Justification:"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: revokeReason,
    onChange: e => setRevokeReason(e.target.value),
    className: "form-input"
  })), revokeError && /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      padding: 10,
      borderRadius: 6,
      color: '#b91c1c',
      fontSize: '0.8rem',
      marginBottom: 14
    }
  }, revokeError), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setRevokeModalOpen(false),
    className: "btn-secondary"
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    onClick: handleRevokeDevice,
    disabled: revokeLoading || !deviceToRevoke,
    className: "btn-primary",
    style: {
      backgroundColor: '#dc2626',
      borderColor: '#b91c1c'
    }
  }, revokeLoading ? 'Quarantining & Signing CRL...' : 'Confirm Quarantine'))) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      padding: 14,
      borderRadius: 8,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Icons.checkCircle, {
    size: 22,
    style: {
      color: '#15803d'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.85rem',
      color: '#166534',
      fontWeight: 600
    }
  }, revokeResult.message)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setRevokeModalOpen(false),
    className: "btn-secondary"
  }, "Close")))))), diagnosticsModalOpen && /*#__PURE__*/React.createElement("div", {
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
  }, /*#__PURE__*/React.createElement(Icons.cpu, {
    size: 20,
    style: {
      color: '#15803d'
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.98rem',
      fontWeight: 700,
      color: '#0f172a'
    }
  }, "Gateway Cryptographic Stack & Host Diagnostics")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setDiagnosticsModalOpen(false),
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
  }, "Host RAM"), /*#__PURE__*/React.createElement("div", {
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
  }, info.environment?.liboqs_version || '0.16.0')), /*#__PURE__*/React.createElement("div", {
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
  }, "Cores (Phys / Log)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#0f172a',
      marginTop: 2
    }
  }, info.environment?.cpu_cores || 10, " / ", info.environment?.cpu_logical || 12))), /*#__PURE__*/React.createElement("div", {
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
  }, "Server ML-DSA-65 Verification Key:"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      color: '#15803d',
      fontSize: '0.72rem',
      wordBreak: 'break-all'
    }
  }, info.server_vk_preview || 'Loaded from server_keys.json')), /*#__PURE__*/React.createElement("div", {
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
  }, "SQLite Registry Database Path:"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      color: '#0f172a',
      fontSize: '0.74rem'
    }
  }, info.database_path || 'pqkms.db'))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 20px',
      borderTop: '1px solid #e2e8f0',
      textAlign: 'right',
      backgroundColor: '#f8fafc'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setDiagnosticsModalOpen(false),
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
  }, "Close")))), /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '1px solid #e2e8f0',
      backgroundColor: '#ffffff',
      padding: '16px 24px',
      textAlign: 'center',
      fontSize: '0.75rem',
      color: '#64748b'
    }
  }, "PQ-KMS Post-Quantum Cryptographic Framework \u2022 NIST FIPS 203 (ML-KEM-768) \u2022 NIST FIPS 204 (ML-DSA-65) \u2022 AES-256-GCM AEAD \u2022 FDA 21 CFR Part 11 Compliant Audit Log"));
}

  // Mount root
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(React.createElement(App));
  }
})();
