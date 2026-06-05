import { Calendar, Clock, Layers, Edit2, BookOpen } from 'lucide-react';

const ProgrammeScolaireSection = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Programme Scolaire</h2>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2">
                    <Edit2 size={16} />
                    Modifier le calendrier
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendrier Académique */}
                <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Calendar className="text-indigo-400" size={24} />
                        <h3 className="text-xl font-semibold text-white">Calendrier Académique 2024-2025</h3>
                    </div>

                    <div className="relative border-l-2 border-white/10 ml-3 space-y-8 pb-4">
                        {[
                            { date: "15 Sept 2024", event: "Rentrée Scolaire", type: "info", desc: "Début des cours pour tous les cycles" },
                            { date: "20 Oct - 27 Oct", event: "Congés de Toussaint", type: "holiday", desc: "Pause du premier trimestre" },
                            { date: "15 Déc 2024", event: "Fin du 1er Trimestre", type: "exam", desc: "Arrêt des notes et conseils de classe" },
                            { date: "22 Déc - 05 Jan", event: "Congés de Noël", type: "holiday", desc: "Vacances de fin d'année" },
                        ].map((item, idx) => (
                            <div key={idx} className="relative pl-8">
                                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-slate-900 ${item.type === 'holiday' ? 'bg-emerald-500' :
                                        item.type === 'exam' ? 'bg-red-500' : 'bg-blue-500'
                                    }`}></div>
                                <div className="bg-white/5 p-4 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-sm font-bold text-indigo-300">{item.date}</span>
                                        <span className={`text-[10px] uppercase px-2 py-0.5 rounded ${item.type === 'holiday' ? 'bg-emerald-500/20 text-emerald-300' :
                                                item.type === 'exam' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'
                                            }`}>{item.type}</span>
                                    </div>
                                    <h4 className="text-white font-medium text-lg">{item.event}</h4>
                                    <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Configuration Rapide */}
                <div className="space-y-6">
                    {/* Planning Évaluations */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Clock className="text-amber-400" size={20} />
                            <h3 className="text-lg font-semibold text-white">Planning Évaluations</h3>
                        </div>
                        <ul className="space-y-4">
                            <li className="p-3 bg-white/5 rounded-lg border-l-2 border-amber-500">
                                <div className="flex justify-between text-sm text-gray-300 mb-1">
                                    <span>Devoir Surveillé Math</span>
                                    <span className="text-amber-400 font-bold">12 Nov</span>
                                </div>
                                <div className="text-xs text-gray-500">Classe: 3ème • Coeff 2</div>
                            </li>
                            <li className="p-3 bg-white/5 rounded-lg border-l-2 border-blue-500">
                                <div className="flex justify-between text-sm text-gray-300 mb-1">
                                    <span>Compo Française</span>
                                    <span className="text-blue-400 font-bold">15 Nov</span>
                                </div>
                                <div className="text-xs text-gray-500">Classe: Tle • Coeff 3</div>
                            </li>
                        </ul>
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
                                <span>Saisie des notes (T1)</span>
                                <span>J-5</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500" style={{ width: '75%' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Cycles et Filières */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Layers className="text-purple-400" size={20} />
                            <h3 className="text-lg font-semibold text-white">Cycles & Filières</h3>
                        </div>
                        <div className="space-y-3">
                            {[
                                { name: 'Primaire', classes: 6, students: 450 },
                                { name: 'Collège', classes: 12, students: 520 },
                                { name: 'Lycée', classes: 9, students: 275 },
                            ].map((cycle) => (
                                <div key={cycle.name} className="flex justify-between items-center p-2 hover:bg-white/5 rounded transition-colors cursor-pointer">
                                    <span className="text-sm text-gray-200">{cycle.name}</span>
                                    <div className="text-xs text-gray-500">
                                        {cycle.classes} classes • {cycle.students} élèves
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="flex items-center gap-2 mb-2">
                                <BookOpen size={14} className="text-gray-400" />
                                <span className="text-xs text-gray-400">Filières (Lycée)</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs border border-blue-500/30">Scientifique</span>
                                <span className="px-2 py-1 rounded bg-red-500/20 text-red-300 text-xs border border-red-500/30">Littéraire</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgrammeScolaireSection;
