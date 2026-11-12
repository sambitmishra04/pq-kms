import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { DeviceManagement } from './pages/DeviceManagement';
import { SessionMonitor } from './pages/SessionMonitor';
import { DMFBTwin } from './pages/DMFBTwin';
import { DoctorPortal } from './pages/DoctorPortal';
import { AuditLog } from './pages/AuditLog';
import { Benchmarks } from './pages/Benchmarks';
import { LoginPage } from './pages/LoginPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Authenticated Layout with Role-Based Route Guards */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Admin / Auditor Dashboard */}
              <Route
                index
                element={
                  <ProtectedRoute allowedRoles={['admin', 'auditor']}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Fleet Management */}
              <Route
                path="devices"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DeviceManagement />
                  </ProtectedRoute>
                }
              />

              {/* Admin Key Lifecycle */}
              <Route
                path="sessions"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <SessionMonitor />
                  </ProtectedRoute>
                }
              />

              {/* Doctor & Clinician Portal */}
              <Route
                path="doctor"
                element={
                  <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                    <DoctorPortal />
                  </ProtectedRoute>
                }
              />

              {/* Biochip Twin */}
              <Route
                path="dmfb"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'doctor', 'auditor']}>
                    <DMFBTwin />
                  </ProtectedRoute>
                }
              />

              {/* Auditor & Compliance */}
              <Route
                path="audit"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'auditor']}>
                    <AuditLog />
                  </ProtectedRoute>
                }
              />

              {/* Benchmarks */}
              <Route
                path="benchmarks"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'auditor']}>
                    <Benchmarks />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
