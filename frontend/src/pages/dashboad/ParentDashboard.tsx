import React from 'react';
import type { User } from '../../types';
import { salutation } from '../../utils/salutation';

interface ParentDashboardProps {
  user?: User;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ user }) => {
  // Utiliser user.schoolId pour les requêtes multi-tenant si nécessaire
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tableau de Bord Parent</h1>
  <p className="text-gray-600">{salutation(user)}{user?.firstName ? (user.gender ? '' : ' !') : ''}</p>
      </header>

      {/* Vue d'Ensemble */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">👨‍👧‍👦 Vue d'ensemble</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-gray-500">Enfants liés au compte</span>
            <p className="text-2xl font-bold text-blue-600">2</p>
          </div>
          <div>
            <span className="text-gray-500">Notifications non lues</span>
            <p className="text-2xl font-bold text-green-600">1</p>
          </div>
        </div>
      </section>

      {/* Aperçu Rapide des Enfants */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">👥 Gérer mes enfants</h3>
        <p className="text-sm text-gray-600 mb-4">Accès rapide aux informations scolaires.</p>

        {/* Carte enfant (exemple simulé) */}
        <div className="space-y-4">
          <div className="p-4 border-l-4 border-gray-200 rounded-lg bg-gray-50">
            <h4 className="font-semibold text-gray-800">Harry Potter</h4>
            <p className="text-sm text-gray-600">Moyenne générale : 18/20</p>
            <p className="text-sm text-gray-500">Prochaine évaluation : Mathématiques</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Voir les détails
            </button>
            <button className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              Contacter l’enseignant
            </button>
            <button className="px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
              Planifier une réunion
            </button>
            <button className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Voir le bulletin
            </button>
          </div>
        </div>
      </section>

      {/* Gestion Financière */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">💰 Gestion financière</h3>
        <p className="text-sm text-gray-500 mb-4">Suivez les frais de scolarité et vos paiements.</p>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Voir les frais
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Payer en ligne
          </button>
        </div>
      </section>
    </div>
  );
};

export default ParentDashboard;
