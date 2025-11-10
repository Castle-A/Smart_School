import React from 'react';
const SupervisorProfile: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Section : Discipline Scolaire */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">👮‍♂️ Discipline Scolaire</h2>
        
        <div className="space-y-4">
          {/* Actions Rapides */}
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-red-50 text-red-700 font-medium rounded-md hover:bg-red-100 transition-colors">
              📝 Saisir un Retard
            </button>
            <button className="px-4 py-2 bg-orange-50 text-orange-700 font-medium rounded-md hover:bg-orange-100 transition-colors">
              ⚠️ Voir le Rapport de Discipline
            </button>
          </div>

          {/* Statistiques Clés */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mt-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-800">12</p>
              <p className="text-sm text-gray-500">Retards ce mois</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-800">3</p>
              <p className="text-sm text-gray-500">Avertissements</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-800">1</p>
              <p className="text-sm text-gray-500">Exclusions</p>
            </div>
          </div>
        </div>

        {/* Derniers Événements */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Événements Récents</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-red-50 border-l-4 border-red-200 rounded-lg">
              <div className="text-2xl">📅</div>
              <div>
                <p className="font-medium text-red-800">Retard justifié</p>
                <p className="text-sm text-gray-600">Jeanne Dupont - 3ème A</p>
                <p className="text-xs text-gray-500">Raison: Retard de train.</p>
              </div>
              <p className="text-xs text-gray-400 mt-1">Il y a 2 heures</p>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-yellow-50 border-l-4 border-yellow-200 rounded-lg">
              <div className="text-2xl">⚠️</div>
              <div>
                <p className="font-medium text-yellow-800">Avertissement</p>
                <p className="text-sm text-gray-600">Harry Potter - 5ème B</p>
                <p className="text-xs text-gray-500">Raison: Non-respect du matériel.</p>
              </div>
              <p className="text-xs text-gray-400 mt-1">Il y a 5 jours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section : Communication avec les Enseignants */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">✉️ Communication avec les Enseignants</h2>
        
        <div className="space-y-4">
          <button className="w-full text-left px-4 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-md hover:bg-indigo-100 transition-colors">
            📢 Envoyer un message général à tous les enseignants
          </button>
          <button className="w-full text-left px-4 py-2 mt-2 bg-green-50 text-green-700 font-medium rounded-md hover:bg-green-100 transition-colors">
            📄 Publier une note officielle dans le journal de classe
          </button>
          <button className="w-full text-left px-4 py-2 mt-2 bg-blue-50 text-blue-700 font-medium rounded-md hover:bg-blue-100 transition-colors">
            📋 Annoncer une réunion pédagogique
          </button>
        </div>
      </div>

      {/* Section : Gestion des Sanctions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">⚖️ Gestion des Sanctions</h2>
        
        <div className="space-y-4">
          <button className="w-full text-left px-4 py-2 bg-gray-50 text-gray-700 font-medium rounded-md hover:bg-gray-100 transition-colors">
            👤 Voir la liste des sanctions en cours
          </button>
          <button className="w-full text-left px-4 py-2 mt-2 bg-red-50 text-red-700 font-medium rounded-md hover:bg-red-100 transition-colors">
            ⛔ Appliquer une sanction
          </button>
        </div>
      </div>

      {/* Section : Interface avec l'Administration */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">🤝 Interface Administration</h2>
        
        <div className="space-y-4">
          <button className="w-full text-left px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-md hover:bg-blue-100 transition-colors">
            📈 Rapport mensuel à la direction
          </button>
          <button className="w-full text-left px-4 py-2 mt-2 bg-green-50 text-green-700 font-medium rounded-md hover:bg-green-100 transition-colors">
            📊 Consulter les archives de l'école
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupervisorProfile;