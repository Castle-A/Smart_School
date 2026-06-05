import type { WizardData } from './types';
import { Layers, UserCheck, BookOpen, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../../../../../../shared/api/api';

export const Step5Review = ({ data }: { data: WizardData }) => {
    const [teacherMap, setTeacherMap] = useState<Record<string, string>>({});
    const [mainTeacherName, setMainTeacherName] = useState<string>('');

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await api.get('/teachers');
                const teachers = res.data;
                const map: Record<string, string> = {};

                teachers.forEach((t: any) => {
                    map[t.userId] = `${t.user.firstName} ${t.user.lastName}`;
                });
                setTeacherMap(map);

                if (data.mainTeacherId && map[data.mainTeacherId]) {
                    setMainTeacherName(map[data.mainTeacherId]);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchDetails();
    }, [data.mainTeacherId]);

    const enabledSubjects = data.subjects.filter(s => s.isEnabled);

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Récapitulatif</h3>
                <p className="text-gray-400">Vérifiez les informations avant de créer la classe.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Identity Card */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-4 text-indigo-400">
                        <Layers size={24} />
                        <h4 className="text-lg font-bold text-white">Identité</h4>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-400">Nom</span>
                            <span className="text-white font-bold">{data.identity.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-400">Cycle</span>
                            <span className="text-white">{data.identity.cycle}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-400">Niveau</span>
                            <span className="text-white">{data.identity.level}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Salle</span>
                            <span className="text-white">{data.identity.room || '-'}</span>
                        </div>
                    </div>
                </div>

                {/* Main Teacher Card */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-4 text-amber-400">
                        <UserCheck size={24} />
                        <h4 className="text-lg font-bold text-white">Professeur Principal</h4>
                    </div>
                    {mainTeacherName ? (
                        <div className="flex items-center gap-4 bg-amber-500/10 p-4 rounded-lg border border-amber-500/20">
                            <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xl">
                                {mainTeacherName.charAt(0)}
                            </div>
                            <div>
                                <p className="text-white font-bold text-lg">{mainTeacherName}</p>
                                <p className="text-amber-200/60 text-sm">Responsable de la classe</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-red-400 italic">Non sélectionné</p>
                    )}
                </div>
            </div>

            {/* Subjects Table */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mt-6">
                <div className="p-4 bg-black/20 border-b border-white/10 flex items-center gap-3">
                    <BookOpen className="text-emerald-400" size={20} />
                    <h4 className="text-lg font-bold text-white">Programme ({enabledSubjects.length} matières)</h4>
                </div>
                <table className="w-full">
                    <thead className="bg-black/20 text-gray-400 text-sm">
                        <tr>
                            <th className="px-6 py-3 text-left">Matière</th>
                            <th className="px-6 py-3 text-center">Coef.</th>
                            <th className="px-6 py-3 text-left">Professeur</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                        {enabledSubjects.map(s => (
                            <tr key={s.id}>
                                <td className="px-6 py-3 text-white font-medium">{s.name}</td>
                                <td className="px-6 py-3 text-center text-gray-300">{s.coefficient}</td>
                                <td className="px-6 py-3 text-indigo-300 flex items-center gap-2">
                                    <User size={14} />
                                    {s.teacherId ? teacherMap[s.teacherId] : <span className="text-red-400 italic">Non assigné</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Total */}
            <div className="flex justify-end mt-4">
                <div className="bg-indigo-600/20 border border-indigo-500/30 px-6 py-3 rounded-xl">
                    <span className="text-indigo-300 mr-2">Total Coefficients:</span>
                    <span className="text-white font-bold text-xl">{enabledSubjects.reduce((acc, curr) => acc + curr.coefficient, 0)}</span>
                </div>
            </div>
        </div>
    );
};
