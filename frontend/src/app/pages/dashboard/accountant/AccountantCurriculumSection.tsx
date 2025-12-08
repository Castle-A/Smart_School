import { Layers, Users } from 'lucide-react';

const AccountantCurriculumSection = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Programme Scolaire (Consultation)</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cycles et Filières */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Layers className="text-purple-400" size={20} />
                        <h3 className="text-lg font-semibold text-white">Structure de l'École</h3>
                    </div>
                    <div className="space-y-3">
                        {[
                            { name: 'Primaire', classes: 6, students: 450 },
                            { name: 'Collège', classes: 12, students: 520 },
                            { name: 'Lycée', classes: 9, students: 275 },
                        ].map((cycle) => (
                            <div key={cycle.name} className="flex justify-between items-center p-2 hover:bg-white/5 rounded transition-colors">
                                <span className="text-sm text-gray-200">{cycle.name}</span>
                                <div className="text-xs text-gray-500">
                                    {cycle.classes} classes • {cycle.students} élèves
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Liste des Classes */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Users className="text-indigo-400" size={20} />
                        <h3 className="text-lg font-semibold text-white">Classes & Effectifs</h3>
                    </div>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {[
                            { name: "6ème A", students: 45 },
                            { name: "6ème B", students: 42 },
                            { name: "5ème A", students: 40 },
                            { name: "Tle D", students: 35 },
                        ].map((cls, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2 bg-white/5 rounded border border-white/5">
                                <p className="text-sm font-medium text-white">{cls.name}</p>
                                <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full">{cls.students} élèves</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountantCurriculumSection;
