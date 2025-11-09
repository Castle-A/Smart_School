import React from 'react';
import type { User } from '../../../types';

interface DirectorProfileProps {
  user: User;
}

const DirectorProfile: React.FC<DirectorProfileProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      {/* Section Informations Personnelles */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Mes Informations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Prénom</label>
            <p className="mt-1 text-gray-900">{user.firstName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-gray-900">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Tableau de Bord de Gestion */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Tableau de Bord</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
          <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <div className="text-2xl">👥</div>
            <p className="text-sm text-gray-600 mt-1">Gérer les Élèves</p>
          </button>
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <div className="text-2xl">👨‍🏫</div>
            <p className="text-sm text-gray-600 mt-1">Gérer les Professeurs</p>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <div className="text-2xl">📚</div>
            <p className="text-sm text-gray-600 mt-1">Gérer les Classes</p>
          </button>
          <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <div className="text-2xl">📝</div>
            <p className="text-sm text-gray-600 mt-1">Bulletins & Notes</p>
          </button>
          <button className="p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
            <div className="text-2xl">📅</div>
            <p className="text-sm text-gray-600 mt-1">Emploi du Temps</p>
          </button>
          <button className="p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
            <div className="text-2xl">💰</div>
            <p className="text-sm text-gray-600 mt-1">Finances & Abonnement</p>
          </button>
        </div>
      </div>

      {/* Notifications Récentes */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Notifications Récentes</h2>
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 border-l-4 border-blue-400 text-sm">
            <p className="font-medium">Nouvelle inscription</p>
            <p className="text-gray-600">L'élève Harry Potter a été inscrit en 6ème A.</p>
          </div>
          <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 text-sm">
            <p className="font-medium">Rappel de paiement</p>
            <p className="text-gray-600">Votre abonnement arrive à échéance dans 10 jours.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectorProfile;