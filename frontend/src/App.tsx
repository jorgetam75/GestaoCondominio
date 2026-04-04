import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './hooks/useAuth';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import UnauthorizedPage from './pages/Unauthorized';
import { AdminDashboard } from './pages/AdminDashboard';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { ResidentDashboard } from './pages/ResidentDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { UserRole } from '../../shared/types/index.js';

function RoleDashboard() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Route to appropriate dashboard based on role
  const roleMap: Record<string, () => JSX.Element> = {
    [UserRole.ADMIN]: AdminDashboard,
    [UserRole.MANAGER]: ManagerDashboard,
    [UserRole.RESIDENT]: ResidentDashboard,
  };

  const Dashboard = roleMap[user.role] || DashboardPage;
  return <Dashboard />;
}

function App() {
  const { initializeAuth, isLoading } = useAuthStore();

  useEffect(() => {
    // Initialize auth on app load
    initializeAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <RoleDashboard />
          </ProtectedRoute>
        }
      />

      {/* Role-specific dashboards */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRoles={[UserRole.ADMIN]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager"
        element={
          <ProtectedRoute requiredRoles={[UserRole.MANAGER]}>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resident"
        element={
          <ProtectedRoute requiredRoles={[UserRole.RESIDENT]}>
            <ResidentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Redirect root to dashboard or login */}
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* Catch-all 404 */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-gray-600 mb-6">Página não encontrada</p>
              <a
                href="/dashboard"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Voltar ao Dashboard
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
