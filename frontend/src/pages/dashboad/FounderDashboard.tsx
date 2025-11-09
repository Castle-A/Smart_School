import React from 'react';
import type { User } from '../../types';

interface FounderDashboardProps {
  user: User;
}

const FounderDashboard: React.FC<FounderDashboardProps> = ({ user }) => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Tableau de Bord Fondateur</h1>
      <p className="text-gray-600">Bienvenue, {user.firstName} !</p>

      {/* Résumé de l'École */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">📊 Résumé de votre École</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-gray-500">Nom de l'école</span>
            <p className="text-xl font-bold text-gray-900">{user.schoolName}</p>
          </div>
          <div>
            <span className="text-gray-500">Email de l'école</span>
            <p className="text-xl font-bold text-gray-900">{user.school?.email || 'Non renseigné'}</p>
          </div>
          <div>
            <span className="text-gray-500">Statutut de l'abonnement</span>
            <p className="text-xl font-bold text-green-600">Actif</p>
          </div>
        </div>
      </div>

      {/* Actions Principales */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">⚙️ Actions Principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100">
            👥 Gérer les Utilisateurs
          </button>
          <button className="w-full text-left px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100">
            📚 Gérer les Classes
          </button>
          <button className="w-full text-left px-4 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100">
            📊 Bulletins & Notes
          </button>
          <button className="w-full text-left px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100">
            💰 Paramètres de l'École
          </button>
        </div>
      </div>

      {/* Widgets Rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">📈 Nouvelles Inscritions</h3>
          <p className="text-sm text-gray-500 mb-4">Cliquez pour gérer les demandes d'inscription en attente.</p>
          <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Voir les demandes
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">💰 Gestion Financière</h3>
          <p className="text-sm text-gray-500 mb-4">Suivez vos revenus et gérez vos abonnements.</p>
          <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Voir le Rapport Financier
          </button>
        </div>
      </div>
    </div>
  );
};

export default FounderDashboard;