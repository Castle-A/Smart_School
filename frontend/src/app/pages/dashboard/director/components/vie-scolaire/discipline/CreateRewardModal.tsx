import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import api from '../../../../../../../shared/api/api';

interface CreateRewardModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export const CreateRewardModal = ({ onClose, onSuccess }: CreateRewardModalProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    const [formData, setFormData] = useState({
        type: 'TABLEAU_HONNEUR',
        reason: '',
        date: new Date().toISOString().split('T')[0]
    });

    // Search students
    useEffect(() => {
        if (searchTerm.length < 2) return;
        const delayDebounceTok = setTimeout(async () => {
            try {
                // Reuse existing student search if available or fallback
                const res = await api.get(`/students?search=${searchTerm}`);
                setSearchResults(res.data);
            } catch (err) {
                console.error(err);
            }
        }, 500);
        return () => clearTimeout(delayDebounceTok);
    }, [searchTerm]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/vie-scolaire/rewards', {
                ...formData,
                studentId: selectedStudent.id
            });
            onSuccess();
            onClose();
        } catch (err) {
            alert('Erreur lors de la création');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#1e293b] rounded-2xl border border-white/10 w-full max-w-lg overflow-hidden shadow-2xl">
                <div className="flex justify-between items-center p-4 border-b border-white/10">
                    <h3 className="text-lg font-bold text-white">Nouvelle Gratification</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
                </div>

                <div className="p-6">
                    {!selectedStudent ? (
                        <div className="space-y-4">
                            <label className="text-sm text-gray-400">Rechercher l'élève</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input
                                    type="text"
                                    placeholder="Nom de l'élève..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {searchResults.map(s => (
                                    <div
                                        key={s.id}
                                        onClick={() => setSelectedStudent(s)}
                                        className="p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer flex justify-between items-center"
                                    >
                                        <p className="text-white text-sm font-medium">{s.firstName} {s.lastName}</p>
                                        <span className="text-xs text-gray-400">{s.matricule}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex items-center justify-between bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                                <span className="text-emerald-300 font-bold">{selectedStudent.firstName} {selectedStudent.lastName}</span>
                                <button type="button" onClick={() => setSelectedStudent(null)} className="text-xs text-emerald-400 hover:text-emerald-200">Changer</button>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                                >
                                    <option value="TABLEAU_HONNEUR">Tableau d'Honneur</option>
                                    <option value="FELICITATIONS">Félicitations</option>
                                    <option value="ENCOURAGEMENTS">Encouragements</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Motif / Commentaire</label>
                                <textarea
                                    value={formData.reason}
                                    onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm h-24"
                                    placeholder="Ex: Excellent travail ce trimestre..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                                <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-gray-300 hover:bg-white/5">Annuler</button>
                                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">Confirmer</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
