import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Type, AlignLeft } from 'lucide-react';

interface CreateEventDto {
    title: string;
    start: string; // YYYY-MM-DD
    end: string;   // YYYY-MM-DD
    type: string;
    description: string;
}

interface CreateAcademicEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateEventDto) => Promise<void>;
    allowedTypes?: string[]; // If provided, restricts the type dropdown
}

const EVENT_TYPES = [
    { value: 'ACADEMIC_PERIOD', label: 'Période Académique (Trimestre/Semestre)' },
    { value: 'HOLIDAY', label: 'Congés / Vacances' },
    { value: 'EXAM', label: 'Examens' },
    { value: 'FINANCIAL', label: 'Échéance Financière' },
    { value: 'MEETING', label: 'Réunion / Conseil' },
    { value: 'OTHER', label: 'Autre' }
];

const CreateAcademicEventModal: React.FC<CreateAcademicEventModalProps> = ({ isOpen, onClose, onSubmit, allowedTypes }) => {
    const [formData, setFormData] = useState<CreateEventDto>({
        title: '',
        start: new Date().toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
        type: allowedTypes ? allowedTypes[0] : 'OTHER',
        description: ''
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const availableTypes = allowedTypes
        ? EVENT_TYPES.filter(t => allowedTypes.includes(t.value))
        : EVENT_TYPES;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error("Error creating event", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-[#1a1b23] border border-white/10 rounded-xl w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white">Nouvel Événement</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                            <Type size={16} /> Titre
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Ex: Paiement 2ème Tranche"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <CalendarIcon size={16} /> Début
                            </label>
                            <input
                                type="date"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                value={formData.start}
                                onChange={e => setFormData({ ...formData, start: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <CalendarIcon size={16} /> Fin
                            </label>
                            <input
                                type="date"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                value={formData.end}
                                onChange={e => setFormData({ ...formData, end: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Type d'événement</label>
                        <select
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            {availableTypes.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                            <AlignLeft size={16} /> Description
                        </label>
                        <textarea
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 min-h-[100px]"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Détails optionnels..."
                        />
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
                            {loading ? 'Création...' : 'Créer Événement'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAcademicEventModal;
