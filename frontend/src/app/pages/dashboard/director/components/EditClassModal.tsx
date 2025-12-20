import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, UserPlus } from 'lucide-react';
import api from '../../../../../shared/api/api';
import { toastEvents } from '../../../../../shared/utils/toast-events';

interface Teacher {
    id: string;
    firstName: string;
    lastName: string;
    matricule: string;
    userId: string;
    role?: string;
}

interface EditClassModalProps {
    classId: string;
    onClose: () => void;
    onUpdate: () => void;
}

const EditClassModal = ({ classId, onClose, onUpdate }: EditClassModalProps) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        room: '',
        mainTeacherId: '',
    });
    const [students, setStudents] = useState<any[]>([]);
    const [classDetails, setClassDetails] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [classRes, teachersRes] = await Promise.all([
                    api.get(`/classes/${classId}`),
                    api.get('/teachers')
                ]);

                const cls = classRes.data;
                setClassDetails(cls);
                setFormData({
                    name: cls.name,
                    room: cls.room || '',
                    mainTeacherId: cls.mainTeacher?.user?.id || cls.mainTeacherId || '',
                });
                setStudents(cls.students);
                setTeachers(teachersRes.data);
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [classId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...formData,
                mainTeacherId: formData.mainTeacherId || null,
            };
            await api.patch(`/classes/${classId}`, payload);
            onUpdate();
            onClose();
        } catch (err) {
            console.error('Error updating class:', err);
            toastEvents.error("Erreur lors de la mise à jour de la classe. Vérifiez votre connexion ou contactez le support.");
        } finally {
            setSaving(false);
        }
    };

    const handleRemoveStudent = async (studentId: string) => {
        if (!confirm('Êtes-vous sûr de vouloir retirer cet élève de la classe ?')) return;

        try {
            await api.delete(`/classes/${classId}/students/${studentId}`);
            setStudents(prev => prev.filter(s => s.id !== studentId));
            onUpdate(); // Refresh parent list count
        } catch (err) {
            console.error('Error removing student:', err);
        }
    };

    if (loading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h2 className="text-xl font-bold text-white">Modifier la Classe</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <form id="edit-class-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Salle de classe</label>
                                <input
                                    type="text"
                                    value={formData.room}
                                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                                    placeholder="Ex: Salle 101"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    {classDetails && ['MATERNELLE', 'PRIMAIRE'].includes(classDetails.cycle)
                                        ? 'Maître / Maîtresse'
                                        : 'Professeur Principal'}
                                </label>
                                <select
                                    value={formData.mainTeacherId}
                                    onChange={(e) => setFormData({ ...formData, mainTeacherId: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 [&>option]:bg-slate-800"
                                >

                                    {teachers
                                        .filter(t => {
                                            if (!classDetails) return true;

                                            const isPrimary = ['MATERNELLE', 'PRIMAIRE'].includes(classDetails.cycle);
                                            const isSecondary = ['PREMIER_CYCLE', 'SECOND_CYCLE'].includes(classDetails.cycle);

                                            if (isPrimary) {
                                                return t.role === 'MAITRE';
                                            }
                                            if (isSecondary) {
                                                return t.role === 'TEACHER';
                                            }
                                            return true;
                                        })
                                        .map(t => (
                                            <option key={t.id} value={t.userId}>
                                                {t.firstName} {t.lastName}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>
                    </form>

                    <div className="border-t border-white/10 pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-white">Gestion des Élèves</h3>
                            <button className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                                <UserPlus size={16} />
                                Ajouter un élève
                            </button>
                        </div>

                        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden max-h-60 overflow-y-auto">
                            {students.length === 0 ? (
                                <div className="p-4 text-center text-gray-400 text-sm">Aucun élève</div>
                            ) : (
                                <table className="w-full text-left">
                                    <tbody className="divide-y divide-white/5">
                                        {students.map((student) => (
                                            <tr key={student.id} className="hover:bg-white/5">
                                                <td className="px-4 py-3 text-white text-sm">
                                                    {student.firstName} {student.lastName}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        onClick={() => handleRemoveStudent(student.id)}
                                                        className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-500/10 transition-colors"
                                                        title="Retirer de la classe"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        form="edit-class-form"
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                        {saving ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save size={18} />
                                Enregistrer
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditClassModal;
