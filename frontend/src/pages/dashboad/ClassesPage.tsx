import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // <-- chemin corrigé

// Type pour une classe
interface Student {
  id: string;
  firstName: string;
  lastName: string;
}

interface Class {
  id: string;
  name: string;
  level: string;
  schoolId: string;
  students?: Student[]; // <-- ajouté
}

const ClassesPage: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      setIsLoading(true);
      setError('');
      try {
        // TODO: remplacer par votre vrai appel API
        const mockClasses: Class[] = [
          {
            id: '1',
            name: '6ème A',
            level: 'SIXIEME_A',
            schoolId: user?.schoolId || '',
            students: [
              { id: 's1', firstName: 'Amina', lastName: 'K.' },
              { id: 's2', firstName: 'Idriss', lastName: 'S.' },
            ],
          },
          {
            id: '2',
            name: '5ème B',
            level: 'CINQUIEME_B',
            schoolId: user?.schoolId || '',
            students: [{ id: 's3', firstName: 'Irène', lastName: 'B.' }],
          },
          {
            id: '3',
            name: '4ème A',
            level: 'QUATRIEME_A',
            schoolId: user?.schoolId || '',
            students: [],
          },
        ];
        setClasses(mockClasses);
      } catch {
        setError('Erreur lors du chargement des classes.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchClasses();
  }, [user]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestion des Classes</h1>

      {error && (
        <div
          className="p-4 mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg"
          role="alert"
        >
          {error}
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-blue-500"></div>
        </div>
      )}

      {!isLoading && !error && (
        <div className="space-y-6">
          {/* Bouton créer une classe */}
          <div className="flex justify-end mb-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              + Créer une classe
            </button>
          </div>

          {/* Tableau */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Niveau
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre d&apos;élèves
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classes.map((classItem) => (
                  <tr key={classItem.id} className="hover:bg-gray-50">
                    {/* Nom */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{classItem.name}</div>
                      <div className="text-xs text-gray-500">{classItem.id}</div>
                    </td>

                    {/* Niveau */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {classItem.level}
                    </td>

                    {/* Nombre d'élèves */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {classItem.students?.length ?? 0}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-indigo-600 hover:text-indigo-900">Voir</button>
                      <button className="ml-2 text-yellow-600 hover:text-yellow-900">Modifier</button>
                      <button className="ml-2 text-red-600 hover:text-red-900">Supprimer</button>
                    </td>
                  </tr>
                ))}
                {classes.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                      Aucune classe trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassesPage;
