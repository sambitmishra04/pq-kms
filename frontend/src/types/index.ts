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
}

export interface AuditEvent {
  event_id: string;
  time: string;
  actor: string;
  event_type: string;
  device_id?: string;
  outcome: 'ACCEPTED' | 'REJECTED' | 'INFO';
  details?: string;
  prev_hash: string;
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
