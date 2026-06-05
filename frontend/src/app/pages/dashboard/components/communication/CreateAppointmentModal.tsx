import React, { useState } from 'react';
import type { CreateAppointmentDto } from '../../../../api/appointment.service';
import { X } from 'lucide-react';

interface CreateAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CreateAppointmentDto) => Promise<void>;
}

export const CreateAppointmentModal: React.FC<CreateAppointmentModalProps> = ({ isOpen, onClose, onSave }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<CreateAppointmentDto>({
        title: '',
        start: '',
        end: '',
        mode: 'PRESENTIAL',
        location: '',
        participantIds: []
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                    <h3 className="font-bold text-gray-800">Demander un Rendez-vous</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Début</label>
                            <input
                                type="datetime-local"
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.start}
                                onChange={e => setFormData({ ...formData, start: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fin</label>
                            <input
                                type="datetime-local"
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.end}
                                onChange={e => setFormData({ ...formData, end: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                            <select
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.mode}
                                onChange={e => setFormData({ ...formData, mode: e.target.value as any })}
                            >
                                <option value="PRESENTIAL">Présentiel</option>
                                <option value="PHONE">Téléphone</option>
                                <option value="ONLINE">Visio</option>
                            </select>
                        </div>
                        {formData.mode !== 'PHONE' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.location || ''}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="Salle, Bureau..."
                                />
                            </div>
                        )}
                    </div>

                    {/* Simplified Participant Selection Mock */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Participants (ID Mock)</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Saisir ID User (Demo)"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const val = e.currentTarget.value;
                                    setFormData(prev => ({ ...prev, participantIds: [...prev.participantIds, val] }));
                                    e.currentTarget.value = '';
                                }
                            }}
                        />
                        <div className="flex gap-2 flex-wrap mt-2">
                            {formData.participantIds.map(pid => (
                                <span key={pid} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs flex items-center gap-1">
                                    {pid} <button type="button" onClick={() => setFormData(p => ({ ...p, participantIds: p.participantIds.filter(x => x !== pid) }))}><X size={12} /></button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium disabled:opacity-50"
                        >
                            {isLoading ? 'Envoi...' : 'Envoyer la demande'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
