import React, { useState, useEffect } from 'react';
import { Check, X, UserCheck, AlertTriangle } from 'lucide-react';
import { adminRequestService } from '../../../../../shared/api/admin-requests.service';
import api from '../../../../../shared/api/api';
import { toastEvents } from '../../../../../shared/utils/toast-events';

interface StudentValidationModalProps {
    studentId: string | null;
    requestId?: string | null;
    onClose: () => void;
    onSuccess: () => void;
}

const StudentValidationModal: React.FC<StudentValidationModalProps> = ({ studentId, requestId, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState<any>(null);
    const [classes, setClasses] = useState<any[]>([]);

    useEffect(() => {
        if (studentId) {
            setupModal();
        }
    }, [studentId]);

    const setupModal = async () => {
        setFetching(true);
        try {
            // Fetch student data
            const studentRes = await api.get(`/students/${studentId}`);
            setFormData(studentRes.data);

            // Fetch classes for assignment dropdown
            const classesRes = await api.get('/classes');
            setClasses(classesRes.data);
        } catch (error) {
            console.error("Error fetching student details", error);
        } finally {
            setFetching(false);
        }
    };

    const handleValidate = async () => {
        setLoading(true);
        try {
            // Update student with potentially modified data and set status to ACTIVE
            await api.patch(`/students/${studentId}`, {
                ...formData,
                status: 'ACTIVE'
            });

            if (requestId) {
                await adminRequestService.resolve(requestId, 'APPROVED');
            }

            onSuccess();
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error validating student", error);
            toastEvents.error("Erreur lors de la validation");
        } finally {
            setLoading(false);
        }
    };

    if (!studentId) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl relative overflow-hidden">
                {fetching ? (
                    <div className="p-12 text-center text-white">Chargement des données...</div>
                ) : (
                    <>
                        <div className="bg-[#0f172a] p-6 border-b border-white/10 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <UserCheck className="text-emerald-400" />
                                Validation Inscription
                            </h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
                        </div>

                        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg flex gap-3 text-amber-200 text-sm">
                                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                                <p>Vous pouvez corriger ou compléter les informations avant de valider l'inscription définitive.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-400">Matricule</label>
                                    <input
                                        type="text"
                                        value={formData.matricule || ''}
                                        onChange={e => setFormData({ ...formData, matricule: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white font-mono"
                                    />
                                </div>
                                <div></div> {/* Spacer */}
                                <div>
                                    <label className="text-xs text-gray-400">Nom</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400">Prénoms</label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400">Date de Naissance</label>
                                    <input
                                        type="date"
                                        value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
                                        onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400">Genre</label>
                                    <select
                                        value={formData.gender}
                                        onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white"
                                    >
                                        <option value="HOMME">Masculin</option>
                                        <option value="FEMME">Féminin</option>
                                    </select>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-4">
                                <label className="text-xs text-indigo-300 font-bold mb-2 block">Affectation Classe</label>
                                <select
                                    value={formData.classId || ''}
                                    onChange={e => setFormData({ ...formData, classId: e.target.value })}
                                    className="w-full bg-indigo-500/10 border border-indigo-500/30 rounded px-3 py-3 text-white focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">-- En attente d'affectation --</option>
                                    {classes.map((cls: any) => (
                                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="bg-[#0f172a] p-4 border-t border-white/10 flex justify-end gap-3">
                            <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white">Annuler</button>
                            <button
                                onClick={handleValidate}
                                disabled={loading}
                                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2 font-bold transition-all"
                            >
                                <Check size={18} />
                                Valider & Activer
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StudentValidationModal;
