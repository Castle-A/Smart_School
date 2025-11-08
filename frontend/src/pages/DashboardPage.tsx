import React from 'react';
import { Link } from 'react-router-dom'; // <-- Importer Link
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  if (!isAuthenticated || !user) return <div>Redirection en cours...</div>;
  const handleLogout = () => { logout(); navigate('/login'); };
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
        <div className="flex space-x-4">
          <Link to="/profile" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Mon Profil
          </Link>
          <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Se déconnecter</button>
        </div>
      </div>
      <div className="mt-4 p-6 bg-white rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <img
            src={user.avatarUrl || '/default-avatar.svg'}
            alt="Avatar"
            className="w-12 h-12 rounded-full"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const t = e.currentTarget as HTMLImageElement;
              t.onerror = null;
              // si l'image externe échoue, on bascule vers l'asset local
              if (t.src && !t.src.includes('/default-avatar.svg')) {
                t.src = '/default-avatar.svg';
              }
            }}
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Bonjour {user.firstName} !</h2>
            <p className="text-gray-600">Connecté en tant que <span className="font-medium">{user.role}</span> de <span className="font-bold text-blue-600">{user.schoolName}</span></p>
          </div>
        </div>
      </div>
      {/* ... le reste de votre page ... */}
    </div>
  );
};
export default DashboardPage;