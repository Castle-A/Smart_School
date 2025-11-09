import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

type ClassItem = { id: string; name: string };

const classesMock: ClassItem[] = [
  { id: '1', name: '6ème A' },
  { id: '2', name: '6ème B' },
  { id: '3', name: '5ème A' },
];

const MyGrades: React.FC = () => {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Gérer les Notes</h1>
      <p className="text-gray-600">
        {user?.firstName ? `Bonjour ${user.firstName}. ` : ''}
        Consultez et gérez les notes des élèves par classe et par matière.
      </p>

      <div className="mt-6">
        {/* Sélection de la classe */}
        {selectedClass ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Notes pour <span className="text-blue-700">{selectedClass.name}</span>
            </h2>

            {/* Ici: tableau des élèves/notes, filtres par matière, etc. */}
            <div className="mt-6">
              <button
                onClick={() => setSelectedClass(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Changer de classe
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 p-4 border-l-4 border-yellow-400 rounded-lg">
            <p className="text-center text-yellow-800">
              Veuillez sélectionner une classe pour gérer ses notes.
            </p>
          </div>
        )}

        {/* Liste des classes (mock pour l'instant) */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Classes disponibles</h3>
          <ul className="space-y-2">
            {classesMock.map((cls) => (
              <li key={cls.id}>
                <button
                  onClick={() => setSelectedClass(cls)}
                  className="w-full text-left px-4 py-2 bg-white rounded-md shadow hover:bg-gray-100"
                >
                  {cls.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MyGrades;
