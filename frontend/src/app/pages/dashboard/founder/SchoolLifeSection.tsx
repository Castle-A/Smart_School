import { Calendar, UserCheck, UserX, AlertTriangle, Clock } from 'lucide-react';

export default function SchoolLifeSection() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Vie Scolaire</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Attendance Stats */}
                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                            <UserCheck className="w-6 h-6" />
                        </div>
                        <span className="text-xs text-white/40 font-medium">Aujourd'hui</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">96%</h3>
                    <p className="text-white/60 text-sm">Taux de présence</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-red-500/10 text-red-400">
                            <UserX className="w-6 h-6" />
                        </div>
                        <span className="text-xs text-white/40 font-medium">Non justifiées</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">12</h3>
                    <p className="text-white/60 text-sm">Absences du jour</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-yellow-500/10 text-yellow-400">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <span className="text-xs text-white/40 font-medium">Cette semaine</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">5</h3>
                    <p className="text-white/60 text-sm">Incidents signalés</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Absences */}
                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-orange-400" />
                        Dernières Absences
                    </h3>
                    <div className="space-y-4">
                        {[
                            { name: "Kouamé Aya", class: "3ème A", time: "08:00", reason: "Maladie", status: "Justifiée" },
                            { name: "Diallo Mamadou", class: "Tle D", time: "08:00", reason: "Non renseigné", status: "Injustifiée" },
                            { name: "Soro Aminata", class: "6ème 2", time: "10:00", reason: "Retard bus", status: "En attente" },
                        ].map((abs, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                <div>
                                    <p className="text-white font-medium text-sm">{abs.name} <span className="text-white/40 text-xs">• {abs.class}</span></p>
                                    <p className="text-white/40 text-xs">{abs.time} - {abs.reason}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs border ${abs.status === 'Justifiée' ? 'bg-green-500/10 text-green-400 border-green-500/20' : abs.status === 'Injustifiée' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                    {abs.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-400" />
                        Événements à venir
                    </h3>
                    <div className="space-y-4">
                        {[
                            { title: "Conseil de classe 3ème", date: "30 Nov", time: "14:00", type: "Réunion" },
                            { title: "Fête de l'école", date: "15 Déc", time: "09:00", type: "Événement" },
                            { title: "Réunion Parents-Profs", date: "18 Déc", time: "16:00", type: "Rencontre" },
                        ].map((evt, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                <div className="text-center bg-white/5 rounded-lg p-2 min-w-[60px]">
                                    <span className="block text-xs text-white/40">{evt.date.split(' ')[1]}</span>
                                    <span className="block text-lg font-bold text-white">{evt.date.split(' ')[0]}</span>
                                </div>
                                <div>
                                    <p className="text-white font-medium text-sm">{evt.title}</p>
                                    <p className="text-white/40 text-xs">{evt.time} • {evt.type}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
