import { useState, useEffect } from 'react';
import { X, User, Users, BookOpen } from 'lucide-react';
import api from '../../../../../shared/api/api';

interface Student {
    id: string;
    firstName: string;
    lastName: string;
    matricule: string;
    gender: string;
}

interface ClassDetails {
    id: string;
    name: string;
    cycle: string;
    level: string;
    series?: string;
    room?: string;
    mainTeacher?: {
        user: {
            firstName: string;
            lastName: string;
        }
    };
    students: Student[];
    studentCount: number;
}

interface ClassDetailsModalProps {
    classId: string;
    onClose: () => void;
}

const ClassDetailsModal = ({ classId, onClose }: ClassDetailsModalProps) => {
    const [classData, setClassData] = useState<ClassDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClassDetails = async () => {
            try {
                const response = await api.get(`/classes/${classId}`);
                setClassData(response.data);
            } catch (err) {
                console.error('Error fetching class details:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchClassDetails();
    }, [classId]);

    if (!classData && !loading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                <BookOpen size={24} />
                            </span>
                            {loading ? 'Chargement...' : classData?.name}
                        </h2>
                        {!loading && (
                            <p className="text-gray-400 mt-1 ml-12">
                                {classData?.cycle} • {classData?.studentCount} Élèves
                            </p>
                        )}
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <>
                            {/* Info Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                    <p className="text-sm text-gray-400 mb-1">Professeur Principal</p>
                                    <div className="flex items-center gap-2 text-white font-medium">
                                        <User size={18} className="text-emerald-400" />
                                        {classData?.mainTeacher ? (
                                            `${classData.mainTeacher.user.firstName} ${classData.mainTeacher.user.lastName}`
                                        ) : (
                                            <span className="text-gray-500 italic">Non assigné</span>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                    <p className="text-sm text-gray-400 mb-1">Salle de classe</p>
                                    <div className="flex items-center gap-2 text-white font-medium">
                                        <div className="w-4 h-4 rounded bg-indigo-500/20 border border-indigo-500/50" />
                                        {classData?.room || <span className="text-gray-500 italic">Non assignée</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Students List */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <Users size={20} className="text-indigo-400" />
                                    Liste des Élèves
                                </h3>

                                {classData?.students.length === 0 ? (
                                    <div className="text-center py-8 bg-white/5 rounded-xl border border-dashed border-white/10">
                                        <p className="text-gray-400">Aucun élève dans cette classe</p>
                                    </div>
                                ) : (
                                    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                                        <table className="w-full text-left">
                                            <thead className="bg-white/5 text-gray-400 text-sm">
                                                <tr>
                                                    <th className="px-4 py-3 font-medium">Matricule</th>
                                                    <th className="px-4 py-3 font-medium">Nom Prénom</th>
                                                    <th className="px-4 py-3 font-medium">Genre</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {classData?.students.map((student) => (
                                                    <tr key={student.id} className="hover:bg-white/5 transition-colors">
                                                        <td className="px-4 py-3 text-gray-300 font-mono text-sm">{student.matricule}</td>
                                                        <td className="px-4 py-3 text-white">
                                                            {student.firstName} {student.lastName}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-1 rounded text-xs font-medium ${['F', 'FEMALE', 'FEMME'].includes(student.gender?.toUpperCase())
                                                                ? 'bg-pink-500/20 text-pink-300'
                                                                : 'bg-blue-500/20 text-blue-300'
                                                                }`}>
                                                                {['HOMME', 'MALE', 'M'].includes(student.gender?.toUpperCase()) ? 'Masculin' :
                                                                    ['FEMME', 'FEMALE', 'F'].includes(student.gender?.toUpperCase()) ? 'Féminin' : 'Divers'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClassDetailsModal;
