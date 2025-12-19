import { useState, useEffect } from 'react';
import { Calendar, Check, Plus } from 'lucide-react';
import api from '../../../../shared/api/api';

interface AcademicYear {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

const AcademicYearManager = () => {
    const [years, setYears] = useState<AcademicYear[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Form state
    const [newName, setNewName] = useState('');
    const [newStart, setNewStart] = useState('');
    const [newEnd, setNewEnd] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchYears = async () => {
        setLoading(true);
        try {
            const res = await api.get('/academic-years');
            setYears(res.data);
        } catch (e) {
            console.error("Failed to load years", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchYears();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/academic-years', {
                name: newName,
                startDate: newStart,
                endDate: newEnd
            });
            setIsCreating(false);
            setNewName(''); setNewStart(''); setNewEnd('');
            fetchYears();
        } catch (e) {
            console.error("Create failed", e);
        } finally {
            setSubmitting(false);
        }
    };

    const handleActivate = async (id: string) => {
        if (!confirm("Voulez-vous vraiment activer cette année scolaire ? Cela affectera toutes les opérations.")) return;
        try {
            await api.patch(`/academic-years/${id}/activate`);
            fetchYears(); // Refresh to show new active
        } catch (e) {
            alert("Erreur lors de l'activation");
        }
    };

    return (
        <div className="bg-[#1e293b] rounded-xl border border-white/10 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Calendar className="text-indigo-400" /> Années Scolaires
                </h2>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors"
                >
                    <Plus size={16} /> Nouvelle Année
                </button>
            </div>

            {isCreating && (
                <form onSubmit={handleCreate} className="mb-6 bg-black/20 p-4 rounded-lg border border-white/5 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Nom (ex: 2024-2025)</label>
                            <input
                                required
                                type="text"
                                className="w-full bg-[#0f172a] border border-white/10 rounded-lg p-2 text-white text-sm"
                                value={newName} onChange={e => setNewName(e.target.value)}
                                placeholder="2024-2025"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Date de début</label>
                            <input
                                required
                                type="date"
                                className="w-full bg-[#0f172a] border border-white/10 rounded-lg p-2 text-white text-sm"
                                value={newStart} onChange={e => setNewStart(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Date de fin</label>
                            <input
                                required
                                type="date"
                                className="w-full bg-[#0f172a] border border-white/10 rounded-lg p-2 text-white text-sm"
                                value={newEnd} onChange={e => setNewEnd(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setIsCreating(false)} className="px-3 py-1.5 text-gray-400 hover:text-white text-sm">Annuler</button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
                        >
                            {submitting ? 'Création...' : 'Créer'}
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-3">
                {years.map(y => (
                    <div
                        key={y.id}
                        className={`group flex items-center justify-between p-4 rounded-lg border transition-all ${y.isActive
                            ? 'bg-gradient-to-r from-indigo-500/10 to-indigo-600/5 border-indigo-500/50'
                            : 'bg-white/5 border-white/5 hover:border-white/10'
                            }`}
                    >
                        <div>
                            <div className="flex items-center gap-3">
                                <span className={`text-lg font-bold ${y.isActive ? 'text-indigo-400' : 'text-gray-300'}`}>
                                    {y.name}
                                </span>
                                {y.isActive && (
                                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs border border-indigo-500/30 flex items-center gap-1">
                                        <Check size={12} /> Active
                                    </span>
                                )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                {new Date(y.startDate).toLocaleDateString()} - {new Date(y.endDate).toLocaleDateString()}
                            </div>
                        </div>

                        {!y.isActive && (
                            <button
                                onClick={() => handleActivate(y.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 bg-white/10 hover:bg-green-500/20 hover:text-green-400 text-gray-400 rounded-lg text-xs"
                            >
                                Activer
                            </button>
                        )}
                        {y.isActive && (
                            <div className="text-green-500 opacity-50">
                                <Check size={20} />
                            </div>
                        )}
                    </div>
                ))}

                {!loading && years.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        Aucune année scolaire définie. Créez-en une pour commencer.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AcademicYearManager;
