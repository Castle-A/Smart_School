import React from 'react';
import { salutation } from '../../utils/salutation';
import type { User } from '../../types';

interface SupervisorDashboardProps {
  user?: User | null;
}

const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({ user }) => {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tableau de bord Surveillant Général</h1>
  <p className="text-gray-600">{salutation(user ?? undefined)}</p>
      </header>

      {/* Accès direct Discipline / Présences */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-100 p-6 rounded-lg shadow flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">👮 Suivi de la vie scolaire</h2>
          <p className="text-sm text-gray-700">
            Pointages, retards, incidents et convocations des parents.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="px-5 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium">
            ➕ Enregistrer une absence
          </button>
          <button className="px-5 py-3 bg-rose-600 text-white rounded-md hover:bg-rose-700 font-medium">
            ⚠️ Déclarer un incident
          </button>
        </div>
      </section>

      {/* Vue d’ensemble */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Vue d’ensemble du jour</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 border-l-4 border-blue-200 rounded-lg bg-blue-50">
            <span className="text-gray-600">Absences (élèves)</span>
            <p className="text-2xl font-bold text-blue-700">14</p>
          </div>
          <div className="p-4 border-l-4 border-yellow-200 rounded-lg bg-yellow-50">
            <span className="text-gray-600">Retards</span>
            <p className="text-2xl font-bold text-yellow-700">9</p>
          </div>
          <div className="p-4 border-l-4 border-rose-200 rounded-lg bg-rose-50">
            <span className="text-gray-600">Incidents</span>
            <p className="text-2xl font-bold text-rose-700">3</p>
          </div>
          <div className="p-4 border-l-4 border-green-200 rounded-lg bg-green-50">
            <span className="text-gray-600">Convocations envoyées</span>
            <p className="text-2xl font-bold text-green-700">5</p>
          </div>
        </div>
      </section>

      {/* Actions rapides */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">⚙️ Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            🕒 Pointer une absence / retard
          </button>
          <button className="px-4 py-2 bg-orange-50 text-orange-700 rounded-md hover:bg-orange-100">
            📝 Rédiger un rapport d’incident
          </button>
          <button className="px-4 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100">
            📩 Convoquer un parent
          </button>
          <button className="px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100">
            📅 Programmer une retenue
          </button>
        </div>
      </section>

      {/* Grille principale : Présences / Discipline / Permanences */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Présences & Retards */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">✅ Présences & retards</h3>
          <div className="space-y-3">
            <div className="p-4 border-l-4 border-gray-200 rounded-lg hover:bg-gray-50">
              <h4 className="font-semibold text-gray-800">4e B — 08h</h4>
              <p className="text-sm text-gray-600">Absents : 2 | Retards : 1</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">Dernier pointage : 08:20</span>
                <div className="flex gap-3">
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium">Mettre à jour</button>
                  <button className="text-gray-700 hover:text-gray-900 font-medium">Historique</button>
                </div>
              </div>
            </div>

            <div className="p-4 border-l-4 border-gray-200 rounded-lg hover:bg-gray-50">
              <h4 className="font-semibold text-gray-800">3e A — 09h</h4>
              <p className="text-sm text-gray-600">Absents : 0 | Retards : 2</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">Dernier pointage : 09:10</span>
                <button className="text-indigo-600 hover:text-indigo-800 font-medium">Mettre à jour</button>
              </div>
            </div>
          </div>
        </div>

        {/* Discipline & Sanctions */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">⚠️ Discipline & sanctions</h3>
          <div className="space-y-3">
            <div className="p-4 border-l-4 border-rose-200 rounded-lg">
              <h4 className="font-semibold text-gray-800">Incident : chahut en classe</h4>
              <p className="text-sm text-gray-600">Élève : D. Kossi — 5e C</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">Signalé : aujourd’hui 10:05</span>
                <div className="flex gap-3">
                  <button className="text-rose-600 hover:text-rose-800 font-medium">Appliquer sanction</button>
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium">Convoquer parent</button>
                </div>
              </div>
            </div>

            <div className="p-4 border-l-4 border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-gray-800">Retard répété</h4>
              <p className="text-sm text-gray-600">Élève : A. Nadia — 4e A (3 retards)</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">Dernier : 07:58</span>
                <button className="text-purple-700 hover:text-purple-900 font-medium">Programmer retenue</button>
              </div>
            </div>
          </div>
        </div>

        {/* Permanences & Surveillance d’examens */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🧭 Permanences & surveillances</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Heure</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Poste</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Lieu</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-t px-4 py-2 text-sm">07:30 — 09:30</td>
                  <td className="border-t px-4 py-2 text-sm">Portail / Entrées</td>
                  <td className="border-t px-4 py-2 text-sm">Portail principal</td>
                  <td className="border-t px-4 py-2 text-sm">
                    <button className="text-indigo-600 hover:text-indigo-800">Remplacer</button>
                  </td>
                </tr>
                <tr>
                  <td className="border-t px-4 py-2 text-sm">10:00 — 12:00</td>
                  <td className="border-t px-4 py-2 text-sm">Surveillance examen</td>
                  <td className="border-t px-4 py-2 text-sm">Salle 3</td>
                  <td className="border-t px-4 py-2 text-sm">
                    <button className="text-indigo-600 hover:text-indigo-800">Détails</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Convocations & Étude surveillée */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Convocations des parents */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📩 Convocations des parents</h3>
          <div className="space-y-3">
            <div className="p-4 border-l-4 border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-800">Élève : B. Irène — 3e B</h4>
              <p className="text-sm text-gray-600">Motif : Retards récurrents</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">RDV proposé : 11/11/2025 09:00</span>
                <div className="flex gap-3">
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium">Contacter</button>
                  <button className="text-green-600 hover:text-green-800 font-medium">Confirmer</button>
                </div>
              </div>
            </div>

            <div className="p-4 border-l-4 border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-800">Élève : T. Pascal — 5e A</h4>
              <p className="text-sm text-gray-600">Motif : Incident en cours</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">RDV : 12/11/2025 13:00</span>
                <button className="text-indigo-600 hover:text-indigo-800 font-medium">Voir convocation</button>
              </div>
            </div>
          </div>
        </div>

        {/* Étude surveillée / Retenues */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📝 Étude surveillée & retenues</h3>
          <div className="space-y-3">
            <div className="p-4 border-l-4 border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-gray-800">Retenue — Vendredi 16:00</h4>
              <p className="text-sm text-gray-600">Liste provisoire : 6 élèves</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">Salle : Permanence</span>
                <div className="flex gap-3">
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium">Voir liste</button>
                  <button className="text-green-600 hover:text-green-800 font-medium">Valider</button>
                </div>
              </div>
            </div>

            <div className="p-4 border-l-4 border-green-200 rounded-lg">
              <h4 className="font-semibold text-gray-800">Étude surveillée — 17:00</h4>
              <p className="text-sm text-gray-600">Présents : 18 / 25</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">Surveillant : K. Adé</span>
                <button className="text-indigo-600 hover:text-indigo-800 font-medium">Pointer</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journal des incidents (historique rapide) */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📒 Journal des incidents (Rapide)</h3>
        <div className="space-y-3">
          <div className="p-4 border-l-4 border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-800">Sortie de classe sans autorisation</h4>
              <span className="text-xs text-gray-500">09/11/2025 — 11:40</span>
            </div>
            <p className="text-sm text-gray-600">Élève : Y. Roméo — 6e C</p>
            <div className="mt-2 flex gap-3">
              <button className="text-indigo-600 hover:text-indigo-800 font-medium">Détails</button>
              <button className="text-rose-600 hover:text-rose-800 font-medium">Sanctionner</button>
            </div>
          </div>

          <div className="p-4 border-l-4 border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-800">Tenue non conforme</h4>
              <span className="text-xs text-gray-500">09/11/2025 — 07:45</span>
            </div>
            <p className="text-sm text-gray-600">Élève : H. Mireille — 4e D</p>
            <button className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium">Marquer comme réglé</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupervisorDashboard;
