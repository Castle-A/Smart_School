import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // <-- Importer useAuth
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/ProfilePage'; // <-- Importer ProfilePage
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

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
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="*" element={<div>Page introuvable</div>} />
    </Routes>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800 p-4 text-white">
        <div className="container mx-auto flex space-x-6">
          <Link to="/home" className="hover:text-blue-400">Accueil</Link>
          <Link to="/login" className="hover:text-blue-400">Connexion</Link>
          <Link to="/register" className="hover:text-blue-400">Inscription</Link>
        </div>
      </nav>
      <main className="container mx-auto p-8">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;