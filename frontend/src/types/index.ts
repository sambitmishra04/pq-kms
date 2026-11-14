export type UserRole = 'admin' | 'doctor' | 'auditor';

export interface User {
  user_id: string;
  username: string;
  full_name: string;
  role: UserRole;
  department?: string;
  is_active: boolean;
}

export interface Device {
  device_id: string;
  status: 'PENDING' | 'AUTHORIZED' | 'REVOKED' | 'DISABLED';
  role: string;
  enrolled_at?: string;
  kem_public_key?: string;
  sig_public_key?: string;
  kem_public_key_hex?: string | null;
  kem_public_key_b64?: string | null;
  kem_key_size_bytes?: number;
  kem_fingerprint?: string | null;
  sig_public_key_hex?: string | null;
  sig_public_key_b64?: string | null;
  sig_key_size_bytes?: number;
  sig_fingerprint?: string | null;
  enrolment_code_hash?: string;
}

export interface Session {
  session_id: string;
  key_id: string;
  device_id: string;
  created_at: string;
  expires_at: string;
  state: 'CREATED' | 'ACTIVE' | 'DEACTIVATED' | 'COMPROMISED' | 'DESTROYED';
  msg_count: number;
  last_counter: number;
  is_expired?: boolean;
  time_remaining_s?: number;
  in_transient_ram?: boolean;
  progress_pct?: number;
}

export interface SessionStats {
  total: number;
  created: number;
  active: number;
  deactivated: number;
  destroyed: number;
  compromised: number;
  active_devices: number;
}

export interface SessionMemoryStatus {
  volatile_keys_in_ram: number;
  active_keys_in_ram: number;
  deactivated_in_ram: number;
  valid_keys_in_ram: number;
  disk_key_material_stored: boolean;
  isolation_model: string;
  zeroization_guarantee: string;
}

export interface SessionListResponse {
  sessions: Session[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  stats: SessionStats;
  memory_status: SessionMemoryStatus;
}

export interface SessionDetail {
  session_id: string;
  key_id: string;
  device_id: string;
  created_at: string;
  expires_at: string;
  state: 'CREATED' | 'ACTIVE' | 'DEACTIVATED' | 'COMPROMISED' | 'DESTROYED';
  msg_count: number;
  last_counter: number;
  next_expected_counter: number;
  is_expired: boolean;
  time_remaining_s: number;
  deactivated_at?: string | null;
  grace_remaining_s: number;
  in_transient_ram: boolean;
  key_byte_length: number;
  cipher_suite: string;
  kem_primitive: string;
  sig_primitive: string;
  kdf_primitive: string;
  device_status?: string | null;
  device_role?: string | null;
  audit_events: Array<{
    event_id: string;
    time: string;
    actor: string;
    event_type: string;
    device_id?: string;
    outcome: string;
    details?: string;
  }>;
}

export interface SessionActionResponse {
  status: string;
  session_id: string;
  action: string;
  message: string;
  details?: Record<string, any>;
}

export interface BulkSessionActionResponse {
  status: string;
  action: string;
  affected_count: number;
  message: string;
}

export interface AuditBreakDetails {
  index: number;
  rowid: number;
  event_id: string;
  time: string;
  actor: string;
  event_type: string;
  device_id?: string;
  outcome: string;
  details?: string;
  expected_prev_hash: string;
  actual_prev_hash: string;
  preceding_event_id?: string;
  preceding_time?: string;
  preceding_event_type?: string;
  reason: string;
}

export interface AuditStats {
  ACCEPTED: number;
  REJECTED: number;
  INFO: number;
  TOTAL: number;
  [key: string]: number;
}

export interface AuditEvent {
  rowid?: number;
  event_id: string;
  time: string;
  actor: string;
  event_type: string;
  device_id?: string;
  outcome: 'ACCEPTED' | 'REJECTED' | 'INFO';
  details?: string;
  prev_hash: string;
  current_hash?: string;
}

export interface StateSummary {
  devices: Device[];
  sessions: Session[];
  message_stats: {
    total: number;
    accepted: number;
    rejected: number;
  };
  latest_crl_version: number;
  revoked_devices: string[];
}

export interface AuditResponse {
  events: AuditEvent[];
  chain_valid: boolean;
  chain_break_index: number | null;
  total_records?: number;
  filtered_count?: number;
  break_details?: AuditBreakDetails | null;
  stats?: AuditStats | null;
}

export interface CRLResponse {
  version: number;
  issued_at: string;
  device_ids: string[];
  signature_hex: string;
}

export interface BenchmarkStat {
  operation: string;
  algorithm: string;
  trials: number;
  mean_ns: number;
  min_ns: number;
  max_ns: number;
}

export interface SystemHealth {
  status: string;
  server_time: string;
  uptime: string;
  uptime_seconds: number;
  algorithms: {
    kem: string;
    sig: string;
    symmetric: string;
    kdf: string;
  };
  statistics: {
    total_devices: number;
    authorized_devices: number;
    active_sessions: number;
    latest_crl_version: number;
  };
}

export interface SystemConfig {
  cryptography: {
    kem_algorithm: string;
    sig_algorithm: string;
    symmetric_cipher: string;
    key_derivation: string;
    kem_variants: string[];
    sig_variants: string[];
  };
  lifecycle: {
    session_lifetime_s: number;
    max_messages_per_session: number;
    grace_window_s: number;
    rotation_check_interval_s: number;
  };
  protocol: {
    timestamp_skew_tolerance_s: number;
    client_nonce_bytes: number;
    audit_hash_chain_enabled: boolean;
  };
  database: {
    path: string;
    engine: string;
    key_material_stored: boolean;
  };
  benchmarking: {
    warmup_cycles: number;
    trial_count: number;
    payload_sizes_bytes: number[];
  };
}

export interface Droplet {
  id: string;
  label: string;
  droplet_type: string;
  x: number;
  y: number;
  volume_ul: number;
  concentration_mg_dl: number;
  color: string;
}

export interface BiochipSnapshot {
  device_id: string;
  grid_size: [number, number];
  active_electrodes: [number, number][];
  detector_coord: [number, number];
  dispensers: {
    sample: [number, number];
    reagent: [number, number];
    waste: [number, number];
  };
  droplets: Droplet[];
  status: string;
}

export interface AssayStepSnapshot {
  step_num: number;
  operation: string;
  description: string;
  active_electrodes: [number, number][];
  grid_state: BiochipSnapshot;
}

export interface OpticalSensorReading {
  detected: boolean;
  glucose_mg_dl: number;
  absorbance_au?: number;
  optical_sensor_coords?: [number, number];
  clinical_status: string;
  timestamp?: string;
}

export interface FullAssayResult {
  patient_glucose: number;
  steps: AssayStepSnapshot[];
  sensor_reading: OpticalSensorReading;
  final_state: BiochipSnapshot;
}

// ─── Clinician Diagnostic Portal Types ────────────────────────────────────────

export interface VitalReading {
  timestamp: string;
  glucose_mg_dl: number;
}

export interface PatientRecord {
  patient_id: string;
  name: string;
  age: number;
  gender: string;
  device_id: string;
  device_status: string;
  glucose_mg_dl: number;
  blood_pressure: string;
  systolic_bp: number;
  diastolic_bp: number;
  heart_rate: number;
  spo2: number;
  temperature_c: number;
  insulin_u_ml: number;
  bmi: number;
  last_assay_time: string;
  clinical_indication: string;
  status: 'STABLE' | 'WARNING' | 'CRITICAL';
  session_id?: string;
  session_state?: string;
  message_counter: number;
  aead_cipher: string;
  kem_algorithm: string;
  sig_algorithm: string;
  crypto_verified: boolean;
  crypto_status_text: string;
  is_tampered: boolean;
  tamper_alert?: string;
  acknowledged: boolean;
  acknowledged_by?: string;
  acknowledged_at?: string;
  last_intervention?: string;
  history: VitalReading[];
}

export interface PatientListResponse {
  patients: PatientRecord[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  summary: {
    total_patients: number;
    critical_count: number;
    warning_count: number;
    stable_count: number;
    active_biochips: number;
    revoked_biochips: number;
  };
}

export interface ClinicianTamperResult {
  patient_id: string;
  device_id: string;
  is_tampered: boolean;
  true_glucose: number;
  falsified_glucose: number;
  pqc_aead_status: string;
  tamper_detected: boolean;
  error_detail: string;
  clinical_consequence: string;
  audit_event_id: string;
}

