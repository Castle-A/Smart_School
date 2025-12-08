import { BookOpen, FileText, Plus, Edit2, TrendingUp } from 'lucide-react';

const TeacherCurriculumSection = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Programme Scolaire</h2>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
                        <Plus size={18} />
                        Nouvelle Évaluation
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/10">
                        <Edit2 size={18} />
                        Cahier de Texte
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cahier de Texte */}
                <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <BookOpen className="text-blue-400" size={24} />
                        <h3 className="text-xl font-semibold text-white">Mon Cahier de Texte</h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { class: "3ème A", date: "Lundi 27 Nov", topic: "Équations du second degré", homework: "Exercices 12-15 p.45" },
                            { class: "Tle D", date: "Lundi 27 Nov", topic: "Intégrales - Méthode par parties", homework: "DM n°3 pour le 04/12" },
                            { class: "1ère C", date: "Mardi 28 Nov", topic: "Dérivées - Fonctions composées", homework: "Exercices 8-10 p.78" },
                        ].map((entry, idx) => (
                            <div key={idx} className="p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full">{entry.class}</span>
                                        <h4 className="text-white font-medium mt-2">{entry.topic}</h4>
                                    </div>
                                    <span className="text-xs text-gray-500">{entry.date}</span>
                                </div>
                                <p className="text-sm text-gray-400">Devoirs : {entry.homework}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Évaluations & Notes */}
                <div className="space-y-6">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <FileText className="text-amber-400" size={20} />
                            <h3 className="text-lg font-semibold text-white">Évaluations</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="p-3 bg-white/5 rounded-lg border-l-2 border-amber-500">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-white font-medium">DS Math - 3ème A</span>
                                    <span className="text-amber-400 font-bold">12 Déc</span>
                                </div>
                                <p className="text-xs text-gray-400">Coeff 2 - Chapitre 3</p>
                            </div>
                            <div className="p-3 bg-white/5 rounded-lg border-l-2 border-blue-500">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-white font-medium">Compo Tle D</span>
                                    <span className="text-blue-400 font-bold">15 Déc</span>
                                </div>
                                <p className="text-xs text-gray-400">Coeff 3 - Trimestre 1</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <TrendingUp className="text-emerald-400" size={20} />
                            <h3 className="text-lg font-semibold text-white">Saisie Notes</h3>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">3ème A - DS n°2</span>
                                <span className="text-emerald-400">100%</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                        <div className="space-y-2 mt-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Tle D - Interro</span>
                                <span className="text-amber-400">65%</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500" style={{ width: '65%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherCurriculumSection;
