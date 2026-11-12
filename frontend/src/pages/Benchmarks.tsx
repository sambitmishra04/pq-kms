import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import {
  BarChart3,
  LineChart as LineChartIcon,
  AreaChart as AreaChartIcon,
  Cpu,
  Shield,
  Users,
  TrendingDown,
  Layers,
  HardDrive,
  Table as TableIcon,
  Copy,
  Check,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

type StudyId = 'primitives' | 'security_levels' | 'concurrency' | 'payloads' | 'amortization' | 'lifecycle';
type ChartType = 'bar' | 'line' | 'area';
type ViewMode = 'chart' | 'table';
type UnitType = 'ms' | 'us';

interface StudyMeta {
  id: StudyId;
  name: string;
  icon: any;
  description: string;
}

const STUDIES: StudyMeta[] = [
  {
    id: 'primitives',
    name: 'Cryptographic Primitives',
    icon: Cpu,
    description: 'Direct comparison between PQC lattice mechanisms and classical cryptography across key exchange, signatures, and symmetric AEAD.',
  },
  {
    id: 'security_levels',
    name: 'Security Categories',
    icon: Shield,
    description: 'Parameter sensitivity and performance trade-offs across Category 1 (128-bit), Category 3 (192-bit), and Category 5 (256-bit).',
  },
  {
    id: 'concurrency',
    name: 'Fleet Concurrency',
    icon: Users,
    description: 'Multi-device load scaling and gateway throughput from 1 to 50 concurrent active edge biochips.',
  },
  {
    id: 'payloads',
    name: 'Diagnostic Payloads',
    icon: HardDrive,
    description: 'End-to-end transaction latency across 128 B (voltage commands), 1 KiB (glucose telemetry), and 10 KiB (routing scripts).',
  },
  {
    id: 'amortization',
    name: 'Wire Amortization',
    icon: TrendingDown,
    description: 'Decay curve of per-message wire framing overhead as active session message count scales up to 1,000 readings.',
  },
  {
    id: 'lifecycle',
    name: 'Lifecycle Operations',
    icon: Layers,
    description: 'Computational latency for session key rollover, emergency CRL generation, and edge verifier anti-rollback checks.',
  },
];

export const Benchmarks: React.FC = () => {
  const [activeStudy, setActiveStudy] = useState<StudyId>('primitives');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  const [unit, setUnit] = useState<UnitType>('ms');
  const [copied, setCopied] = useState(false);

  // Filters within studies
  const [primitiveFilter, setPrimitiveFilter] = useState<'all' | 'key_exchange' | 'signatures' | 'symmetric'>('all');
  const [securityMetric, setSecurityMetric] = useState<'handshake' | 'keygen' | 'encap' | 'decap' | 'keysize'>('handshake');
  const [concurrencyMetric, setConcurrencyMetric] = useState<'both' | 'throughput' | 'latency'>('both');
  const [payloadMetric, setPayloadMetric] = useState<'total' | 'breakdown'>('total');

  const { theme } = useTheme();

  // Color theme mapping
  const gridColor = theme === 'dark' ? '#1e293b' : '#e2e8f0';
  const textColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const tooltipBg = theme === 'dark' ? '#0f172a' : '#ffffff';
  const tooltipBorder = theme === 'dark' ? '#334155' : '#cbd5e1';

  // Scale multiplier based on selected unit
  const scale = unit === 'us' ? 1000 : 1;
  const unitLabel = unit === 'us' ? 'µs' : 'ms';

  // Check if current study supports unit toggle
  const supportsUnitToggle = useMemo(() => {
    if (activeStudy === 'security_levels') return securityMetric !== 'keysize';
    return ['primitives', 'payloads', 'lifecycle'].includes(activeStudy);
  }, [activeStudy, securityMetric]);

  // ─── 1. Primitives Data (E1) ────────────────────────────────────────────────
  const rawPrimitivesData = useMemo(() => [
    { category: 'key_exchange', operation: 'Key Generation', pqc_ms: 0.106, classical_ms: 0.090 },
    { category: 'key_exchange', operation: 'Key Encapsulation / Agree', pqc_ms: 0.060, classical_ms: 0.085 },
    { category: 'key_exchange', operation: 'Key Decapsulation', pqc_ms: 0.045, classical_ms: 0.085 },
    { category: 'signatures', operation: 'Signature Gen (1 KB)', pqc_ms: 0.109, classical_ms: 0.080 },
    { category: 'signatures', operation: 'Signature Verify (1 KB)', pqc_ms: 0.102, classical_ms: 0.250 },
    { category: 'signatures', operation: 'Signature Verify (10 KB)', pqc_ms: 0.075, classical_ms: 0.260 },
    { category: 'symmetric', operation: 'AEAD Encrypt (1 KB)', pqc_ms: 0.0068, classical_ms: 0.0068 },
    { category: 'symmetric', operation: 'AEAD Decrypt (1 KB)', pqc_ms: 0.0091, classical_ms: 0.0091 },
  ], []);

  const primitivesData = useMemo(() => {
    const filtered = primitiveFilter === 'all' 
      ? rawPrimitivesData 
      : rawPrimitivesData.filter((d) => d.category === primitiveFilter);

    return filtered.map((d) => ({
      operation: d.operation,
      PQC: Number((d.pqc_ms * scale).toFixed(3)),
      Classical: Number((d.classical_ms * scale).toFixed(3)),
    }));
  }, [rawPrimitivesData, primitiveFilter, scale]);

  // ─── 2. Security Levels Data (E2) ──────────────────────────────────────────
  const securityLevelsData = useMemo(() => {
    return [
      {
        level: 'Category 1 (128-bit)',
        handshake_ms: 0.18,
        keygen_ms: 0.033,
        encap_ms: 0.046,
        decap_ms: 0.054,
        keysize_bytes: 2144,
      },
      {
        level: 'Category 3 (192-bit)',
        handshake_ms: 0.28,
        keygen_ms: 0.098,
        encap_ms: 0.111,
        decap_ms: 0.136,
        keysize_bytes: 3136,
      },
      {
        level: 'Category 5 (256-bit)',
        handshake_ms: 0.41,
        keygen_ms: 0.099,
        encap_ms: 0.069,
        decap_ms: 0.168,
        keysize_bytes: 4224,
      },
    ].map((d) => {
      let val = 0;
      let displayUnit = unitLabel;
      if (securityMetric === 'handshake') val = d.handshake_ms * scale;
      else if (securityMetric === 'keygen') val = d.keygen_ms * scale;
      else if (securityMetric === 'encap') val = d.encap_ms * scale;
      else if (securityMetric === 'decap') val = d.decap_ms * scale;
      else if (securityMetric === 'keysize') {
        val = d.keysize_bytes;
        displayUnit = 'Bytes';
      }

      return {
        level: d.level,
        Value: Number(val.toFixed(2)),
        unit: displayUnit,
      };
    });
  }, [securityMetric, scale, unitLabel]);

  // ─── 3. Concurrency Data (E5) ──────────────────────────────────────────────
  const concurrencyData = useMemo(() => [
    { clients: '1 Node', throughput: 45.5, meanLatency: 20.73, p95Latency: 20.73, successRate: 100 },
    { clients: '5 Nodes', throughput: 50.3, meanLatency: 64.21, p95Latency: 92.95, successRate: 100 },
    { clients: '10 Nodes', throughput: 58.2, meanLatency: 92.17, p95Latency: 145.52, successRate: 100 },
    { clients: '20 Nodes', throughput: 63.4, meanLatency: 178.46, p95Latency: 272.33, successRate: 100 },
    { clients: '30 Nodes', throughput: 57.6, meanLatency: 283.69, p95Latency: 460.63, successRate: 100 },
    { clients: '40 Nodes', throughput: 56.0, meanLatency: 300.19, p95Latency: 568.12, successRate: 100 },
    { clients: '50 Nodes', throughput: 65.6, meanLatency: 355.31, p95Latency: 607.58, successRate: 100 },
  ], []);

  // ─── 4. Payloads Data (E3) ─────────────────────────────────────────────────
  const payloadsData = useMemo(() => [
    {
      payload: '128 B (Voltage Vector)',
      'PQC Total': Number((35.04 * scale).toFixed(2)),
      'PQC Handshake': Number((19.03 * scale).toFixed(2)),
      'PQC Message': Number((16.01 * scale).toFixed(2)),
      'Classical Total': Number((0.96 * scale).toFixed(2)),
    },
    {
      payload: '1 KiB (Glucose Telemetry)',
      'PQC Total': Number((35.27 * scale).toFixed(2)),
      'PQC Handshake': Number((19.15 * scale).toFixed(2)),
      'PQC Message': Number((16.12 * scale).toFixed(2)),
      'Classical Total': Number((0.995 * scale).toFixed(2)),
    },
    {
      payload: '10 KiB (Routing Script)',
      'PQC Total': Number((35.93 * scale).toFixed(2)),
      'PQC Handshake': Number((19.45 * scale).toFixed(2)),
      'PQC Message': Number((16.48 * scale).toFixed(2)),
      'Classical Total': Number((1.085 * scale).toFixed(2)),
    },
  ], [scale]);

  // ─── 5. Amortization Curve (E4) ────────────────────────────────────────────
  const amortizationData = useMemo(() => [
    { messages: 1, effectiveBytes: 10420, overheadPct: 100 },
    { messages: 10, effectiveBytes: 1066, overheadPct: 9.3 },
    { messages: 50, effectiveBytes: 232, overheadPct: 2.1 },
    { messages: 100, effectiveBytes: 128, overheadPct: 0.98 },
    { messages: 250, effectiveBytes: 74, overheadPct: 0.58 },
    { messages: 500, effectiveBytes: 45, overheadPct: 0.35 },
    { messages: 750, effectiveBytes: 38, overheadPct: 0.28 },
    { messages: 1000, effectiveBytes: 34, overheadPct: 0.23 },
  ], []);

  // ─── 6. Key Lifecycle Operations Data (E7) ─────────────────────────────────
  const lifecycleData = useMemo(() => [
    { operation: 'Session Rollover', latency: Number((0.140 * scale).toFixed(3)), sd: Number((0.020 * scale).toFixed(3)) },
    { operation: 'CRL Generation & Signing', latency: Number((0.345 * scale).toFixed(3)), sd: Number((0.183 * scale).toFixed(3)) },
    { operation: 'Verifier CRL Anti-Rollback Check', latency: Number((0.130 * scale).toFixed(3)), sd: Number((0.009 * scale).toFixed(3)) },
  ], [scale]);

  // Copy active study data as CSV
  const handleCopyData = () => {
    let csv = '';
    if (activeStudy === 'primitives') {
      csv = 'Operation,PQC (' + unitLabel + '),Classical (' + unitLabel + ')\n' +
        primitivesData.map((r) => `"${r.operation}",${r.PQC},${r.Classical}`).join('\n');
    } else if (activeStudy === 'security_levels') {
      csv = 'Security Level,Value,Unit\n' +
        securityLevelsData.map((r) => `"${r.level}",${r.Value},${r.unit}`).join('\n');
    } else if (activeStudy === 'concurrency') {
      csv = 'Concurrent Clients,Throughput (req/s),Mean Latency (ms),P95 Latency (ms),Success Rate (%)\n' +
        concurrencyData.map((r) => `"${r.clients}",${r.throughput},${r.meanLatency},${r.p95Latency},${r.successRate}`).join('\n');
    } else if (activeStudy === 'payloads') {
      csv = 'Payload Size,PQC Total (' + unitLabel + '),PQC Handshake (' + unitLabel + '),PQC Message (' + unitLabel + '),Classical Total (' + unitLabel + ')\n' +
        payloadsData.map((r) => `"${r.payload}",${r['PQC Total']},${r['PQC Handshake']},${r['PQC Message']},${r['Classical Total']}`).join('\n');
    } else if (activeStudy === 'amortization') {
      csv = 'Messages in Session,Effective Bytes per Message,Overhead Percentage\n' +
        amortizationData.map((r) => `${r.messages},${r.effectiveBytes},${r.overheadPct}%`).join('\n');
    } else if (activeStudy === 'lifecycle') {
      csv = 'Lifecycle Operation,Latency (' + unitLabel + '),Standard Deviation (' + unitLabel + ')\n' +
        lifecycleData.map((r) => `"${r.operation}",${r.latency},${r.sd}`).join('\n');
    }

    navigator.clipboard.writeText(csv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Active Chart Renderer (Guarantees every chart type works for every study)
  const renderActiveChart = () => {
    switch (activeStudy) {
      case 'primitives':
        if (chartType === 'line') {
          return (
            <LineChart data={primitivesData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="operation" stroke={textColor} tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis stroke={textColor} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', fontSize: '11px', color: theme === 'dark' ? '#f1f5f9' : '#0f172a' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="PQC" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Classical" stroke="#94a3b8" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          );
        }
        if (chartType === 'area') {
          return (
            <AreaChart data={primitivesData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
              <defs>
                <linearGradient id="pqcGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="classGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="operation" stroke={textColor} tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis stroke={textColor} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', fontSize: '11px', color: theme === 'dark' ? '#f1f5f9' : '#0f172a' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="PQC" stroke="#0d9488" fillOpacity={1} fill="url(#pqcGrad)" />
              <Area type="monotone" dataKey="Classical" stroke="#94a3b8" fillOpacity={1} fill="url(#classGrad)" />
            </AreaChart>
          );
        }
        return (
          <BarChart data={primitivesData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="operation" stroke={textColor} tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={50} />
            <YAxis stroke={textColor} tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', fontSize: '11px', color: theme === 'dark' ? '#f1f5f9' : '#0f172a' }} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            <Bar dataKey="PQC" fill="#0d9488" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Classical" fill="#94a3b8" radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      case 'security_levels':
        if (chartType === 'line') {
          return (
            <LineChart data={securityLevelsData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="level" stroke={textColor} tick={{ fontSize: 11 }} />
              <YAxis stroke={textColor} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', fontSize: '11px', color: theme === 'dark' ? '#f1f5f9' : '#0f172a' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="Value" name={`Value (${securityLevelsData[0]?.unit})`} stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 5 }} />
            </LineChart>
          );
        }
        if (chartType === 'area') {
          return (
            <AreaChart data={securityLevelsData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <defs>
                <linearGradient id="secGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="level" stroke={textColor} tick={{ fontSize: 11 }} />
              <YAxis stroke={textColor} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', fontSize: '11px', color: theme === 'dark' ? '#f1f5f9' : '#0f172a' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="Value" name={`Value (${securityLevelsData[0]?.unit})`} stroke="#7c3aed" fillOpacity={1} fill="url(#secGrad)" />
            </AreaChart>
          );
        }
        return (
          <BarChart data={securityLevelsData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="level" stroke={textColor} tick={{ fontSize: 11 }} />
            <YAxis stroke={textColor} tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', fontSize: '11px', color: theme === 'dark' ? '#f1f5f9' : '#0f172a' }} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            <Bar dataKey="Value" name={`Value (${securityLevelsData[0]?.unit})`} fill="#7c3aed" radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      case 'concurrency':
        if (chartType === 'bar') {
          return (
            <BarChart data={concurrencyData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="clients" stroke={textColor} tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" stroke="#0d9488" tick={{ fontSize: 11 }} />
              {concurrencyMetric === 'both' && (
                <YAxis yAxisId="right" orientation="right" stroke="#ef4444" tick={{ fontSize: 11 }} />
              )}
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', fontSize: '11px', color: theme === 'dark' ? '#f1f5f9' : '#0f172a' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              {(concurrencyMetric === 'both' || concurrencyMetric === 'throughput') && (
                <Bar yAxisId="left" dataKey="throughput" name="Throughput (req/s)" fill="#0d9488" radius={[4, 4, 0, 0]} />
              )}
              {(concurrencyMetric === 'both' || concurrencyMetric === 'latency') && (
                <Bar yAxisId={concurrencyMetric === 'both' ? 'right' : 'left'} dataKey="p95Latency" name="P95 Latency (ms)" fill="#ef4444" radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          );
        }
        if (chartType === 'area') {
          return (
            <AreaChart data={concurrencyData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <defs>
                <linearGradient id="tputGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="latGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="clients" stroke={textColor} tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" stroke="#0d9488" tick={{ fontSize: 11 }} />
              {concurrencyMetric === 'both' && (
                <YAxis yAxisId="right" orientation="right" stroke="#ef4444" tick={{ fontSize: 11 }} />
              )}
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', fontSize: '11px', color: theme === 'dark' ? '#f1f5f9' : '#0f172a' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              {(concurrencyMetric === 'both' || concurrencyMetric === 'throughput') && (
                <Area yAxisId="left" type="monotone" dataKey="throughput" name="Throughput (req/s)" stroke="#0d9488" fillOpacity={1} fill="url(#tputGrad)" />
              )}
              {(concurrencyMetric === 'both' || concurrencyMetric === 'latency') && (
                <Area yAxisId={concurrencyMetric === 'both' ? 'right' : 'left'} type="monotone" dataKey="p95Latency" name="P95 Latency (ms)" stroke="#ef4444" fillOpacity={1} fill="url(#latGrad)" />
              )}
            </AreaChart>
          );
        }
        return (
          <LineChart data={concurrencyData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="clients" stroke={textColor} tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left" stroke="#0d9488" tick={{ fontSize: 11 }} />
            {concurrencyMetric === 'both' && (
              <YAxis yAxisId="right" orientation="right" stroke="#ef4444" tick={{ fontSize: 11 }} />
            )}
            <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', fontSize: '11px', color: theme === 'dark' ? '#f1f5f9' : '#0f172a' }} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            {(concurrencyMetric === 'both' || concurrencyMetric === 'throughput') && (
              <Line yAxisId="left" type="monotone" dataKey="throughput" name="Throughput (req/s)" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 4 }} />
            )}
            {(concurrencyMetric === 'both' || concurrencyMetric === 'latency') && (
              <Line yAxisId={concurrencyMetric === 'both' ? 'right' : 'left'} type="monotone" dataKey="p95Latency" name="P95 Latency (ms)" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 4 }} />
            )}
          </LineChart>
        );

      case 'payloads':
        if (chartType === 'line') {
          return (
            <LineChart data={payloadsData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="payload" stroke={textColor} tick={{ fontSize: 11 }} />
              <YAxis stroke={textColor} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', fontSize: '11px', color: theme === 'dark' ? '#f1f5f9' : '#0f172a' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              {payloadMetric === 'total' ? (
                <>
                  <Line type="monotone" dataKey="PQC Total" name={`PQC Total (${unitLabel})`} stroke="#0d9488" strokeWidth={2.5} dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="Classical Total" name={`Classical Total (${unitLabel})`} stroke="#94a3b8" strokeWidth={2.5} dot={{ r: 5 }} />
                </>
              ) : (
                <>
                  <Line type="monotone" dataKey="PQC Handshake" name={`PQC Handshake (${unitLabel})`} stroke="#0d9488" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="PQC Message" name={`PQC Message (${unitLabel})`} stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Classical Total" name={`Classical Total (${unitLabel})`} stroke="#94a3b8" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 4 }} />
                </>
              )}
            </LineChart>
          );
        }
        if (chartType === 'area') {
          return (
            <AreaChart data={payloadsData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <defs>
                <linearGradient id="pqcTotalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="classTotalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="payload" stroke={textColor} tick={{ fontSize: 11 }} />
              <YAxis stroke={textColor} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', fontSize: '11px', color: theme === 'dark' ? '#f1f5f9' : '#0f172a' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="PQC Total" name={`PQC Total (${unitLabel})`} stroke="#0d9488" fillOpacity={1} fill="url(#pqcTotalGrad)" />
              <Area type="monotone" dataKey="Classical Total" name={`Classical Total (${unitLabel})`} stroke="#94a3b8" fillOpacity={1} fill="url(#classTotalGrad)" />
            </AreaChart>
          );
        }
        return (
          <BarChart data={payloadsData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="payload" stroke={textColor} tick={{ fontSize: 11 }} />
            <YAxis stroke={textColor} tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', fontSize: '11px', color: theme === 'dark' ? '#f1f5f9' : '#0f172a' }} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            {payloadMetric === 'total' ? (
              <>
                <Bar dataKey="PQC Total" name={`PQC Total (${unitLabel})`} fill="#0d9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Classical Total" name={`Classical Total (${unitLabel})`} fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </>
            ) : (
              <>
                <Bar dataKey="PQC Handshake" name={`PQC Handshake (${unitLabel})`} fill="#0d9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="PQC Message" name={`PQC Message (${unitLabel})`} fill="#7c3aed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Classical Total" name={`Classical Total (${unitLabel})`} fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </>
            )}
          </BarChart>
        );

      case 'amortization':
        if (chartType === 'bar') {
          return (
            <BarChart data={amortizationData} margin={{ top: 10, right: 20, left: 0, bottom: 15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="messages" stroke={textColor} tick={{ fontSize: 11 }} label={{ value: 'Messages in Session', position: 'insideBottom', offset: -10, fontSize: 11, fill: textColor }} />
              <YAxis stroke={textColor} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', fontSize: '11px', color: theme === 'dark' ? '#f1f5f9' : '#0f172a' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="effectiveBytes" name="Effective Bytes / Msg" fill="#d97706" radius={[4, 4, 0, 0]} />
            </BarChart>
          );
        }
        if (chartType === 'area') {
          return (
            <AreaChart data={amortizationData} margin={{ top: 10, right: 20, left: 0, bottom: 15 }}>
              <defs>
                <linearGradient id="amortGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="messages" stroke={textColor} tick={{ fontSize: 11 }} label={{ value: 'Messages in Session', position: 'insideBottom', offset: -10, fontSize: 11, fill: textColor }} />
              <YAxis stroke={textColor} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', fontSize: '11px', color: theme === 'dark' ? '#f1f5f9' : '#0f172a' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="effectiveBytes" name="Effective Bytes / Msg" stroke="#d97706" fillOpacity={1} fill="url(#amortGrad)" />
            </AreaChart>
          );
        }
        return (
          <LineChart data={amortizationData} margin={{ top: 10, right: 20, left: 0, bottom: 15 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="messages" stroke={textColor} tick={{ fontSize: 11 }} label={{ value: 'Messages in Session', position: 'insideBottom', offset: -10, fontSize: 11, fill: textColor }} />
            <YAxis stroke={textColor} tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', fontSize: '11px', color: theme === 'dark' ? '#f1f5f9' : '#0f172a' }} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            <Line type="monotone" dataKey="effectiveBytes" name="Effective Bytes / Msg" stroke="#d97706" strokeWidth={2.5} dot={{ r: 4 }} />
          </LineChart>
        );

      case 'lifecycle':
        if (chartType === 'line') {
          return (
            <LineChart data={lifecycleData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="operation" stroke={textColor} tick={{ fontSize: 11 }} />
              <YAxis stroke={textColor} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', fontSize: '11px', color: theme === 'dark' ? '#f1f5f9' : '#0f172a' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="latency" name={`Mean Latency (${unitLabel})`} stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 5 }} />
            </LineChart>
          );
        }
        if (chartType === 'area') {
          return (
            <AreaChart data={lifecycleData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <defs>
                <linearGradient id="lifeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="operation" stroke={textColor} tick={{ fontSize: 11 }} />
              <YAxis stroke={textColor} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', fontSize: '11px', color: theme === 'dark' ? '#f1f5f9' : '#0f172a' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="latency" name={`Mean Latency (${unitLabel})`} stroke="#3b82f6" fillOpacity={1} fill="url(#lifeGrad)" />
            </AreaChart>
          );
        }
        return (
          <BarChart data={lifecycleData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="operation" stroke={textColor} tick={{ fontSize: 11 }} />
            <YAxis stroke={textColor} tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', fontSize: '11px', color: theme === 'dark' ? '#f1f5f9' : '#0f172a' }} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            <Bar dataKey="latency" name={`Mean Latency (${unitLabel})`} fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Cryptographic Performance Telemetry
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Empirical benchmark analytics, parameter sensitivity studies, and fleet scalability profiles.
          </p>
        </div>

        {/* Global Action: Copy CSV */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyData}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 text-xs font-medium shadow-2xs transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'CSV Copied' : 'Export Study Data'}</span>
          </button>
        </div>
      </div>

      {/* 4 Summary KPI Cards (Cleaned of all subtexts) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#101726] border border-slate-200 dark:border-teal-500/30 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase font-mono">
            Key Encapsulation
          </span>
          <p className="text-2xl font-bold font-mono text-teal-700 dark:text-teal-300">0.060 ms</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#101726] border border-slate-200 dark:border-purple-500/30 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase font-mono">
            Signature Verify
          </span>
          <p className="text-2xl font-bold font-mono text-purple-700 dark:text-purple-300">0.102 ms</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#101726] border border-slate-200 dark:border-amber-500/30 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase font-mono">
            Amortized Wire
          </span>
          <p className="text-2xl font-bold font-mono text-amber-700 dark:text-amber-300">34 Bytes / Msg</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#101726] border border-slate-200 dark:border-emerald-500/30 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase font-mono">
            Fleet Peak Throughput
          </span>
          <p className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400">65.6 req/s</p>
        </div>
      </div>

      {/* Interactive Study Selector Pills */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
        {STUDIES.map((study) => {
          const Icon = study.icon;
          const isActive = activeStudy === study.id;
          return (
            <button
              key={study.id}
              onClick={() => setActiveStudy(study.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{study.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Studio Panel */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-lg space-y-5">
        {/* Study Header & Interactive Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {STUDIES.find((s) => s.id === activeStudy)?.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {STUDIES.find((s) => s.id === activeStudy)?.description}
            </p>
          </div>

          {/* Controls: Chart Type, Unit Toggle, Field Selector, View Mode */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Field Filter for Primitives */}
            {activeStudy === 'primitives' && (
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-[11px]">
                <button
                  onClick={() => setPrimitiveFilter('all')}
                  className={`px-2 py-1 rounded transition-colors ${primitiveFilter === 'all' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setPrimitiveFilter('key_exchange')}
                  className={`px-2 py-1 rounded transition-colors ${primitiveFilter === 'key_exchange' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                  Key Exchange
                </button>
                <button
                  onClick={() => setPrimitiveFilter('signatures')}
                  className={`px-2 py-1 rounded transition-colors ${primitiveFilter === 'signatures' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                  Signatures
                </button>
                <button
                  onClick={() => setPrimitiveFilter('symmetric')}
                  className={`px-2 py-1 rounded transition-colors ${primitiveFilter === 'symmetric' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                  Symmetric AEAD
                </button>
              </div>
            )}

            {/* Field Selector for Security Levels */}
            {activeStudy === 'security_levels' && (
              <select
                value={securityMetric}
                onChange={(e) => setSecurityMetric(e.target.value as any)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-teal-500 font-sans cursor-pointer"
              >
                <option value="handshake">Total Handshake Latency</option>
                <option value="keygen">Key Generation</option>
                <option value="encap">Key Encapsulation</option>
                <option value="decap">Key Decapsulation</option>
                <option value="keysize">Public Key Footprint (Bytes)</option>
              </select>
            )}

            {/* Field Selector for Concurrency */}
            {activeStudy === 'concurrency' && (
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px]">
                <button
                  onClick={() => setConcurrencyMetric('both')}
                  className={`px-2 py-1 rounded transition-colors ${concurrencyMetric === 'both' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                  Combined
                </button>
                <button
                  onClick={() => setConcurrencyMetric('throughput')}
                  className={`px-2 py-1 rounded transition-colors ${concurrencyMetric === 'throughput' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                  Throughput
                </button>
                <button
                  onClick={() => setConcurrencyMetric('latency')}
                  className={`px-2 py-1 rounded transition-colors ${concurrencyMetric === 'latency' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                  P95 Latency
                </button>
              </div>
            )}

            {/* Field Selector for Payloads */}
            {activeStudy === 'payloads' && (
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px]">
                <button
                  onClick={() => setPayloadMetric('total')}
                  className={`px-2 py-1 rounded transition-colors ${payloadMetric === 'total' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                  Total Latency
                </button>
                <button
                  onClick={() => setPayloadMetric('breakdown')}
                  className={`px-2 py-1 rounded transition-colors ${payloadMetric === 'breakdown' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                  Component Breakdown
                </button>
              </div>
            )}

            {/* Unit Switcher: ms vs us (for time-based metrics) */}
            {supportsUnitToggle && (
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] font-mono">
                <button
                  onClick={() => setUnit('ms')}
                  className={`px-2 py-1 rounded transition-colors ${unit === 'ms' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                  ms
                </button>
                <button
                  onClick={() => setUnit('us')}
                  className={`px-2 py-1 rounded transition-colors ${unit === 'us' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                  µs
                </button>
              </div>
            )}

            {/* Chart Style Switcher (Bar vs Line vs Area) - Active for ALL studies in Chart view */}
            {viewMode === 'chart' && (
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setChartType('bar')}
                  className={`p-1.5 rounded transition-colors ${chartType === 'bar' ? 'bg-teal-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'}`}
                  title="Bar Chart"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setChartType('line')}
                  className={`p-1.5 rounded transition-colors ${chartType === 'line' ? 'bg-teal-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'}`}
                  title="Line Chart"
                >
                  <LineChartIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setChartType('area')}
                  className={`p-1.5 rounded transition-colors ${chartType === 'area' ? 'bg-teal-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'}`}
                  title="Area Chart"
                >
                  <AreaChartIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* View Mode: Chart vs Table */}
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setViewMode('chart')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${viewMode === 'chart' ? 'bg-teal-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
              >
                Chart
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors ${viewMode === 'table' ? 'bg-teal-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
              >
                <TableIcon className="w-3 h-3" /> Table
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Display: Chart View vs Table View */}
        {viewMode === 'chart' ? (
          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {renderActiveChart()}
            </ResponsiveContainer>
          </div>
        ) : (
          /* Table View */
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold uppercase tracking-wider font-mono text-[10px]">
                {activeStudy === 'primitives' && (
                  <tr>
                    <th className="px-4 py-3">Cryptographic Operation</th>
                    <th className="px-4 py-3 text-right">PQC ({unitLabel})</th>
                    <th className="px-4 py-3 text-right">Classical ({unitLabel})</th>
                    <th className="px-4 py-3 text-right">Delta / Speedup</th>
                  </tr>
                )}
                {activeStudy === 'security_levels' && (
                  <tr>
                    <th className="px-4 py-3">Security Level</th>
                    <th className="px-4 py-3 text-right">Value</th>
                    <th className="px-4 py-3 text-right">Unit</th>
                  </tr>
                )}
                {activeStudy === 'concurrency' && (
                  <tr>
                    <th className="px-4 py-3">Concurrent Nodes</th>
                    <th className="px-4 py-3 text-right">Throughput (req/s)</th>
                    <th className="px-4 py-3 text-right">Mean Latency (ms)</th>
                    <th className="px-4 py-3 text-right">P95 Latency (ms)</th>
                    <th className="px-4 py-3 text-right">Success Rate</th>
                  </tr>
                )}
                {activeStudy === 'payloads' && (
                  <tr>
                    <th className="px-4 py-3">Diagnostic Payload</th>
                    <th className="px-4 py-3 text-right">PQC Total ({unitLabel})</th>
                    <th className="px-4 py-3 text-right">Handshake ({unitLabel})</th>
                    <th className="px-4 py-3 text-right">Message ({unitLabel})</th>
                    <th className="px-4 py-3 text-right">Classical Total ({unitLabel})</th>
                  </tr>
                )}
                {activeStudy === 'amortization' && (
                  <tr>
                    <th className="px-4 py-3">Session Messages</th>
                    <th className="px-4 py-3 text-right">Effective Wire Size (Bytes/Msg)</th>
                    <th className="px-4 py-3 text-right">Overhead Percentage</th>
                  </tr>
                )}
                {activeStudy === 'lifecycle' && (
                  <tr>
                    <th className="px-4 py-3">Lifecycle Operation</th>
                    <th className="px-4 py-3 text-right">Mean Latency ({unitLabel})</th>
                    <th className="px-4 py-3 text-right">Std Dev ({unitLabel})</th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {activeStudy === 'primitives' && primitivesData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-2.5 font-sans font-medium text-slate-800 dark:text-slate-200">{row.operation}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-teal-600 dark:text-teal-400">{row.PQC}</td>
                    <td className="px-4 py-2.5 text-right text-slate-500">{row.Classical}</td>
                    <td className="px-4 py-2.5 text-right text-emerald-600 dark:text-emerald-400 font-sans">
                      {row.PQC < row.Classical ? `${((row.Classical / row.PQC)).toFixed(2)}x Faster` : `${((row.PQC / row.Classical)).toFixed(2)}x Baseline`}
                    </td>
                  </tr>
                ))}
                {activeStudy === 'security_levels' && securityLevelsData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-2.5 font-sans font-medium text-slate-800 dark:text-slate-200">{row.level}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-purple-600 dark:text-purple-400">{row.Value}</td>
                    <td className="px-4 py-2.5 text-right text-slate-500">{row.unit}</td>
                  </tr>
                ))}
                {activeStudy === 'concurrency' && concurrencyData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-2.5 font-sans font-medium text-slate-800 dark:text-slate-200">{row.clients}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-teal-600 dark:text-teal-400">{row.throughput} req/s</td>
                    <td className="px-4 py-2.5 text-right text-slate-500">{row.meanLatency} ms</td>
                    <td className="px-4 py-2.5 text-right text-amber-600 dark:text-amber-400">{row.p95Latency} ms</td>
                    <td className="px-4 py-2.5 text-right text-emerald-600 font-bold">{row.successRate}%</td>
                  </tr>
                ))}
                {activeStudy === 'payloads' && payloadsData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-2.5 font-sans font-medium text-slate-800 dark:text-slate-200">{row.payload}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-teal-600 dark:text-teal-400">{row['PQC Total']}</td>
                    <td className="px-4 py-2.5 text-right text-slate-500">{row['PQC Handshake']}</td>
                    <td className="px-4 py-2.5 text-right text-slate-500">{row['PQC Message']}</td>
                    <td className="px-4 py-2.5 text-right text-slate-500">{row['Classical Total']}</td>
                  </tr>
                ))}
                {activeStudy === 'amortization' && amortizationData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-2.5 font-sans font-medium text-slate-800 dark:text-slate-200">{row.messages} msgs</td>
                    <td className="px-4 py-2.5 text-right font-bold text-amber-600 dark:text-amber-400">{row.effectiveBytes} B/msg</td>
                    <td className="px-4 py-2.5 text-right text-slate-500">{row.overheadPct}%</td>
                  </tr>
                ))}
                {activeStudy === 'lifecycle' && lifecycleData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-2.5 font-sans font-medium text-slate-800 dark:text-slate-200">{row.operation}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-blue-600 dark:text-blue-400">{row.latency}</td>
                    <td className="px-4 py-2.5 text-right text-slate-500">± {row.sd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
