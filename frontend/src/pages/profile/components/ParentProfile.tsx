import React from 'react';
const ParentProfile: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Section : Mes Enfants */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Mes Enfants</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold">Harry Potter</h3>
            <p className="text-sm text-gray-600">Classe: 4ème A</p>
            <p className="text-sm text-gray-500">Responsable: M. James Potter</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold">Hermione Granger</h3>
            <p className="text-sm text-gray-600">Classe: 4ème A</p>
            <p className="text-sm text-gray-500">Responsable: M. et Mme Granger</p>
          </div>
        </div>
        <button className="w-full text-left px-4 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-md hover:bg-indigo-100">
          ➕ Ajouter un enfant
        </button>
      </div>

      {/* Section : Communication avec l'École */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Communication</h2>
        <div className="space-y-2">
          <button className="w-full text-left px-4 py-2 bg-green-50 text-green-700 font-medium rounded-md hover:bg-green-100">
            ✉️ Contacter un enseignant
          </button>
          <button className="w-full text-left px-4 py-2 mt-2 bg-blue-50 text-blue-700 font-medium rounded-md hover:bg-blue-100">
            📨 Prendre un rendez-vous à l'administration
          </button>
        </div>
      </div>

      {/* Section : Paiement en Ligne */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Paiement en Ligne</h2>
        <div className="space-y-2">
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800">Mensualités en Règle</h3>
            <p className="text-sm text-gray-600">Le paiement automatique est activé pour les frais de scolarité.</p>
          </div>
          <button className="w-full text-left px-4 py-2 bg-orange-50 text-orange-700 font-medium rounded-md hover:bg-orange-100">
            💳 Ajouter un moyen de paiement
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentProfile;