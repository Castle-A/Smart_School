import React from 'react';

const MyReports: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mes Rapports</h1>
      <p className="text-gray-600">
        Générez et consultez tous les rapports importants.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Bulletins Scolaires */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Bulletins Scolaires</h2>
          <p className="text-gray-600">
            Générez des bulletins par classe, par matière, ou pour un élève spécifique.
          </p>
          <div className="mt-4">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Générer le bulletin de notes
            </button>
          </div>
        </div>

        {/* Rapports de Présence */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📈 Rapports de Présence</h2>
          <p className="text-gray-600">
            Suivez les présences et les absences des élèves en temps réel.
          </p>
          <div className="mt-4">
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Télécharger le rapport de présence global
            </button>
          </div>
        </div>

        {/* Emploi du Temps */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🗓️ Emploi du Temps</h2>
          <p className="text-gray-600">
            Visualisez et gérez l'emploi du temps de toute l'école.
          </p>
          <div className="mt-4">
            <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
              Voir l'emploi du temps
            </button>
          </div>
        </div>

        {/* Rapports de Notes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Rapports de Notes</h2>
          <p className="text-gray-600">
            Consultez les notes et les évaluations des élèves.
          </p>
          <div className="mt-4">
            <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Gérer les notes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MyReports;
