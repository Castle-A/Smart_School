import { CheckSquare, Clock, AlertCircle, FileText } from 'lucide-react';

const SupervisorSchoolLifeSection = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Vie Scolaire (Surveillance)</h2>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
                        <CheckSquare size={18} />
                        Faire l'appel
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors shadow-lg shadow-amber-500/20">
                        <Clock size={18} />
                        Noter un retard
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Saisie Rapide */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <FileText className="text-blue-400" size={24} />
                        <h3 className="text-xl font-semibold text-white">Saisie Rapide</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-colors text-left">
                            <span className="block text-white font-medium mb-1">Absence Élève</span>
                            <span className="text-xs text-gray-400">Signaler une absence</span>
                        </button>
                        <button className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-colors text-left">
                            <span className="block text-white font-medium mb-1">Sortie Anticipée</span>
                            <span className="text-xs text-gray-400">Autorisation de sortie</span>
                        </button>
                        <button className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-colors text-left">
                            <span className="block text-white font-medium mb-1">Incident Mineur</span>
                            <span className="text-xs text-gray-400">Tenue, matériel...</span>
                        </button>
                    </div>
                </div>

                {/* Résumé du Jour */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <AlertCircle className="text-emerald-400" size={24} />
                        <h3 className="text-xl font-semibold text-white">Résumé du Jour</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-gray-300">Absences signalées</span>
                            <span className="text-white font-bold">12</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-gray-300">Retards notés</span>
                            <span className="text-white font-bold">8</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-gray-300">Incidents mineurs</span>
                            <span className="text-white font-bold">3</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupervisorSchoolLifeSection;
