import { Users, GraduationCap, TrendingUp, AlertTriangle, Calendar, BookOpen, UserCheck } from 'lucide-react';
import { useAuth } from '../../../../shared/contexts/AuthContext';

const DirectorOverviewSection = () => {
    const { user } = useAuth();

    const getTeacherLabel = () => {
        if (user?.directorType === 'PRIMARY_PRESCHOOL') return 'Maîtres';
        if (user?.directorType === 'COLLEGE') return 'Professeurs';
        return 'Enseignants';
    };

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Vue d'Ensemble</h2>
                <p className="text-gray-400">Tableau de bord du directeur</p>
            </div>

            {/* KPIs Principaux */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Élèves', value: '1,245', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', trend: '+12' },
                    { label: getTeacherLabel(), value: '84', icon: GraduationCap, color: 'text-emerald-400', bg: 'bg-emerald-500/10', trend: '+3' },
                    { label: 'Classes', value: '27', icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-500/10', trend: '+2' },
                    { label: 'Taux Présence', value: '94.5%', icon: UserCheck, color: 'text-amber-400', bg: 'bg-amber-500/10', trend: '+1.2%' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                <stat.icon className={stat.color} size={24} />
                            </div>
                            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full">
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-sm text-gray-400">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Alertes et Actions Rapides */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Alertes */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <AlertTriangle className="text-amber-400" size={24} />
                        <h3 className="text-xl font-semibold text-white">Alertes & Actions</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-white font-medium">Bulletins à Valider</h4>
                                <span className="text-red-400 font-bold">5</span>
                            </div>
                            <p className="text-sm text-gray-400">Trimestre 1 - Classes en attente</p>
                            <button className="mt-3 text-sm text-red-400 hover:text-red-300">Voir les bulletins →</button>
                        </div>
                        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-white font-medium">Incidents Discipline</h4>
                                <span className="text-amber-400 font-bold">12</span>
                            </div>
                            <p className="text-sm text-gray-400">Cette semaine</p>
                            <button className="mt-3 text-sm text-amber-400 hover:text-amber-300">Consulter →</button>
                        </div>
                        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-white font-medium">Absences Non Justifiées</h4>
                                <span className="text-blue-400 font-bold">28</span>
                            </div>
                            <p className="text-sm text-gray-400">À traiter</p>
                            <button className="mt-3 text-sm text-blue-400 hover:text-blue-300">Traiter →</button>
                        </div>
                    </div>
                </div>

                {/* Événements à Venir */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Calendar className="text-indigo-400" size={24} />
                        <h3 className="text-xl font-semibold text-white">Événements à Venir</h3>
                    </div>
                    <div className="space-y-3">
                        {[
                            { title: 'Conseil de Classe 3ème', date: '02 Déc', time: '14:00', type: 'meeting' },
                            { title: 'Composition Trimestre 1', date: '05 Déc', time: '08:00', type: 'exam' },
                            { title: 'Réunion Parents-Profs', date: '08 Déc', time: '15:00', type: 'meeting' },
                            { title: 'Fin Trimestre 1', date: '15 Déc', time: 'Toute la journée', type: 'deadline' },
                        ].map((event, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                <div className="flex-shrink-0 w-12 text-center">
                                    <div className="text-xs text-gray-400">{event.date.split(' ')[1]}</div>
                                    <div className="text-lg font-bold text-white">{event.date.split(' ')[0]}</div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-medium text-sm truncate">{event.title}</h4>
                                    <p className="text-xs text-gray-400">{event.time}</p>
                                </div>
                                <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${event.type === 'exam' ? 'bg-red-400' :
                                    event.type === 'meeting' ? 'bg-blue-400' :
                                        'bg-amber-400'
                                    }`}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Graphiques de Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Répartition par Niveau */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Répartition des Élèves</h3>
                    <div className="space-y-4">
                        {[
                            { level: 'Primaire', count: 450, total: 1245, color: 'bg-blue-500' },
                            { level: 'Collège', count: 520, total: 1245, color: 'bg-emerald-500' },
                            { level: 'Lycée', count: 275, total: 1245, color: 'bg-purple-500' },
                        ].map((item, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-300">{item.level}</span>
                                    <span className="text-white font-medium">{item.count} élèves ({Math.round((item.count / item.total) * 100)}%)</span>
                                </div>
                                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color}`} style={{ width: `${(item.count / item.total) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Taux de Réussite */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Performance Académique</h3>
                    <div className="space-y-4">
                        {[
                            { subject: 'Mathématiques', avg: 13.2, color: 'text-blue-400' },
                            { subject: 'Français', avg: 12.8, color: 'text-emerald-400' },
                            { subject: 'Anglais', avg: 14.1, color: 'text-purple-400' },
                            { subject: 'Sciences', avg: 13.5, color: 'text-amber-400' },
                        ].map((subject, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                                <span className="text-sm text-gray-300">{subject.subject}</span>
                                <div className="flex items-center gap-2">
                                    <span className={`text-lg font-bold ${subject.color}`}>{subject.avg}/20</span>
                                    <TrendingUp size={16} className="text-emerald-400" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DirectorOverviewSection;
