import { useState } from 'react';
import {
    UserPlus,
    FileText,
    AlertTriangle,
    Search,
    Printer,
    Users,
    ArrowRight,
    CheckCircle,
    Clock
} from 'lucide-react';
import { useAuth } from '../../../../shared/contexts/AuthContext';

const SecretaryOverviewSection = () => {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    // Mock Data for Search
    const mockStudents = [
        { id: 1, name: 'Kouamé Jean', class: '3ème A', matricule: 'M23001' },
        { id: 2, name: 'Diallo Awa', class: 'Tle D', matricule: 'M23045' },
        { id: 3, name: 'Soro Ali', class: '6ème B', matricule: 'M23102' },
    ];

    const filteredStudents = searchQuery.length > 1
        ? mockStudents.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    const getScopeLabel = () => {
        if (user?.directorType === 'PRIMARY_PRESCHOOL') return 'Primaire & Maternelle';
        if (user?.directorType === 'COLLEGE') return 'Collège & Lycée';
        return 'Tout l\'établissement';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Vue d'Ensemble</h2>
                    <p className="text-gray-400">
                        Espace Secrétariat • <span className="text-indigo-400 font-medium">{getScopeLabel()}</span>
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-400">Aujourd'hui</p>
                    <p className="text-xl font-bold text-white">06 Décembre 2025</p>
                </div>
            </div>

            {/* KPIs Interactifs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-lg bg-indigo-500/10">
                            <UserPlus className="text-indigo-400" size={24} />
                        </div>
                        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full flex items-center gap-1">
                            <ArrowRight size={12} /> Voir liste
                        </span>
                    </div>
                    <div className="mb-1">
                        <h3 className="text-3xl font-bold text-white">12</h3>
                        <p className="text-sm text-gray-400">Inscriptions ce jour</p>
                    </div>
                    <div className="w-full bg-white/5 h-1 mt-4 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full w-[45%]"></div>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-lg bg-amber-500/10">
                            <Clock className="text-amber-400" size={24} />
                        </div>
                        <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full">
                            Action requise
                        </span>
                    </div>
                    <div className="mb-1">
                        <h3 className="text-3xl font-bold text-white">5</h3>
                        <p className="text-sm text-gray-400">Dossiers en attente</p>
                    </div>
                    <p className="text-xs text-amber-400 mt-4">3 dossiers incomplets</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-lg bg-emerald-500/10">
                            <Printer className="text-emerald-400" size={24} />
                        </div>
                        <span className="text-xs bg-white/10 text-gray-400 px-2 py-1 rounded-full">
                            Semaine en cours
                        </span>
                    </div>
                    <div className="mb-1">
                        <h3 className="text-3xl font-bold text-white">28</h3>
                        <p className="text-sm text-gray-400">Documents générés</p>
                    </div>
                    <p className="text-xs text-emerald-400 mt-4">+12% vs semaine dernière</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Widget Guichet Rapide */}
                <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900/40 to-slate-900/40 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>

                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <Search className="text-indigo-400" size={24} />
                        <h3 className="text-xl font-semibold text-white">Guichet Rapide</h3>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setSelectedStudent(null);
                                }}
                                placeholder="Rechercher un élève par nom ou matricule..."
                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all text-lg"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={24} />

                            {/* Dropdown résultats */}
                            {filteredStudents.length > 0 && !selectedStudent && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1f3c] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                                    {filteredStudents.map(student => (
                                        <div
                                            key={student.id}
                                            onClick={() => {
                                                setSelectedStudent(student);
                                                setSearchQuery(student.name);
                                            }}
                                            className="p-4 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 flex justify-between items-center"
                                        >
                                            <div>
                                                <p className="text-white font-medium">{student.name}</p>
                                                <p className="text-sm text-gray-400">{student.matricule}</p>
                                            </div>
                                            <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-indigo-300">
                                                {student.class}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Actions Suggérées après sélection */}
                        {selectedStudent && (
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10 animate-in fade-in slide-in-from-top-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-white font-medium">Actions pour <span className="text-indigo-400">{selectedStudent.name}</span></h4>
                                    <button
                                        onClick={() => {
                                            setSelectedStudent(null);
                                            setSearchQuery('');
                                        }}
                                        className="text-xs text-gray-400 hover:text-white"
                                    >
                                        Effacer
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <button className="flex flex-col items-center justify-center gap-2 p-3 bg-white/5 hover:bg-indigo-600/20 hover:border-indigo-500/30 border border-transparent rounded-lg transition-all text-sm text-gray-300 hover:text-white group">
                                        <Printer size={20} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                                        Certificat
                                    </button>
                                    <button className="flex flex-col items-center justify-center gap-2 p-3 bg-white/5 hover:bg-emerald-600/20 hover:border-emerald-500/30 border border-transparent rounded-lg transition-all text-sm text-gray-300 hover:text-white group">
                                        <UserPlus size={20} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                                        Voir Parents
                                    </button>
                                    <button className="flex flex-col items-center justify-center gap-2 p-3 bg-white/5 hover:bg-amber-600/20 hover:border-amber-500/30 border border-transparent rounded-lg transition-all text-sm text-gray-300 hover:text-white group">
                                        <FileText size={20} className="text-amber-400 group-hover:scale-110 transition-transform" />
                                        Bulletin
                                    </button>
                                    <button className="flex flex-col items-center justify-center gap-2 p-3 bg-white/5 hover:bg-blue-600/20 hover:border-blue-500/30 border border-transparent rounded-lg transition-all text-sm text-gray-300 hover:text-white group">
                                        <Users size={20} className="text-blue-400 group-hover:scale-110 transition-transform" />
                                        Dossier
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tâches / Notifications */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <AlertTriangle className="text-amber-400" size={24} />
                        <h3 className="text-xl font-semibold text-white">Tâches Prioritaires</h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { title: 'Valider dossiers 6ème A', time: 'Il y a 2h', urgent: true },
                            { title: 'Imprimer bulletins CM2', time: 'Il y a 4h', urgent: false },
                            { title: 'Relancer parents retard', time: 'Hier', urgent: false },
                        ].map((task, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group cursor-pointer">
                                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${task.urgent ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`} />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-white group-hover:text-indigo-400 transition-colors">
                                        {task.title}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">{task.time}</p>
                                </div>
                                <CheckCircle size={16} className="text-gray-600 hover:text-emerald-500 transition-colors" />
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-3 text-sm text-indigo-300 hover:text-white border border-indigo-500/30 hover:bg-indigo-500/20 rounded-xl transition-all">
                        Voir toutes les tâches
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SecretaryOverviewSection;
