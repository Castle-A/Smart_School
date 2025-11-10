import React from 'react';
import { User } from '../../../types';

interface TeacherProfileProps {
  user: User;
}

const TeacherProfile: React.FC<TeacherProfileProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Espace Enseignant</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Prénom</label>
            <p className="mt-1 text-gray-900">{user.firstName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Matières enseignées</label>
            <p className="mt-1 text-gray-900">
              {user.teacherProfile?.subjectsTaught?.map((s) => s.name).join(', ') || 'Aucune'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Mon Emploi du Temps</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-center text-gray-600">Votre emploi du temps s'affichera ici.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Mes Classes</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">3ème A</span>
            <span className="text-sm text-gray-500">25 élèves</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">4ème B</span>
            <span className="text-sm text-gray-500">28 élèves</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Actions Rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
            <div className="text-2xl">📝</div>
            <p className="text-sm text-gray-600 mt-1">Saisir des Notes</p>
          </button>
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <div className="text-2xl">📊</div>
            <p className="text-sm text-gray-600 mt-1">Voir les Bulletins</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;