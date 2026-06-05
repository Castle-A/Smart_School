import { useState } from 'react';
import { CheckCircle, Printer, BookOpen, ShieldAlert } from 'lucide-react';
import GradesInputView from './components/GradesInputView';
import AttendanceLogView from './components/AttendanceLogView';

const CensorSchoolLifeSection = () => {
    const [activeTab, setActiveTab] = useState<'grades' | 'attendance' | 'validation' | 'bulletins'>('grades');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Vie Scolaire</h2>
                    <p className="text-gray-400">Notes, Bulletins et Suivi Disciplinaire</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/10">
                <button
                    onClick={() => setActiveTab('grades')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'grades'
                        ? 'bg-indigo-600 text-white border-b-2 border-indigo-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <BookOpen size={18} />
                    Saisie & Devoirs
                </button>
                <button
                    onClick={() => setActiveTab('attendance')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'attendance'
                        ? 'bg-indigo-600 text-white border-b-2 border-indigo-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <ShieldAlert size={18} />
                    Assiduité & Discipline
                </button>
                <button
                    onClick={() => setActiveTab('validation')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'validation'
                        ? 'bg-indigo-600 text-white border-b-2 border-indigo-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <CheckCircle size={18} />
                    Validation & Commentaires
                </button>
                <button
                    onClick={() => setActiveTab('bulletins')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'bulletins'
                        ? 'bg-indigo-600 text-white border-b-2 border-indigo-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Printer size={18} />
                    Bulletins & Suivi
                </button>
            </div>

            {/* Content */}
            <div className="min-h-[300px]">
                {activeTab === 'grades' && <GradesInputView />}
                {activeTab === 'attendance' && <AttendanceLogView />}

                {activeTab === 'validation' && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center flex flex-col items-center justify-center h-[400px]">
                        <CheckCircle size={48} className="text-emerald-400 mb-4 opacity-50" />
                        <h3 className="text-xl font-bold text-white mb-2">Validation & Commentaires</h3>
                        <p className="text-gray-400 max-w-md">Vérification des moyennes, validation des périodes et saisie des appréciations du conseil.</p>
                        <button className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                            Fonctionnalité à venir
                        </button>
                    </div>
                )}
                {activeTab === 'bulletins' && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center flex flex-col items-center justify-center h-[400px]">
                        <Printer size={48} className="text-amber-400 mb-4 opacity-50" />
                        <h3 className="text-xl font-bold text-white mb-2">Bulletins & Suivi</h3>
                        <p className="text-gray-400 max-w-md">Génération des bulletins, archives et tableaux d'honneur.</p>
                        <button className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                            Fonctionnalité à venir
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CensorSchoolLifeSection;
