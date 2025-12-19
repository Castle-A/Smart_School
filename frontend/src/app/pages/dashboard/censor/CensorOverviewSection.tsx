import { useState, useEffect } from 'react';
import {
    BookOpen,
    Users,
    AlertTriangle,
    Calendar,
    TrendingUp,
    BarChart2,
    Bell,
    Clock,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { adminRequestService, type AdminRequest } from '../../../../shared/api/admin-requests.service';

const CensorOverviewSection = () => {
    const [requests, setRequests] = useState<AdminRequest[]>([]);
    const [isLoadingRequests, setIsLoadingRequests] = useState(true);
    const [showArchived, setShowArchived] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<AdminRequest | null>(null);

    const fetchRequests = async () => {
        setIsLoadingRequests(true);
        try {
            const res = await adminRequestService.getMyRequests(showArchived);
            setRequests(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingRequests(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [showArchived]);

    const handleArchive = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Archiver cette notification ?')) return;
        try {
            await adminRequestService.archive(id);
            setRequests(prev => prev.filter(r => r.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const handleArchiveAll = async () => {
        if (!confirm('Tout archiver (approuvées/refusées) ?')) return;
        try {
            await adminRequestService.archiveAllProcessed();
            fetchRequests();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Vue d'Ensemble</h2>
                    <p className="text-gray-400">
                        Direction des Études • <span className="text-indigo-400 font-medium">Collège & Lycée</span>
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-400">Année Scolaire 2025-2026</p>
                    <p className="text-xl font-bold text-white">Semestre 1</p>
                </div>
            </div>

            {/* KPIs Pédagogiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-lg bg-indigo-500/10">
                            <BookOpen className="text-indigo-400" size={24} />
                        </div>
                        <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-full">
                            Global
                        </span>
                    </div>
                    <div className="mb-2">
                        <h3 className="text-3xl font-bold text-white">42%</h3>
                        <p className="text-sm text-gray-400">Progression Programmes</p>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full w-[42%]"></div>
                    </div>
                    <p className="text-xs text-indigo-300 mt-2">Cible théorique: 45% (-3%)</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-lg bg-red-500/10">
                            <AlertTriangle className="text-red-400" size={24} />
                        </div>
                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full animate-pulse">
                            Urgent
                        </span>
                    </div>
                    <div className="mb-1">
                        <h3 className="text-3xl font-bold text-white">3</h3>
                        <p className="text-sm text-gray-400">Professeurs Absents</p>
                    </div>
                    <p className="text-xs text-red-400 mt-4">2 classes sans surveillance</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-lg bg-emerald-500/10">
                            <TrendingUp className="text-emerald-400" size={24} />
                        </div>
                    </div>
                    <div className="mb-1">
                        <h3 className="text-3xl font-bold text-white">11.5</h3>
                        <p className="text-sm text-gray-400">Moyenne Générale École</p>
                    </div>
                    <p className="text-xs text-emerald-400 mt-4">+0.5 pts vs Trimestre 1</p>
                </div>
            </div>

            {/* Notifications / Activités Récentes */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Bell className="text-amber-400" size={24} />
                        <h3 className="text-xl font-semibold text-white">
                            {showArchived ? 'Archives des Notifications' : 'Notifications & Actions'}
                        </h3>
                    </div>
                    <div className="flex gap-2">
                        {!showArchived && (
                            <button
                                onClick={handleArchiveAll}
                                className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors border border-white/10"
                            >
                                Tout nettoyer
                            </button>
                        )}
                        <button
                            onClick={() => setShowArchived(!showArchived)}
                            className={`px-3 py-1.5 text-xs rounded-lg transition-colors border ${showArchived ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'}`}
                        >
                            {showArchived ? 'Voir Actifs' : 'Voir Archives'}
                        </button>
                    </div>
                </div>

                {isLoadingRequests ? (
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {[1, 2, 3].map(i => <div key={i} className="h-24 w-64 bg-white/5 rounded-xl flex-shrink-0 animate-pulse" />)}
                    </div>
                ) : requests.length === 0 ? (
                    <p className="text-gray-400 text-sm italic py-4 text-center">
                        {showArchived ? 'Aucune archive trouvée.' : 'Aucune notification récente.'}
                    </p>
                ) : (
                    // Grid Layout - 10 cards max visible (scrolling if needed, but intended as compact grid)
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {requests.slice(0, 10).map((req) => {
                            let statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                            let StatusIcon = Clock;
                            let statusText = 'En attente';

                            if (req.status === 'APPROVED') {
                                statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                                StatusIcon = CheckCircle;
                                statusText = 'Approuvée';
                            } else if (req.status === 'REJECTED') {
                                statusColor = 'text-red-400 bg-red-500/10 border-red-500/20';
                                StatusIcon = XCircle;
                                statusText = 'Refusée';
                            }

                            let title = 'Requête';
                            if (req.type === 'UPDATE_TEACHER') title = 'Modif. Prof';
                            if (req.type === 'DELETE_TEACHER') title = 'Suppr. Prof';
                            if (req.type === 'CLASS_ASSEMBLY') title = 'Assemblage';

                            return (
                                <div
                                    key={req.id}
                                    onClick={() => setSelectedRequest(req)}
                                    className={`relative p-3 rounded-xl border ${statusColor} transition-all cursor-pointer hover:bg-white/5 group`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-1.5">
                                            <StatusIcon size={14} />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">{statusText}</span>
                                        </div>
                                        {req.status !== 'PENDING' && !showArchived && (
                                            <button
                                                onClick={(e) => handleArchive(req.id, e)}
                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded text-red-400 transition-all absolute top-2 right-2"
                                                title="Archiver"
                                            >
                                                <XCircle size={14} />
                                            </button>
                                        )}
                                    </div>
                                    <h4 className="font-medium text-xs text-gray-200 mb-1 truncate" title={title}>{title}</h4>
                                    <span className="text-[10px] opacity-50 block">
                                        {new Date(req.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Agenda Pédagogique */}
                <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Calendar className="text-indigo-400" size={24} />
                            <h3 className="text-xl font-semibold text-white">Agenda du Jour</h3>
                        </div>
                        <button className="text-sm text-indigo-300 hover:text-white transition-colors">
                            Voir calendrier complet
                        </button>
                    </div>

                    <div className="space-y-4">
                        {[
                            { time: '08:00', border: 'border-l-4 border-indigo-500', title: 'Visite de classe - 3ème A', subtitle: 'Observation cours M. Kouassi (Maths)' },
                            { time: '10:00', border: 'border-l-4 border-emerald-500', title: 'Conseil d\'Enseignement - SVT', subtitle: 'Salle des Profs' },
                            { time: '14:00', border: 'border-l-4 border-amber-500', title: 'Commission Discipline', subtitle: 'Cas élève Touré (Tle D)' },
                            { time: '16:00', border: 'border-l-4 border-purple-500', title: 'Réunion Parents-Profs', subtitle: 'Préparation 2ème Trimestre' },
                        ].map((event, idx) => (
                            <div key={idx} className={`bg-white/5 p-4 rounded-r-xl ${event.border} hover:bg-white/10 transition-colors`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-white font-medium">{event.title}</h4>
                                        <p className="text-sm text-gray-400">{event.subtitle}</p>
                                    </div>
                                    <span className="text-indigo-300 font-mono text-sm bg-indigo-500/10 px-2 py-1 rounded">
                                        {event.time}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Alertes & Tâches */}
                <div className="space-y-6">
                    {/* Alertes Cahiers de Textes */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <BarChart2 className="text-amber-400" size={20} />
                            <h3 className="text-lg font-semibold text-white">Suivi Cahiers de Textes</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm p-2 hover:bg-white/5 rounded transition-colors">
                                <span className="text-gray-300">Retails de remplissage</span>
                                <span className="text-red-400 font-bold">12 profs</span>
                            </div>
                            <div className="flex justify-between items-center text-sm p-2 hover:bg-white/5 rounded transition-colors">
                                <span className="text-gray-300">Validés cette semaine</span>
                                <span className="text-emerald-400 font-bold">85%</span>
                            </div>
                            <button className="w-full mt-2 py-2 text-xs bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded-lg transition-colors border border-amber-500/20">
                                Relancer les retardataires
                            </button>
                        </div>
                    </div>

                    {/* Classes Problématiques */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Users className="text-blue-400" size={20} />
                            <h3 className="text-lg font-semibold text-white">Classes à Surveiller</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {['4ème B', 'Tle A', '3ème C'].map((cls) => (
                                <span key={cls} className="px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg text-sm cursor-pointer hover:bg-red-500/20 transition-colors">
                                    {cls}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={() => setSelectedRequest(null)}>
                    <div className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-bold text-white">Détails de la Notification</h3>
                            <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-white">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-black/20 p-4 rounded-xl">
                                <p className="text-gray-400 text-sm mb-1">Type de Requête</p>
                                <p className="text-white font-medium">
                                    {selectedRequest.type === 'UPDATE_TEACHER' && 'Modification Professeur'}
                                    {selectedRequest.type === 'DELETE_TEACHER' && 'Suppression Professeur'}
                                    {selectedRequest.type === 'CLASS_ASSEMBLY' && 'Assemblage Classe'}
                                    {selectedRequest.type === 'DELETE_CLASS' && 'Suppression de Classe'}
                                    {!['UPDATE_TEACHER', 'DELETE_TEACHER', 'CLASS_ASSEMBLY', 'DELETE_CLASS'].includes(selectedRequest.type) && selectedRequest.type}
                                </p>
                            </div>
                            <div className="bg-black/20 p-4 rounded-xl">
                                <p className="text-gray-400 text-sm mb-1">Statut</p>
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${selectedRequest.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' :
                                    selectedRequest.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                                        'bg-amber-500/20 text-amber-400'
                                    }`}>
                                    {selectedRequest.status === 'APPROVED' && 'Approuvée'}
                                    {selectedRequest.status === 'REJECTED' && 'Refusée'}
                                    {selectedRequest.status === 'PENDING' && 'En Attente'}
                                </span>
                            </div>
                            {selectedRequest.adminComment && (
                                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                    <p className="text-gray-400 text-sm mb-1">Commentaire Administration</p>
                                    <p className="text-white italic">"{selectedRequest.adminComment}"</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CensorOverviewSection;
