import React, { useState } from 'react';
import { X, Save, BookOpen } from 'lucide-react';
import api from '../../../../../shared/api/api';
import { useAuth } from '../../../../../shared/contexts/AuthContext';
import { toastEvents } from '../../../../../shared/utils/toast-events';

import { BENIN_SUBJECTS_LIST } from '../../../../../shared/constants/benin-subjects.constants';

interface AddSubjectModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

const AddSubjectModal = ({ onClose, onSuccess }: AddSubjectModalProps) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<{ name: string, defaultCoef: number }[]>([]);

    // Determine available cycles based on directorType
    const availableCycles = React.useMemo(() => {
        if (user?.directorType === 'PRIMARY_PRESCHOOL') {
            return [
                { value: 'MATERNELLE', label: 'Maternelle' },
                { value: 'PRIMAIRE', label: 'Primaire' }
            ];
        }
        if (user?.directorType === 'COLLEGE') {
            return [
                { value: 'COLLEGE', label: 'Collège (1er Cycle)' },
                { value: 'LYCEE', label: 'Collège (2nd Cycle)' }
            ];
        }
        // BOTH or default
        return [
            { value: 'MATERNELLE', label: 'Maternelle' },
            { value: 'PRIMAIRE', label: 'Primaire' },
            { value: 'COLLEGE', label: 'Collège (1er Cycle)' },
            { value: 'LYCEE', label: 'Collège (2nd Cycle)' }
        ];
    }, [user?.directorType]);

    const [formData, setFormData] = useState({
        name: '',
        coefficient: 1,
        cycle: availableCycles[0].value // Default to first available
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/subjects', formData);
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error creating subject:', err);
            toastEvents.error("Erreur lors de la création de la matière.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <BookOpen size={20} className="text-indigo-400" />
                        Nouvelle Matière
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <form id="add-subject-form" onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Nom de la matière</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setFormData({ ...formData, name: val });
                                        if (val.length > 0) {
                                            const matches = BENIN_SUBJECTS_LIST
                                                .filter(s => s.name.toLowerCase().includes(val.toLowerCase()))
                                                .map(s => ({ name: s.name, defaultCoef: s.defaultCoef }));
                                            const unique = Array.from(new Map(matches.map(item => [item.name, item])).values());
                                            setSuggestions(unique);
                                        } else {
                                            setSuggestions([]);
                                        }
                                    }}
                                    onBlur={() => setTimeout(() => setSuggestions([]), 200)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 placeholder-gray-500"
                                    placeholder="Ex: Mathématiques, Histoire-Géo..."
                                    autoComplete="off"
                                />
                                {suggestions.length > 0 && (
                                    <ul className="absolute z-10 w-full bg-[#1e293b] border border-white/10 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                                        {suggestions.map((s, idx) => (
                                            <li
                                                key={idx}
                                                onClick={() => {
                                                    setFormData({ ...formData, name: s.name, coefficient: s.defaultCoef });
                                                    setSuggestions([]);
                                                }}
                                                className="px-4 py-2 hover:bg-white/10 cursor-pointer text-gray-300 hover:text-white transition-colors text-sm"
                                            >
                                                {s.name} (Coef: {s.defaultCoef})
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Cycle</label>
                            <select
                                required
                                value={formData.cycle}
                                onChange={(e) => setFormData({ ...formData, cycle: e.target.value })}
                                className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 appearance-none"
                            >
                                {availableCycles.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Coefficient</label>
                            <input
                                type="number"
                                required
                                min="0.25"
                                max="8"
                                step="0.25"
                                value={formData.coefficient}
                                onChange={(e) => setFormData({ ...formData, coefficient: parseFloat(e.target.value) || 0 })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 placeholder-gray-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Coefficient par défaut pour cette matière.</p>
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        form="add-subject-form"
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save size={18} />
                                Créer
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddSubjectModal;
