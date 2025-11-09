import React from 'react';
import type { User } from '../../types';

interface HeadTeacherDashboardProps {
  user: User;
}

const HeadTeacherDashboard: React.FC<HeadTeacherDashboardProps> = ({ user }) => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Tableau de Bord Censeur</h1>
      <p className="text-gray-600">
        Bienvenue, {user?.lastName ? `M. ${user.lastName}` : ""} !
      </p>

      {/* Vue d'Ensemble Pédagogique */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">📊 Vue d’Ensemble Pédagogique</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-gray-500">Classes supervisées</span>
            <p className="text-2xl font-bold text-blue-600">12</p>
          </div>
          <div>
            <span className="text-gray-500">Enseignants suivis</span>
            <p className="text-2xl font-bold text-green-600">22</p>
          </div>
          <div>
            <span className="text-gray-500">Conseils de classe à venir</span>
            <p className="text-2xl font-bold text-purple-600">3</p>
          </div>
        </div>
      </div>

      {/* Actions Rapides */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">⚙️ Actions Rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100">
            📅 Gérer les Emplois du Temps
          </button>
          <button className="w-full text-left px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100">
            🧪 Planifier les Évaluations
          </button>
          <button className="w-full text-left px-4 py-2 bg-yellow-50 text-yellow-700 rounded-md hover:bg-yellow-100">
            🧑‍🏫 Suivi des Enseignants
          </button>
          <button className="w-full text-left px-4 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100">
            🧾 Conseils de Classe
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeadTeacherDashboard;
