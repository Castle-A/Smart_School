import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Subject } from '../../types';

const SubjectPage: React.FC = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour créer une matière
  const handleCreateSubject = async (newSubject: { name: string; code?: string }) => {
    setLoading(true);
    setError(null);
    try {
      // Simuler l'appel API
      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(newSubject),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création de la matière.');
      }

      const createdSubject = await response.json();
      setSubjects(prev => [...prev, createdSubject]);
      // On pourrait aussi afficher un message de succès
      alert('Matière créée avec succès !');
    } catch (err: unknown) {
      const message = typeof err === 'object' && err !== null && 'message' in err ? String((err as { message?: unknown }).message) : 'Erreur lors de la création de la matière.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour supprimer une matière
  const handleDeleteSubject = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) {
      try {
        const response = await fetch(`/api/subjects/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la suppression.');
        }

        setSubjects(prev => prev.filter(subject => subject.id !== id));
        alert('Matière supprimée.');
      } catch (err: unknown) {
        console.error(err);
      }
    }
  };

  // Simuler le chargement des données au montage
  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/subjects');
        const data = await response.json();
        setSubjects(data);
      } catch {
        setError('Erreur lors du chargement des matières.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [user?.id]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Matières</h1>
        <button
          onClick={() => handleCreateSubject({ name: 'Philosophie', code: 'PHILO' })}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Créer une matière
        </button>
      </div>

      {/* Message d'erreur ou de succès */}
      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 border-l-4 border-red-300 rounded-lg">
          {error}
        </div>
      )}

      {/* Indicateur de chargement */}
      {loading && (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300"></div>
        </div>
      )}

      {/* Tableau des matières */}
      {!loading && !error && (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-6 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(subject => (
                <tr key={subject.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{subject.name}</td>
                  <td className="px-6 py-4 text-gray-500">{subject.code || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteSubject(subject.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubjectPage;