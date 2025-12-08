import { useState, useEffect } from 'react';
import { Users, Trash2, Plus, ArrowRightLeft, X, Save } from 'lucide-react';
import api from '../../../../../shared/api/api';
import { adminRequestService } from '../../../../../shared/api/admin-requests.service';

interface AssignmentsViewProps {
    classes: any[];
}

interface TeacherAssignment {
    teacherUserId: string;
    teacherName: string; // for UI
    type: 'TEACHER' | 'MAIN_TEACHER';
    subjectId?: string; // If we supported per-subject assignment
}

// Reuse Subject/Teacher interfaces ideally

const CensorAssignmentsView = ({ classes }: AssignmentsViewProps) => {
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [allTeachers, setAllTeachers] = useState<any[]>([]); // These are Teachers (with user relation)

    // Local draft state
    const [localTeachers, setLocalTeachers] = useState<TeacherAssignment[]>([]);

    // Modal states
    const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);

    useEffect(() => {
        const fetchGlobals = async () => {
            try {
                const teachRes = await api.get('/teachers');
                setAllTeachers(teachRes.data);
            } catch (err) {
                console.error('Error fetching globals:', err);
            }
        };
        fetchGlobals();
    }, []);

    useEffect(() => {
        if (!selectedClassId) {
            setLocalTeachers([]);
            return;
        }

        const fetchClass = async () => {
            try {
                const res = await api.get(`/classes/${selectedClassId}`);

                // Initialize local state from current class state
                const currentTeachers: TeacherAssignment[] = [];

                // Main Teacher
                if (res.data.mainTeacher) {
                    currentTeachers.push({
                        teacherUserId: res.data.mainTeacher.user.id, // Using UserID for matching
                        teacherName: `${res.data.mainTeacher.user.firstName} ${res.data.mainTeacher.user.lastName}`,
                        type: 'MAIN_TEACHER'
                    });
                }

                // Regular Teachers
                res.data.teachers.forEach((t: any) => {
                    // Check if already added as main teacher (if they are same person)?
                    // Usually distinct roles in lists, but same person.
                    // Let's just add.
                    currentTeachers.push({
                        teacherUserId: t.user.id, // Need User ID
                        // Wait, t.user.id in `teachers` array? Yes, `include: { user: ... }`
                        teacherName: `${t.user.firstName} ${t.user.lastName}`,
                        type: 'TEACHER'
                    });
                });

                // Remove duplicates if Main Teacher is also in Teachers list (database might store both relations)
                // We'll manage them as unique entries in our UI list for simplicity

                setLocalTeachers(currentTeachers);

            } catch (err) {
                console.error('Error fetching class:', err);
            }
        };
        fetchClass();
    }, [selectedClassId]);

    const handleAddTeacherToDraft = (teacherId: string) => {
        // specific teacher from `allTeachers`
        const teacher = allTeachers.find(t => t.id === parseInt(teacherId) || t.id === teacherId);
        // Note: Teacher ID vs User ID. `allTeachers` has `userId`.
        if (!teacher) return;

        // Prevent duplicates
        if (localTeachers.some(t => t.teacherUserId === teacher.userId && t.type === 'TEACHER')) {
            alert("Ce professeur est déjà dans la liste.");
            return;
        }

        setLocalTeachers([...localTeachers, {
            teacherUserId: teacher.userId,
            teacherName: `${teacher.firstName} ${teacher.lastName}`,
            type: 'TEACHER'
        }]);
        setIsAddTeacherOpen(false);
    };

    const handleRemoveTeacherFromDraft = (userId: string, type: 'TEACHER' | 'MAIN_TEACHER') => {
        setLocalTeachers(localTeachers.filter(t => !(t.teacherUserId === userId && t.type === type)));
    };

    const handleSetMainTeacher = (userId: string) => {
        // Remove existing main teacher if any
        let newTeachers = localTeachers.filter(t => t.type !== 'MAIN_TEACHER');

        const teacher = allTeachers.find(t => t.userId === userId);
        if (teacher) {
            newTeachers.push({
                teacherUserId: teacher.userId,
                teacherName: `${teacher.firstName} ${teacher.lastName}`,
                type: 'MAIN_TEACHER'
            });
        }
        setLocalTeachers(newTeachers);
    };

    const handleSubmitAssembly = async () => {
        if (!confirm("Voulez-vous soumettre cette composition de classe au Directeur pour validation ?")) return;

        try {
            await adminRequestService.create('CLASS_ASSEMBLY', {
                classId: selectedClassId,
                assignments: localTeachers.map(t => ({
                    teacherUserId: t.teacherUserId,
                    type: t.type,
                    // subjectId: ... if we mapped subjects
                }))
            });
            alert("Composition soumise avec succès !");
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la soumission.");
        }
    };

    // Filter out teachers already in draft for dropdown?
    const availableTeachers = allTeachers.filter(t => !localTeachers.some(lt => lt.teacherUserId === t.userId && lt.type === 'TEACHER'));

    return (
        <div className="space-y-6">
            {/* Class Selector */}
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

            {selectedClassId && (
                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Users size={20} className="text-emerald-400" />
                                Composition de la Classe (Brouillon)
                            </h3>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsAddTeacherOpen(true)}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <Plus size={16} /> Ajouter Professeur
                                </button>
                                <button
                                    onClick={handleSubmitAssembly}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
                                >
                                    <Save size={16} /> Soumettre au Directeur
                                </button>
                            </div>
                        </div>

                        {/* Main Teacher */}
                        <div className="mb-8 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
                            <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-wider mb-2">Professeur Principal</h4>
                            {localTeachers.find(t => t.type === 'MAIN_TEACHER') ? (
                                <div className="flex justify-between items-center bg-indigo-500/20 p-3 rounded-lg border border-indigo-500/30">
                                    <span className="text-white font-medium">
                                        {localTeachers.find(t => t.type === 'MAIN_TEACHER')?.teacherName}
                                    </span>
                                    <button
                                        onClick={() => handleRemoveTeacherFromDraft(localTeachers.find(t => t.type === 'MAIN_TEACHER')!.teacherUserId, 'MAIN_TEACHER')}
                                        className="text-indigo-300 hover:text-white"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <p className="text-gray-500 italic text-sm">Aucun professeur principal désigné.</p>
                            )}
                        </div>

                        {/* Teacher List */}
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Corps Enseignant</h4>
                        <div className="space-y-3">
                            {localTeachers.filter(t => t.type === 'TEACHER').length === 0 ? (
                                <p className="text-gray-500 italic text-center py-8">Aucun professeur assigné.</p>
                            ) : (
                                localTeachers.filter(t => t.type === 'TEACHER').map((t, idx) => (
                                    <div key={`${t.teacherUserId}-${idx}`} className="bg-white/5 p-3 rounded-lg flex justify-between items-center group border border-white/5 hover:border-white/10 transition-colors">
                                        <span className="text-white">{t.teacherName}</span>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {!localTeachers.some(lt => lt.type === 'MAIN_TEACHER' && lt.teacherUserId === t.teacherUserId) && (
                                                <button
                                                    onClick={() => handleSetMainTeacher(t.teacherUserId)}
                                                    className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded hover:bg-indigo-500 hover:text-white transition-colors"
                                                >
                                                    Désigner PP
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleRemoveTeacherFromDraft(t.teacherUserId, 'TEACHER')}
                                                className="text-gray-500 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {isAddTeacherOpen && (
                            <div className="mt-4 p-4 bg-black/40 rounded-lg border border-white/10 animate-fade-in">
                                <label className="block text-sm text-gray-400 mb-2">Sélectionner un professeur :</label>
                                <select
                                    onChange={(e) => {
                                        if (e.target.value) handleAddTeacherToDraft(e.target.value);
                                    }}
                                    className="w-full bg-[#1a1f37] text-white border border-white/10 rounded px-3 py-2"
                                >
                                    <option value="">-- Liste des professeurs --</option>
                                    {availableTeachers.map(t => (
                                        <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CensorAssignmentsView;
