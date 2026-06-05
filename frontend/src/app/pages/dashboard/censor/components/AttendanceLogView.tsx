import { useState } from 'react';
import { Search } from 'lucide-react';

const AttendanceLogView = () => {
    // Mock data representing what will come from Surveillants
    const [incidents] = useState([
        { id: 1, date: '2025-10-24 08:30', student: 'KOUASSI Amenan', class: '3ème A', type: 'RETARD', reason: 'Panne de transport', reporter: 'Mr. Konan' },
        { id: 2, date: '2025-10-24 10:00', student: 'TOURE Moussa', class: 'Tle D', type: 'EXCLUSION', reason: 'Bavardage intempestif', reporter: 'Mme. Diallo' },
        { id: 3, date: '2025-10-23 14:00', student: 'DIALLO Ibrahim', class: '6ème B', type: 'ABSENCE', reason: 'Non justifiée', reporter: 'Vie Scolaire' },
    ]);

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 bg-white/5 border border-white/10 p-4 rounded-xl items-center">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Rechercher un élève..."
                        className="pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                </div>
                <select className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white text-sm">
                    <option value="">Tous les types</option>
                    <option value="ABSENCE">Absences</option>
                    <option value="RETARD">Retards</option>
                    <option value="DISCIPLINE">Sanctions / Discipline</option>
                </select>
                <select className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white text-sm">
                    <option value="">Aujourd'hui</option>
                    <option value="">Cette semaine</option>
                    <option value="">Ce mois</option>
                </select>
            </div>

            {/* Log Table */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#1e293b] text-gray-200 uppercase font-medium">
                        <tr>
                            <th className="p-4">Date & Heure</th>
                            <th className="p-4">Élève</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Motif / Détail</th>
                            <th className="p-4">Signalé par</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {incidents.map((inc) => (
                            <tr key={inc.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 text-gray-400">{inc.date}</td>
                                <td className="p-4">
                                    <p className="text-white font-medium">{inc.student}</p>
                                    <span className="text-xs text-indigo-300">{inc.class}</span>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${inc.type === 'RETARD' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                        inc.type === 'ABSENCE' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                            'bg-red-500/10 text-red-400 border border-red-500/20'
                                        }`}>
                                        {inc.type}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-300">{inc.reason}</td>
                                <td className="p-4 text-gray-400 italic">{inc.reporter}</td>
                                <td className="p-4 text-right">
                                    <button className="text-indigo-400 hover:text-white text-xs border border-indigo-400/30 px-2 py-1 rounded hover:bg-indigo-500/20 transition-colors">
                                        Voir Dossier
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {incidents.length === 0 && (
                            <tr><td colSpan={6} className="p-6 text-center text-gray-500">Aucun incident à afficher.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceLogView;
