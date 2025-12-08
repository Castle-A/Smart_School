import { Users, GraduationCap, AlertTriangle, CheckCircle, Search, Filter, BookOpen } from 'lucide-react';

const VieScolaireSection = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Vie Scolaire</h2>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                        <input
                            type="text"
                            placeholder="Rechercher un élève..."
                            className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 w-64"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/10">
                        <Filter size={16} />
                        Filtres
                    </button>
                </div>
            </div>

            {/* Stats Rapides */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total Élèves", value: "1,245", icon: Users, color: "text-blue-400", bg: "bg-blue-500/20" },
                    { label: "Enseignants", value: "84", icon: GraduationCap, color: "text-indigo-400", bg: "bg-indigo-500/20" },
                    { label: "Taux Présence", value: "96.5%", icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/20" },
                    { label: "Moyenne Générale", value: "12.4/20", icon: BookOpen, color: "text-amber-400", bg: "bg-amber-500/20" }
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex items-center gap-4">
                        <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">{stat.label}</p>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Annuaire Enseignants */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-white">Annuaire Enseignants</h3>
                        <button className="text-xs text-indigo-400 hover:text-indigo-300">Voir tout</button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: "M. Koffi", subject: "Mathématiques", classes: "Tle C, 1ère C", status: "En cours", fillRate: "98%" },
                            { name: "Mme. Diallo", subject: "Français", classes: "6ème, 5ème", status: "Libre", fillRate: "100%" },
                            { name: "M. Sow", subject: "Physique", classes: "2nde C", status: "En cours", fillRate: "85%" },
                        ].map((teacher, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-sm font-bold text-white border border-white/20">
                                        {teacher.name.charAt(3)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{teacher.name}</p>
                                        <p className="text-xs text-slate-400">{teacher.subject} • {teacher.classes}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs px-2 py-1 rounded-full ${teacher.status === 'En cours' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                                        {teacher.status}
                                    </span>
                                    <p className="text-[10px] text-slate-500 mt-1">Cahier: {teacher.fillRate}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Supervision Pédagogique */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Supervision Pédagogique</h3>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-300">Validation des Bulletins (T1)</span>
                                <span className="text-emerald-400 font-medium">92%</span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: '92%' }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-300">Saisie des Notes (Trimestre 1)</span>
                                <span className="text-amber-400 font-medium">78%</span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500" style={{ width: '78%' }}></div>
                            </div>
                        </div>

                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg mt-4">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle size={16} className="text-red-400" />
                                <h4 className="text-red-400 text-sm font-semibold">Classes en difficulté</h4>
                            </div>
                            <ul className="text-xs text-slate-700 space-y-2 ml-6 list-disc">
                                <li><span className="text-white font-medium">3ème B</span> - Moyenne générale: <span className="text-red-300">08.5/20</span></li>
                                <li><span className="text-white font-medium">Tle D</span> - Retard programme Physique (3 chapitres)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Répertoire Élèves (Aperçu) */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">Derniers Élèves Inscrits</h3>
                    <div className="flex gap-2">
                        {['Tous', 'Primaire', 'Collège', 'Lycée'].map(filter => (
                            <button key={filter} className="px-3 py-1 text-xs rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="text-xs uppercase bg-white/10 text-slate-300">
                        <tr>
                            <th className="px-4 py-3 rounded-l-lg">Nom & Prénoms</th>
                            <th className="px-4 py-3">Classe</th>
                            <th className="px-4 py-3">Responsable</th>
                            <th className="px-4 py-3">Statut</th>
                            <th className="px-4 py-3 rounded-r-lg">Moyenne</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {[
                            { name: "Kouamé Aya Sarah", class: "Tle D", parent: "M. Kouamé", status: "Interne", avg: "14.5" },
                            { name: "Diop Moussa", class: "6ème A", parent: "Mme Diop", status: "Externe", avg: "16.2" },
                            { name: "Traoré Fanta", class: "CM2", parent: "M. Traoré", status: "Demi-pension", avg: "13.8" },
                        ].map((student, idx) => (
                            <tr key={idx} className="hover:bg-white/10 transition-colors">
                                <td className="px-4 py-3 font-medium text-white">{student.name}</td>
                                <td className="px-4 py-3">{student.class}</td>
                                <td className="px-4 py-3">{student.parent}</td>
                                <td className="px-4 py-3"><span className="px-2 py-0.5 bg-white/10 rounded text-xs">{student.status}</span></td>
                                <td className="px-4 py-3 text-emerald-400 font-bold">{student.avg}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VieScolaireSection;
