import React, { useEffect, useState } from 'react';
import { X, BookOpen, School, Star, Loader, Users } from 'lucide-react';
import api from '../../../../shared/api/api';

interface TeacherClassesModalProps {
    isOpen: boolean;
    onClose: () => void;
    teacher: {
        id: number;
        firstName: string;
        lastName: string;
        subjects: string[];
        gender?: string;
        directorType?: string;
        role?: string;
    };
}

interface AssignedClass {
    id: string;
    name: string;
    level: string;
    isMainTeacher: boolean;
    studentCount: number;
}

const TeacherClassesModal: React.FC<TeacherClassesModalProps> = ({ isOpen, onClose, teacher }) => {
    // console.log('TeacherDetailsModal received:', teacher); // Remove debug log or keep it if issues persist
    const [loading, setLoading] = useState(true);
    const [classes, setClasses] = useState<AssignedClass[]>([]);

    useEffect(() => {
        if (isOpen && teacher.id) {
            fetchTeacherDetails();
        }
    }, [isOpen, teacher.id]);

    const fetchTeacherDetails = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/teachers/${teacher.id}`);
            const data = response.data;
            const schoolUser = data.user?.schoolUsers?.[0];

            if (schoolUser) {
                const teaching: any[] = schoolUser.teachingClasses || [];
                const managing: any[] = schoolUser.teacherClasses || [];

                const classMap = new Map<string, AssignedClass>();

                teaching.forEach((c: any) => {
                    classMap.set(c.id, {
                        id: c.id,
                        name: c.name,
                        level: c.level,
                        isMainTeacher: false,
                        studentCount: c._count?.students || 0
                    });
                });

                managing.forEach((c: any) => {
                    if (classMap.has(c.id)) {
                        const existing = classMap.get(c.id)!;
                        existing.isMainTeacher = true;
                        if (c._count?.students !== undefined) {
                            existing.studentCount = c._count.students;
                        }
                    } else {
                        classMap.set(c.id, {
                            id: c.id,
                            name: c.name,
                            level: c.level,
                            isMainTeacher: true,
                            studentCount: c._count?.students || 0
                        });
                    }
                });

                setClasses(Array.from(classMap.values()));
            }
        } catch (error) {
            console.error("Error fetching teacher details", error);
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    const getTeacherContextLabel = () => {
        const gender = teacher.gender?.toUpperCase() || '';
        const isMale = gender === 'MALE' || gender === 'M' || gender === 'HOMME';
        const isFemale = gender === 'FEMALE' || gender === 'F' || gender === 'FEMME';

        const isPrimary = teacher.directorType === 'PRIMARY_PRESCHOOL' || teacher.role === 'MAITRE';

        if (isPrimary) {
            if (isMale) return "Maître";
            if (isFemale) return "Maîtresse";
            return "Maître/Maîtresse";
        }

        if (teacher.directorType === 'COLLEGE' || teacher.role === 'TEACHER') {
            return "Professeur";
        }

        // Default fallback
        if (isMale) return "Enseignant";
        if (isFemale) return "Enseignante";
        return "Enseignant(e)";
    };

    const getFormattedCycle = (name: string) => {
        const n = name.toUpperCase();
        if (n.includes("MATERNELLE")) return "Maternelle";
        if (["CI", "CP", "CE1", "CE2", "CM1", "CM2"].some(s => n.startsWith(s)) || n.includes("PRIMAIRE")) return "Primaire";
        if (["6", "5", "4", "3"].some(d => n.startsWith(d)) || n.includes("COLLEGE") || n.includes("COLLÈGE")) return "Collège Premier Cycle";
        if (["2", "1", "T", "S"].some(d => n.startsWith(d)) || n.includes("LYCEE") || n.includes("LYCÉE") || n.includes("TERMINALE")) return "Collège Second Cycle";
        return "";
    };

    const label = getTeacherContextLabel();
    const isPrimaryTeacher = label === 'Maître' || label === 'Maîtresse' || label === 'Maître/Maîtresse';

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl w-full max-w-lg relative overflow-hidden shadow-2xl">

                {/* Header Background */}
                <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700"></div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Profile Content */}
                <div className="px-6 pb-6">
                    {/* Avatar */}
                    <div className="relative -mt-12 mb-4 flex justify-center">
                        <div className="w-24 h-24 rounded-full bg-slate-900/90 p-1">
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                                {getInitials(teacher.firstName, teacher.lastName)}
                            </div>
                        </div>
                    </div>

                    {/* Name & Role */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-1">
                            {teacher.firstName} {teacher.lastName}
                        </h2>
                        <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-indigo-300 border border-white/10">
                            {label}
                        </span>
                    </div>

                    <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {/* Matières */}
                        <div>
                            <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <BookOpen size={14} />
                                Matières Enseignées
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {teacher.subjects && teacher.subjects.length > 0 ? (
                                    teacher.subjects.map((subject, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-medium border border-indigo-500/20">
                                            {subject}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-white/30 italic text-sm">
                                        {isPrimaryTeacher ? "Tout" : "Aucune matière spécifiée"}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Classes */}
                        <div>
                            <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <School size={14} />
                                Classes Attribuées
                            </h3>

                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <Loader className="animate-spin text-indigo-500" size={24} />
                                </div>
                            ) : classes.length === 0 ? (
                                <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10 border-dashed">
                                    <p className="text-white/40 text-sm">Aucune classe attribuée pour le moment.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {classes.map((cls) => (
                                        <div key={cls.id} className="group flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-3 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-white/70 group-hover:text-white group-hover:bg-indigo-500/20 transition-colors">
                                                    <span className="font-bold text-sm">{cls.name.substring(0, 2).toUpperCase()}</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-medium text-sm">{cls.name}</h4>
                                                    <div className="flex items-center gap-2 text-xs text-white/40">
                                                        <span>{getFormattedCycle(cls.name)}</span>
                                                        <span>•</span>
                                                        <div className="flex items-center gap-1">
                                                            <Users size={10} />
                                                            <span>{cls.studentCount} élèves</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {cls.isMainTeacher && (
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" title="Professeur Principal">
                                                    <Star size={14} fill="currentColor" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherClassesModal;
