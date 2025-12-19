import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { RequestItem } from './RequestItem';
import { adminRequestService, type AdminRequest } from '../../../../../shared/api/admin-requests.service';
import SearchFilterBar from '../../../../../shared/components/SearchFilterBar';
import api from '../../../../../shared/api/api';

const DirectorRequestsView = () => {
    const [requests, setRequests] = useState<AdminRequest[]>([]);
    const [involvedTeachers, setInvolvedTeachers] = useState<Record<string, any>>({});
    const [involvedStudents, setInvolvedStudents] = useState<Record<string, any>>({});
    const [involvedClasses, setInvolvedClasses] = useState<Record<string, any>>({});
    const [processing, setProcessing] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string | 'ALL'>('ALL');
    const [showFilter, setShowFilter] = useState(false);

    const [showArchived, setShowArchived] = useState(false);

    // Rejection Modal State
    const [rejectionModal, setRejectionModal] = useState<{ isOpen: boolean; requestId: string | null }>({ isOpen: false, requestId: null });
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        fetchRequests();
    }, [showArchived]);

    const fetchRequests = async () => {
        try {
            // Updated logic: Active view shows ALL active (non-archived) requests (Pending + Processed).
            // Archive view shows ALL archived requests.
            const status = undefined;

            const res = await adminRequestService.findAll(status, showArchived);
            if (Array.isArray(res.data)) {
                setRequests(res.data);
                // Fetch involved teachers for diffing
                const teacherIds = res.data
                    .filter(r => r.type === 'UPDATE_TEACHER' || r.type === 'DELETE_TEACHER')
                    .map(r => {
                        try {
                            const d = typeof r.data === 'string' ? JSON.parse(r.data) : r.data;
                            return d.teacherId;
                        } catch { return null; }
                    })
                    .filter(Boolean);

                if (teacherIds.length > 0) {
                    fetchInvolvedTeachers(Array.from(new Set(teacherIds)));
                }

                const studentIds = res.data
                    .filter(r => r.type === 'VALIDATE_STUDENT_REGISTRATION')
                    .map(r => {
                        try {
                            const d = typeof r.data === 'string' ? JSON.parse(r.data) : r.data;
                            return d.studentId;
                        } catch { return null; }
                    })
                    .filter(Boolean);

                if (studentIds.length > 0) {
                    fetchInvolvedStudents(Array.from(new Set(studentIds)));
                }

                const classIds = res.data
                    .filter(r => r.type === 'DELETE_CLASS' || r.type === 'CLASS_ASSEMBLY')
                    .map(r => {
                        try {
                            const d = typeof r.data === 'string' ? JSON.parse(r.data) : r.data;
                            return d.classId;
                        } catch { return null; }
                    })
                    .filter(Boolean);

                if (classIds.length > 0) {
                    fetchInvolvedClasses(Array.from(new Set(classIds)));
                }
            } else {
                setRequests([]);
            }
        } catch (err) {
            console.error(err);
            setRequests([]);
        }
    };

    const fetchInvolvedTeachers = async (ids: string[]) => {
        const teachersMap: Record<string, any> = {};
        await Promise.all(ids.map(async (id) => {
            try {
                // Determine logic to fetch teacher (could be bulk in future)
                const res = await api.get(`/teachers/${id}`);
                teachersMap[id] = res.data;
            } catch (e) {
                console.error(`Failed to fetch teacher ${id}`, e);
            }
        }));
        setInvolvedTeachers(teachersMap);
    };

    const fetchInvolvedStudents = async (ids: string[]) => {
        const studentsMap: Record<string, any> = {};
        await Promise.all(ids.map(async (id) => {
            try {
                const res = await api.get(`/students/${id}`);
                studentsMap[id] = res.data;
            } catch (e) {
                console.error(`Failed to fetch student ${id}`, e);
            }
        }));
        setInvolvedStudents(studentsMap);
    };

    const fetchInvolvedClasses = async (ids: string[]) => {
        const classesMap: Record<string, any> = {};
        await Promise.all(ids.map(async (id) => {
            try {
                const res = await api.get(`/classes/${id}`);
                classesMap[id] = res.data;
            } catch (e) {
                console.error(`Failed to fetch class ${id}`, e);
            }
        }));
        setInvolvedClasses(classesMap);
    };

    const handleApprove = async (id: string) => {
        setProcessing(id);
        try {
            await adminRequestService.resolve(id, 'APPROVED');
            // Don't remove from list immediately if we want to show it as "Approved" so user can archive it.
            // But usually Director wants to process quickly. 
            // Let's refresh requests to show clear status update
            fetchRequests();
        } catch (err) {
            alert("Erreur lors de l'approbation.");
            fetchRequests();
        } finally {
            setProcessing(null);
        }
    };

    const handleArchive = async (id: string) => {
        if (!confirm('Archiver cette requête ?')) return;
        try {
            await adminRequestService.archive(id);
            setRequests(prev => prev.filter(r => r.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const handleArchiveAll = async () => {
        if (!confirm('Archiver toutes les requêtes traitées ?')) return;
        try {
            await adminRequestService.archiveAllProcessed();
            fetchRequests();
        } catch (error) {
            console.error(error);
        }
    };

    const openRejectionModal = (id: string) => {
        setRejectionModal({ isOpen: true, requestId: id });
        setRejectionReason('');
    };

    const submitRejection = async () => {
        if (!rejectionModal.requestId || !rejectionReason.trim()) return;

        const id = rejectionModal.requestId;
        setProcessing(id);
        setRejectionModal({ isOpen: false, requestId: null }); // Close modal immediately

        try {
            await adminRequestService.resolve(id, 'REJECTED', rejectionReason);
            setRequests(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            alert("Erreur lors du rejet.");
            fetchRequests();
        } finally {
            setProcessing(null);
            setRejectionReason('');
        }
    };

    // Helper functions removed (moved to RequestItem)

    const getTitle = (type: string) => {
        switch (type) {
            case 'DELETE_TEACHER': return 'Suppression de Compte';
            case 'UPDATE_TEACHER': return 'Modification de Profil';
            case 'CLASS_ASSEMBLY': return 'Composition de Classe';
            case 'DELETE_CLASS': return 'Suppression de Classe';
            case 'VALIDATE_STUDENT_REGISTRATION': return 'Inscription Élève';
            default: return type.replace(/_/g, ' ');
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesSearch =
            getTitle(req.type).toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.requester.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.requester.lastName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterType === 'ALL' || req.type === filterType;

        return matchesSearch && matchesFilter;
    });

    const uniqueTypes = Array.from(new Set(requests.map(r => r.type)));

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Requêtes Administratives</h3>

            <SearchFilterBar
                onSearch={setSearchTerm}
                placeholder="Rechercher une requête..."
                isFilterEnabled={true}
                isFilterOpen={showFilter}
                onFilterClick={() => setShowFilter(!showFilter)}
                filterContent={
                    <div className="p-2 space-y-1">
                        <button
                            onClick={() => { setFilterType('ALL'); setShowFilter(false); }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${filterType === 'ALL' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-white/5'}`}
                        >
                            Tout voir
                        </button>
                        {uniqueTypes.map(type => (
                            <button
                                key={type}
                                onClick={() => { setFilterType(type); setShowFilter(false); }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${filterType === type ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-white/5'}`}
                            >
                                {getTitle(type)}
                            </button>
                        ))}
                    </div>
                }
            />

            <div className="flex justify-end items-center gap-3 mb-4">
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

            {filteredRequests.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/10">
                    <Check size={48} className="mx-auto text-emerald-500 mb-4" />
                    <p className="text-gray-400">Aucune requête en attente.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredRequests.map(req => {
                        const data = typeof req.data === 'string' ? JSON.parse(req.data) : req.data;
                        const involvedTeacher = data.teacherId ? involvedTeachers[data.teacherId] : undefined;
                        const involvedStudent = data.studentId ? involvedStudents[data.studentId] : undefined;
                        const involvedClass = data.classId ? involvedClasses[data.classId] : undefined;

                        return (
                            <RequestItem
                                key={req.id}
                                req={req}
                                involvedTeacher={involvedTeacher}
                                involvedStudent={involvedStudent}
                                involvedClass={involvedClass}
                                onApprove={handleApprove}
                                onReject={openRejectionModal}
                                onArchive={handleArchive}
                                processing={processing}
                                showArchived={showArchived}
                            />
                        );
                    })}
                </div>
            )}

            {/* Rejection Modal */}
            {rejectionModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                        <h3 className="text-lg font-bold text-white mb-2">Motif du Refus</h3>
                        <p className="text-sm text-gray-400 mb-4">Veuillez indiquer pourquoi vous refusez cette demande. Ce message sera visible par le demandeur.</p>

                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full h-32 bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-red-500/50 resize-none mb-4 placeholder-gray-600"
                            placeholder="Ex: Informations incomplètes..."
                            autoFocus
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setRejectionModal({ isOpen: false, requestId: null })}
                                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={submitRejection}
                                disabled={!rejectionReason.trim()}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Confirmer le Refus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DirectorRequestsView;
