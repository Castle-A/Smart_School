import { Routes, Route, Link } from 'react-router-dom';
import  LoginPage  from './pages/auth/LoginPage';
import  RegisterPage  from './pages/auth/RegisterPage';

// --- Composants de pages (factices pour l'instant) ---
const HomePage = () => (
  <div className="text-center">
    <h1 className="text-4xl font-bold text-blue-600">Bienvenue sur Smart_School</h1>
    <p className="mt-4 text-lg text-gray-700">La plateforme de gestion scolaire moderne.</p>
  </div>
);

const DashboardPage = () => (
  <div>
    <h1 className="text-3xl font-bold">Tableau de Bord</h1>
    <p className="mt-2">Interface principale pour les utilisateurs connectés.</p>
  </div>
);

// --- Composant principal de l'application ---
function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barre de navigation */}
      <nav className="bg-gray-800 p-4 text-white shadow-md">
        <div className="container mx-auto flex space-x-6">
          <Link to="/" className="hover:text-blue-400 transition-colors">Accueil</Link>
          <Link to="/login" className="hover:text-blue-400 transition-colors">Connexion</Link>
          <Link to="/register" className="hover:text-blue-400 transition-colors">Inscription</Link>
          <Link to="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
        </div>
      </nav>

      {/* Zone d'affichage des pages */}
      <main className="container mx-auto p-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;