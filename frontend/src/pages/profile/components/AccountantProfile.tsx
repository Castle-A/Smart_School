import React from 'react';
const AccountantProfile: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Section : Tableau de Bord Financier */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Tableau de Bord Financier</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">€12,450</p>
            <p className="text-sm text-gray-500">Revenus ce mois</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">€8,200</p>
            <p className="text-sm text-gray-500">Frais de scolarité</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">€450</p>
            <p className="text-sm text-gray-500">Frais exceptionnels</p>
          </div>
        </div>
      </div>

      {/* Section : Gestion des Abonnements */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Gestion des Abonnements</h2>
        <div className="space-y-2">
          <div className="p-4 border rounded-md">
            <h3 className="font-semibold">Plan Actuel : Essai Gratuit</h3>
            <p className="text-sm text-gray-600">Il vous reste 25 jours dans votre période d'essai.</p>
            <button className="mt-2 w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700">
              Choisir un plan
            </button>
          </div>
        </div>
      </div>

      {/* Section : Rapports Fiscaux */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Rapports Fiscaux</h2>
        <div className="space-y-2">
          <button className="w-full text-left px-4 py-2 bg-gray-50 text-gray-700 font-medium rounded-md hover:bg-gray-100">
            📊 Générer le Bilan Annuel
          </button>
          <button className="w-full text-left px-4 py-2 mt-2 bg-gray-50 text-gray-700 font-medium rounded-md hover:bg-gray-100">
            📄 Exporter les Reçus de Paiement
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountantProfile;