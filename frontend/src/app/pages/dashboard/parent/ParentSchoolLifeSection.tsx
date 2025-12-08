import { UserX, Clock, AlertTriangle, Calendar } from 'lucide-react';

const ParentSchoolLifeSection = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Vie Scolaire</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Absences & Retards */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <UserX className="text-red-400" size={24} />
                        <h3 className="text-xl font-semibold text-white">Absences & Retards</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-gray-300">Total Absences (ce mois)</span>
                            <span className="text-red-400 font-bold text-xl">2</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-gray-300">Total Retards (ce mois)</span>
                            <span className="text-amber-400 font-bold text-xl">1</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h4 className="text-sm font-semibold text-white mb-3">Historique Récent</h4>
                        <div className="space-y-2">
                            {[
                                { type: "Absence", date: "27 Nov", reason: "Maladie", justified: true },
                                { type: "Retard", date: "25 Nov", reason: "Transport", justified: true },
                            ].map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center p-2 bg-white/5 rounded text-sm">
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className={item.type === 'Absence' ? 'text-red-400' : 'text-amber-400'} />
                                        <span className="text-gray-300">{item.type} - {item.date}</span>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded ${item.justified ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                                        {item.justified ? 'Justifié' : 'Non justifié'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Discipline */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <AlertTriangle className="text-amber-400" size={24} />
                        <h3 className="text-xl font-semibold text-white">Discipline</h3>
                    </div>

                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-center">
                        <Calendar size={32} className="text-emerald-400 mx-auto mb-2" />
                        <p className="text-emerald-300 font-medium">Aucun incident disciplinaire</p>
                        <p className="text-xs text-gray-400 mt-1">Comportement exemplaire ce trimestre</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentSchoolLifeSection;
