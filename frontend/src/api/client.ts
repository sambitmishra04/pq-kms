import axios from 'axios';
import type {
  Device,
  StateSummary,
  AuditResponse,
  CRLResponse,
  BenchmarkStat,
  SystemHealth,
  SystemConfig,
  User,
  FullAssayResult,
  BiochipSnapshot,
} from '../types';

const API_BASE = ''; // Relative URLs will be proxied by Vite or handled directly

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-inject JWT token if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('pqkms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // If user is acting as admin, also provide X-Admin-Token as fallback for native admin routes
  const adminToken = localStorage.getItem('pqkms_admin_token') || 'admin-secret-token-change-in-production';
  config.headers['X-Admin-Token'] = adminToken;
  return config;
});

// Response interceptor for auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      // Clear token and let context handle it
    }
    return Promise.reject(error);
  }
);

// ─── API Endpoints ────────────────────────────────────────────────────────────

export const api = {
  // Auth
  login: async (username: string, password: string): Promise<{ access_token: string; user: User }> => {
    const res = await apiClient.post('/api/auth/login', { username, password });
    return res.data;
  },
  getMe: async (): Promise<User> => {
    const res = await apiClient.get('/api/auth/me');
    return res.data;
  },
  getUsers: async (): Promise<User[]> => {
    const res = await apiClient.get('/api/auth/users');
    return res.data;
  },

  // KMS Core State & Devices
  getState: async (): Promise<StateSummary> => {
    const res = await apiClient.get('/state');
    return res.data;
  },
  getDeviceKeys: async (deviceId: string): Promise<Device> => {
    const res = await apiClient.get(`/devices/${encodeURIComponent(deviceId)}/keys`);
    return res.data;
  },
  enrolDevice: async (deviceId: string, role: string = 'device'): Promise<{ device_id: string; enrolment_code: string; message: string }> => {
    const res = await apiClient.post('/enrol', { device_id: deviceId, role });
    return res.data;
  },
  revokeDevice: async (deviceId: string): Promise<{ device_id: string; crl_version: number; message: string }> => {
    const res = await apiClient.post('/revoke', { device_id: deviceId });
    return res.data;
  },
  getRevocations: async (): Promise<CRLResponse | null> => {
    const res = await apiClient.get('/revocations');
    return res.data;
  },

  // Audit Log
  getAudit: async (limit: number = 100): Promise<AuditResponse> => {
    const res = await apiClient.get(`/audit?limit=${limit}`);
    return res.data;
  },

  // Metrics / Benchmarks
  getMetrics: async (): Promise<{ benchmark_stats: BenchmarkStat[] }> => {
    const res = await apiClient.get('/metrics');
    return res.data;
  },

  // System
  getHealth: async (): Promise<SystemHealth> => {
    const res = await apiClient.get('/api/system/health');
    return res.data;
  },
  getConfig: async (): Promise<SystemConfig> => {
    const res = await apiClient.get('/api/system/config');
    return res.data;
  },

  // DMFB Digital Twin
  runGlucoseAssay: async (patientGlucose: number = 220): Promise<FullAssayResult> => {
    const res = await apiClient.post(`/api/dmfb/run-assay?patient_glucose=${patientGlucose}`);
    return res.data;
  },
  getDmfbState: async (): Promise<BiochipSnapshot> => {
    const res = await apiClient.get('/api/dmfb/state');
    return res.data;
  },
};
