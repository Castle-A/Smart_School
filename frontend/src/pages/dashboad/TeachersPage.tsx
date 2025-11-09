import React from 'react';
import { useAuth } from '../../context/AuthContext';

const TeacherPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Espace Professeur</h1>
      <p className="text-gray-600">
        Bienvenue, {user?.firstName} !
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Colonne de gauche : Profil et Infos */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Mon Profil</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-900">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Matières enseignées</label>
                <p className="mt-1 text-gray-900">
                  {/* Ici, vous pourriez lister les matières associées au professeur */}
                  Mathématiques, Histoire, Physiques...
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Classes</label>
                <p className="mt-1 text-gray-900">
                  {/* Ici, vous pourriez lister les classes où le professeur intervient */}
                  3ème A, 4ème B, etc.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Actions Rapides</h2>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100">
                ➕️ Créer un devoir
              </button>
              <button className="w-full text-left px-4 py-2 mt-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100">
                ✅ Voir mes classes
              </button>
              <button className="w-full text-left px-4 py-2 mt-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100">
                  📚 Voir mes matières
              </button>
              <button className="w-full text-left px-4 py-2 mt-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100">
                  📅 Voir mon emploi du temps
              </button>
            </div>
          </div>
        </div>

        {/* Colonne de droite : Statistiques et Outils */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Mes Statistiques</h2>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">15</p>
                <p className="text-sm text-gray-500">Élèves totaux</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">3</p>
                <p className="text-sm text-gray-500">Classes assignées</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Outils</h2>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100">
                📝 Imprimer la liste de mes classes
              </button>
              <button className="w-full text-left px-4 py-2 mt-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100">
                  📊 Exporter les notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherPage;