import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context'; // <-- Importer useAuth
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/ProfilePage'; // <-- Importer ProfilePage
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/dashboad/AdminDashboard';
import AdministrationManager from './pages/admin/AdministrationManager';
import HolidaysManager from './pages/admin/HolidaysManager';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import ChangePasswordPage from './pages/auth/ChangePasswordPage';

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Chargement de l'authentification...</div>;
  }
  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/home" replace />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
  <Route path="/profile" element={<ProtectedRoute requireSchool={true}><ProfilePage /></ProtectedRoute>} />
  <Route path="/change-password" element={<ProtectedRoute requireSchool={true}><ChangePasswordPage /></ProtectedRoute>} />
  <Route path="/dashboard" element={<ProtectedRoute requireSchool={true}><DashboardPage /></ProtectedRoute>} />
  {/* Admin-only route */}
  <Route path="/admin" element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
  {/* Gestion de l'administration (création/attribution des rôles au sein d'une école) */}
  <Route path="/admin/administration" element={<ProtectedRoute requireSchool={true} allowedRoles={["FONDATEUR","DIRECTEUR","SUPER_ADMIN"]}><AdministrationManager /></ProtectedRoute>} />
  <Route path="/admin/holidays" element={<ProtectedRoute requireSchool={true} allowedRoles={["SUPER_ADMIN"]}><HolidaysManager /></ProtectedRoute>} />
      <Route path="*" element={<div>Page introuvable</div>} />
    </Routes>
  );
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Moderner Header für authentifizierte Nutzer */}
      {isAuthenticated && <Header />}

      <main className="container mx-auto p-8">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;