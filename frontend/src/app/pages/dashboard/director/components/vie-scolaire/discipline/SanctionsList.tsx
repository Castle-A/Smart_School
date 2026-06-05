import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';
import api from '../../../../../../../shared/api/api';
import { CreateSanctionModal } from './CreateSanctionModal';
import { toastEvents } from '../../../../../../../shared/utils/toast-events';

export const SanctionsList = () => {
    const [sanctions, setSanctions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchSanctions = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/vie-scolaire/sanctions');
            if (Array.isArray(res.data)) {
                setSanctions(res.data);
            } else {
                console.warn('API returned non-array for sanctions:', res.data);
                setSanctions([]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSanctions();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Supprimer cette sanction ?')) return;
        try {
            await api.delete(`/vie-scolaire/sanctions/${id}`);
            fetchSanctions();
        } catch (err) {
            toastEvents.error('Erreur lors de la suppression');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Sanctions Disciplinaires</h3>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-lg shadow-red-500/20"
                >
                    <Plus size={18} />
                    Nouvelle Sanction
                </button>
            </div>

            {/* List */}
            <div className="space-y-2">
                {isLoading ? (
                    <div className="text-gray-400 text-center py-8">Chargement...</div>
                ) : sanctions.length === 0 ? (
                    <div className="text-gray-400 text-center py-8 border border-dashed border-white/10 rounded-xl">
                        Aucune sanction enregistrée.
                    </div>
                ) : (
                    (Array.isArray(sanctions) ? sanctions : []).map((s) => (
                        <div key={s.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center group hover:bg-white/10 transition-colors">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className={`px-2 py-0.5 rounded textxs font-bold uppercase tracking-wider ${s.severity >= 4 ? 'bg-red-500/20 text-red-400' :
                                        s.severity >= 3 ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                        {s.type}
                                    </span>
                                    <h4 className="text-white font-medium">{s.student?.firstName} {s.student?.lastName}</h4>
                                </div>
                                <p className="text-gray-400 text-sm">{s.reason}</p>
                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                    <Calendar size={12} />
                                    <span>Du {new Date(s.startDate || s.createdAt).toLocaleDateString()}</span>
                                    {s.endDate && <span> au {new Date(s.endDate).toLocaleDateString()}</span>}
                                    <span>• Par {s.reporter?.user?.firstName || 'Administration'}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(s.id)}
                                className="p-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {isCreateModalOpen && (
                <CreateSanctionModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={fetchSanctions}
                />
            )}
        </div>
    );
};
