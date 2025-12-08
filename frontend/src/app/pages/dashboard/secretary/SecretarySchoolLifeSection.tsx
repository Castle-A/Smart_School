import { useState } from 'react';
import { Clock, AlertTriangle, CheckSquare, Search } from 'lucide-react';

const SecretarySchoolLifeSection = () => {
    const [activeTab, setActiveTab] = useState<'attendance' | 'discipline'>('attendance');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Vie Scolaire</h2>
                    <p className="text-gray-400">Suivi des absences et de la discipline</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/10">
                <button
                    onClick={() => setActiveTab('attendance')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'attendance'
                        ? 'bg-indigo-600 text-white border-b-2 border-indigo-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Clock size={18} />
                    Absences & Retards
                </button>
                <button
                    onClick={() => setActiveTab('discipline')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'discipline'
                        ? 'bg-indigo-600 text-white border-b-2 border-indigo-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <AlertTriangle size={18} />
                    Discipline
                </button>
            </div>

            {/* Content */}
            {activeTab === 'attendance' ? <AttendanceTab /> : <DisciplineTab />}
        </div>
    );
};

const AttendanceTab = () => (
    <div className="space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Saisie Rapide des Absences</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <select className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white">
                    <option>Sélectionner une classe...</option>
                    <option>6ème A</option>
                    <option>3ème B</option>
                </select>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="text" placeholder="Rechercher élève..." className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white" />
                </div>
                <button className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition-colors">
                    <CheckSquare className="inline-block mr-2" size={18} />
                    Marquer Absent
                </button>
            </div>
        </div>

        {/* Mock List */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden p-6">
            <h4 className="text-white font-medium mb-4">Absences du Jour</h4>
            <table className="w-full text-left text-sm text-gray-400">
                <thead className="text-gray-200 uppercase font-medium">
                    <tr>
                        <th className="pb-3">Élève</th>
                        <th className="pb-3">Classe</th>
                        <th className="pb-3">Motif</th>
                        <th className="pb-3 text-right">Statut</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    <tr>
                        <td className="py-3 text-white">Yasmine K.</td>
                        <td className="py-3">3ème B</td>
                        <td className="py-3">Non justifié</td>
                        <td className="py-3 text-right text-red-400">En attente</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);

const DisciplineTab = () => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
        <AlertTriangle size={48} className="mx-auto mb-4 text-amber-500 opacity-50" />
        <h3 className="text-xl font-semibold text-white mb-2">Conseil de Discipline</h3>
        <p className="text-gray-400 max-w-md mx-auto">
            Accès restreint. Veuillez contacter le Censeur ou le Surveillant Général pour gérer les incidents disciplinaires majeurs.
        </p>
    </div>
);

export default SecretarySchoolLifeSection;
