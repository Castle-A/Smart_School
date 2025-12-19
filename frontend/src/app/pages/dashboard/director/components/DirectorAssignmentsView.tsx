import { useState, useEffect } from 'react';
import { Users, ArrowRightLeft } from 'lucide-react';
import api from '../../../../../shared/api/api';

const DirectorAssignmentsView = () => {
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [classDetails, setClassDetails] = useState<any>(null);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await api.get('/classes');
                setClasses(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchClasses();
    }, []);

    useEffect(() => {
        if (!selectedClassId) {
            setClassDetails(null);
            return;
        }
        const fetchClass = async () => {
            try {
                const res = await api.get(`/classes/${selectedClassId}`);
                setClassDetails(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchClass();
    }, [selectedClassId]);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="p-3 bg-indigo-500/20 rounded-lg text-indigo-400">
                    <ArrowRightLeft size={24} />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Sélectionner une Classe</label>
                    <select
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="w-full bg-[#1a1f37] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                    >
                        <option value="">-- Choisir une classe --</option>
                        {classes.map(cls => (
                            <option key={cls.id} value={cls.id}>{cls.name} ({cls.cycle})</option>
                        ))}
                    </select>
                </div>
            </div>

            {classDetails && (
                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Users size={20} className="text-emerald-400" />
                            Composition de la Classe
                        </h3>

                        <div className="mb-8 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
                            <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-wider mb-2">Professeur Principal</h4>
                            <div className="flex items-center gap-3">
                                {classDetails.mainTeacher ? (
                                    <span className="text-white font-medium">
                                        {classDetails.mainTeacher.user.firstName} {classDetails.mainTeacher.user.lastName}
                                    </span>
                                ) : (
                                    <span className="text-gray-500 italic">Non assigné</span>
                                )}
                            </div>
                        </div>

                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Répartition par Matière</h4>
                        <div className="overflow-hidden rounded-xl border border-white/10">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 text-gray-400">
                                    <tr>
                                        <th className="p-3 font-medium">Matière</th>
                                        <th className="p-3 font-medium text-center">Coef.</th>
                                        <th className="p-3 font-medium">Enseignant Affecté</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {classDetails.subjects?.map((s: any) => (
                                        <tr key={s.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-3 text-white font-medium">{s.name}</td>
                                            <td className="p-3 text-center text-gray-300">{s.coefficient}</td>
                                            <td className="p-3">
                                                {s.assignedTeacher ? (
                                                    <span className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20 text-xs font-semibold">
                                                        {s.assignedTeacher.user.firstName} {s.assignedTeacher.user.lastName}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500 text-xs italic">Non assigné</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {(!classDetails.subjects || classDetails.subjects.length === 0) && (
                                        <tr>
                                            <td colSpan={4} className="p-4 text-center text-gray-500 italic">
                                                Aucune matière configurée.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DirectorAssignmentsView;
