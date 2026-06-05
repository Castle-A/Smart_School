import { useState } from 'react';
import { Calendar, BookOpen, Clock, Users, Shield } from 'lucide-react';
import TimetableEditor from './components/TimetableEditor';
import ClassCouncil from '../components/ClassCouncil';
import YearEndClosure from '../components/YearEndClosure';

const CensorCurriculumSection = () => {
    const [activeTab, setActiveTab] = useState<'timetable' | 'calendar' | 'syllabus' | 'council' | 'closure'>('timetable');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Programme Scolaire</h2>
                    <p className="text-gray-400">Emplois du temps, Calendriers et Programmes</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/10">
                <button
                    onClick={() => setActiveTab('timetable')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'timetable'
                        ? 'bg-indigo-600 text-white border-b-2 border-indigo-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Clock size={18} />
                    Emplois du Temps
                </button>
                <button
                    onClick={() => setActiveTab('calendar')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'calendar'
                        ? 'bg-indigo-600 text-white border-b-2 border-indigo-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Calendar size={18} />
                    Calendriers & Examens
                </button>
                <button
                    onClick={() => setActiveTab('syllabus')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'syllabus'
                        ? 'bg-indigo-600 text-white border-b-2 border-indigo-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <BookOpen size={18} />
                    Programmes d'Étude
                </button>
                <button
                    onClick={() => setActiveTab('council')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'council'
                        ? 'bg-indigo-600 text-white border-b-2 border-indigo-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Users size={18} />
                    Conseil de Classe
                </button>
                <button
                    onClick={() => setActiveTab('closure')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'closure'
                        ? 'bg-red-600 text-white border-b-2 border-red-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Shield size={18} />
                    Audit de Fin d'Année
                </button>
            </div>

            {/* Content */}
            <div className="min-h-[300px]">
                {activeTab === 'timetable' && <TimetableEditor />}

                {activeTab === 'calendar' && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center flex flex-col items-center justify-center h-[400px]">
                        <Calendar size={48} className="text-emerald-400 mb-4 opacity-50" />
                        <h3 className="text-xl font-bold text-white mb-2">Calendriers & Examens</h3>
                        <p className="text-gray-400 max-w-md">Planification des devoirs communs, examens blancs et événements scolaires.</p>
                        <button className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                            Bientôt disponible
                        </button>
                    </div>
                )}
                {activeTab === 'syllabus' && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center flex flex-col items-center justify-center h-[400px]">
                        <BookOpen size={48} className="text-amber-400 mb-4 opacity-50" />
                        <h3 className="text-xl font-bold text-white mb-2">Programmes d'Étude</h3>
                        <p className="text-gray-400 max-w-md">Suivi de l'avancement des programmes et cahiers de textes.</p>
                        <button className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                            Bientôt disponible
                        </button>
                    </div>
                )}
                {activeTab === 'council' && <ClassCouncil />}
                {activeTab === 'closure' && <YearEndClosure />}
            </div>
        </div>
    );
};

export default CensorCurriculumSection;

