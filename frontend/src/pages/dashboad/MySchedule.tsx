import React, { useState } from 'react';
import { useAuth } from '../../context';
import { salutation } from '../../utils/salutation';

type Lesson = { time: string; subject: string };
type DaySchedule = { day: string; lessons: Lesson[] };

const WEEK_DATA: DaySchedule[] = [
  {
    day: 'Lundi',
    lessons: [
      { time: '08:00 - 09:00', subject: 'Mathématiques' },
      { time: '09:00 - 10:00', subject: 'Français' },
      { time: '11:00 - 12:00', subject: 'Anglais' },
      { time: '13:00 - 14:00', subject: 'Histoire' },
      { time: '14:00 - 15:00', subject: 'Philosophie' },
    ],
  },
  {
    day: 'Mardi',
    lessons: [
      { time: '08:00 - 10:00', subject: 'Physique-Chimie' },
      { time: '11:00 - 12:00', subject: 'Chimie' },
      { time: '13:00 - 14:00', subject: 'Géographie' },
    ],
  },
  {
    day: 'Mercredi',
    lessons: [
      { time: '08:00 - 09:00', subject: 'SVT' },
      { time: '09:00 - 11:00', subject: 'Informatique' },
    ],
  },
  {
    day: 'Jeudi',
    lessons: [
      { time: '08:00 - 10:00', subject: 'Histoire-Géo' },
      { time: '14:00 - 15:00', subject: 'Sport' },
    ],
  },
  {
    day: 'Vendredi',
    lessons: [
      { time: '09:00 - 10:00', subject: 'Arts plastiques' },
      { time: '11:00 - 12:00', subject: 'Musique' },
    ],
  },
];

const MySchedule: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'week' | 'month'>('week');

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Mon Emploi du Temps</h1>
      <p className="text-gray-600 mb-6">
        {salutation(user)}{user?.firstName ? (user.gender ? ', ' : ', ') : ''}consultez votre emploi du temps{user?.schoolName ? ` à ${user.schoolName}` : ''}.
      </p>

      {/* Sélecteur de vue */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setCurrentView('week')}
          aria-pressed={currentView === 'week'}
          className={`px-4 py-2 rounded-md font-medium transition ${
            currentView === 'week'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Vue Semaine
        </button>
        <button
          onClick={() => setCurrentView('month')}
          aria-pressed={currentView === 'month'}
          className={`px-4 py-2 rounded-md font-medium transition ${
            currentView === 'month'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Vue Mensuelle
        </button>
      </div>

      {/* Contenu */}
      <div className="bg-white p-6 rounded-lg shadow">
        {currentView === 'week' ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Emploi du temps de la semaine</h2>

            {/* Grille des jours */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {WEEK_DATA.map((col) => (
                <div key={col.day} className="p-4 border rounded-lg">
                  <p className="text-center text-sm text-gray-500 mb-2">{col.day}</p>

                  <ul className="space-y-3">
                    {col.lessons.map((l, i) => (
                      <li key={`${col.day}-${i}`} className="rounded-lg border-l-4 border-gray-200 pl-3">
                        <p className="text-xs text-gray-500">{l.time}</p>
                        <p className="text-sm text-gray-700">{l.subject}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Vue mensuelle</h2>
            <p className="text-gray-600">La vue mensuelle sera bientôt disponible.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySchedule;
