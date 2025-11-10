import React from 'react';
const HeadTeacherProfile: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Section : Emploi du Temps */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Mon Emploi du Temps</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-center text-gray-600">Votre emploi du temps s'affichera ici.</p>
          {/* TODO: Intégrer un calendrier (FullCalendar) */}
        </div>
      </div>

      {/* Section : Mes Classes */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Mes Classes</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">3ème A</span>
            <span className="text-sm text-gray-500">25 élèves</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">4ème B</span>
            <span className="text-sm text-gray-500">28 élèves</span>
          </div>
        </div>
      </div>

      {/* Section : Évaluations */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Évaluations & Examens</h2>
        <div className="space-y-2">
          <button className="w-full text-left px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-md hover:bg-blue-100">
            📝 Saisir les Notes du Dernier Contrôle
          </button>
          <button className="w-full text-left px-4 py-2 mt-2 bg-green-50 text-green-700 font-medium rounded-md hover:bg-green-100">
            📊 Voir les Bulletins Trimestriels
          </button>
        </div>
      </div>

      {/* Section : Communication */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Communication</h2>
        <div className="space-y-2">
          <button className="w-full text-left px-4 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-md hover:bg-indigo-100">
            ✉️ Envoyer un message aux parents d'une classe
          </button>
          <button className="w-full text-left px-4 py-2 mt-2 bg-purple-50 text-purple-700 font-medium rounded-md hover:bg-purple-100">
            📢 Annoncer un devoir
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeadTeacherProfile;