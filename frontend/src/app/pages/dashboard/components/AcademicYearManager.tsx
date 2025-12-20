import { useState, useEffect } from 'react';
import { Calendar, Check, Plus, ArrowRightLeft, Info, AlertTriangle } from 'lucide-react';
import api from '../../../../shared/api/api';
import { toastEvents } from '../../../../shared/utils/toast-events';
import { RolloverWizard } from './RolloverWizard'; // Import

interface AcademicYear {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    status?: string; // Add status field from API if needed
}

const AcademicYearManager = () => {
    const [years, setYears] = useState<AcademicYear[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [showRollover, setShowRollover] = useState(false); // Rollover State

    // Form state
    const [newName, setNewName] = useState('');
    const [newStart, setNewStart] = useState('');
    const [newEnd, setNewEnd] = useState('');
    const [newPeriodType, setNewPeriodType] = useState('TRIMESTER');
    const [newAutoClosureEnabled, setNewAutoClosureEnabled] = useState(false);
    const [newAutoClosureDate, setNewAutoClosureDate] = useState('');
    const [showClosureInfo, setShowClosureInfo] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const fetchYears = async () => {
        setLoading(true);
        try {
            const res = await api.get('/academic-years');
            // Ensure data is an array before setting
            if (Array.isArray(res.data)) {
                setYears(res.data);
            } else {
                console.warn('[AcademicYearManager] API returned non-array data, using empty array');
                setYears([]);
            }
        } catch (error: unknown) {
            // Silently handle 404 - endpoint not implemented yet
            // Check if it's an axios error safely
            const e = error as any; // Temporary cast for access, ideally use type guard or AxiosError
            if (e?.response?.status === 404) {
                console.log('[AcademicYearManager] API endpoint not yet implemented, using empty array');
                setYears([]);
            } else {
                console.error("Failed to load years", e);
                setYears([]); // Fallback to empty array on any error
            }
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
                endDate: newEnd,
                periodType: newPeriodType,
                autoClosureEnabled: newAutoClosureEnabled,
                autoClosureDate: newAutoClosureEnabled ? newAutoClosureDate : undefined
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
            toastEvents.error("Erreur lors de l'activation");
        }
    };

    // Find active year for Rollover Source
    const activeYear = years.find(y => y.isActive);

    return (
        <div className="bg-[#1e293b] rounded-xl border border-white/10 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Calendar className="text-indigo-400" /> Années Scolaires
                </h2>
                <div className="flex gap-2">
                    {/* Rollover Button - Only if active year exists */}
                    {activeYear && (
                        <button
                            onClick={() => setShowRollover(true)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 hover:text-emerald-300 border border-emerald-600/30 rounded-lg text-sm transition-colors"
                        >
                            <ArrowRightLeft size={16} /> Préparer Année Suivante
                        </button>
                    )}
                    <button
                        onClick={() => setIsCreating(!isCreating)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors"
                    >
                        <Plus size={16} /> Nouvelle Année
                    </button>
                </div>
            </div>

            {/* Rollover Modal */}
            {showRollover && activeYear && (
                <RolloverWizard
                    sourceYearId={activeYear.id}
                    onClose={() => setShowRollover(false)}
                    onSuccess={() => {
                        setShowRollover(false);
                        fetchYears();
                    }}
                />
            )}

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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pt-4 border-t border-white/5">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Découpage Académique</label>
                            <select
                                className="w-full bg-[#0f172a] border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                                value={newPeriodType}
                                onChange={e => setNewPeriodType(e.target.value)}
                            >
                                <option value="TRIMESTER">Trimestres (3 périodes)</option>
                                <option value="SEMESTER">Semestres (2 périodes)</option>
                            </select>
                        </div>

                        <div className="pt-6 relative">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="autoClosure"
                                    checked={newAutoClosureEnabled}
                                    onChange={e => setNewAutoClosureEnabled(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-[#0f172a]"
                                />
                                <label htmlFor="autoClosure" className="ml-2 text-sm text-gray-300 mr-2">
                                    Activer Clôture Automatique
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowClosureInfo(!showClosureInfo)}
                                    className="text-gray-400 hover:text-indigo-400 transition-colors"
                                    title="Plus d'informations sur la clôture automatique"
                                >
                                    <Info size={16} />
                                </button>
                            </div>

                            {showClosureInfo && (
                                <div className="mt-2 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs text-indigo-200 animate-in fade-in slide-in-from-top-1 absolute z-10 w-64 md:w-80 shadow-xl backdrop-blur-md left-0 top-full">
                                    <h4 className="font-bold flex items-center gap-2 mb-2 text-indigo-100">
                                        <Info size={14} /> Comment ça marche ?
                                    </h4>
                                    <p className="mb-2">
                                        À la date choisie, le système lancera un <strong>audit de fin d'année</strong> :
                                    </p>
                                    <ul className="list-disc pl-4 space-y-1 mb-2 opacity-90">
                                        <li>Vérification que tous les bulletins sont publiés.</li>
                                        <li>Validation administrative des dossiers élèves.</li>
                                        <li>Archivage des données financières.</li>
                                    </ul>
                                    <div className="flex gap-2 p-2 bg-amber-500/10 rounded border border-amber-500/20 text-amber-200 mt-2">
                                        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                                        <p>Si des blocages existent (ex: notes manquantes), la clôture sera <strong>suspendue</strong> et vous serez notifié.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {newAutoClosureEnabled && (
                            <div className="animate-in fade-in slide-in-from-left-2">
                                <label className="block text-xs text-gray-400 mb-1">Date de Clôture</label>
                                <input
                                    type="date"
                                    required={newAutoClosureEnabled}
                                    className="w-full bg-[#0f172a] border border-white/10 rounded-lg p-2 text-white text-sm"
                                    value={newAutoClosureDate} onChange={e => setNewAutoClosureDate(e.target.value)}
                                />
                            </div>
                        )}
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
