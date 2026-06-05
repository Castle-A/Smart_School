import { useState, useEffect } from 'react';
import { Plus, Trophy, Trash2 } from 'lucide-react';
import api from '../../../../../../../shared/api/api';
import { CreateRewardModal } from './CreateRewardModal';
import { toastEvents } from '../../../../../../../shared/utils/toast-events';

export const RewardsList = () => {
    const [rewards, setRewards] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchRewards = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/vie-scolaire/rewards');
            setRewards(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRewards();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Supprimer cette gratification ?')) return;
        try {
            await api.delete(`/vie-scolaire/rewards/${id}`);
            fetchRewards();
        } catch (err) {
            toastEvents.error('Erreur lors de la suppression');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Gratifications & Encouragements</h3>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors shadow-lg shadow-amber-500/20"
                >
                    <Plus size={18} />
                    Nouvelle Gratification
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoading ? (
                    <div className="text-gray-400 col-span-2 text-center py-8">Chargement...</div>
                ) : rewards.length === 0 ? (
                    <div className="text-gray-400 col-span-2 text-center py-8 border border-dashed border-white/10 rounded-xl">
                        Aucune gratification enregistrée.
                    </div>
                ) : (
                    rewards.map((r) => (
                        <div key={r.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center group hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-amber-500/20 rounded-full text-amber-400">
                                    <Trophy size={20} />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium">{r.student?.firstName} {r.student?.lastName}</h4>
                                    <p className="text-amber-400 text-xs font-bold uppercase tracking-wide">{r.type}</p>
                                    {r.reason && <p className="text-gray-400 text-xs mt-1 italic">"{r.reason}"</p>}
                                    <p className="text-gray-500 text-[10px] mt-1">{new Date(r.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(r.id)}
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
                <CreateRewardModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={fetchRewards}
                />
            )}
        </div>
    );
};
