import React, { useState } from 'react';
import {
  Stethoscope,
  HeartPulse,
  Activity,
  AlertCircle,
  CheckCircle,
  FileText,
  UserCheck,
  Calendar,
  Lock,
  Search,
  Droplet,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';

interface PatientRecord {
  patient_id: string;
  name: string;
  age: number;
  gender: string;
  device_id: string;
  glucose_mg_dl: number;
  blood_pressure: string;
  heart_rate: number;
  spo2: number;
  temperature_c: number;
  last_assay_time: string;
  clinical_indication: string;
  status: 'STABLE' | 'WARNING' | 'CRITICAL';
}

const SAMPLE_PATIENTS: PatientRecord[] = [
  {
    patient_id: 'PAT-4821',
    name: 'Eleanor Vance',
    age: 58,
    gender: 'Female',
    device_id: 'DMFB-ALPHA',
    glucose_mg_dl: 220.0,
    blood_pressure: '142/88',
    heart_rate: 88,
    spo2: 97,
    temperature_c: 37.1,
    last_assay_time: '10 mins ago',
    clinical_indication: 'Severe Hyperglycemia — Insulin Required',
    status: 'CRITICAL',
  },
  {
    patient_id: 'PAT-3904',
    name: 'Robert Chen',
    age: 46,
    gender: 'Male',
    device_id: 'DMFB-BETA',
    glucose_mg_dl: 98.4,
    blood_pressure: '118/76',
    heart_rate: 72,
    spo2: 99,
    temperature_c: 36.6,
    last_assay_time: '25 mins ago',
    clinical_indication: 'Normal Fasting Glycemia',
    status: 'STABLE',
  },
  {
    patient_id: 'PAT-6192',
    name: 'Maria Santos',
    age: 62,
    gender: 'Female',
    device_id: 'DMFB-GAMMA',
    glucose_mg_dl: 174.5,
    blood_pressure: '135/84',
    heart_rate: 80,
    spo2: 98,
    temperature_c: 36.8,
    last_assay_time: '42 mins ago',
    clinical_indication: 'Impaired Glucose Tolerance (Pre-diabetes)',
    status: 'WARNING',
  },
  {
    patient_id: 'PAT-1830',
    name: 'James Wilson',
    age: 34,
    gender: 'Male',
    device_id: 'DMFB-01',
    glucose_mg_dl: 62.0,
    blood_pressure: '110/70',
    heart_rate: 68,
    spo2: 98,
    temperature_c: 36.5,
    last_assay_time: '1 hour ago',
    clinical_indication: 'Hypoglycemia Alert — Administer Fast-Acting Carbohydrate',
    status: 'CRITICAL',
  },
];

export const DoctorPortal: React.FC = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<PatientRecord[]>(SAMPLE_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord>(SAMPLE_PATIENTS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [acknowledged, setAcknowledged] = useState<Record<string, boolean>>({});

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.device_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAcknowledge = (id: string) => {
    setAcknowledged((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Clinician Telemetry & Diagnostic Portal
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-semibold">
              Endocrinology Dept
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Attending Physician: <strong className="text-slate-800 dark:text-slate-200">{user?.full_name || 'Dr. Priya Sharma'}</strong> • Decrypted point-of-care bioassay telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs">
          <Lock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>AEAD Decryption: Verified</span>
        </div>
      </div>

      {/* Main Grid: Patient List (5 cols) + Patient Detail (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Patient List */}
        <div className="lg:col-span-5 bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm dark:shadow-lg space-y-3">
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

          <div className="space-y-2 overflow-y-auto max-h-[580px]">
            {filteredPatients.map((p) => {
              const isSelected = selectedPatient.patient_id === p.patient_id;
              return (
                <div
                  key={p.patient_id}
                  onClick={() => setSelectedPatient(p)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-300 dark:border-teal-500/60 shadow-xs'
                      : 'bg-white dark:bg-[#0d131f] border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-200">{p.name}</span>
                    <Badge status={p.status}>{p.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    <span>{p.patient_id} • Age {p.age}</span>
                    <span className="text-teal-700 dark:text-teal-400 font-bold">{p.glucose_mg_dl} mg/dL</span>
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 flex items-center justify-between">
                    <span>Node: {p.device_id}</span>
                    <span>{p.last_assay_time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Patient Diagnostic Detail */}
        <div className="lg:col-span-7 bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm dark:shadow-lg space-y-6">
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
                {selectedPatient.gender}, {selectedPatient.age} years old • Continuous Point-of-Care Biochip Monitoring
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block">MONITORING BIOCHIP</span>
              <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-400">
                {selectedPatient.device_id}
              </span>
            </div>
          </div>

          {/* Clinical Vital Signs Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono">
              <span className="text-[10px] text-slate-500 uppercase block">Blood Glucose</span>
              <span className="text-xl font-bold text-teal-700 dark:text-teal-300 mt-1 block">
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
          </div>

          {/* Clinical Indication Banner */}
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
            </div>
          </div>

          {/* Physician Action Bar */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono block">
              Physician Response & Clinical Protocols
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleAcknowledge(selectedPatient.patient_id)}
                disabled={acknowledged[selectedPatient.patient_id]}
                className="px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                {acknowledged[selectedPatient.patient_id]
                  ? '✓ Alert Acknowledged'
                  : 'Acknowledge Clinical Reading'}
              </button>
              <button
                onClick={() => alert(`Clinical protocol dispatched for ${selectedPatient.name}: Subcutaneous Regular Insulin 8 Units.`)}
                className="px-3.5 py-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
              >
                Order Clinical Intervention
              </button>
              <button
                onClick={() => alert(`Assay re-run requested on ${selectedPatient.device_id}. High-voltage EWOD actuation scheduled.`)}
                className="px-3.5 py-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
              >
                Request Immediate Bioassay Re-run
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
