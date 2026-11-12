import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import WarehouseMapPage from './pages/WarehouseMapPage';
import Orders from './pages/Orders';
import Suppliers from './pages/Suppliers';
import Staff from './pages/Staff';
import Reports from './pages/Reports';
import Alerts from './pages/Alerts';
import UserManagement from './pages/UserManagement';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, hasRole } = useAuth();
  const token = localStorage.getItem('token');

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !hasRole(...allowedRoles)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />

          {/* Protected routes wrapped in Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="warehouse-map" element={<WarehouseMapPage />} />
            <Route path="orders" element={<Orders />} />
            <Route
              path="suppliers"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                  <Suppliers />
                </ProtectedRoute>
              }
            />
            <Route path="staff" element={<Staff />} />
            <Route
              path="reports"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route path="alerts" element={<Alerts />} />
            <Route
              path="users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#0f172a',
            color: '#f8fafc',
            border: '1px solid #334155',
            borderRadius: '4px',
            fontSize: '12px',
          },
        }}
      />
    </AuthProvider>
  );
}
