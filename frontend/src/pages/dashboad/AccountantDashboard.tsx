import React from 'react';

interface AccountantDashboardProps {
  user?: { firstName?: string; lastName?: string };
}

const AccountantDashboard: React.FC<AccountantDashboardProps> = ({ user }) => {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tableau de bord Comptable</h1>
        <p className="text-gray-600">Bienvenue, {user?.firstName ?? '—'} !</p>
      </header>

      {/* Accès direct Paiement / Reçu */}
      <section className="bg-gradient-to-r from-emerald-50 to-teal-100 p-6 rounded-lg shadow flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">💳 Encaissements & reçus</h2>
          <p className="text-sm text-gray-700">
            Enregistrer un paiement, générer un reçu, consulter les arriérés.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="px-5 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-medium">
            ➕ Enregistrer un paiement
          </button>
          <button className="px-5 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 font-medium">
            🧾 Émettre un reçu
          </button>
        </div>
      </section>

      {/* Vue d’ensemble */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Vue d’ensemble financière (jour)</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 border-l-4 border-emerald-200 rounded-lg bg-emerald-50">
            <span className="text-gray-600">Encaissements du jour</span>
            <p className="text-2xl font-bold text-emerald-700">1 250 000 F CFA</p>
          </div>
          <div className="p-4 border-l-4 border-amber-200 rounded-lg bg-amber-50">
            <span className="text-gray-600">Arriérés totaux</span>
            <p className="text-2xl font-bold text-amber-700">8 400 000 F CFA</p>
          </div>
          <div className="p-4 border-l-4 border-sky-200 rounded-lg bg-sky-50">
            <span className="text-gray-600">Dépenses validées</span>
            <p className="text-2xl font-bold text-sky-700">320 000 F CFA</p>
          </div>
          <div className="p-4 border-l-4 border-fuchsia-200 rounded-lg bg-fuchsia-50">
            <span className="text-gray-600">Reçus émis (aujourd’hui)</span>
            <p className="text-2xl font-bold text-fuchsia-700">27</p>
          </div>
        </div>
      </section>

      {/* Actions rapides */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">⚙️ Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">
            💳 Enregistrer un paiement
          </button>
          <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100">
            🧾 Générer / Réimprimer un reçu
          </button>
          <button className="px-4 py-2 bg-amber-50 text-amber-700 rounded-md hover:bg-amber-100">
            📜 Liste des arriérés
          </button>
          <button className="px-4 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100">
            📈 Rapport quotidien
          </button>
        </div>
      </section>

      {/* Grille principale : Frais & Paiements / Arriérés / Caisse */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Frais & Paiements récents */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">💼 Paiements récents</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Élève</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Montant</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-t px-4 py-2 text-sm">09/11/2025</td>
                  <td className="border-t px-4 py-2 text-sm">A. Dossa (2nde A)</td>
                  <td className="border-t px-4 py-2 text-sm">150 000 F</td>
                  <td className="border-t px-4 py-2 text-sm">
                    <button className="text-indigo-600 hover:text-indigo-800">Reçu</button>
                  </td>
                </tr>
                <tr>
                  <td className="border-t px-4 py-2 text-sm">09/11/2025</td>
                  <td className="border-t px-4 py-2 text-sm">K. Amina (4e B)</td>
                  <td className="border-t px-4 py-2 text-sm">75 000 F</td>
                  <td className="border-t px-4 py-2 text-sm">
                    <button className="text-indigo-600 hover:text-indigo-800">Reçu</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex gap-3">
            <button className="text-indigo-600 hover:text-indigo-800 font-medium">Voir tout</button>
            <button className="text-emerald-600 hover:text-emerald-800 font-medium">Nouveau paiement</button>
          </div>
        </div>

        {/* Arriérés (balances élèves) */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📜 Arriérés (balances élèves)</h3>
          <div className="space-y-3">
            <div className="p-4 border-l-4 border-amber-200 rounded-lg">
              <h4 className="font-semibold text-gray-800">S. Idriss — 3e A</h4>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-sm text-amber-700">Reste dû : 45 000 F</span>
                <div className="flex gap-3">
                  <button className="text-emerald-600 hover:text-emerald-800 font-medium">Encaisser</button>
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium">Notifier parent</button>
                </div>
              </div>
            </div>
            <div className="p-4 border-l-4 border-amber-200 rounded-lg">
              <h4 className="font-semibold text-gray-800">B. Irène — 2nde C</h4>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-sm text-amber-700">Reste dû : 90 000 F</span>
                <button className="text-emerald-600 hover:text-emerald-800 font-medium">Encaisser</button>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <button className="text-amber-700 hover:text-amber-900 font-medium">Exporter la liste</button>
          </div>
        </div>

        {/* Caisse (Cashbook) */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">💵 Caisse (journal)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Pièce</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Libellé</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Débit</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Crédit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-t px-4 py-2 text-sm">RC-2025-0112</td>
                  <td className="border-t px-4 py-2 text-sm">Frais scolarité A. Dossa</td>
                  <td className="border-t px-4 py-2 text-sm">—</td>
                  <td className="border-t px-4 py-2 text-sm">150 000 F</td>
                </tr>
                <tr>
                  <td className="border-t px-4 py-2 text-sm">FA-2025-0041</td>
                  <td className="border-t px-4 py-2 text-sm">Achat manuels – Fournisseur ABC</td>
                  <td className="border-t px-4 py-2 text-sm">120 000 F</td>
                  <td className="border-t px-4 py-2 text-sm">—</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex gap-3">
            <button className="text-indigo-600 hover:text-indigo-800 font-medium">Voir le journal</button>
            <button className="text-emerald-600 hover:text-emerald-800 font-medium">Nouvelle écriture</button>
          </div>
        </div>
      </section>

      {/* Fournisseurs & Factures */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🏷️ Fournisseurs</h3>
          <div className="space-y-3">
            <div className="p-4 border-l-4 border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-800">Papeterie BENINPRO</h4>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-sm text-gray-600">Solde à payer : 230 000 F</span>
                <div className="flex gap-3">
                  <button className="text-emerald-600 hover:text-emerald-800 font-medium">Régler</button>
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium">Détails</button>
                </div>
              </div>
            </div>

            <div className="p-4 border-l-4 border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-800">Transport SCOLABUS</h4>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-sm text-gray-600">Solde à payer : 0 F</span>
                <button className="text-indigo-600 hover:text-indigo-800 font-medium">Historique</button>
              </div>
            </div>
          </div>
        </div>

        {/* Factures */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🧾 Factures</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">N°</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Fournisseur</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Montant</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Statut</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-t px-4 py-2 text-sm">FA-2025-0041</td>
                  <td className="border-t px-4 py-2 text-sm">BENINPRO</td>
                  <td className="border-t px-4 py-2 text-sm">120 000 F</td>
                  <td className="border-t px-4 py-2 text-sm">En attente</td>
                  <td className="border-t px-4 py-2 text-sm">
                    <button className="text-emerald-600 hover:text-emerald-800">Régler</button>
                  </td>
                </tr>
                <tr>
                  <td className="border-t px-4 py-2 text-sm">FA-2025-0042</td>
                  <td className="border-t px-4 py-2 text-sm">SCOLABUS</td>
                  <td className="border-t px-4 py-2 text-sm">80 000 F</td>
                  <td className="border-t px-4 py-2 text-sm">Payée</td>
                  <td className="border-t px-4 py-2 text-sm">
                    <button className="text-indigo-600 hover:text-indigo-800">Reçu</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Rapports */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">📈 Rapports & états</h3>
        <p className="text-sm text-gray-500 mb-4">
          Générer les états financiers : journal de caisse, relevé des paiements, arriérés, récapitulatif mensuel.
        </p>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Rapport quotidien
          </button>
          <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100">
            Journal de caisse
          </button>
          <button className="px-4 py-2 bg-amber-50 text-amber-700 rounded-md hover:bg-amber-100">
            Liste des arriérés
          </button>
          <button className="px-4 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100">
            Récapitulatif mensuel
          </button>
        </div>
      </section>
    </div>
  );
};

export default AccountantDashboard;
