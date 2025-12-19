import { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import api from '../../../../../../shared/api/api';
import type { WizardData } from './types';

interface StepProps {
    data: WizardData;
    updateData: React.Dispatch<React.SetStateAction<WizardData>>;
}

export const Step3Teachers = ({ data, updateData }: StepProps) => {
    const [teachers, setTeachers] = useState<any[]>([]);
    const [showAllTeachers, setShowAllTeachers] = useState<Record<string, boolean>>({}); // Per subject toggle

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                // Optimized fetch: Use simple=true to skip heavy aggregations
                const res = await api.get('/teachers?simple=true');
                setTeachers(res.data); // data is Teacher[] { id, specialty, user: {...} }
            } catch (err) {
                console.error('Failed to fetch teachers', err);
            }
        };
        fetchTeachers();
    }, []);

    const handleAssignTeacher = (subjectId: string, teacherId: string) => {
        updateData(prev => ({
            ...prev,
            subjects: prev.subjects.map(s => s.id === subjectId ? { ...s, teacherId } : s)
        }));
    };

    const toggleShowAll = (subjectId: string) => {
        setShowAllTeachers(prev => ({
            ...prev,
            [subjectId]: !prev[subjectId]
        }));
    };

    const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const getFilteredTeachers = (subjectName: string, subjectId: string) => {
        // If "Show All" is enabled for this subject, return strict all
        if (showAllTeachers[subjectId]) return teachers;

        const normalizedSubject = normalize(subjectName);

        const filtered = teachers.filter(t => {
            if (!t.specialty) return false; // No specialty = filtered out unless show all
            const normalizedSpecialty = normalize(t.specialty);
            // Check for containment both ways to handle "Maths" in "Mathématiques" or vice versa
            return normalizedSpecialty.includes(normalizedSubject) || normalizedSubject.includes(normalizedSpecialty);
        });

        // If filtering returns nothing, maybe we should auto-fallback? 
        // For now, let's trust the "Show All" toggle, but return filtered list.
        return filtered.length > 0 ? filtered : [];
    };

    const enabledSubjects = data.subjects.filter(s => s.isEnabled);

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Affectation des Professeurs</h3>
                <p className="text-gray-400">Assignez un professeur pour chaque matière sélectionnée.</p>
            </div>

            <div className="bg-[#1a1f37] border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-black/20 text-white">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Matière</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">Coefficient</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Professeur Assigné</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {enabledSubjects.map(subject => {
                            const availableTeachers = getFilteredTeachers(subject.name, subject.id);
                            // If we have 0 matches and haven't toggled show all, we effectively still show empty list until toggle
                            // Let's rely on the explicit toggle state, but maybe hint if empty.

                            return (
                                <tr key={subject.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-white text-lg">{subject.name}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded text-xs font-bold mr-2">
                                            Coef {subject.coefficient}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-2">
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                <select
                                                    value={subject.teacherId || ''}
                                                    onChange={(e) => handleAssignTeacher(subject.id, e.target.value)}
                                                    className={`w-full bg-black/20 border rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors ${subject.teacherId ? 'border-emerald-500/50 text-emerald-300' : 'border-white/10 text-gray-400'
                                                        }`}
                                                >
                                                    <option value="">
                                                        {availableTeachers.length === 0 && !showAllTeachers[subject.id]
                                                            ? "Aucun spécialiste trouvé..."
                                                            : "Sélectionner un professeur..."}
                                                    </option>
                                                    {(showAllTeachers[subject.id] ? teachers : availableTeachers)
                                                        .filter(t => t.userId)
                                                        .map(t => (
                                                            <option key={t.id} value={t.userId}>
                                                                {t.user.firstName} {t.user.lastName} {t.specialty ? `(${t.specialty})` : ''}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>

                                            {/* Show All Toggle */}
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => toggleShowAll(subject.id)}
                                                    className="text-xs text-indigo-300 hover:text-indigo-200 underline"
                                                >
                                                    {showAllTeachers[subject.id] ? "Voir les spécialistes uniquement" : "Voir tous les professeurs"}
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500">
                    <User size={20} />
                </div>
                <p className="text-sm text-amber-200">
                    <strong>Note:</strong> Vous pourrez sélectionner le Professeur Principal uniquement parmi les professeurs assignés ici.
                </p>
            </div>
        </div>
    );
};

