import React from 'react';
import type { User } from '../../../types';

interface FounderProfileProps {
  user: User;
}

const FounderProfile: React.FC<FounderProfileProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      {/* Section Informations Personnelles */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Informations Personnelles</h2>
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

      {/* Section Informations sur l'École */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Informations sur l'École</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom de l'école</label>
            <p className="mt-1 text-gray-900">{user.school?.name ?? ''}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email de l'école</label>
            <p className="mt-1 text-gray-900">{user.school?.email ?? ''}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Adresse</label>
            <p className="mt-1 text-gray-900">{user.school?.address || 'Non renseignée'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
            <p className="mt-1 text-gray-900">{user.school?.phone || 'Non renseigné'}</p>
          </div>
        </div>
      </div>

      {/* Section Statistiques Clés */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Statistiques Clés</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">--</p>
            <p className="text-sm text-gray-500">Total Élèves</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">--</p>
            <p className="text-sm text-gray-500">Total Professeurs</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">--</p>
            <p className="text-sm text-gray-500">Total Classes</p>
          </div>
        </div>
      </div>

      {/* Section Gestion de l'Abonnement */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Gestion de l'Abonnement</h2>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Offre d'essai actuelle</strong> - Il vous reste 25 jours.
          </p>
        </div>
        <button className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700">
          Mettre à niveau mon abonnement
        </button>
      </div>

      {/* Section Actions Rapides */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Actions Rapides</h2>
        <div className="space-y-2">
          <button
            onClick={() => { window.location.href = '/admin/administration'; }}
            className="w-full text-left px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200"
          >
            👥 Gérer l'Administration
          </button>
          <button className="w-full text-left px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200">
            💰 Voir les finances
          </button>
          <button className="w-full text-left px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200">
            ⚙️ Paramètres de l'école
          </button>
        </div>
      </div>
    </div>
  );
};

export default FounderProfile;