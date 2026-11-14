import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Stethoscope,
  HeartPulse,
  Activity,
  AlertCircle,
  CheckCircle2,
  FileText,
  Lock,
  Search,
  Droplet,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RotateCw,
  Syringe,
  Pill,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Cpu,
  Fingerprint,
  Info,
  X,
  Radio,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';
import { CopyBadge } from '../components/common/CopyBadge';
import { Modal } from '../components/common/Modal';
import { api } from '../api/client';
import type { PatientRecord, PatientListResponse, ClinicianTamperResult } from '../types';

export const DoctorPortal: React.FC = () => {
  const { user } = useAuth();

  // State
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('PAT-4821');
  const [totalPatients, setTotalPatients] = useState<number>(0);
  const [summary, setSummary] = useState<{
    total_patients: number;
    critical_count: number;
    warning_count: number;
    stable_count: number;
    active_biochips: number;
    revoked_biochips: number;
  }>({
    total_patients: 0,
    critical_count: 0,
    warning_count: 0,
    stable_count: 0,
    active_biochips: 0,
    revoked_biochips: 0,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [deviceFilter, setDeviceFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(12);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Action states
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string; eventId?: string } | null>(null);

  // Intervention Modal
  const [showInterventionModal, setShowInterventionModal] = useState<boolean>(false);
  const [interventionProtocol, setInterventionProtocol] = useState<string>('Subcutaneous Regular Insulin');
  const [interventionDosage, setInterventionDosage] = useState<string>('8 Units');
  const [interventionNotes, setInterventionNotes] = useState<string>('');

  // Bioassay Re-run Simulation Modal / Indicator
  const [showAssayModal, setShowAssayModal] = useState<boolean>(false);
  const [assayResult, setAssayResult] = useState<{
    steps: any[];
    sensor_reading: any;
    measured_glucose: number;
    absorbance: number;
  } | null>(null);

  // Tamper Simulation Modal
  const [showTamperModal, setShowTamperModal] = useState<boolean>(false);
  const [tamperDetail, setTamperDetail] = useState<ClinicianTamperResult | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Fetch patient telemetry
  const fetchPatients = useCallback(async (page: number = currentPage, isBackground: boolean = false) => {
    if (!isBackground) setLoading(true);
    else setRefreshing(true);

    try {
      const res: PatientListResponse = await api.getClinicianPatients({
        search: searchTerm,
        status: statusFilter,
        device_status: deviceFilter,
        page,
        page_size: pageSize,
      });

      setPatients(res.patients);
      setTotalPatients(res.total);
      setTotalPages(res.total_pages);
      setSummary(res.summary);

      // Ensure a valid selected patient
      if (res.patients.length > 0) {
        const exists = res.patients.some((p) => p.patient_id === selectedPatientId);
        if (!exists && page === 1 && !searchTerm && statusFilter === 'ALL') {
          setSelectedPatientId(res.patients[0].patient_id);
        } else if (!exists && res.patients.length > 0) {
          setSelectedPatientId(res.patients[0].patient_id);
        }
      }
    } catch (err: any) {
      console.error('Failed to load patient telemetry:', err);
      setToastMessage({
        type: 'error',
        text: 'Failed to connect to Biochip Telemetry API. Check backend connectivity.',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchTerm, statusFilter, deviceFilter, currentPage, pageSize, selectedPatientId]);

  useEffect(() => {
    fetchPatients(1);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, deviceFilter]);

  useEffect(() => {
    fetchPatients(currentPage);
  }, [currentPage]);

  // Find currently selected patient
  const selectedPatient = useMemo(() => {
    const found = patients.find((p) => p.patient_id === selectedPatientId);
    return found || patients[0] || null;
  }, [patients, selectedPatientId]);

  // Handle Acknowledge Reading
  const handleAcknowledge = async () => {
    if (!selectedPatient) return;
    setActionLoading('acknowledge');
    try {
      const res = await api.acknowledgePatientReading(
        selectedPatient.patient_id,
        `Telemetry reviewed by ${user?.full_name || 'Clinician'}`
      );
      setToastMessage({
        type: 'success',
        text: `Clinical reading for ${selectedPatient.name} acknowledged and sealed in Forensic Audit Ledger.`,
        eventId: res.audit_event_id,
      });
      // Refresh patient data in background
      await fetchPatients(currentPage, true);
    } catch (err: any) {
      setToastMessage({
        type: 'error',
        text: 'Failed to record acknowledgment: ' + (err.response?.data?.detail || err.message),
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Clinical Intervention Submission
  const handleDispatchIntervention = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    setActionLoading('intervention');
    try {
      const res = await api.orderClinicalIntervention(selectedPatient.patient_id, {
        protocol: interventionProtocol,
        dosage: interventionDosage,
        notes: interventionNotes,
      });
      setShowInterventionModal(false);
      setInterventionNotes('');
      setToastMessage({
        type: 'success',
        text: `Clinical intervention dispatched: ${res.protocol}. Recorded in Merkle audit ledger.`,
        eventId: res.audit_event_id,
      });
      await fetchPatients(currentPage, true);
    } catch (err: any) {
      setToastMessage({
        type: 'error',
        text: 'Failed to order intervention: ' + (err.response?.data?.detail || err.message),
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Live Bioassay Re-run
  const handleRerunAssay = async () => {
    if (!selectedPatient) return;
    setActionLoading('rerun');
    try {
      const res = await api.rerunBioassay(selectedPatient.patient_id);
      setAssayResult({
        steps: res.steps,
        sensor_reading: res.sensor_reading,
        measured_glucose: res.patient.glucose_mg_dl,
        absorbance: res.sensor_reading?.absorbance_au || 0.6,
      });
      setShowAssayModal(true);
      setToastMessage({
        type: 'success',
        text: `Live DMFB bioassay executed on ${selectedPatient.device_id}. Optical detector measured ${res.patient.glucose_mg_dl} mg/dL.`,
        eventId: res.audit_event_id,
      });
      await fetchPatients(currentPage, true);
    } catch (err: any) {
      setToastMessage({
        type: 'error',
        text: 'Bioassay execution failed: ' + (err.response?.data?.detail || err.message),
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Simulate MITM Tamper
  const handleSimulateTamper = async () => {
    if (!selectedPatient) return;
    setActionLoading('tamper');
    try {
      const res = await api.simulateClinicianTamper(selectedPatient.patient_id);
      setTamperDetail(res);
      setShowTamperModal(true);
      setToastMessage({
        type: 'warning',
        text: `Tamper simulation triggered on ${selectedPatient.device_id}! AEAD GCM tag failed verification.`,
        eventId: res.audit_event_id,
      });
      await fetchPatients(currentPage, true);
    } catch (err: any) {
      setToastMessage({
        type: 'error',
        text: 'Failed to simulate tamper: ' + (err.response?.data?.detail || err.message),
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Reset Tamper
  const handleResetTamper = async () => {
    if (!selectedPatient) return;
    setActionLoading('reset_tamper');
    try {
      await api.resetClinicianTamper(selectedPatient.patient_id);
      setShowTamperModal(false);
      setToastMessage({
        type: 'success',
        text: `Tamper alert reset for ${selectedPatient.name}. Telemetry integrity restored to Verified.`,
      });
      await fetchPatients(currentPage, true);
    } catch (err: any) {
      setToastMessage({
        type: 'error',
        text: 'Failed to reset tamper state: ' + (err.response?.data?.detail || err.message),
      });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs shadow-md transition-all ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
              : toastMessage.type === 'warning'
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
            {toastMessage.type === 'warning' && <AlertTriangle className="w-4 h-4 shrink-0" />}
            {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{toastMessage.text}</span>
            {toastMessage.eventId && (
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/60 dark:bg-black/30 border border-current">
                Audit Event: {toastMessage.eventId.slice(0, 8)}...
              </span>
            )}
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-current opacity-70 hover:opacity-100 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Clinician Telemetry & Diagnostic Portal
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Attending Physician: <strong className="text-slate-800 dark:text-slate-200">{user?.full_name || 'Dr. Priya Sharma'}</strong> • Live point-of-care digital microfluidic telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Security Alert Pill (only displayed if an active security alert or revocation is present) */}
          {selectedPatient?.is_tampered ? (
            <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg border shadow-2xs bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>AEAD Tag Mismatch: Tampered</span>
            </div>
          ) : selectedPatient?.device_status === 'REVOKED' ? (
            <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg border shadow-2xs bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>CRL Revoked Biochip Node</span>
            </div>
          ) : null}

          {/* Refresh Button */}
          <button
            onClick={() => fetchPatients(currentPage, true)}
            disabled={refreshing || loading}
            className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors shadow-2xs disabled:opacity-50"
            title="Refresh patient telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-teal-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Population Overview Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3 rounded-xl bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Monitored Cohort</span>
          <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
            {summary.total_patients}
          </span>
          <span className="text-[10px] text-slate-400">Total clinical profiles</span>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'CRITICAL' ? 'ALL' : 'CRITICAL')}
          className={`p-3 rounded-xl border cursor-pointer transition-all ${
            statusFilter === 'CRITICAL'
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 shadow-xs'
              : 'bg-white dark:bg-[#101726] border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 uppercase">Critical Triage</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </div>
          <span className="text-xl font-bold font-mono text-rose-700 dark:text-rose-400 mt-0.5 block">
            {summary.critical_count}
          </span>
          <span className="text-[10px] text-slate-400">Glucose &lt;70 or &ge;200</span>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'WARNING' ? 'ALL' : 'WARNING')}
          className={`p-3 rounded-xl border cursor-pointer transition-all ${
            statusFilter === 'WARNING'
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 shadow-xs'
              : 'bg-white dark:bg-[#101726] border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 uppercase block">Impaired / Warning</span>
          <span className="text-xl font-bold font-mono text-amber-700 dark:text-amber-400 mt-0.5 block">
            {summary.warning_count}
          </span>
          <span className="text-[10px] text-slate-400">Pre-diabetes / Glycemic surge</span>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'STABLE' ? 'ALL' : 'STABLE')}
          className={`p-3 rounded-xl border cursor-pointer transition-all ${
            statusFilter === 'STABLE'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 shadow-xs'
              : 'bg-white dark:bg-[#101726] border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase block">Normoglycemic</span>
          <span className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-0.5 block">
            {summary.stable_count}
          </span>
          <span className="text-[10px] text-slate-400">Target homeostatic range</span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 uppercase block">Active Biochips</span>
          <span className="text-xl font-bold font-mono text-teal-700 dark:text-teal-400 mt-0.5 block">
            {summary.active_biochips}
          </span>
          <span className="text-[10px] text-slate-400">{summary.revoked_biochips} Revoked in CRL</span>
        </div>
      </div>

      {/* Main Grid: Patient List (5 cols) + Patient Detail Console (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Patient List */}
        <div className="lg:col-span-5 bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm dark:shadow-lg space-y-3 flex flex-col">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by patient name, ID, or DMFB node..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 text-xs focus:outline-none focus:border-teal-500 font-sans"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 text-[11px] font-mono">
            <div className="flex items-center gap-1">
              {(['ALL', 'CRITICAL', 'WARNING', 'STABLE'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2 py-0.5 rounded transition-all ${
                    statusFilter === s
                      ? 'bg-slate-800 text-white dark:bg-teal-500/20 dark:text-teal-300 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <select
              value={deviceFilter}
              onChange={(e) => setDeviceFilter(e.target.value)}
              className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] focus:outline-none"
            >
              <option value="ALL">All Nodes</option>
              <option value="AUTHORIZED">Authorized Nodes</option>
              <option value="REVOKED">Revoked (CRL)</option>
            </select>
          </div>

          {/* Patient Cards List */}
          <div className="flex-1 space-y-2 overflow-y-auto max-h-[620px] pr-1 min-h-[380px]">
            {loading ? (
              <div className="py-16 text-center text-slate-400 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-teal-600" />
                <p className="text-xs">Decrypting biochip telemetry streams...</p>
              </div>
            ) : patients.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-1">
                <AlertCircle className="w-6 h-6 mx-auto text-slate-400" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">No patient records found</p>
                <p className="text-[11px]">Try adjusting your search query or triage filters.</p>
              </div>
            ) : (
              patients.map((p) => {
                const isSelected = selectedPatient?.patient_id === p.patient_id;
                return (
                  <div
                    key={p.patient_id}
                    onClick={() => setSelectedPatientId(p.patient_id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-teal-50/70 dark:bg-teal-950/40 border-teal-400 dark:border-teal-500/60 shadow-xs'
                        : 'bg-white dark:bg-[#0d131f] border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-slate-200">{p.name}</span>
                        {p.acknowledged && (
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                            ✓ Ack
                          </span>
                        )}
                        {p.is_tampered && (
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-bold animate-pulse">
                            Tampered
                          </span>
                        )}
                      </div>
                      <Badge status={p.status}>{p.status}</Badge>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                      <span>{p.patient_id} • Age {p.age}</span>
                      <span
                        className={`font-bold ${
                          p.status === 'CRITICAL'
                            ? 'text-rose-600 dark:text-rose-400'
                            : p.status === 'WARNING'
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-teal-700 dark:text-teal-400'
                        }`}
                      >
                        {p.glucose_mg_dl} mg/dL
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 flex items-center justify-between">
                      <span className="flex items-center gap-1 font-mono">
                        <Cpu className="w-3 h-3 text-slate-400" /> {p.device_id}
                        {p.device_status === 'REVOKED' && (
                          <span className="text-rose-500 text-[9px] font-semibold">(REVOKED)</span>
                        )}
                      </span>
                      <span>{p.last_assay_time}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination Controls */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>
              Page {currentPage} of {totalPages} ({totalPatients} patients)
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage <= 1 || loading}
                className="p-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage >= totalPages || loading}
                className="p-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Selected Patient Diagnostic Detail */}
        <div className="lg:col-span-7 bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm dark:shadow-lg space-y-6">
          {selectedPatient ? (
            <>
              {/* Header Info */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedPatient.name}</h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {selectedPatient.patient_id}
                    </span>
                    <Badge status={selectedPatient.status}>{selectedPatient.status}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                    {selectedPatient.gender}, {selectedPatient.age} years old
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block">MONITORING BIOCHIP</span>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-400">
                      {selectedPatient.device_id}
                    </span>
                    <CopyBadge text={selectedPatient.device_id} label="" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 block mt-0.5">
                    Status: <strong className={selectedPatient.device_status === 'AUTHORIZED' ? 'text-emerald-600' : 'text-rose-600'}>{selectedPatient.device_status}</strong>
                  </span>
                </div>
              </div>

              {/* Tamper / Revocation / Clinical Indication Banner */}
              {selectedPatient.is_tampered ? (
                <div className="p-4 rounded-xl border bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 space-y-2">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600 animate-bounce" />
                    <div className="flex-1 space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider font-mono">
                        Cyber-Physical Tampering Detected!
                      </h4>
                      <p className="text-xs leading-relaxed">
                        {selectedPatient.tamper_alert ||
                          'AES-256-GCM authentication tag mismatch (InvalidTag). An attacker modified the glucose ciphertext in transit. Packet rejected by PQ-KMS.'}
                      </p>
                    </div>
                    <button
                      onClick={handleResetTamper}
                      disabled={actionLoading === 'reset_tamper'}
                      className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-semibold transition-colors shadow-2xs"
                    >
                      Reset State
                    </button>
                  </div>
                </div>
              ) : selectedPatient.device_status === 'REVOKED' ? (
                <div className="p-4 rounded-xl border bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider font-mono">
                      Biochip Node Revoked in CRL
                    </h4>
                    <p className="text-xs leading-relaxed">
                      Device <code className="font-mono">{selectedPatient.device_id}</code> is listed in CRL. Key material is revoked and point-of-care bioassays must be re-provisioned before clinical intervention.
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 ${
                    selectedPatient.status === 'CRITICAL'
                      ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-200'
                      : selectedPatient.status === 'WARNING'
                      ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-200'
                      : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-200'
                  }`}
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider font-mono">
                      Diagnostic Assessment
                    </h4>
                    <p className="text-xs leading-relaxed font-sans">
                      {selectedPatient.clinical_indication}
                    </p>
                    {selectedPatient.last_intervention && (
                      <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400 mt-1 pt-1 border-t border-current/20">
                        Active Order: <span className="font-bold">{selectedPatient.last_intervention}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Clinical Vital Signs Card (Grid of 4 primary + 4 secondary) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono">
                  <span className="text-[10px] text-slate-500 uppercase block">Blood Glucose</span>
                  <span
                    className={`text-xl font-bold mt-1 block ${
                      selectedPatient.status === 'CRITICAL'
                        ? 'text-rose-600 dark:text-rose-400'
                        : selectedPatient.status === 'WARNING'
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-teal-700 dark:text-teal-300'
                    }`}
                  >
                    {selectedPatient.glucose_mg_dl}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">mg/dL (Enzymatic)</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono">
                  <span className="text-[10px] text-slate-500 uppercase block">Blood Pressure</span>
                  <span className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                    {selectedPatient.blood_pressure}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">mmHg</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono">
                  <span className="text-[10px] text-slate-500 uppercase block">Heart Rate</span>
                  <span className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                    {selectedPatient.heart_rate}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">BPM</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono">
                  <span className="text-[10px] text-slate-500 uppercase block">Oxygen Sat</span>
                  <span className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                    {selectedPatient.spo2}%
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">SpO2</span>
                </div>

                {/* Additional Clinical Vitals */}
                <div className="p-2.5 rounded-lg bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 font-mono text-xs">
                  <span className="text-[10px] text-slate-400 uppercase block">Body Temp</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedPatient.temperature_c} °C</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 font-mono text-xs">
                  <span className="text-[10px] text-slate-400 uppercase block">Serum Insulin</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedPatient.insulin_u_ml} μU/mL</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 font-mono text-xs">
                  <span className="text-[10px] text-slate-400 uppercase block">Body Mass Index</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedPatient.bmi} kg/m²</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 font-mono text-xs">
                  <span className="text-[10px] text-slate-400 uppercase block">Anti-Replay Counter</span>
                  <span className="font-semibold text-teal-700 dark:text-teal-400">Seq #{selectedPatient.message_counter}</span>
                </div>
              </div>

              {/* 24-Hour Glucose Trend Chart */}
              {selectedPatient.history && selectedPatient.history.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                      Continuous Glucose Trajectory (mg/dL)
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Normal Target: 70–140 mg/dL
                    </span>
                  </div>

                  <div className="h-36 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedPatient.history} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} />
                        <XAxis
                          dataKey="timestamp"
                          tick={{ fontSize: 10, fill: '#64748b' }}
                          stroke="#cbd5e1"
                        />
                        <YAxis
                          domain={[40, 'auto']}
                          tick={{ fontSize: 10, fill: '#64748b' }}
                          stroke="#cbd5e1"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0f172a',
                            borderColor: '#334155',
                            borderRadius: '0.5rem',
                            fontSize: '11px',
                            color: '#fff',
                            fontFamily: 'monospace',
                          }}
                          formatter={(value: any) => [`${value} mg/dL`, 'Blood Glucose']}
                        />
                        <ReferenceLine y={140} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Target Max (140)', position: 'insideTopRight', fill: '#f59e0b', fontSize: 9 }} />
                        <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Hypo Min (70)', position: 'insideBottomRight', fill: '#ef4444', fontSize: 9 }} />
                        <Line
                          type="monotone"
                          dataKey="glucose_mg_dl"
                          stroke={selectedPatient.status === 'CRITICAL' ? '#f43f5e' : selectedPatient.status === 'WARNING' ? '#f59e0b' : '#0d9488'}
                          strokeWidth={2.5}
                          dot={{ r: 3, fill: '#0d9488' }}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Physician Response & Clinical Protocols Bar */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono block">
                    Physician Response & Clinical Protocols
                  </span>
                  {selectedPatient.acknowledged && (
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Reviewed by {selectedPatient.acknowledged_by || 'Attending'}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Button 1: Acknowledge */}
                  <button
                    onClick={handleAcknowledge}
                    disabled={selectedPatient.acknowledged || actionLoading === 'acknowledge'}
                    className="px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    {actionLoading === 'acknowledge' ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : selectedPatient.acknowledged ? (
                      '✓ Alert Acknowledged'
                    ) : (
                      'Acknowledge Clinical Reading'
                    )}
                  </button>

                  {/* Button 2: Clinical Intervention Modal */}
                  <button
                    onClick={() => setShowInterventionModal(true)}
                    className="px-3.5 py-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs flex items-center gap-1.5"
                  >
                    <Syringe className="w-3.5 h-3.5 text-teal-600" />
                    Order Clinical Intervention
                  </button>

                  {/* Button 3: Re-run Bioassay (Live DMFB simulator) */}
                  <button
                    onClick={handleRerunAssay}
                    disabled={actionLoading === 'rerun'}
                    className="px-3.5 py-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs flex items-center gap-1.5"
                  >
                    {actionLoading === 'rerun' ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
                    ) : (
                      <RotateCw className="w-3.5 h-3.5 text-teal-600" />
                    )}
                    Request Immediate Bioassay Re-run
                  </button>

                  {/* Button 4: Simulate MITM Tamper (Attack Demo) */}
                  <button
                    onClick={handleSimulateTamper}
                    disabled={actionLoading === 'tamper'}
                    className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-300 text-slate-600 dark:text-slate-400 text-xs font-mono border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs ml-auto flex items-center gap-1"
                    title="Demonstrate how PQ-KMS catches MITM tampering of diagnostic readings"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    Simulate Tamper
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="py-24 text-center text-slate-400 space-y-2">
              <Stethoscope className="w-8 h-8 mx-auto text-slate-400 opacity-50" />
              <p className="text-sm">Select a patient on the left to review biochip telemetry.</p>
            </div>
          )}
        </div>
      </div>

      {/* Clinical Intervention Modal */}
      {showInterventionModal && selectedPatient && (
        <Modal
          isOpen={showInterventionModal}
          onClose={() => setShowInterventionModal(false)}
          title={`Order Clinical Protocol — ${selectedPatient.name} (${selectedPatient.patient_id})`}
        >
          <form onSubmit={handleDispatchIntervention} className="space-y-4 text-xs font-sans">
            <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 font-mono text-[11px] text-teal-900 dark:text-teal-200">
              Current Reading: <strong>{selectedPatient.glucose_mg_dl} mg/dL</strong> • Triage: <strong>{selectedPatient.status}</strong>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Clinical Intervention Protocol
              </label>
              <select
                value={interventionProtocol}
                onChange={(e) => setInterventionProtocol(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="Subcutaneous Regular Insulin">Subcutaneous Regular Insulin Bolus</option>
                <option value="IV Regular Insulin Infusion">IV Regular Insulin Infusion Protocol</option>
                <option value="Oral Fast-Acting Dextrose Gel">Oral Fast-Acting Dextrose Gel (15-20g)</option>
                <option value="IV 50% Dextrose (D50W)">IV 50% Dextrose (D50W) Bolus (Hypoglycemia)</option>
                <option value="Metformin Titration">Metformin 500mg Titration (Oral)</option>
                <option value="Isotonic Saline Hydration">Isotonic Saline Hydration (0.9% NaCl)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Dosage / Administration Details
              </label>
              <input
                type="text"
                value={interventionDosage}
                onChange={(e) => setInterventionDosage(e.target.value)}
                placeholder="e.g. 8 Units Subcutaneous or 25g Oral"
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Physician Clinical Notes
              </label>
              <textarea
                value={interventionNotes}
                onChange={(e) => setInterventionNotes(e.target.value)}
                placeholder="Indication: Glycemic control protocol. Re-evaluate point-of-care bioassay in 45 minutes."
                rows={3}
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-sans"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowInterventionModal(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading === 'intervention'}
                className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold flex items-center gap-1.5 shadow-xs"
              >
                {actionLoading === 'intervention' && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                Dispatch & Sign Protocol
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Live Bioassay Re-run Modal */}
      {showAssayModal && assayResult && selectedPatient && (
        <Modal
          isOpen={showAssayModal}
          onClose={() => setShowAssayModal(false)}
          title={`Digital Microfluidic Bioassay Execution — ${selectedPatient.device_id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-300 dark:border-teal-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-teal-600 uppercase block">Optical Absorbance</span>
                <span className="text-xl font-bold font-mono text-teal-800 dark:text-teal-200">
                  {assayResult.absorbance} AU
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-teal-600 uppercase block">Measured Serum Glucose</span>
                <span className="text-xl font-bold font-mono text-teal-800 dark:text-teal-200">
                  {assayResult.measured_glucose} mg/dL
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 font-mono text-[11px] uppercase tracking-wider">
                Executed EWOD Biochip Steps (8×8 Grid)
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {assayResult.steps?.map((step: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono flex items-center justify-between"
                  >
                    <span>
                      Step {step.step_num}: <strong>{step.operation}</strong> — {step.description}
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      Electrodes: {step.active_electrodes?.length || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-slate-500 font-mono">
              ✓ Telemetry encrypted with AES-256-GCM using ML-KEM-768 derived session key and verified on server.
            </p>

            <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAssayModal(false)}
                className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs"
              >
                Close & Return
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MITM Tamper Simulation Modal */}
      {showTamperModal && tamperDetail && (
        <Modal
          isOpen={showTamperModal}
          onClose={() => setShowTamperModal(false)}
          title={`Cyber-Physical Tampering Simulation Result`}
        >
          <div className="space-y-4 text-xs font-sans">
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
              <div>
                <strong className="block font-mono uppercase tracking-wider text-[11px]">
                  Tamper Detected By PQ-KMS AEAD Layer
                </strong>
                <p className="mt-0.5">{tamperDetail.error_detail}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">True Biochip Reading</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white mt-1 block">
                  {tamperDetail.true_glucose} mg/dL
                </span>
                <span className="text-[10px] text-rose-600">Severe Hyperglycemia</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Attacker Injected</span>
                <span className="text-lg font-bold text-rose-600 mt-1 block">
                  {tamperDetail.falsified_glucose} mg/dL
                </span>
                <span className="text-[10px] text-slate-400">Falsified Normal Reading</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-mono space-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-300 uppercase block">Clinical Consequence</span>
              <p className="text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                {tamperDetail.clinical_consequence}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="font-mono text-[10px] text-slate-400">
                Audit Event: {tamperDetail.audit_event_id.slice(0, 8)}...
              </span>
              <button
                type="button"
                onClick={handleResetTamper}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
              >
                Reset Tamper State
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
