import { useState, useMemo } from 'react';
import { X, CheckSquare, Square, Save, Loader2 } from 'lucide-react';
import { BENIN_SUBJECTS_LIST } from '../../../../../shared/constants/benin-subjects.constants';
import api from '../../../../../shared/api/api';
import { toastEvents } from '../../../../../shared/utils/toast-events';

interface ImportSubjectsModalProps {
    onClose: () => void;
    onSuccess: () => void;
    existingSubjects: string[]; // Names of subjects already in DB to avoid duplicates
}

const ImportSubjectsModal = ({ onClose, onSuccess, existingSubjects }: ImportSubjectsModalProps) => {
    // Filter for Secondary subjects only
    const availableSubjects = useMemo(() => {
        return BENIN_SUBJECTS_LIST.filter(s =>
            ['COLLEGE', 'LYCEE', 'LYCEE_TECHNIQUE', 'COLLEGE_LYCEE'].includes(s.cycle) &&
            !existingSubjects.includes(s.name)
        );
    }, [existingSubjects]);

    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleSubject = (name: string) => {
        setSelectedSubjects(prev =>
            prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
        );
    };

    const toggleAll = () => {
        if (selectedSubjects.length === availableSubjects.length) {
            setSelectedSubjects([]);
        } else {
            setSelectedSubjects(availableSubjects.map(s => s.name));
        }
    };

    const handleImport = async () => {
        if (selectedSubjects.length === 0) return;
        setIsSubmitting(true);
        try {
            const subjectsToImport = availableSubjects.filter(s => selectedSubjects.includes(s.name));

            // Transform to DTOs
            const dtos = subjectsToImport.map(s => ({
                name: s.name,
                coefficient: s.defaultCoef,
                cycle: s.cycle
            }));

            // Bulk API Call
            await api.post('/subjects/bulk', {
                subjects: dtos
            });

            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Import process failed', error);
            const msg = error.response?.data?.message || error.message || "Erreur critique lors de l'importation.";
            toastEvents.error(`Erreur: ${Array.isArray(msg) ? msg.join(', ') : msg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1e293b] rounded-2xl border border-white/10 w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#1e293b] rounded-t-2xl">
                    <div>
                        <h3 className="text-xl font-bold text-white">Importer du Catalogue Bénin</h3>
                        <p className="text-sm text-gray-400">Sélectionnez les matières à ajouter à votre établissement</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {availableSubjects.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            Toutes les matières du catalogue sont déjà ajoutées.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                <span className="text-sm text-gray-400">{availableSubjects.length} matières disponibles</span>
                                <button
                                    onClick={toggleAll}
                                    className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                                >
                                    {selectedSubjects.length === availableSubjects.length ? <CheckSquare size={16} /> : <Square size={16} />}
                                    Tout sélectionner
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {availableSubjects.map((subject) => (
                                    <div
                                        key={subject.name}
                                        onClick={() => toggleSubject(subject.name)}
                                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedSubjects.includes(subject.name)
                                            ? 'bg-indigo-600/20 border-indigo-500/50'
                                            : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                                            }`}
                                    >
                                        <div className={`flex-shrink-0 text-indigo-400`}>
                                            {selectedSubjects.includes(subject.name) ? <CheckSquare size={20} /> : <Square size={20} />}
                                        </div>
                                        <div>
                                            <p className={`font-medium ${selectedSubjects.includes(subject.name) ? 'text-white' : 'text-gray-300'}`}>
                                                {subject.name}
                                            </p>
                                            <div className="flex gap-2 text-xs">
                                                <span className="text-gray-500">Coef: {subject.defaultCoef}</span>
                                                <span className="text-gray-500">• {subject.cycle.replace('_', ' ')}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-white/10 bg-[#1e293b] rounded-b-2xl flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleImport}
                        disabled={selectedSubjects.length === 0 || isSubmitting}
                        className={`flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium shadow-lg shadow-indigo-500/20 ${(selectedSubjects.length === 0 || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {isSubmitting ? 'Importation...' : `Importer (${selectedSubjects.length})`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportSubjectsModal;
