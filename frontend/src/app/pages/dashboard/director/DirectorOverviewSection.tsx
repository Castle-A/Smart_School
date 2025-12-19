import { Users, GraduationCap, TrendingUp, Calendar, BookOpen, UserCheck, Bell, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminRequestService, type AdminRequest } from '../../../../shared/api/admin-requests.service';
import { calendarService, type AcademicEvent } from '../../../api/calendar.service';
import { useAuth } from '../../../../shared/contexts/AuthContext';
import StudentValidationModal from './components/StudentValidationModal';

const DirectorOverviewSection = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [requests, setRequests] = useState<AdminRequest[]>([]);
    const [showArchived, setShowArchived] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<AdminRequest | null>(null);
    const [validationStudentId, setValidationStudentId] = useState<string | null>(null);
    const [validationRequestId, setValidationRequestId] = useState<string | null>(null);
    const [upcomingEvents, setUpcomingEvents] = useState<AcademicEvent[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const events = await calendarService.getEvents();
                // Filter for future events only
                const futureEvents = events
                    .filter((e: AcademicEvent) => new Date(e.start) >= new Date())
                    .sort((a: AcademicEvent, b: AcademicEvent) => new Date(a.start).getTime() - new Date(b.start).getTime())
                    .slice(0, 5);
                setUpcomingEvents(futureEvents);
            } catch (error) {
                console.error("Failed to fetch events", error);
            }
        };
        fetchEvents();
    }, []);

    const getEventTypeColor = (type: string) => {
        switch (type) {
            case 'EXAM': return 'bg-red-400';
            case 'MEETING': return 'bg-blue-400';
            case 'HOLIDAY': return 'bg-emerald-400';
            case 'ACADEMIC_PERIOD': return 'bg-purple-400';
            default: return 'bg-amber-400';
        }
    };

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await adminRequestService.findAll(undefined, showArchived);
                // Parse data if it is a string
                const parsedRequests = res.data.map(req => ({
                    ...req,
                    payload: typeof req.data === 'string' ? JSON.parse(req.data) : req.data
                }));
                setRequests(parsedRequests);
            } catch (error) {
                console.error("Failed to fetch requests", error);
            }
        };
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
            const res = await adminRequestService.findAll(undefined, showArchived);
            const parsedRequests = res.data.map(req => ({
                ...req,
                payload: typeof req.data === 'string' ? JSON.parse(req.data) : req.data
            }));
            setRequests(parsedRequests);
        } catch (error) {
            console.error(error);
        }
    };

    const getTeacherLabel = () => {
        if (user?.directorType === 'PRIMARY_PRESCHOOL') return 'Maîtres';
        if (user?.directorType === 'COLLEGE') return 'Professeurs';
        return 'Enseignants';
    };

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Vue d'Ensemble</h2>
                <p className="text-gray-400">Tableau de bord du directeur</p>
            </div>

            {/* KPIs Principaux */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Élèves', value: '1,245', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', trend: '+12' },
                    { label: getTeacherLabel(), value: '84', icon: GraduationCap, color: 'text-emerald-400', bg: 'bg-emerald-500/10', trend: '+3' },
                    { label: 'Classes', value: '27', icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-500/10', trend: '+2' },
                    { label: 'Taux Présence', value: '94.5%', icon: UserCheck, color: 'text-amber-400', bg: 'bg-amber-500/10', trend: '+1.2%' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                <stat.icon className={stat.color} size={24} />
                            </div>
                            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full">
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-sm text-gray-400">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Alertes et Actions Rapides */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Alertes */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Bell className="text-amber-400" size={24} />
                            <h3 className="text-xl font-semibold text-white">Notifications & Actions</h3>
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

                    <div className="space-y-3">
                        {requests.length === 0 ? (
                            <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-center py-8">
                                <p className="text-gray-400 text-sm">{showArchived ? 'Aucune archive.' : 'Aucune alerte pour le moment.'}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {requests.slice(0, 5).map(req => {
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
                                    if (req.type === 'VALIDATE_STUDENT_REGISTRATION') title = 'Inscription Élève';

                                    return (
                                        <div
                                            key={req.id}
                                            onClick={() => {
                                                if (req.type === 'VALIDATE_STUDENT_REGISTRATION' && req.status === 'PENDING') {
                                                    setValidationStudentId(req.payload?.studentId);
                                                    setValidationRequestId(req.id);
                                                } else {
                                                    setSelectedRequest(req);
                                                }
                                            }}
                                            className={`p-3 rounded-lg border ${statusColor} hover:bg-white/5 transition-colors cursor-pointer group relative`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${statusColor.split(' ')[1]}`}>
                                                        <StatusIcon size={16} className={statusColor.split(' ')[0]} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-medium text-sm">{title}</h4>
                                                        <p className="text-xs text-gray-400">
                                                            {req.requester?.firstName} {req.requester?.lastName} • {new Date(req.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${statusColor.split(' ')[1]} ${statusColor.split(' ')[0]}`}>
                                                        {statusText}
                                                    </span>
                                                    {req.status !== 'PENDING' && !showArchived && (
                                                        <button
                                                            onClick={(e) => handleArchive(req.id, e)}
                                                            className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:bg-red-500/20 rounded-md transition-all"
                                                            title="Archiver"
                                                        >
                                                            <XCircle size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {requests.length > 5 && (
                                    <button
                                        onClick={() => navigate('/app/dashboard', { state: { section: 'administration', view: 'requests' } })}
                                        className="text-center text-xs text-indigo-400 hover:text-indigo-300 py-2"
                                    >
                                        Voir toutes les {requests.length} notifications →
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Événements à Venir */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Calendar className="text-indigo-400" size={24} />
                        <h3 className="text-xl font-semibold text-white">Événements à Venir</h3>
                    </div>
                    <div className="space-y-3">
                        {upcomingEvents.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-4">Aucun événement à venir.</p>
                        ) : (
                            upcomingEvents.map((event, idx) => {
                                const dateObj = new Date(event.start);
                                const dateStr = dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
                                const timeStr = dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

                                return (
                                    <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                        <div className="flex-shrink-0 w-12 text-center">
                                            <div className="text-xs text-gray-400">{dateStr.split(' ')[1]}</div>
                                            <div className="text-lg font-bold text-white">{dateStr.split(' ')[0]}</div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white font-medium text-sm truncate">{event.title}</h4>
                                            <p className="text-xs text-gray-400">{timeStr}</p>
                                        </div>
                                        <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${getEventTypeColor(event.type)}`}></div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Graphiques de Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Répartition par Niveau */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Répartition des Élèves</h3>
                    <div className="space-y-4">
                        {[
                            { level: 'Primaire', count: 450, total: 1245, color: 'bg-blue-500' },
                            { level: 'Collège', count: 520, total: 1245, color: 'bg-emerald-500' },
                            { level: 'Lycée', count: 275, total: 1245, color: 'bg-purple-500' },
                        ].map((item, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-300">{item.level}</span>
                                    <span className="text-white font-medium">{item.count} élèves ({Math.round((item.count / item.total) * 100)}%)</span>
                                </div>
                                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color}`} style={{ width: `${(item.count / item.total) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Taux de Réussite */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Performance Académique</h3>
                    <div className="space-y-4">
                        {[
                            { subject: 'Mathématiques', avg: 13.2, color: 'text-blue-400' },
                            { subject: 'Français', avg: 12.8, color: 'text-emerald-400' },
                            { subject: 'Anglais', avg: 14.1, color: 'text-purple-400' },
                            { subject: 'Sciences', avg: 13.5, color: 'text-amber-400' },
                        ].map((subject, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                                <span className="text-sm text-gray-300">{subject.subject}</span>
                                <div className="flex items-center gap-2">
                                    <span className={`text-lg font-bold ${subject.color}`}>{subject.avg}/20</span>
                                    <TrendingUp size={16} className="text-emerald-400" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={() => setSelectedRequest(null)}>
                    <div className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
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
                                    {selectedRequest.type === 'VALIDATE_STUDENT_REGISTRATION' && 'Inscription Élève'}
                                    {!['UPDATE_TEACHER', 'DELETE_TEACHER', 'CLASS_ASSEMBLY', 'VALIDATE_STUDENT_REGISTRATION'].includes(selectedRequest.type) && selectedRequest.type}
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

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    if (selectedRequest?.type === 'VALIDATE_STUDENT_REGISTRATION' && selectedRequest.status === 'PENDING') {
                                        setValidationStudentId(selectedRequest.payload?.studentId);
                                        setSelectedRequest(null);
                                    } else {
                                        navigate('/app/dashboard', { state: { section: 'administration', view: 'requests' } });
                                        setSelectedRequest(null);
                                    }
                                }}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                            >
                                Traiter / Voir Détails
                            </button>
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {validationStudentId && (
                <StudentValidationModal
                    studentId={validationStudentId}
                    requestId={validationRequestId}
                    onClose={() => {
                        setValidationStudentId(null);
                        setValidationRequestId(null);
                    }}
                    onSuccess={() => {
                        // We refresh request after success
                        const fetchRequests = async () => {
                            try {
                                const res = await adminRequestService.findAll(undefined, showArchived);
                                const parsedRequests = res.data.map(req => ({
                                    ...req,
                                    payload: typeof req.data === 'string' ? JSON.parse(req.data) : req.data
                                }));
                                setRequests(parsedRequests);
                            } catch (e) { console.error(e) }
                        };
                        fetchRequests();
                        setValidationStudentId(null);
                        setValidationRequestId(null);
                    }}
                />
            )}
        </div>
    );
};

export default DirectorOverviewSection;
