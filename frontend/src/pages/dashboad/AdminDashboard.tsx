import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Tableau de Bord Administrateur</h1>
      <p className="text-gray-600">
        Vue d'ensemble de la plateforme Smart School.
      </p>
      <p className="text-sm text-gray-500">
        Depuis ce panneau, vous pouvez gérer toutes les écoles et voir les statistiques globales.
      </p>

      {/* Statistiques Globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🌐 Total Écoles</h2>
          <p className="text-3xl font-bold text-blue-600">42</p>
          <p className="text-sm text-gray-500">Écoles actives</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">👥 Total Utilisateurs</h2>
          <p className="text-3xl font-bold text-green-600">128</p>
          <p className="text-sm text-gray-500">Utilisateurs actifs</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📈 Total Classes</h2>
          <p className="text-3xl font-bold text-purple-600">384</p>
          <p className="text-sm text-gray-500">Classes actives</p>
        </div>
      </div>

      {/* Tableau de bord des Écoles */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">🏫 Liste des Écoles</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Nom de l'école
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Lignes du tableau seront générées dynamiquement depuis votre base de données plus tard. */}
              <tr>
                <td className="px-4 py-2 text-sm text-gray-900 border-t border-gray-200">Lycée Exemple</td>
                <td className="px-4 py-2 text-sm text-gray-900">contact@lycee-exemple.tg</td>
                <td className="px-4 py-2 text-sm text-gray-900">42</td>
                <td className="px-4 py-2 text-sm text-gray-900">12</td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  <button className="text-indigo-600 hover:bg-indigo-800">
                    Voir
                  </button>
                  <button className="text-red-600 hover:bg-red-800">
                    Supprimer
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-gray-900">École du Futur Proche
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">contact@ecole-proche.tg</td>
                <td className="px-4 py-2 text-sm text-gray-900">8</td>
                <td className="px-4 py-2 text-sm text-gray-900">Enseignant</td>
                <td className="px-4 py-2 text-sm text-gray-900">3</td>
                <td className="px-4 py-2 text-sm text-gray-900">Maths</td>
                <td className="px-4 py-2 text-sm text-gray-900">Physiques</td>
                <td className="px-4 py-2 text-sm text-gray-900">Anglais</td>
                <td className="px-4 py-2 text-sm text-gray-900">15</td>
                <td className="px-4 py-2 text-sm text-gray-900">Oui</td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  <button className="text-indigo-600 hover:bg-indigo-800">
                    Détails
                  </button>
                  <button className="text-red-600 hover:bg-red-800">
                    Supprimer
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;