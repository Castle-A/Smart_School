import React from 'react';
import { useAuth } from '../../context';
import { salutation } from '../../utils/salutation';
import { useNavigate } from 'react-router-dom';

// Sous-pages supprimées (pas utilisées pour l'instant)

const StudentsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Espace Élève</h1>
      <p className="text-gray-600">
        {salutation(user)}{user?.firstName ? (user.gender ? '' : ' !') : ''} Voici votre espace personnel.
      </p>

      {/* Menu de navigation pour les pages de l'élève */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          onClick={() => navigate('/dashboard/students/reports')}
          className="px-4 py-2 bg-white shadow rounded-md hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          📄 Mes Bulletins
        </button>
        <button
          onClick={() => navigate('/dashboard/students/grades')}
          className="px-4 py-2 bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          📊 Mes Notes
        </button>
        <button
          onClick={() => navigate('/dashboard/students/schedule')}
          className="px-4 py-2 bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          ⏰ Mon Emploi du Temps
        </button>
        <button
          onClick={() => navigate('/dashboard/students/attendance')}
          className="px-4 py-2 bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          📋 Mes Présences
        </button>
      </div>

      {/* Zone de contenu dynamique */}
      <main className="bg-white p-6 rounded-lg shadow">
        {/* La page par défaut, on pourrait afficher un résumé */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Tableau de Bord</h2>
          <p className="text-gray-600">
            Choisissez une section ci-dessus pour voir plus de détails.
          </p>
        </div>
      </main>
    </div>
  );
};

export default StudentsPage;