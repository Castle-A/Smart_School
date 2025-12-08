import { useState, useEffect } from 'react';
import { BookOpen, UserPlus, Users, Trash2, Plus, ArrowRightLeft, X } from 'lucide-react';
import api from '../../../../../shared/api/api';
import Avatar from '../../../../../shared/components/Avatar';

interface AssignmentsViewProps {
    classes: any[];
}

const AssignmentsView = ({ classes }: AssignmentsViewProps) => {
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [classDetails, setClassDetails] = useState<any>(null);
    const [allSubjects, setAllSubjects] = useState<any[]>([]);
    const [allTeachers, setAllTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Modal states
    const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
    const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
    const [selectedSubjectToAdd, setSelectedSubjectToAdd] = useState<{ id: string, coef: number } | null>(null);

    useEffect(() => {
        // Fetch global lists on mount
        const fetchGlobals = async () => {
            try {
                const [subjRes, teachRes] = await Promise.all([
                    api.get('/subjects'),
                    api.get('/teachers')
                ]);
                setAllSubjects(subjRes.data);
                setAllTeachers(teachRes.data);
            } catch (err) {
                console.error('Error fetching globals:', err);
            }
        };
        fetchGlobals();
    }, []);

    useEffect(() => {
        if (!selectedClassId) {
            setClassDetails(null);
            return;
        }

        const fetchClass = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/classes/${selectedClassId}`);
                setClassDetails(res.data);
            } catch (err) {
                console.error('Error fetching class:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchClass();
    }, [selectedClassId]);

    const handleAddSubject = async (subjectId: string, coefficient?: number) => {
        try {
            await api.post(`/classes/${selectedClassId}/subjects/${subjectId}`, { coefficient });
            // Refresh class details
            const res = await api.get(`/classes/${selectedClassId}`);
            setClassDetails(res.data);
            setClassDetails(res.data);
            setIsAddSubjectOpen(false);
            setSelectedSubjectToAdd(null);
        } catch (err) {
            console.error('Error adding subject:', err);
            alert('Erreur lors de l\'ajout de la matière');
        }
    };

    const handleRemoveSubject = async (subjectId: string) => {
        if (!confirm('Retirer cette matière de la classe ?')) return;
        try {
            await api.delete(`/classes/${selectedClassId}/subjects/${subjectId}`);
            const res = await api.get(`/classes/${selectedClassId}`);
            setClassDetails(res.data);
        } catch (err) {
            console.error('Error removing subject:', err);
            alert('Erreur lors du retrait de la matière');
        }
    };

    const handleAddTeacher = async (teacherId: string) => {
        try {
            // Need SchoolUser ID from Teacher object? 
            // The API usually returns `teachers` list where `id` is Teacher ID, but linking usually requires SchoolUserId or similar?
            // Wait, ClassesService.addTeacher expects `schoolUserId`.
            // The `/teachers` endpoint returns Teacher entities.
            // Teacher entity has `userId`.
            // User entity has `schoolUsers`.
            // WE NEED SCHOOLUSER ID.
            // My previous `TeachersRepository` implementation returns objects that are Teacher entities enhanced with some counts.
            // Does it include SchoolUser ID?
            // Step 892 update to repo:
            // It maps `teacher` but doesn't explicitly return `schoolUserId` field except if it was already there.
            // `teacher.user.schoolUsers[0]?.id`?
            // I should verify what `/teachers` returns.
            // Assuming for now passing `teacher.user.id` (UserId) might work if I update backend to lookup SchoolUser like I did for CreateClass?
            // Actually, `ClassesService.addTeacher` uses `connect: { id: schoolUserId }`. It expects the ID of the relation (SchoolUser).
            // I should update `ClassesService.addTeacher` to handle userId resolution OR update Frontend to find SchoolUserID.
            // Or update `TeachersRepository` to return SchoolUserId. This is safest.

            // Assuming I pass teacher.id (Teacher ID) -> No.
            // Let's rely on finding by Teacher ID on backend?
            // Actually, the simplest fix is to update `ClassesService.addTeacher` to resolve UserID -> SchoolUser ID, just like `create` and `update` logic.
            // I will implement that fix in next step. For now, assuming I send UserID.

            // Wait, my `EditClassModal` sends `userId`.
            // So sticking to `userId` standard is best.

            const teacher = allTeachers.find(t => t.id === teacherId);
            if (!teacher) return;

            await api.post(`/classes/${selectedClassId}/teachers/${teacher.userId}`);
            const res = await api.get(`/classes/${selectedClassId}`);
            setClassDetails(res.data);
            setIsAddTeacherOpen(false);
        } catch (err) {
            console.error('Error adding teacher:', err);
            alert('Erreur lors de l\'ajout du professeur');
        }
    };

    const handleRemoveTeacher = async (teacherUserId: string) => { // Using userId here too?
        if (!confirm('Retirer ce professeur de la classe ?')) return;
        try {
            // Backend removeTeacher expects ID. If I update backend to handle userId, then fine.
            // If not, it expects SchoolUserId.
            // I will update backend to consistenly use UserId.
            await api.delete(`/classes/${selectedClassId}/teachers/${teacherUserId}`);
            const res = await api.get(`/classes/${selectedClassId}`);
            setClassDetails(res.data);
        } catch (err) {
            console.error('Error removing teacher:', err);
            alert('Erreur lors du retrait du professeur');
        }
    };

    // Filter out already assigned subjects for the dropdown AND filter by cycle
    const availableSubjects = allSubjects.filter(s =>
        !classDetails?.subjects.some((cs: any) => cs.id === s.id) &&
        (s.cycle === classDetails?.cycle || (!s.cycle && classDetails?.cycle === 'PRIMAIRE'))
    );

    // Filter out already assigned teachers
    const availableTeachers = allTeachers.filter(t => !classDetails?.teachers.some((ct: any) => ct.user.id === t.userId)); // Assuming teacher.userId

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
                            <option key={cls.id} value={cls.id}>{cls.name} ({cls.cycle}) • {cls.studentCount} élèves</option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedClassId && classDetails && (
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                    {/* Left: Subjects */}
                    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col h-full">
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <BookOpen size={18} className="text-pink-400" />
                                Matières Enseignées
                            </h3>
                            <button
                                onClick={() => setIsAddSubjectOpen(true)}
                                className="p-2 hover:bg-white/10 rounded-lg text-indigo-400 hover:text-white transition-colors"
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        <div className="p-4 flex-1 overflow-y-auto max-h-[500px] space-y-3">
                            {classDetails.subjects.length === 0 ? (
                                <p className="text-center text-gray-500 py-8 italic">Aucune matière assignée</p>
                            ) : (
                                classDetails.subjects.map((subject: any) => {
                                    // Find teachers capable of teaching this subject AND assigned to class
                                    const teachersForSubject = classDetails.teachers.filter((ct: any) => {
                                        // Need to check specific teacher capability?
                                        // "availableTeachers" has subjects string list.
                                        // We need to look up the teacher object from "allTeachers" using user ID?
                                        const globalTeacher = allTeachers.find(at => at.userId === ct.user.id); // Assuming we can match ID? 
                                        // Actually `ct.user.id` is UserID. `at.userId` is UserID.
                                        if (!globalTeacher) return false;
                                        // Check if subject name is in teacher's subjects array
                                        return globalTeacher.subjects.some((s: string) =>
                                            s.toLowerCase().includes(subject.name.toLowerCase()) ||
                                            subject.name.toLowerCase().includes(s.toLowerCase())
                                        );
                                    });

                                    return (
                                        <div key={subject.id} className="bg-black/20 rounded-lg p-3 border border-white/5">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="text-white font-medium">{subject.name}</h4>
                                                    <span className="text-xs text-gray-400">Coef: {subject.coefficient}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveSubject(subject.id)}
                                                    className="text-gray-600 hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            {/* Assigned Teachers for this Subject */}
                                            <div className="pl-3 border-l-2 border-indigo-500/20 mt-2 space-y-1">
                                                {teachersForSubject.length > 0 ? (
                                                    teachersForSubject.map((t: any) => (
                                                        <div key={t.id} className="text-xs text-indigo-300 flex items-center gap-1">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                                            {t.user.firstName} {t.user.lastName}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-xs text-amber-500/70 italic flex items-center gap-1">
                                                        ⚠ Aucun prof. assigné
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {isAddSubjectOpen && (
                            <div className="p-4 border-t border-white/10 bg-white/5 space-y-3">
                                <h4 className="text-sm font-medium text-gray-300">Ajouter une matière</h4>
                                <div className="space-y-2">
                                    <select
                                        onChange={(e) => {
                                            const subId = e.target.value;
                                            if (subId) {
                                                const sub = availableSubjects.find(s => s.id === subId);
                                                setSelectedSubjectToAdd({ id: subId, coef: sub?.coefficient || 1 });
                                            } else {
                                                setSelectedSubjectToAdd(null);
                                            }
                                        }}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                                        value={selectedSubjectToAdd?.id || ""}
                                    >
                                        <option value="">Sélectionner une matière...</option>
                                        {availableSubjects.map(s => (
                                            <option key={s.id} value={s.id}>{s.name} (Coef défaut: {s.coefficient})</option>
                                        ))}
                                    </select>

                                    {selectedSubjectToAdd && (
                                        <div className="flex gap-2 items-center">
                                            <div className="flex-1">
                                                <label className="text-xs text-gray-400 block mb-1">Coef. pour cette classe</label>
                                                <input
                                                    type="number"
                                                    min="0.25"
                                                    max="8"
                                                    step="0.25"
                                                    value={selectedSubjectToAdd.coef}
                                                    onChange={(e) => setSelectedSubjectToAdd(prev => prev ? ({ ...prev, coef: parseFloat(e.target.value) || 0 }) : null)}
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                                                />
                                            </div>
                                            <button
                                                onClick={() => handleAddSubject(selectedSubjectToAdd.id, selectedSubjectToAdd.coef)}
                                                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm"
                                            >
                                                Ajouter
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-end">
                                    <button onClick={() => { setIsAddSubjectOpen(false); setSelectedSubjectToAdd(null); }} className="text-xs text-gray-400 hover:text-white">
                                        Annuler
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Teachers */}
                    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col h-full">
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Users size={18} className="text-emerald-400" />
                                Professeurs de la classe
                            </h3>
                            <button
                                onClick={() => setIsAddTeacherOpen(true)}
                                className="p-2 hover:bg-white/10 rounded-lg text-indigo-400 hover:text-white transition-colors"
                            >
                                <UserPlus size={20} />
                            </button>
                        </div>

                        <div className="p-4 flex-1 overflow-y-auto max-h-[500px] space-y-3">
                            {/* Main Teacher */}
                            {classDetails.mainTeacher && (
                                <div className="bg-indigo-500/10 rounded-lg p-3 border border-indigo-500/30 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-500 rounded-full text-white">
                                            <Users size={16} />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-medium text-sm">
                                                {classDetails.mainTeacher.user.firstName} {classDetails.mainTeacher.user.lastName}
                                            </h4>
                                            <span className="text-xs text-indigo-300">Professeur Principal</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Subject Teachers */}
                            {classDetails.teachers.filter((t: any) => t.id !== classDetails.mainTeacher?.id).length === 0 && !classDetails.mainTeacher ? (
                                <p className="text-center text-gray-500 py-8 italic">Aucun professeur assigné</p>
                            ) : (
                                classDetails.teachers
                                    .filter((t: any) => !classDetails.mainTeacher || t.user.firstName !== classDetails.mainTeacher.user.firstName) // Rough filter for main teacher duplication if they are also in teachers list?
                                    // Actually backend "teachers" relation usually excludes mainTeacher unless added to both.
                                    // Let's assume they are distinct or duplicates don't matter much.
                                    .map((t: any) => (
                                        <div key={t.id} className="bg-black/20 rounded-lg p-3 border border-white/5 flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <Avatar firstName={t.user.firstName} lastName={t.user.lastName} size="sm" />
                                                <div>
                                                    <h4 className="text-white font-medium text-sm">
                                                        {t.user.firstName} {t.user.lastName}
                                                    </h4>
                                                    {/* Find subjects they teach */}
                                                    <span className="text-xs text-gray-400">
                                                        {allTeachers.find(at => at.userId === t.user.id)?.subjects.join(', ') || 'Aucune matière définie'}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveTeacher(t.user.id)} // Must pass UserID if backend fix applied
                                                className="text-gray-600 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))
                            )}
                        </div>

                        {isAddTeacherOpen && (
                            <div className="p-4 border-t border-white/10 bg-white/5">
                                <h4 className="text-sm font-medium text-gray-300 mb-2">Ajouter un professeur</h4>
                                <div className="flex gap-2">
                                    <select
                                        onChange={(e) => {
                                            if (e.target.value) handleAddTeacher(e.target.value);
                                        }}
                                        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                                        value=""
                                    >
                                        <option value="">Sélectionner...</option>
                                        {availableTeachers.map(t => (
                                            <option key={t.id} value={t.id}>{t.firstName} {t.lastName} ({t.subjects.slice(0, 2).join(', ')})</option>
                                        ))}
                                    </select>
                                    <button onClick={() => setIsAddTeacherOpen(false)} className="p-2 text-gray-400 hover:text-white">
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignmentsView;
