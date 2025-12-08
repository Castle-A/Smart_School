import { useState, useEffect } from 'react';
import { AlertCircle, Check, X, Clock, User, UserX, UserCog, Users } from 'lucide-react';
import { adminRequestService, type AdminRequest } from '../../../../../shared/api/admin-requests.service';

const DirectorRequestsView = () => {
    const [requests, setRequests] = useState<AdminRequest[]>([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await adminRequestService.findAll('PENDING');
            console.log('DEBUG [fetchRequests]: res', res);
            console.log('DEBUG [fetchRequests]: res.data', res.data);
            console.log('DEBUG [fetchRequests]: isArray?', Array.isArray(res.data));
            if (Array.isArray(res.data)) {
                setRequests(res.data);
            } else {
                console.error('Expected array but got:', res.data);
                // Fallback or alert
                setRequests([]); // Prevent crash
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleResolve = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        const comment = prompt(status === 'APPROVED' ? "Commentaire (Optionnel):" : "Raison du rejet :");
        if (status === 'REJECTED' && !comment) return;

        try {
            await adminRequestService.resolve(id, status, comment || undefined);
            fetchRequests();
        } catch (err) {
            alert("Erreur lors du traitement de la requête.");
        }
    };

    const renderRequestContent = (request: AdminRequest) => {
        const data = JSON.parse(request.data);

        switch (request.type) {
            case 'DELETE_TEACHER':
                return (
                    <div>
                        <p className="text-gray-300">Demande de suppression de professeur (ID: {data.teacherId})</p>
                        <p className="text-sm text-gray-500 mt-1">Raison: {data.reason}</p>
                    </div>
                );
            case 'UPDATE_TEACHER':
                return (
                    <div>
                        <p className="text-gray-300">Demande de modification de professeur (ID: {data.teacherId})</p>
                        <p className="text-sm text-gray-500 mt-1">Note: {data.note}</p>
                    </div>
                );
            case 'CLASS_ASSEMBLY':
                return (
                    <div>
                        <p className="text-gray-300">Proposition de composition de classe (ID: {data.classId})</p>
                        <p className="text-sm text-gray-500 mt-1">{data.assignments?.length || 0} affectations proposées</p>
                    </div>
                );
            default:
                return <p className="text-gray-300">Type de requête inconnu</p>;
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'DELETE_TEACHER': return <UserX className="text-red-400" />;
            case 'UPDATE_TEACHER': return <UserCog className="text-amber-400" />;
            case 'CLASS_ASSEMBLY': return <Users className="text-indigo-400" />;
            default: return <AlertCircle className="text-gray-400" />;
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Requêtes Administratives</h3>

            {requests.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/10">
                    <Check size={48} className="mx-auto text-emerald-500 mb-4" />
                    <p className="text-gray-400">Aucune requête en attente.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {requests.map(req => (
                        <div key={req.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/5 rounded-lg">
                                    {getIcon(req.type)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-white font-bold">{req.type.replace('_', ' ')}</h4>
                                        <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">PENDING</span>
                                    </div>
                                    {renderRequestContent(req)}
                                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                        <User size={12} />
                                        <span>Demandé par {req.requester.firstName} {req.requester.lastName}</span>
                                        <span>•</span>
                                        <Clock size={12} />
                                        <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 self-end md:self-center">
                                <button
                                    onClick={() => handleResolve(req.id, 'REJECTED')}
                                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    <X size={16} /> Rejeter
                                </button>
                                <button
                                    onClick={() => handleResolve(req.id, 'APPROVED')}
                                    className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    <Check size={16} /> Valider
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DirectorRequestsView;
