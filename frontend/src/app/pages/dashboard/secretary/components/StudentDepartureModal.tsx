import { useState } from 'react';
import { X, AlertTriangle, ArrowRight } from 'lucide-react';
import api from '../../../../../shared/api/api';
import { toastEvents } from '../../../../../shared/utils/toast-events';

interface StudentDepartureModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: { id: string; firstName: string; lastName: string; matricule: string };
    onSuccess: () => void;
}

const StudentDepartureModal = ({ isOpen, onClose, student, onSuccess }: StudentDepartureModalProps) => {
    const [reason, setReason] = useState('Déménagement');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [comments, setComments] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirm(`Confirmer le départ de ${student.firstName} ${student.lastName} ? Cette action archivera le dossier.`)) return;

        setLoading(true);
        try {
            await api.post(`/students/${student.id}/transfer`, {
                reason,
                destinationSchool: destination,
                date,
                comments
            });
            toastEvents.success("Départ enregistré avec succès.");
            onSuccess();
            onClose();
        } catch (e) {
            console.error("Transfer failed", e);
            toastEvents.error("Erreur lors du traitement du départ.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1e293b] rounded-xl border border-white/10 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-4 border-b border-white/10">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <AlertTriangle className="text-red-500" size={20} />
                        Départ / Transfert
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 bg-red-500/10 border-b border-red-500/20">
                    <p className="text-sm text-red-200">
                        Vous êtes sur le point de sortir l'élève <strong>{student.firstName} {student.lastName}</strong> ({student.matricule}) des effectifs actifs.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Motif du départ</label>
                        <select
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white focus:border-indigo-500 outline-none"
                            value={reason} onChange={e => setReason(e.target.value)}
                        >
                            <option value="Déménagement">Déménagement</option>
                            <option value="Exclusion">Exclusion</option>
                            <option value="Abandon">Abandon</option>
                            <option value="Raisons Financières">Raisons Financières</option>
                            <option value="Diplômé">Diplômé (Anticipé)</option>
                            <option value="Autre">Autre</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Établissement de Destination</label>
                        <input
                            type="text"
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white focus:border-indigo-500 outline-none"
                            placeholder="Ex: Collège Notre Dame..."
                            value={destination} onChange={e => setDestination(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Date de départ effective</label>
                        <input
                            type="date"
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white focus:border-indigo-500 outline-none"
                            value={date} onChange={e => setDate(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Commentaire / Observation</label>
                        <textarea
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white focus:border-indigo-500 outline-none resize-none h-20"
                            placeholder="Détails supplémentaires..."
                            value={comments} onChange={e => setComments(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button" onClick={onClose}
                            className="px-4 py-2 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-lg shadow-red-500/20 flex items-center gap-2"
                        >
                            {loading ? 'Traitement...' : <>Confirmer le Départ <ArrowRight size={16} /></>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentDepartureModal;
