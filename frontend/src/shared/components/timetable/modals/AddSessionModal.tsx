import React, { useState, useEffect } from 'react';
import { X, Clock, User, BookOpen, MapPin } from 'lucide-react';
import api from '../../../../shared/api/api';
import { TimetableService } from '../../../../app/api/timetable.service';
import type { UpsertSessionDto } from '../../../../app/api/timetable.service';

interface AddSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => Promise<void>; // Changed to void as service handles it, or keep passing data if parent needs it
    classId: string;
    dayDefault?: number;
    timeDefault?: string;
}

const AddSessionModal: React.FC<AddSessionModalProps> = ({ isOpen, onClose, onSubmit, classId, dayDefault, timeDefault }) => {
    const [formData, setFormData] = useState<UpsertSessionDto>({
        dayOfWeek: dayDefault || 1,
        startTime: timeDefault || '08:00',
        endTime: '10:00',
        classId: classId,
        subjectId: '',
        teacherId: '',
        room: ''
    });

    const [subjects, setSubjects] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchResources();
            setFormData(prev => ({
                ...prev,
                dayOfWeek: dayDefault || 1,
                startTime: timeDefault || '08:00',
                classId: classId
            }));
            setError(null);
        }
    }, [isOpen, classId, dayDefault, timeDefault]);

    const fetchResources = async () => {
        setFetching(true);
        setError(null);
        try {
            // Fetch Subjects
            const classResponse = await api.get(`/classes/${classId}`);
            if (classResponse.data && classResponse.data.classSubjects) {
                setSubjects(classResponse.data.classSubjects.map((cs: any) => ({
                    id: cs.subjectId,
                    name: cs.subject.name,
                    defaultTeacherId: cs.teacherId
                })));
            }

            // Fetch Teachers
            const teachersResponse = await api.get('/teachers'); // Verified endpoint
            setTeachers(teachersResponse.data);

        } catch (error) {
            console.error("Failed to fetch resources", error);
            setError("Impossible de charger les données. Veuillez vérifier votre connexion.");
            // No more mock data here - we want real feedback
        } finally {
            setFetching(false);
        }
    };

    const handleSubjectChange = (subjectId: string) => {
        const subject = subjects.find(s => s.id === subjectId);
        setFormData(prev => ({
            ...prev,
            subjectId,
            teacherId: subject?.defaultTeacherId || prev.teacherId
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await TimetableService.upsertSession(formData);
            await onSubmit();
            onClose();
        } catch (error) {
            console.error("Error creating session", error);
            setError("Erreur lors de l'enregistrement du cours.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-[#1a1b23] border border-white/10 rounded-xl w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white">Ajouter un Cours</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm flex items-center gap-2">
                            <span className="font-bold">Erreur :</span> {error}
                        </div>
                    )}
                    {/* Form content omitted for brevity, keeping existing structure */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Jour</label>
                            <select
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                value={formData.dayOfWeek}
                                onChange={e => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })}
                            >
                                <option value={1}>Lundi</option>
                                <option value={2}>Mardi</option>
                                <option value={3}>Mercredi</option>
                                <option value={4}>Jeudi</option>
                                <option value={5}>Vendredi</option>
                                <option value={6}>Samedi</option>
                                <option value={7}>Dimanche</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Salle (Opt.)</label>
                            <div className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-lg px-4 py-2">
                                <MapPin size={16} className="text-gray-400" />
                                <input
                                    type="text"
                                    className="bg-transparent w-full text-white focus:outline-none"
                                    value={formData.room || ''}
                                    onChange={e => setFormData({ ...formData, room: e.target.value })}
                                    placeholder="Ex: 12"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <Clock size={16} /> Début
                            </label>
                            <input
                                type="time"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                value={formData.startTime}
                                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <Clock size={16} /> Fin
                            </label>
                            <input
                                type="time"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                value={formData.endTime}
                                onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                            <BookOpen size={16} /> Matière
                        </label>
                        <select
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                            value={formData.subjectId}
                            onChange={e => handleSubjectChange(e.target.value)}
                            disabled={fetching}
                        >
                            <option value="">{fetching ? "Chargement..." : "Sélectionner une matière"}</option>
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name} {s.defaultTeacherId ? '(Prof assigné)' : ''}</option>)}
                        </select>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <User size={16} /> Enseignant
                            </label>
                            <select
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                value={formData.teacherId}
                                onChange={e => setFormData({ ...formData, teacherId: e.target.value })}
                                disabled={fetching}
                            >
                                <option value="">Automatique (Prof de la matière)</option>
                                {teachers.map(t => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
                            </select>
                            <p className="text-xs text-gray-500">
                                Changer l'enseignant ici mettra à jour l'affectation permanente pour cette matière.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                        >
                            {loading ? 'Enregistrement...' : 'Ajouter au Planning'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSessionModal;
