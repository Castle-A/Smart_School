import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDownAZ, CalendarDays, GraduationCap, X, Mail, Phone, Calendar, FileText, ChevronLeft, ChevronRight, UserPlus, Trash2, Pencil, Clock } from 'lucide-react';
import Skeleton from '../../../../../shared/components/Skeleton';
import api from '../../../../../shared/api/api';
import Avatar from '../../../../../shared/components/Avatar';
import { useAuth } from '../../../../../shared/contexts/AuthContext';
import { adminRequestService } from '../../../../../shared/api/admin-requests.service';
import { AnimatePresence } from 'framer-motion';
import SearchFilterBar from '../../../../../shared/components/SearchFilterBar';

interface Teacher {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    contractType: string;
    hireDate: string;
    matricule: string;
    subjects: string[];
    classes?: number;
    role?: string;
    title?: string;
    diploma?: string;
    specialty?: string;
}

const CensorTeachersView = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState<'name' | 'date' | 'classes'>('name');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());
    const itemsPerPage = 48;

    useEffect(() => {
        fetchTeachers();
        fetchPendingRequests();
    }, []);

    const fetchTeachers = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/teachers');
            setTeachers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPendingRequests = async () => {
        try {
            const response = await adminRequestService.getMyRequests();
            const pendingIds = new Set<string>();
            response.data.forEach((req: any) => {
                if (req.status === 'PENDING' && (req.type === 'UPDATE_TEACHER' || req.type === 'DELETE_TEACHER')) {
                    try {
                        const data = JSON.parse(req.data);
                        if (data.teacherId) pendingIds.add(data.teacherId);
                    } catch (e) {
                        // ignore parsing error
                    }
                }
            });
            setPendingRequests(pendingIds);
        } catch (error) {
            console.error("Failed to fetch pending requests", error);
        }
    };

    // Filter and sort teachers
    const filteredTeachers = teachers
        .filter(teacher => {
            const matchesSearch = `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
            if (!matchesSearch) return false;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'name') return a.lastName.localeCompare(b.lastName);
            if (sortBy === 'date') return new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime();
            if (sortBy === 'classes') return (b.classes || 0) - (a.classes || 0);
            return 0;
        });

    const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
    const currentTeachers = filteredTeachers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleDeleteRequest = async (teacherId: string) => {
        if (pendingRequests.has(teacherId)) {
            alert("Une requête est déjà en cours pour ce professeur.");
            return;
        }

        // Censor Request Logic
        const reason = prompt("Raison de la suppression (pour le Directeur):");
        if (!reason) return;

        try {
            await adminRequestService.create('DELETE_TEACHER', {
                teacherId,
                reason
            });
            alert('Requête de suppression envoyée au Directeur.');
            fetchPendingRequests(); // Refresh badges
        } catch (err) {
            alert('Erreur lors de l\'envoi de la requête.');
        }
    };

    // Check permission for "Nouveau Professeur"
    const canCreateTeacher = user?.permissions?.includes('MANAGE_TEACHERS') || false; // Adjust permission key as needed

    return (
        <div className="space-y-6">
            <SearchFilterBar
                onSearch={setSearchTerm}
                placeholder="Rechercher un professeur..."
                isFilterEnabled={true}
                isFilterOpen={isFilterOpen}
                onFilterClick={() => setIsFilterOpen(!isFilterOpen)}
                filterContent={
                    <div className="p-2">
                        <button onClick={() => { setSortBy('name'); setIsFilterOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${sortBy === 'name' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-white/5'}`}>
                            <ArrowDownAZ size={16} /> <span className="text-sm">Alphabétique (A-Z)</span>
                        </button>
                        <button onClick={() => { setSortBy('date'); setIsFilterOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${sortBy === 'date' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-white/5'}`}>
                            <CalendarDays size={16} /> <span className="text-sm">Date d'embauche</span>
                        </button>
                        <button onClick={() => { setSortBy('classes'); setIsFilterOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${sortBy === 'classes' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-white/5'}`}>
                            <GraduationCap size={16} /> <span className="text-sm">Nombre de classes</span>
                        </button>
                    </div>
                }
                actions={
                    canCreateTeacher && (
                        <button
                            onClick={() => navigate('/app/add-teacher')}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20 whitespace-nowrap"
                        >
                            <UserPlus size={18} />
                            Nouveau Professeur
                        </button>
                    )
                }
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {isLoading ? (
                    Array.from({ length: 12 }).map((_, i) => (
                        <Skeleton key={i} className="h-48 w-full bg-white/5" />
                    ))
                ) : (
                    currentTeachers.map((teacher) => {
                        const isPending = pendingRequests.has(teacher.id);
                        return (
                            <div
                                key={teacher.id}
                                onClick={() => setSelectedTeacher(teacher)}
                                className={`bg-white/5 backdrop-blur-sm border ${isPending ? 'border-amber-500/30 bg-amber-500/5' : 'border-white/10'} rounded-xl p-3 hover:bg-white/10 transition-all cursor-pointer group hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/10 flex flex-col relative`}
                            >
                                {isPending && (
                                    <div className="absolute top-2 left-2 z-10">
                                        <div className="bg-amber-500/20 text-amber-400 p-1 rounded-full" title="En attente de validation">
                                            <Clock size={14} />
                                        </div>
                                    </div>
                                )}

                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (isPending) {
                                                alert("Une modification est déjà en attente pour ce professeur.");
                                                return;
                                            }
                                            navigate(`/app/edit-teacher/${teacher.id}`);
                                        }}
                                        className={`p-1 ${isPending ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-indigo-400'}`}
                                        title="Modifier"
                                    >
                                        <Pencil size={14} />
                                    </button>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteRequest(teacher.id); }}
                                        className="p-1 text-gray-400 hover:text-red-400"
                                        title="Demander la suppression"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                                <div className="flex flex-col items-center mb-2">
                                    <Avatar firstName={teacher.firstName} lastName={teacher.lastName} size="md" />
                                    <h4 className="text-white font-medium text-xs mt-2 text-center line-clamp-1">{teacher.firstName} {teacher.lastName}</h4>
                                </div>
                                <div className="space-y-1 text-xs flex-1">
                                    <p className="text-gray-400 text-[10px] text-center">{teacher.phone}</p>
                                    {teacher.email && <p className="text-gray-500 text-[9px] text-center truncate w-full px-1" title={teacher.email}>{teacher.email}</p>}
                                    <p className="text-indigo-400 text-[10px] text-center">{teacher.contractType}</p>
                                </div>

                                <div className="mt-2 flex justify-center">
                                    <div className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${(teacher.classes || 0) > 0
                                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                        }`}>
                                        {(teacher.classes || 0) === 0 ? 'Aucune classe' : `${teacher.classes} classe${(teacher.classes || 0) > 1 ? 's' : ''}`}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {
                totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-6">
                        <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${currentPage === 1 ? 'bg-white/5 text-gray-500 cursor-not-allowed' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                            <ChevronLeft size={16} /> Précédent
                        </button>
                        <span className="text-white text-sm">Page {currentPage} sur {totalPages}</span>
                        <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${currentPage === totalPages ? 'bg-white/5 text-gray-500 cursor-not-allowed' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                            Suivant <ChevronRight size={16} />
                        </button>
                    </div>
                )
            }

            {/* Modals */}
            <AnimatePresence>
                {selectedTeacher && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                        <div className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-md relative overflow-hidden shadow-2xl">
                            {/* Decorative Background */}
                            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-indigo-600/30 via-purple-600/20 to-transparent z-0" />

                            <button
                                onClick={() => setSelectedTeacher(null)}
                                className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white/70 hover:text-white transition-colors backdrop-blur-sm"
                            >
                                <X size={20} />
                            </button>

                            <div className="relative z-10 pt-12 px-6 pb-8 text-center">
                                <div className="relative inline-block mb-4">
                                    <div className="p-1 bg-[#1e293b] rounded-full">
                                        <Avatar firstName={selectedTeacher.firstName} lastName={selectedTeacher.lastName} size="xl" />
                                    </div>
                                    {/* Status Dot */}
                                    <div
                                        className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-4 border-[#1e293b] ${(selectedTeacher.classes && selectedTeacher.classes > 0)
                                            ? 'bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.5)]'
                                            : 'bg-gray-500'
                                            }`}
                                        title={(selectedTeacher.classes && selectedTeacher.classes > 0) ? "Affecté(e) à une classe" : "Non affecté(e)"}
                                    />
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2">{selectedTeacher.firstName} {selectedTeacher.lastName}</h3>

                                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-sm capitalize">
                                    {(selectedTeacher.title || 'Enseignant').toLowerCase()}
                                </span>
                                {selectedTeacher.specialty && (
                                    <p className="text-gray-400 text-sm mt-2">{selectedTeacher.specialty}</p>
                                )}

                                <div className="mt-8 space-y-3 text-left">
                                    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
                                        <div className="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/30 transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Email</p>
                                            <p className="text-sm text-gray-200 truncate">{selectedTeacher.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
                                        <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/30 transition-colors">
                                            <Phone size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Téléphone</p>
                                            <p className="text-sm text-gray-200">{selectedTeacher.phone}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
                                            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 group-hover:bg-amber-500/30 transition-colors">
                                                <Calendar size={16} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-medium text-gray-400 uppercase">Embauche</p>
                                                <p className="text-sm text-gray-200">{new Date(selectedTeacher.hireDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
                                            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30 transition-colors">
                                                <FileText size={16} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-medium text-gray-400 uppercase">Contrat</p>
                                                <p className="text-sm text-gray-200">{selectedTeacher.contractType}</p>
                                            </div>
                                        </div>
                                        {selectedTeacher.diploma && (
                                            <div className="col-span-2 flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
                                                <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400 group-hover:bg-teal-500/30 transition-colors">
                                                    <GraduationCap size={16} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] font-medium text-gray-400 uppercase">Diplôme</p>
                                                    <p className="text-sm text-gray-200">{selectedTeacher.diploma}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CensorTeachersView;
