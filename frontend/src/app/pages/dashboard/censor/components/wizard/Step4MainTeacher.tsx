import { useEffect, useState } from 'react';
import { UserCheck, Star, AlertTriangle } from 'lucide-react';
import api from '../../../../../../shared/api/api';
import type { WizardData } from './types';

interface StepProps {
    data: WizardData;
    updateData: React.Dispatch<React.SetStateAction<WizardData>>;
}

export const Step4MainTeacher = ({ data, updateData }: StepProps) => {
    const [assignedTeachers, setAssignedTeachers] = useState<any[]>([]);

    useEffect(() => {
        const fetchTeacherDetails = async () => {
            // In a real app we might already have details, or fetch by ID
            // For now, let's fetch all and filter
            try {
                const res = await api.get('/teachers');
                const allTeachers = res.data;

                // Get IDs assigned in Step 3
                const assignedIds = new Set(data.subjects.map(s => s.teacherId).filter(Boolean));

                const filtered = allTeachers.filter((t: any) => assignedIds.has(t.userId));
                setAssignedTeachers(filtered);
            } catch (err) {
                console.error(err);
            }
        };

        if (data.subjects.some(s => s.teacherId)) {
            fetchTeacherDetails();
        }
    }, [data.subjects]);

    const handleSelect = (userId: string) => {
        updateData(prev => ({ ...prev, mainTeacherId: userId }));
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Professeur Principal</h3>
                <p className="text-gray-400">Sélectionnez le professeur principal parmi l'équipe enseignante.</p>
            </div>

            {assignedTeachers.length === 0 ? (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 text-center">
                    <div className="bg-yellow-500/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        <AlertTriangle className="text-yellow-500" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1">Aucun professeur assigné</h4>
                    <p className="text-gray-400">Veuillez assigner des professeurs aux matières à l'étape précédente.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {assignedTeachers.map(teacher => (
                        <div
                            key={teacher.id}
                            onClick={() => handleSelect(teacher.userId)}
                            className={`cursor-pointer border rounded-xl p-4 transition-all flex items-center gap-4 ${data.mainTeacherId === teacher.userId
                                ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/10'
                                : 'bg-white/5 border-white/5 hover:bg-white/10'
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${data.mainTeacherId === teacher.userId ? 'bg-indigo-500 text-white' : 'bg-white/10 text-gray-400'
                                }`}>
                                <UserCheck size={24} />
                            </div>
                            <div>
                                <h4 className={`font-bold ${data.mainTeacherId === teacher.userId ? 'text-white' : 'text-gray-300'}`}>
                                    {teacher.user.firstName} {teacher.user.lastName}
                                </h4>
                                <p className="text-xs text-gray-500">{teacher.specialty}</p>
                            </div>
                            {data.mainTeacherId === teacher.userId && (
                                <div className="ml-auto text-indigo-400">
                                    <Star size={20} fill="currentColor" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

