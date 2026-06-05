import { Users, AlertTriangle, CheckCircle, Search } from 'lucide-react';

const DirectorSchoolLifeSection = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Vie Scolaire</h2>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Rechercher un élève..."
                            className="pl-10 pr-4 py-2 bg-white/10 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Stats Rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                    { label: "Absences Aujourd'hui", value: "12", icon: Users, color: "text-red-400", bg: "bg-red-500/20" },
                    { label: "Retards", value: "8", icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/20" },
                    { label: "Taux Présence", value: "96.5%", icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/20" },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex items-center gap-4">
                        <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">{stat.label}</p>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Rapports Élèves en Difficulté */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Élèves en Difficulté (Rapports)</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle size={16} className="text-red-400" />
                                <h4 className="text-red-400 text-sm font-semibold">Alerte Académique</h4>
                            </div>
                            <ul className="text-xs text-gray-300 space-y-2 ml-6 list-disc">
                                <li><span className="text-white font-medium">Kouamé Jean (3ème A)</span> - Moyenne en chute libre (07/20)</li>
                                <li><span className="text-white font-medium">Diallo Awa (Tle D)</span> - 5 absences non justifiées cette semaine</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Derniers Incidents Disciplinaires */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Derniers Incidents</h3>
                    <div className="space-y-3">
                        {[
                            { student: "Koné Moussa", class: "4ème B", type: "Bavardage", date: "Aujourd'hui 10:00" },
                            { student: "Soro Ali", class: "3ème A", type: "Retard (20min)", date: "Aujourd'hui 08:20" },
                        ].map((incident, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                <div>
                                    <p className="text-sm font-medium text-white">{incident.student} <span className="text-gray-500">({incident.class})</span></p>
                                    <p className="text-xs text-gray-400">{incident.type}</p>
                                </div>
                                <span className="text-xs text-gray-500">{incident.date}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DirectorSchoolLifeSection;
