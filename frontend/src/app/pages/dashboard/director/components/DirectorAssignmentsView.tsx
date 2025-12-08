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

                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Corps Enseignant</h4>
                        <div className="space-y-3">
                            {classDetails.teachers.length === 0 ? (
                                <p className="text-gray-500 italic text-center py-4">Aucun professeur assigné.</p>
                            ) : (
                                classDetails.teachers.map((t: any) => (
                                    <div key={t.id} className="bg-white/5 p-3 rounded-lg flex justify-between items-center">
                                        <span className="text-white">{t.user.firstName} {t.user.lastName}</span>
                                        {/* Show subjects if available in API response? For now just names */}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DirectorAssignmentsView;
