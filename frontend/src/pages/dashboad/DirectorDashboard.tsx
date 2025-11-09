import React from 'react';

interface DirectorDashboardProps {
  user?: { firstName?: string; lastName?: string };
}

const DirectorDashboard: React.FC<DirectorDashboardProps> = ({ user }) => {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tableau de bord Directeur</h1>
        <p className="text-gray-600">Bienvenue, {user?.firstName ?? '—'} !</p>
      </header>

      {/* Vue d'ensemble du personnel pédagogique */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">👥 Personnel pédagogique</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-gray-500">Total enseignants</span>
            <p className="text-2xl font-bold text-blue-600">42</p>
          </div>
          <div>
            <span className="text-gray-500">Total classes</span>
            <p className="text-2xl font-bold text-green-600">12</p>
          </div>
        </div>
      </section>

      {/* Actions de gestion */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">⚙️ Gestion</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100">
            👥 Gérer les classes
          </button>
          <button className="w-full text-left px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100">
            📚 Gérer les matières
          </button>
          <button className="w-full text-left px-4 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100">
            📝 Bulletins & notes
          </button>
          <button className="w-full text-left px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100">
            📅 Emploi du temps
          </button>
        </div>
      </section>

      {/* Widgets rapides */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">📈 Communication</h3>
          <p className="text-sm text-gray-500 mb-4">
            Envoyez des communications ciblées aux parents et aux élèves.
          </p>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              ✉️ Message général
            </button>
            <button className="w-full text-left px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              📧 Créer un évènement
            </button>
          </div>
        </div>

        {/* Cartes supplémentaires (exemples) */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">🎯 Objectifs</h3>
          <p className="text-sm text-gray-500">Taux d’assiduité cible : 95 %</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">🏫 Vie scolaire</h3>
          <p className="text-sm text-gray-500">Conseils de classe : 3 à venir</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">🧾 Rapports</h3>
          <button className="w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100">
            Générer le rapport hebdo
          </button>
        </div>
      </section>
    </div>
  );
};

export default DirectorDashboard;
