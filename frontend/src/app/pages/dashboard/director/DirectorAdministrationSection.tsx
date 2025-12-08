import { Users, GraduationCap, BookOpen, UserPlus, Plus, Search, Edit2, Trash2, X, Phone, Mail, Calendar, FileText, Filter, ChevronLeft, ChevronRight, ArrowDownAZ, CalendarDays, Inbox, Link2, UserSquare2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Skeleton from '../../../../shared/components/Skeleton';
import { useNavigate, useLocation } from 'react-router-dom';
import Avatar from '../../../../shared/components/Avatar';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../../shared/contexts/AuthContext';
import api from '../../../../shared/api/api';
import ClassDetailsModal from './components/ClassDetailsModal';
import EditClassModal from './components/EditClassModal';
import ConfirmationModal from '../../../../shared/components/ConfirmationModal';
import AddSubjectModal from './components/AddSubjectModal';
import DirectorRequestsView from './components/DirectorRequestsView';
import DirectorAssignmentsView from './components/DirectorAssignmentsView';
import CensorStudentsView from '../censor/components/CensorStudentsView'; // Reusing Student View

interface Teacher {
    id: number;
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
}

interface ClassData {
    id: string;
    name: string;
    cycle: string;
    level: string;
    series?: string;
    room?: string;
    studentCount: number;
    mainTeacher?: {
        user: {
            firstName: string;
            lastName: string;
        }
    };
}

const DirectorAdministrationSection = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const filterRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<'requests' | 'teachers' | 'students' | 'classes' | 'subjects' | 'assignments'>('teachers');

    // Teachers State
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isTeachersLoading, setIsTeachersLoading] = useState(true);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState<'name' | 'date' | 'classes'>('name');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 48;
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Classes State
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [isClassesLoading, setIsClassesLoading] = useState(true);
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const [editingClassId, setEditingClassId] = useState<string | null>(null);
    const [confirmationModal, setConfirmationModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        isDanger?: boolean;
        confirmLabel?: string;
    } | null>(null);

    // Fetch teachers
    // Fetch teachers
    const fetchTeachers = async () => {
        if (!user?.schoolId) return;
        setIsTeachersLoading(true);
        try {
            const response = await api.get('/teachers');
            setTeachers(response.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        } finally {
            setIsTeachersLoading(false);
        }
    };

    // Fetch classes
    // Fetch classes
    const fetchClasses = async () => {
        if (!user?.schoolId) return;
        setIsClassesLoading(true);
        const LEVEL_ORDER = [
            'Maternelle I', 'Maternelle II',
            'CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2',
            '6ème', '5ème', '4ème', '3ème',
            '2nde', '1ère', 'Terminale'
        ];

        try {
            const response = await api.get('/classes');
            const data = response.data.sort((a: any, b: any) => {
                const indexA = LEVEL_ORDER.indexOf(a.level);
                const indexB = LEVEL_ORDER.indexOf(b.level);
                if (indexA !== -1 && indexB !== -1) {
                    if (indexA !== indexB) return indexA - indexB;
                    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
                }
                if (indexA !== -1) return -1;
                if (indexB !== -1) return 1;
                return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
            });
            setClasses(data);
        } catch (error) {
            console.error('Error fetching classes:', error);
        } finally {
            setIsClassesLoading(false);
        }
    };

    const refreshData = async () => {
        await Promise.all([
            fetchTeachers(),
            fetchClasses()
        ]);
    };

    useEffect(() => {
        if (activeTab === 'teachers') fetchTeachers();
        if (activeTab === 'classes') fetchClasses();
        if (activeTab === 'subjects') fetchSubjects();
    }, [activeTab, user?.schoolId]);

    // Handle navigation state
    useEffect(() => {
        if (location.state?.section === 'administration') {
            if (location.state?.view) {
                setActiveTab(location.state.view as any);
            }
            if (location.state?.newTeacher) {
                setTeachers(prev => {
                    if (prev.some(t => t.id === location.state.newTeacher.id)) return prev;
                    return [location.state.newTeacher, ...prev];
                });
            }
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // Close filter menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node) && !searchTerm) {
                setIsSearchExpanded(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDeleteClass = (classId: string) => {
        setConfirmationModal({
            isOpen: true,
            title: 'Supprimer une classe',
            message: 'Êtes-vous sûr de vouloir supprimer cette classe ? Cette action est irréversible (Soft Delete).',
            confirmLabel: 'Supprimer',
            isDanger: true,
            onConfirm: async () => {
                try {
                    await api.delete(`/classes/${classId}`);
                    refreshData();
                } catch (error) {
                    console.error('Error deleting class:', error);
                    alert('Erreur lors de la suppression de la classe');
                }
            }
        });
    };

    const handleDeleteTeacher = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce professeur ?')) return;
        try {
            await api.delete(`/teachers/${id}`);
            fetchTeachers();
        } catch (err) {
            alert('Erreur lors de la suppression');
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

    // Render Tabs Content
    const renderTeachersTab = () => (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 flex items-center gap-3" ref={searchContainerRef}>
                    <div className={`relative flex items-center transition-all duration-300 ease-in-out ${isSearchExpanded ? 'flex-1 max-w-md' : 'w-10'}`}>
                        <button
                            onClick={() => {
                                setIsSearchExpanded(true);
                                // Focus input after expansion
                                setTimeout(() => document.querySelector<HTMLInputElement>('input[placeholder="Rechercher un professeur..."]')?.focus(), 100);
                            }}
                            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${isSearchExpanded ? 'text-gray-400 pointer-events-none' : 'text-white bg-white/10 hover:bg-white/20'}`}
                        >
                            <Search size={18} />
                        </button>

                        <input
                            type="text"
                            placeholder="Rechercher un professeur..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onBlur={() => {
                                if (!searchTerm && !isFilterOpen) {
                                    setIsSearchExpanded(false);
                                }
                            }}
                            className={`w-full py-2 bg-white/10 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 transition-all pl-10 pr-4 ${isSearchExpanded ? 'opacity-100 visible' : 'opacity-0 invisible w-0 p-0 border-0'}`}
                        />
                    </div>
                    <div className="relative" ref={filterRef}>
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors border ${isFilterOpen ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/10 border-white/10 text-gray-300 hover:bg-white/20'}`}
                        >
                            <Filter size={18} />
                            <span className="hidden md:inline">Filtrer</span>
                        </button>
                        {isFilterOpen && (
                            <div className="absolute right-0 top-full mt-2 w-64 bg-[#1a1f37] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden">
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
                            </div>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => navigate('/app/add-teacher')}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20 whitespace-nowrap"
                >
                    <UserPlus size={18} />
                    Nouveau Professeur
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {isTeachersLoading ? (
                    Array.from({ length: 12 }).map((_, i) => (
                        <Skeleton key={i} className="h-48 w-full bg-white/5" />
                    ))
                ) : (
                    currentTeachers.map((teacher) => (
                        <div
                            key={teacher.id}
                            onClick={() => setSelectedTeacher(teacher)}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all cursor-pointer group hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/10 flex flex-col relative"
                        >
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteTeacher(String(teacher.id)); }} className="p-1 text-gray-400 hover:text-red-400">
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
                        </div>
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                    <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${currentPage === 1 ? 'bg-white/5 text-gray-500 cursor-not-allowed' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                        <ChevronLeft size={16} /> Précédent
                    </button>
                    <span className="text-white text-sm">Page {currentPage} sur {totalPages}</span>
                    <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${currentPage === totalPages ? 'bg-white/5 text-gray-500 cursor-not-allowed' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                        Suivant <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );

    const renderClassesTab = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Gestion des Classes</h3>
                {(
                    user?.directorType === 'PRIMARY_PRESCHOOL' ||
                    (user?.directorType === 'COLLEGE' && user?.permissions?.includes('CREATE_CLASS')) ||
                    (user?.directorType === 'BOTH' && user?.permissions?.includes('CREATE_CLASS'))
                ) && (
                        <button
                            onClick={() => navigate('/app/create-class')}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                        >
                            <Plus size={18} />
                            Créer une Classe
                        </button>
                    )}
            </div>

            {isClassesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full bg-white/5" />
                    ))}
                </div>
            ) : classes.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/10">
                    <GraduationCap size={48} className="mx-auto text-gray-500 mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Aucune classe créée</h3>
                    <p className="text-gray-400 mb-6">Commencez par créer votre première classe</p>
                    <button
                        onClick={() => navigate('/app/create-class')}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    >
                        Créer une classe
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {classes.map((cls) => (
                        <div
                            key={cls.id}
                            onClick={() => setSelectedClassId(cls.id)}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="text-white font-bold text-lg group-hover:text-indigo-400 transition-colors">{cls.name}</h4>
                                    <p className="text-sm text-gray-400">{cls.cycle}</p>
                                </div>
                                <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full">
                                    {cls.studentCount} élèves
                                </span>
                            </div>
                            <div className="space-y-2 mb-3">
                                <div className="text-sm">
                                    <span className="text-gray-400">Main User: </span>
                                    <span className="text-white">
                                        {cls.mainTeacher
                                            ? `${cls.mainTeacher.user.firstName} ${cls.mainTeacher.user.lastName}`
                                            : <span className="text-gray-500 italic">Non assigné</span>
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                                <button
                                    onClick={() => setEditingClassId(cls.id)}
                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <Edit2 size={12} />
                                    Modifier
                                </button>
                                <button
                                    onClick={() => handleDeleteClass(cls.id)}
                                    className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const [subjects, setSubjects] = useState<{ id: string, name: string, coefficient: number, cycle: string }[]>([]);
    const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);

    const fetchSubjects = async () => {
        if (!user?.schoolId) return;
        try {
            const response = await api.get('/subjects');
            setSubjects(response.data);
        } catch (error) {
            // Error handling
        }
    };

    const handleDeleteSubject = (id: string) => {
        if (!confirm('Supprimer cette matière ?')) return;
        api.delete(`/subjects/${id}`).then(fetchSubjects).catch(() => alert("Erreur"));
    };

    const renderSubjectsTab = () => {
        const canManage = !(user?.role === 'DIRECTOR' && ['COLLEGE', 'LYCEE'].includes(user?.directorType || ''));

        // Filter subjects based on Director Type
        const filteredSubjects = subjects.filter(s => {
            const type = user?.directorType;

            if (type === 'COLLEGE') {
                return ['COLLEGE', 'LYCEE', 'LYCEE_TECHNIQUE', 'COLLEGE_LYCEE'].includes(s.cycle);
            }
            if (type === 'LYCEE') {
                return ['LYCEE', 'LYCEE_TECHNIQUE', 'COLLEGE_LYCEE'].includes(s.cycle);
            }
            if (type === 'PRIMARY_PRESCHOOL') {
                return ['PRIMAIRE', 'MATERNELLE'].includes(s.cycle);
            }

            // If type is BOTH or unknown, potentially show all or refine further. 
            // Assuming BOTH means full secondary access:
            if (type === 'BOTH') {
                return ['COLLEGE', 'LYCEE', 'LYCEE_TECHNIQUE', 'COLLEGE_LYCEE'].includes(s.cycle);
            }

            return true; // Admin/Founder see all
        });

        return (
            <div className="space-y-6">
                <div className="flex justify-end items-center">
                    {/* Removed redundant Title 'Gestion des Matières' */}
                    {canManage && (
                        <button
                            onClick={() => setIsAddSubjectModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                        >
                            <Plus size={18} />
                            Ajouter
                        </button>
                    )}
                </div>
                {!canManage && (
                    <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg mb-4 flex items-center gap-3">
                        <BookOpen className="text-blue-400" size={20} />
                        <p className="text-blue-300 text-sm">
                            En tant que Directeur du Secondaire, vous pouvez consulter et modifier les coefficients.
                            La création et la suppression sont déléguées au Censeur.
                        </p>
                    </div>
                )}
                {filteredSubjects.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">Aucune matière trouvée pour votre cycle.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {filteredSubjects.map(s => (
                            <div key={s.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center group">
                                <div>
                                    <h4 className="text-white font-medium">{s.name}</h4>
                                    <div className="flex gap-2 items-center mt-1">
                                        <p className="text-gray-400 text-xs bg-white/5 px-2 py-0.5 rounded">Coef: {s.coefficient}</p>
                                        <p className="text-gray-500 text-[10px] uppercase border border-white/10 px-1 rounded">{s.cycle.replace('_', ' ')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="text-gray-500 hover:text-indigo-400" title="Modifier le coefficient">
                                        <Edit2 size={16} />
                                    </button>
                                    {canManage && (
                                        <button onClick={() => handleDeleteSubject(s.id)} className="text-gray-500 hover:text-red-400">
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {isAddSubjectModalOpen && (
                    <AddSubjectModal
                        onClose={() => setIsAddSubjectModalOpen(false)}
                        onSuccess={fetchSubjects}
                    />
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Administration Scolaire</h2>
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/10 custom-scrollbar">
                {[
                    { id: 'teachers', label: 'Corps Enseignant', icon: UserSquare2 },
                    { id: 'students', label: 'Gestion des Élèves', icon: Users },
                    { id: 'classes', label: 'Gestion des Classes', icon: GraduationCap },
                    { id: 'subjects', label: 'Gestion des Matières', icon: BookOpen },
                    { id: 'assignments', label: 'Affectations', icon: Link2 },
                    { id: 'requests', label: 'Requêtes', icon: Inbox },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-t-lg transition-colors whitespace-nowrap min-w-max ${activeTab === tab.id
                            ? 'bg-indigo-600 text-white border-b-2 border-indigo-400'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="py-4">
                {activeTab === 'requests' && <DirectorRequestsView />}
                {activeTab === 'teachers' && renderTeachersTab()}
                {activeTab === 'students' && <CensorStudentsView />}
                {activeTab === 'classes' && renderClassesTab()}
                {activeTab === 'subjects' && renderSubjectsTab()}
                {activeTab === 'assignments' && <DirectorAssignmentsView />}
            </div>

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
                                        className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-4 border-[#1e293b] ${(selectedTeacher.classes && selectedTeacher.classes > 0) || (selectedTeacher.subjects && selectedTeacher.subjects.length > 0)
                                            ? 'bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.5)]'
                                            : 'bg-gray-500'
                                            }`}
                                        title={(selectedTeacher.classes && selectedTeacher.classes > 0) ? "Affecté(e)" : "Non affecté(e)"}
                                    />
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2">{selectedTeacher.firstName} {selectedTeacher.lastName}</h3>

                                {/* Role Badge */}
                                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 uppercase tracking-wider shadow-sm">
                                    {(selectedTeacher.subjects && selectedTeacher.subjects.length > 0)
                                        ? 'Professeur'
                                        : (selectedTeacher.gender === 'FEMME' ? 'Maîtresse' : 'Maître')
                                    }
                                </span>

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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {selectedClassId && (
                <ClassDetailsModal
                    classId={selectedClassId}
                    onClose={() => setSelectedClassId(null)}
                />
            )}

            {editingClassId && (
                <EditClassModal
                    classId={editingClassId}
                    onClose={() => setEditingClassId(null)}
                    onUpdate={refreshData}
                />
            )}

            {confirmationModal && (
                <ConfirmationModal
                    isOpen={confirmationModal.isOpen}
                    onClose={() => setConfirmationModal(null)}
                    onConfirm={confirmationModal.onConfirm}
                    title={confirmationModal.title}
                    message={confirmationModal.message}
                    confirmLabel={confirmationModal.confirmLabel}
                    isDanger={confirmationModal.isDanger}
                />
            )}
        </div>
    );
};

export default DirectorAdministrationSection;
