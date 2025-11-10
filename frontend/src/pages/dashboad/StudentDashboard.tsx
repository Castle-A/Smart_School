import React from 'react';
import type { User } from '../../types';
import { salutation } from '../../utils/salutation';

interface StudentDashboardProps {
  user?: User;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user }) => {
  // Utiliser user.schoolId pour les requêtes multi-tenant
  const schoolId = user?.schoolId;
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Espace Élève</h1>
  <p className="text-gray-600">{salutation(user)}{user?.firstName ? (user.gender ? '' : ' !') : ''}</p>
      </header>

      {/* Carte de Bienvenue */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-lg shadow">
  <h2 className="text-2xl font-bold text-gray-800">{salutation(user)}{user?.firstName ? (user.gender ? '' : ' !') : ''}</h2>
        <p className="text-lg text-gray-700">Prépare-toi pour une année scolaire réussie !</p>
        <p className="text-sm text-gray-600">
          Explore ton tableau de bord pour suivre tes cours et tes résultats.
        </p>
      </section>

      {/* Accès Rapide : Cours / Notes / Emploi du temps */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mes Cours */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🚀 Mes cours</h3>
          <p className="text-sm text-gray-500 mb-4">Accède à tes matières.</p>
          <div className="space-y-3">
            <div className="p-4 border-l-4 border-gray-200 rounded-lg hover:bg-gray-50">
              <h4 className="font-semibold text-gray-800">Mathématiques</h4>
              <p className="text-sm text-gray-600">Avec M. Dupont</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">Dernière note : 15/20</span>
                <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                  Voir les détails
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mes Notes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Mes notes</h3>
          <p className="text-sm text-gray-500 mb-4">Consulte et suis tes évaluations.</p>
          <div className="space-y-3">
            <div className="p-4 border-l-4 border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-800">Histoire-Géo</h4>
              <p className="text-sm text-gray-600">La Révolution française</p>
              <div className="mt-2 flex flex-wrap gap-3 items-center">
                <span className="text-xs text-gray-500">Note : 17/20</span>
                <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                  Détails
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Emploi du temps */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 Mon emploi du temps</h3>
          <p className="text-sm text-gray-500 mb-4">Aperçu de la journée.</p>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Heure</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Matière</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Professeur</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Salle</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-t px-4 py-2 text-sm">08:00</td>
                  <td className="border-t px-4 py-2 text-sm">Mathématiques</td>
                  <td className="border-t px-4 py-2 text-sm">M. Dupont</td>
                  <td className="border-t px-4 py-2 text-sm">Salle 2</td>
                  <td className="border-t px-4 py-2 text-sm">
                    <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                      Voir
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Calendrier scolaire */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">📅 Calendrier scolaire</h3>
        <p className="text-sm text-gray-500 mb-4">Tes prochains événements scolaires.</p>
        <div className="space-y-3">
          <div className="p-4 border-l-4 border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-800">Sortie de classe</h4>
            <p className="text-sm text-gray-600">Spectacle de fin d’année</p>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-xs text-gray-500">Date : 15 juin 2024</span>
              <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                Voir les détails
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;
