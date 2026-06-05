import { FileText, TrendingUp, Calendar, Download } from 'lucide-react';

const ParentCurriculumSection = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Programme Scolaire</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
                    <Download size={18} />
                    Télécharger Bulletin
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Notes & Bulletins */}
                <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <FileText className="text-indigo-400" size={24} />
                        <h3 className="text-xl font-semibold text-white">Notes par Matière (Trimestre 1)</h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { subject: "Mathématiques", grade: "14.5/20", coeff: 3, trend: "up" },
                            { subject: "Français", grade: "13.0/20", coeff: 3, trend: "stable" },
                            { subject: "Physique-Chimie", grade: "15.2/20", coeff: 2, trend: "up" },
                            { subject: "Anglais", grade: "12.8/20", coeff: 2, trend: "down" },
                            { subject: "Histoire-Géo", grade: "14.0/20", coeff: 2, trend: "stable" },
                        ].map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/5">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-white font-medium">{item.subject}</h4>
                                        <span className="text-xs text-gray-500">Coeff {item.coeff}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-2xl font-bold ${parseFloat(item.grade) >= 14 ? 'text-emerald-400' : parseFloat(item.grade) >= 10 ? 'text-blue-400' : 'text-red-400'}`}>
                                            {item.grade}
                                        </span>
                                        {item.trend === 'up' && <TrendingUp size={16} className="text-emerald-400" />}
                                        {item.trend === 'down' && <TrendingUp size={16} className="text-red-400 rotate-180" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-white font-semibold">Moyenne Générale</span>
                            <span className="text-3xl font-bold text-indigo-300">13.9/20</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Classement : 8ème / 42 élèves</p>
                    </div>
                </div>

                {/* Emploi du Temps */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Calendar className="text-purple-400" size={24} />
                        <h3 className="text-lg font-semibold text-white">Emploi du Temps</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                            <p className="text-sm text-gray-400 mb-2">Aujourd'hui - Jeudi</p>
                            <div className="space-y-2">
                                {[
                                    { time: "08:00", subject: "Mathématiques" },
                                    { time: "10:00", subject: "Français" },
                                    { time: "14:00", subject: "Physique" },
                                ].map((slot, idx) => (
                                    <div key={idx} className="flex justify-between text-xs p-2 bg-white/5 rounded">
                                        <span className="text-gray-500">{slot.time}</span>
                                        <span className="text-white font-medium">{slot.subject}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button className="w-full py-2 text-sm text-gray-300 hover:text-white border border-white/10 hover:bg-white/5 rounded-lg transition-colors">
                            Voir l'emploi du temps complet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentCurriculumSection;
