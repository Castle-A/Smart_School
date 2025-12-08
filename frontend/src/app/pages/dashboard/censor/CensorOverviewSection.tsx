import {
    BookOpen,
    Users,
    AlertTriangle,
    Calendar,
    TrendingUp,
    BarChart2
} from 'lucide-react';

const CensorOverviewSection = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Vue d'Ensemble</h2>
                    <p className="text-gray-400">
                        Direction des Études • <span className="text-indigo-400 font-medium">Collège & Lycée</span>
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-400">Année Scolaire 2025-2026</p>
                    <p className="text-xl font-bold text-white">Semestre 1</p>
                </div>
            </div>

            {/* KPIs Pédagogiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-lg bg-indigo-500/10">
                            <BookOpen className="text-indigo-400" size={24} />
                        </div>
                        <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-full">
                            Global
                        </span>
                    </div>
                    <div className="mb-2">
                        <h3 className="text-3xl font-bold text-white">42%</h3>
                        <p className="text-sm text-gray-400">Progression Programmes</p>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full w-[42%]"></div>
                    </div>
                    <p className="text-xs text-indigo-300 mt-2">Cible théorique: 45% (-3%)</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-lg bg-red-500/10">
                            <AlertTriangle className="text-red-400" size={24} />
                        </div>
                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full animate-pulse">
                            Urgent
                        </span>
                    </div>
                    <div className="mb-1">
                        <h3 className="text-3xl font-bold text-white">3</h3>
                        <p className="text-sm text-gray-400">Professeurs Absents</p>
                    </div>
                    <p className="text-xs text-red-400 mt-4">2 classes sans surveillance</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-lg bg-emerald-500/10">
                            <TrendingUp className="text-emerald-400" size={24} />
                        </div>
                    </div>
                    <div className="mb-1">
                        <h3 className="text-3xl font-bold text-white">11.5</h3>
                        <p className="text-sm text-gray-400">Moyenne Générale École</p>
                    </div>
                    <p className="text-xs text-emerald-400 mt-4">+0.5 pts vs Trimestre 1</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Agenda Pédagogique */}
                <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Calendar className="text-indigo-400" size={24} />
                            <h3 className="text-xl font-semibold text-white">Agenda du Jour</h3>
                        </div>
                        <button className="text-sm text-indigo-300 hover:text-white transition-colors">
                            Voir calendrier complet
                        </button>
                    </div>

                    <div className="space-y-4">
                        {[
                            { time: '08:00', border: 'border-l-4 border-indigo-500', title: 'Visite de classe - 3ème A', subtitle: 'Observation cours M. Kouassi (Maths)' },
                            { time: '10:00', border: 'border-l-4 border-emerald-500', title: 'Conseil d\'Enseignement - SVT', subtitle: 'Salle des Profs' },
                            { time: '14:00', border: 'border-l-4 border-amber-500', title: 'Commission Discipline', subtitle: 'Cas élève Touré (Tle D)' },
                            { time: '16:00', border: 'border-l-4 border-purple-500', title: 'Réunion Parents-Profs', subtitle: 'Préparation 2ème Trimestre' },
                        ].map((event, idx) => (
                            <div key={idx} className={`bg-white/5 p-4 rounded-r-xl ${event.border} hover:bg-white/10 transition-colors`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-white font-medium">{event.title}</h4>
                                        <p className="text-sm text-gray-400">{event.subtitle}</p>
                                    </div>
                                    <span className="text-indigo-300 font-mono text-sm bg-indigo-500/10 px-2 py-1 rounded">
                                        {event.time}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Alertes & Tâches */}
                <div className="space-y-6">
                    {/* Alertes Cahiers de Textes */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <BarChart2 className="text-amber-400" size={20} />
                            <h3 className="text-lg font-semibold text-white">Suivi Cahiers de Textes</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm p-2 hover:bg-white/5 rounded transition-colors">
                                <span className="text-gray-300">Retails de remplissage</span>
                                <span className="text-red-400 font-bold">12 profs</span>
                            </div>
                            <div className="flex justify-between items-center text-sm p-2 hover:bg-white/5 rounded transition-colors">
                                <span className="text-gray-300">Validés cette semaine</span>
                                <span className="text-emerald-400 font-bold">85%</span>
                            </div>
                            <button className="w-full mt-2 py-2 text-xs bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded-lg transition-colors border border-amber-500/20">
                                Relancer les retardataires
                            </button>
                        </div>
                    </div>

                    {/* Classes Problématiques */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Users className="text-blue-400" size={20} />
                            <h3 className="text-lg font-semibold text-white">Classes à Surveiller</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {['4ème B', 'Tle A', '3ème C'].map((cls) => (
                                <span key={cls} className="px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg text-sm cursor-pointer hover:bg-red-500/20 transition-colors">
                                    {cls}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CensorOverviewSection;
