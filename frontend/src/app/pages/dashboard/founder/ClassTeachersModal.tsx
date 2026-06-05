import React, { useEffect, useState } from 'react';
import { X, Phone, Star, School, Users, GraduationCap, Loader } from 'lucide-react';
import api from '../../../../shared/api/api';

interface Teacher {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    profilePicture?: string;
    // Add other fields if needed for display
    subjects?: string[];
}

interface Student {
    id: string;
    firstName: string;
    lastName: string;
    matricule: string;
    gender: 'MALE' | 'FEMALE';
}

interface ClassTeachersModalProps {
    isOpen: boolean;
    onClose: () => void;
    classId: string;
    classNameStr: string;
    teachers: Teacher[];
    mainTeacher?: {
        firstName: string;
        lastName: string;
        gender?: string;
        phone?: string;
    } | null;
}

const ClassTeachersModal: React.FC<ClassTeachersModalProps> = ({ isOpen, onClose, classId, classNameStr, teachers, mainTeacher }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);

    const displayedTeachers = React.useMemo(() => {
        const list = [...teachers];
        if (mainTeacher) {
            const exists = list.some(t =>
                (t.firstName === mainTeacher.firstName && t.lastName === mainTeacher.lastName)
            );
            if (!exists) {
                list.unshift({
                    id: 'main_' + mainTeacher.firstName,
                    firstName: mainTeacher.firstName,
                    lastName: mainTeacher.lastName,
                    phone: mainTeacher.phone || '',
                    subjects: []
                } as Teacher);
            }
        }
        return list;
    }, [teachers, mainTeacher]);

    useEffect(() => {
        if (isOpen && classId) {
            fetchClassDetails();
        }
    }, [isOpen, classId]);

    const fetchClassDetails = async () => {
        setLoadingStudents(true);
        try {
            const response = await api.get(`/classes/${classId}`);
            if (response.data && response.data.students) {
                setStudents(response.data.students);
            }
        } catch (error) {
            console.error("Error fetching class details", error);
        } finally {
            setLoadingStudents(false);
        }
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    const getMainTeacherLabel = () => {
        const lowerName = classNameStr.toLowerCase();
        let isPrimary = false;

        // Check if Maternelle or Primary
        if (lowerName.includes('maternelle') || lowerName.includes('petite section') || lowerName.includes('moyenne section') || lowerName.includes('grande section')) {
            isPrimary = true;
        } else if (lowerName.match(/\b(ci|cp|ce1|ce2|cm1|cm2)\b/)) {
            isPrimary = true;
        }

        if (isPrimary && mainTeacher?.gender) {
            const g = mainTeacher.gender.toUpperCase();
            if (g === 'MALE' || g === 'M' || g === 'HOMME') return "Maître";
            if (g === 'FEMALE' || g === 'F' || g === 'FEMME') return "Maîtresse";
        }

        if (isPrimary) return "Maître/Maîtresse";

        // Default to Professeur Principal for secondary/high school
        return "Professeur Principal";
    };

    // Debug log to check what we are receiving
    useEffect(() => {
        if (isOpen && mainTeacher) {
            console.log("ClassTeachersModal - MainTeacher:", mainTeacher);
        }
    }, [isOpen, mainTeacher]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">

                {/* Header Background */}
                <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center px-8">
                    <div className="w-16 h-16 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-lg mr-4">
                        <School size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Classe {classNameStr}</h2>
                        <p className="text-blue-100/80 text-sm">Détails de la classe et effectifs</p>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                    {/* 1. Professeur Principal */}
                    {mainTeacher ? (
                        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-bl-xl shadow-sm flex items-center gap-1">
                                <Star size={12} fill="currentColor" />
                                {getMainTeacherLabel()}
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
                                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                                        <span className="text-xl font-bold text-white">{getInitials(mainTeacher.firstName, mainTeacher.lastName)}</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{mainTeacher.firstName} {mainTeacher.lastName}</h3>
                                    <p className="text-indigo-300 text-sm">Responsable de classe</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                            <p className="text-white/40 text-sm italic">Aucun professeur principal assigné</p>
                        </div>
                    )}

                    {/* 2. Autres Enseignants */}
                    <div>
                        <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <GraduationCap size={16} />
                            Équipe Pédagogique ({displayedTeachers.length})
                        </h3>

                        {displayedTeachers.length === 0 ? (
                            <p className="text-white/30 text-sm italic">Aucun enseignant assigné.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {displayedTeachers.map((teacher, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg p-3 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-white/80">
                                            {getInitials(teacher.firstName, teacher.lastName)}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-white font-medium text-sm truncate">{teacher.firstName} {teacher.lastName}</p>
                                            <div className="flex items-center gap-1 text-xs text-white/40">
                                                <Phone size={10} />
                                                <span>{teacher.phone || 'Non renseigné'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 3. Liste des Élèves */}
                    <div>
                        <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Users size={16} />
                            Liste des Élèves ({students.length})
                        </h3>

                        {loadingStudents ? (
                            <div className="flex justify-center py-8">
                                <Loader className="animate-spin text-indigo-500" size={24} />
                            </div>
                        ) : students.length === 0 ? (
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center border-dashed">
                                <p className="text-white/40 text-sm">Aucun élève inscrit dans cette classe.</p>
                            </div>
                        ) : (
                            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                                <div className="max-h-60 overflow-y-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-white/5 text-white/50 font-medium sticky top-0 backdrop-blur-md">
                                            <tr>
                                                <th className="px-4 py-3">Matricule</th>
                                                <th className="px-4 py-3">Nom Prénom</th>
                                                <th className="px-4 py-3 text-center">Genre</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {students.map((student) => (
                                                <tr key={student.id} className="hover:bg-white/5 transition-colors text-white/80">
                                                    <td className="px-4 py-3 font-mono text-xs text-indigo-300">{student.matricule}</td>
                                                    <td className="px-4 py-3 font-medium">{student.firstName} {student.lastName}</td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${student.gender === 'MALE' ? 'bg-blue-500/20 text-blue-300' : 'bg-pink-500/20 text-pink-300'}`}>
                                                            {student.gender === 'MALE' ? 'G' : 'F'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ClassTeachersModal;
