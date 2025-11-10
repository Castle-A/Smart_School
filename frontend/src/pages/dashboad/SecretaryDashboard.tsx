import React from 'react';
import type { User } from '../../types';
import { salutation } from '../../utils/salutation';

interface SecretaryDashboardProps {
  user?: User;
}

const SecretaryDashboard: React.FC<SecretaryDashboardProps> = ({ user }) => {
  // Utiliser user.schoolId pour les requêtes multi-tenant
  const schoolId = user?.schoolId;
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tableau de bord Secrétaire</h1>
  <p className="text-gray-600">{salutation(user)}{user?.firstName ? (user.gender ? '' : ' !') : ''}</p>
      </header>

      {/* Accès direct Inscription */}
      <section className="bg-gradient-to-r from-indigo-50 to-blue-100 p-6 rounded-lg shadow flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">🧑‍🎓 Nouvelle inscription</h2>
          <p className="text-sm text-gray-600">Enregistrer un nouvel élève ou inscrire un ancien élève</p>
        </div>
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium">
          ➕ Démarrer l'inscription
        </button>
      </section>

      {/* Vue d’ensemble */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Vue d’ensemble</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border-l-4 border-blue-200 rounded-lg bg-blue-50">
            <span className="text-gray-600">Élèves inscrits ce mois</span>
            <p className="text-2xl font-bold text-blue-700">32</p>
          </div>
          <div className="p-4 border-l-4 border-yellow-200 rounded-lg bg-yellow-50">
            <span className="text-gray-600">Demandes en attente</span>
            <p className="text-2xl font-bold text-yellow-700">9</p>
          </div>
          <div className="p-4 border-l-4 border-green-200 rounded-lg bg-green-50">
            <span className="text-gray-600">Rendez-vous du jour</span>
            <p className="text-2xl font-bold text-green-700">4</p>
          </div>
        </div>
      </section>

      {/* Actions rapides */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">⚙️ Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            🧑‍🎓 Nouvelle inscription
          </button>
          <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100">
            🧾 Délivrer une attestation
          </button>
          <button className="px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100">
            📅 Planifier un rendez-vous
          </button>
          <button className="px-4 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100">
            ✉️ Courrier (Entrée / Sortie)
          </button>
        </div>
      </section>

      {/* Dossiers élèves | Courrier | Rendez-vous */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dossiers élèves */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📁 Dossiers élèves</h3>
          <div className="space-y-3">
            {/* Dossier à traiter */}
            <div className="p-4 border-l-4 border-gray-200 rounded-lg hover:bg-gray-50">
              <h4 className="font-semibold text-gray-800">Transfert de dossier</h4>
              <p className="text-sm text-gray-600">Élève : K. Amina — 4e B</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">Statut : À traiter</span>
                <div className="flex gap-3">
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium">Ouvrir</button>
                  <button className="text-green-600 hover:text-green-800 font-medium">Valider</button>
                </div>
              </div>
            </div>

            {/* Attestation */}
            <div className="p-4 border-l-4 border-gray-200 rounded-lg hover:bg-gray-50">
              <h4 className="font-semibold text-gray-800">Demande d’attestation</h4>
              <p className="text-sm text-gray-600">Élève : S. Idriss — 3e A</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">Délai : 24h</span>
                <button className="text-indigo-600 hover:text-indigo-800 font-medium">Préparer</button>
              </div>
            </div>
          </div>
        </div>

        {/* Courrier */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📬 Courrier</h3>
          <div className="space-y-3">
            {/* Entrant */}
            <div className="p-4 border-l-4 border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-800">Courrier entrant</h4>
              <p className="text-sm text-gray-600">Lettre de la mairie — Réf. M/2025/113</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">Reçu : aujourd’hui</span>
                <button className="text-indigo-600 hover:text-indigo-800 font-medium">Enregistrer</button>
              </div>
            </div>

            {/* Sortant */}
            <div className="p-4 border-l-4 border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-800">Courrier sortant</h4>
              <p className="text-sm text-gray-600">Convocations conseil de classe</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">À envoyer : demain</span>
                <button className="text-indigo-600 hover:text-indigo-800 font-medium">Préparer envoi</button>
              </div>
            </div>
          </div>
        </div>

        {/* Rendez-vous */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 Rendez-vous</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Objet</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Avec</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-t px-4 py-2 text-sm">09/11/2025 10:30</td>
                  <td className="border-t px-4 py-2 text-sm">Inscription élève</td>
                  <td className="border-t px-4 py-2 text-sm">Parent : A. Dossa</td>
                  <td className="border-t px-4 py-2 text-sm">
                    <button className="text-indigo-600 hover:text-indigo-800">Détails</button>
                  </td>
                </tr>

                <tr>
                  <td className="border-t px-4 py-2 text-sm">09/11/2025 12:00</td>
                  <td className="border-t px-4 py-2 text-sm">Retrait attestation</td>
                  <td className="border-t px-4 py-2 text-sm">Élève : F. Toko</td>
                  <td className="border-t px-4 py-2 text-sm">
                    <button className="text-indigo-600 hover:text-indigo-800">Détails</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Communications */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">📣 Communications</h3>
        <p className="text-sm text-gray-500 mb-4">Derniers messages envoyés aux parents/élèves.</p>
        <div className="space-y-3">
          <div className="p-4 border-l-4 border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-800">Réunion parents - 6ème</h4>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-xs text-gray-500">Statut : Programmé</span>
              <div className="flex gap-3">
                <button className="text-indigo-600 hover:text-indigo-800 font-medium">Voir</button>
                <button className="text-green-600 hover:text-green-800 font-medium">Relancer</button>
              </div>
            </div>
          </div>

          <div className="p-4 border-l-4 border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-800">Note d’information : Tenue scolaire</h4>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-xs text-gray-500">Envoyé : hier</span>
              <button className="text-indigo-600 hover:text-indigo-800 font-medium">Consulter</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SecretaryDashboard;
