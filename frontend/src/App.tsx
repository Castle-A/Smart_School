import { Routes, Route, Link, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Nav */}
      <nav className="bg-gray-800 p-4 text-white">
        <div className="container mx-auto flex space-x-6">
          <Link to="/home" className="hover:text-blue-400">Accueil</Link>
          <Link to="/login" className="hover:text-blue-400">Connexion</Link>
          <Link to="/register" className="hover:text-blue-400">Inscription</Link>
        </div>
      </nav>

      {/* Pages */}
      <main className="container mx-auto p-8">
        <Routes>
          {/* ajoute une route pour "/" */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protégée */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* 404 catch-all pour éviter la page vide */}
          <Route path="*" element={<div>Page introuvable</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;