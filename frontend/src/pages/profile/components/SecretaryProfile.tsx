import React from 'react';
import { useAuth } from '../../../context/AuthContext';

const SecretaryProfile: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      {/* Section : Accueil & Informations */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Accueil de l'École</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">École</p>
            <p className="font-medium">{user?.schoolName || 'École non renseignée'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">ID École</p>
            <p className="font-medium">{user?.schoolId || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Section : Gestion des Documents */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Gestion des Documents</h2>
        <div className="space-y-2">
          <button className="w-full text-left px-4 py-2 bg-gray-50 text-gray-700 font-medium rounded-md hover:bg-gray-100">
            📄 Télécharger le Modèle de Bulletin
          </button>
          <button className="w-full text-left px-4 py-2 mt-2 bg-gray-50 text-gray-700 font-medium rounded-md hover:bg-gray-100">
            📄 Télécharger l'Attestation de Scolarité
          </button>
          <button className="w-full text-left px-4 py-2 mt-2 bg-gray-50 text-gray-700 font-medium rounded-md hover:bg-gray-100">
            📄 Télécharger le Certificat de Scolarité
          </button>
        </div>
      </div>

      {/* Section : Standard Téléphonique */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Standard Téléphonique</h2>
        <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 text-sm">
          <p className="font-medium">Actif</p>
          <p className="text-gray-600">Les parents peuvent joindre l'école de 8h à 17h.</p>
        </div>
      </div>

      {/* Section : Réception & Courrier */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Réception & Courrier</h2>
        <div className="space-y-2">
          <button className="w-full text-left px-4 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-md hover:bg-indigo-100">
            ✉️ Envoyer une circulaire générale
          </button>
          <button className="w-full text-left px-4 py-2 mt-2 bg-green-50 text-green-700 font-medium rounded-md hover:bg-green-100">
            📨 Gérer les dossiers des élèves
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecretaryProfile;