import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy-load all pages — splits Recharts and heavy chart code into separate chunks.
const Landing   = lazy(() => import('./pages/Landing'));
const Login     = lazy(() => import('./pages/Login'));
const Register  = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Income    = lazy(() => import('./pages/Income'));
const Expense   = lazy(() => import('./pages/Expense'));
const Profile   = lazy(() => import('./pages/Profile'));
const Settings  = lazy(() => import('./pages/Settings'));
const NotFound  = lazy(() => import('./pages/NotFound'));

// Minimal inline fallback — keeps the screen blank rather than flashing a loader
// for the sub-100ms transitions most users experience on fast connections.
function PageFallback() {
  return <div className="min-h-screen bg-slate-50 dark:bg-slate-900" />;
}

export default function App() {
  const { token } = useAuth();

  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={token ? <Navigate to="/app" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={token ? <Navigate to="/app" replace /> : <Register />}
        />

        {/* Protected app shell */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="income" element={<Income />} />
          <Route path="expense" element={<Expense />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
