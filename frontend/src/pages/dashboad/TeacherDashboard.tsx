import React from 'react';

interface TeacherDashboardProps {
  user?: { firstName?: string; lastName?: string };
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user }) => {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tableau de bord Enseignant</h1>
        <p className="text-gray-600">Bienvenue, Prof. {user?.lastName ?? '—'} !</p>
      </header>

      {/* Navigation par onglets (actions rapides) */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Navigation rapide</h2>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100">
            📚 Mes Classes
          </button>
          <button className="px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100">
            📝 Mes Notes
          </button>
          <button className="px-4 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100">
            📅 Mon Emploi du Temps
          </button>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mes Classes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📚 Mes classes</h2>
          <div className="space-y-2">
            <div className="p-3 border-l-4 border-gray-200 rounded-lg">
              <h4 className="font-semibold">6ème A</h4>
              <p className="text-sm text-gray-600">Effectif : 25 élèves</p>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                Voir les détails
              </button>
              <button className="text-green-600 hover:text-green-800 font-medium">
                + Ajouter une évaluation
              </button>
            </div>
          </div>
        </div>

        {/* Mes Notes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📝 Mes notes</h2>
          <div className="space-y-2">
            <div className="p-3 border-l-4 border-gray-200 rounded-lg">
              <h4 className="font-semibold">Mathématiques</h4>
              <p className="text-sm text-gray-600">Appréciation : « Excellent travail »</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">Dernière évaluation : 15/20 (12/12/2024)</span>
                <div className="flex gap-3">
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium">Modifier</button>
                  <button className="text-red-600 hover:text-red-800 font-medium">Supprimer</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emploi du temps */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📅 Mon emploi du temps</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Heure</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Matière</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Salle</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-t px-4 py-2 text-sm">08:00</td>
                  <td className="border-t px-4 py-2 text-sm">Mathématiques</td>
                  <td className="border-t px-4 py-2 text-sm">Salle 2</td>
                  <td className="border-t px-4 py-2 text-sm">
                    <button className="text-indigo-600 hover:text-indigo-800">Voir</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeacherDashboard;