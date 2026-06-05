import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { Users, Shield, Lock, LockOpen, Settings, X, GraduationCap, School, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../../shared/api/api';
import { ROLE_LABELS } from '../../../../shared/constants/roles';
import { toastEvents } from '../../../../shared/utils/toast-events';

const SearchableCardHeader = ({
    title,
    icon: Icon,
    onSearch,
    placeholder,
    iconColorClass
}: {
    title: string,
    icon: any,
    onSearch: (val: string) => void,
    placeholder: string,
    iconColorClass: string
}) => {
    const [isSearching, setIsSearching] = useState(false);
    const [value, setValue] = useState('');
    const headerRef = useRef<HTMLDivElement>(null);

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setValue(val);
        onSearch(val);
    };

    const closeSearch = () => {
        setIsSearching(false);
        setValue('');
        onSearch('');
    };

    // Handle click outside to close search
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isSearching && headerRef.current && !headerRef.current.contains(event.target as Node)) {
                closeSearch();
            }
        };

        if (isSearching) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSearching]);

    if (isSearching) {
        return (
            <div ref={headerRef} className="flex items-center gap-2 p-4 bg-[#0f172a] border-b border-white/5 h-[61px]">
                <Search className="text-white/50" size={20} />
                <input
                    autoFocus
                    type="text"
                    value={value}
                    onChange={handleSearch}
                    placeholder={placeholder}
                    className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/30 focus:ring-0"
                />
                <button onClick={closeSearch} className="text-white/50 hover:text-white">
                    <X size={20} />
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between p-4 bg-[#0f172a] border-b border-white/5 h-[61px]">
            <div className="flex items-center gap-3">
                <Icon className={iconColorClass} size={24} />
                <h3 className="text-xl font-semibold text-white">{title}</h3>
            </div>
            <button
                onClick={() => setIsSearching(true)}
                className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
            >
                <Search size={20} />
            </button>
        </div>
    );
};
import ConfirmationModal from '../../../../shared/components/ConfirmationModal';
import EditPermissionsModal from '../../../../shared/components/EditPermissionsModal';
import MemberDetailsModal from './MemberDetailsModal';
import ClassTeachersModal from './ClassTeachersModal';
import TeacherClassesModal from './TeacherClassesModal';

interface Member {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
    lastLogin?: string;
    directorType?: string;
    phone?: string;
    loginMethod?: string;
}

interface PostCount {
    role: string;
    label: string;
    count: number;
}

// Interface for Teachers List
interface TeacherListMember {
    id: number; // Teacher ID (Int)
    userId: string;
    firstName: string;
    lastName: string;
    gender?: string;
    directorType?: string;
    phone: string;
    matricule: string;
    subjects: string[];
    isActive: boolean;
    teachingClassCount: number;
    mainTeacherClassCount: number;
}

// Interface for Classes List
interface ClassItem {
    id: string;
    name: string;
    level: string;
    studentCount: number;
    teacherCount: number; // Counter for teachers assigned
    teachers: any[]; // List of teachers for modal
    mainTeacher?: any;
}

interface AdministrationSectionProps {
    readOnly?: boolean;
}

const AdministrationSection = ({ readOnly = false }: AdministrationSectionProps) => {
    const navigate = useNavigate();

    // State for Admin Team
    const [members, setMembers] = useState<Member[]>([]);

    // State for Teachers and Classes
    const [teachersList, setTeachersList] = useState<TeacherListMember[]>([]);
    const [classesList, setClassesList] = useState<ClassItem[]>([]);

    // Search States
    const [searchPosts, setSearchPosts] = useState('');
    const [searchAdmins, setSearchAdmins] = useState('');
    const [searchClasses, setSearchClasses] = useState('');
    const [searchTeachers, setSearchTeachers] = useState('');

    const [postCounts, setPostCounts] = useState<PostCount[]>([
        { role: 'DIRECTOR', label: 'Directeur', count: 0 },
        { role: 'CENSOR', label: 'Censeur', count: 0 },
        { role: 'SUPERVISOR', label: 'Surveillant', count: 0 },
        { role: 'SECRETARY', label: 'Secrétaire', count: 0 },
        { role: 'ACCOUNTANT', label: 'Comptable', count: 0 },
    ]);

    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [editingPermissionsMember, setEditingPermissionsMember] = useState<Member | null>(null);

    // Modals state
    const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
    const [selectedTeacher, setSelectedTeacher] = useState<TeacherListMember | null>(null);

    const [showResetModal, setShowResetModal] = useState(false);
    const [resetCredentials, setResetCredentials] = useState({ identifier: '', password: '' });
    const [confirmationModal, setConfirmationModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        isDanger?: boolean;
        confirmLabel?: string;
    } | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchMembers();
        fetchClasses();
        fetchTeachers();
    }, []);

    // Click outside to close menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };

        if (openMenuId) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openMenuId]);

    const fetchMembers = async () => {
        try {
            const response = await api.get('/members/list');
            const data = response.data;
            setMembers(data.map((m: any) => ({
                id: m.id,
                firstName: m.firstName,
                lastName: m.lastName,
                email: m.email,
                role: m.role,
                directorType: m.directorType,
                status: m.isActive ? 'active' : 'inactive',
                lastLogin: m.lastLogin,
                phone: m.phone,
                loginMethod: m.loginMethod
            })));

            // Calculate counts
            const counts = postCounts.map(pc => ({
                ...pc,
                count: data.filter((m: any) => m.role === pc.role).length
            }));
            setPostCounts(counts);
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };

    const fetchClasses = async () => {
        try {
            const response = await api.get('/classes');

            // Define exact level order
            const LEVEL_ORDER = [
                'Maternelle I', 'Maternelle II',
                'CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2',
                '6ème', '5ème', '4ème', '3ème',
                '2nde', '1ère', 'Terminale'
            ];

            const sortedData = response.data.sort((a: any, b: any) => {
                // Get indices from level order
                const indexA = LEVEL_ORDER.indexOf(a.level);
                const indexB = LEVEL_ORDER.indexOf(b.level);

                // If both are in the known order, sort by index
                if (indexA !== -1 && indexB !== -1) {
                    if (indexA !== indexB) return indexA - indexB;
                    // If levels are same (e.g. two 6ème classes), sort by full name
                    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
                }

                // If only one is in known order, prioritize known one
                if (indexA !== -1) return -1;
                if (indexB !== -1) return 1;

                // Fallback to name sort
                return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
            });

            // Ensure response structure matches expected
            setClassesList(sortedData.map((c: any) => ({
                ...c,
                teacherCount: c.teacherCount || 0,
                // Ensure teachers list is populated from include if available, or empty
                teachers: c.teachers?.map((t: any) => t.user) || [] // Flatten to user data for modal
            })));
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const fetchTeachers = async () => {
        try {
            const response = await api.get('/teachers');
            setTeachersList(response.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const getTeacherContextLabel = (teacher: TeacherListMember) => {
        const gender = teacher.gender?.toUpperCase() || '';
        const isMale = gender === 'MALE' || gender === 'M' || gender === 'HOMME';
        const isFemale = gender === 'FEMALE' || gender === 'F' || gender === 'FEMME';

        // Check Director Type or School Context if available
        // If specific type is set:
        if (teacher.directorType === 'PRIMARY_PRESCHOOL') {
            if (isMale) return "Maître";
            if (isFemale) return "Maîtresse";
            return "Maître/Maîtresse";
        }

        if (teacher.directorType === 'COLLEGE') {
            if (isMale) return "Enseignant";
            if (isFemale) return "Enseignante";
            return "Enseignant(e)";
        }

        // Fallback checks (maybe based on typical assignments? For now default to Enseignant)
        // If no directorType, maybe they are new. Default to Enseignant for generic.
        if (isMale) return "Enseignant";
        if (isFemale) return "Enseignante";

        return "Enseignant(e)";
    };

    const getFormattedCycle = (name: string) => {
        const n = name.toUpperCase();
        if (n.includes("MATERNELLE")) return "Maternelle";
        if (["CI", "CP", "CE1", "CE2", "CM1", "CM2"].some(s => n.startsWith(s)) || n.includes("PRIMAIRE")) return "Primaire";
        if (["6", "5", "4", "3"].some(d => n.startsWith(d)) || n.includes("COLLEGE") || n.includes("COLLÈGE")) return "Collège Premier Cycle";
        if (["2", "1", "T", "S"].some(d => n.startsWith(d)) || n.includes("LYCEE") || n.includes("LYCÉE") || n.includes("TERMINALE")) return "Collège Second Cycle";
        return "";
    };

    const handlePostClick = (role: string) => {
        if (!readOnly) {
            navigate('/app/create-member', { state: { role } });
        }
    };

    const handleResetPassword = (member: Member) => {
        setConfirmationModal({
            isOpen: true,
            title: 'Réinitialisation du mot de passe',
            message: `Voulez-vous réinitialiser le mot de passe de ${member.firstName} ${member.lastName} ?`,
            confirmLabel: 'Réinitialiser',
            isDanger: false,
            onConfirm: async () => {
                try {
                    const response = await api.post(`/members/${member.id}/reset-password`);
                    const data = response.data;
                    if (data.tempPassword) {
                        setResetCredentials({
                            identifier: member.email,
                            password: data.tempPassword
                        });
                        setShowResetModal(true);
                    }
                } catch (error) {
                    console.error('Error resetting password:', error);
                    toastEvents.error('Erreur lors de la réinitialisation du mot de passe');
                }
            }
        });
    };

    const handleToggleStatus = (member: Member) => {
        const newStatus = member.status === 'active' ? 'inactive' : 'active';
        const action = newStatus === 'inactive' ? 'désactiver' : 'activer';

        setConfirmationModal({
            isOpen: true,
            title: `${action.charAt(0).toUpperCase() + action.slice(1)} le compte`,
            message: `Voulez-vous ${action} le compte de ${member.firstName} ${member.lastName} ?`,
            confirmLabel: newStatus === 'inactive' ? 'Désactiver' : 'Activer',
            isDanger: newStatus === 'inactive',
            onConfirm: async () => {
                try {
                    await api.patch(`/members/${member.id}/toggle-status`);

                    // Update local state
                    setMembers(prev => prev.map(m =>
                        m.id === member.id ? { ...m, status: newStatus } : m
                    ));
                    setOpenMenuId(null);

                    // Success feedback
                    if (newStatus === 'inactive') {
                        toastEvents.success(`Le compte de ${member.firstName} ${member.lastName} a été désactivé avec succès.`);
                    } else {
                        toastEvents.success(`Le compte de ${member.firstName} ${member.lastName} a été réactivé avec succès.`);
                    }

                } catch (error) {
                    console.error('Error updating status:', error);
                    toastEvents.error('Erreur lors de la modification du statut');
                }
            }
        });
    };

    const handleDeleteMember = (member: Member) => {
        setConfirmationModal({
            isOpen: true,
            title: 'Supprimer un membre',
            message: `⚠️ ATTENTION : Voulez-vous supprimer ce membre ?\n\nSes données seront conservées pendant 30 jours avant suppression définitive.\nDurant cette période, seul le support technique pourra restaurer le compte.`,
            confirmLabel: 'Supprimer',
            isDanger: true,
            onConfirm: async () => {
                try {
                    await api.delete(`/members/${member.id}`);
                    fetchMembers();
                    setOpenMenuId(null);
                    toastEvents.success('Membre supprimé avec succès');
                } catch (error) {
                    console.error('Error deleting member:', error);
                    toastEvents.error('Erreur lors de la suppression du membre');
                }
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Administration</h2>
                    <p className="text-slate-400">Vue d'ensemble et gestion du personnel</p>
                </div>
                {!readOnly && (
                    <div className="hidden"></div>
                )}
            </div>

            {/* 4-Block Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 1. Gestion des Postes */}
                {/* 1. Gestion des Postes */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-sm h-[400px] flex flex-col overflow-hidden">
                    <SearchableCardHeader
                        title="Gestion des Postes"
                        icon={Shield}
                        iconColorClass="text-indigo-400"
                        onSearch={setSearchPosts}
                        placeholder="Rechercher un poste..."
                    />
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
                        {postCounts.filter(post =>
                            searchPosts === '' ||
                            post.label.toLowerCase().includes(searchPosts.toLowerCase())
                        ).map((post) => (
                            <div
                                key={post.role}
                                onClick={() => handlePostClick(post.role)}
                                className={`flex justify-between items-center p-3 bg-white/10 rounded-lg transition-colors group ${!readOnly ? 'cursor-pointer hover:bg-white/20' : ''}`}
                            >
                                <span className="text-white group-hover:text-white transition-colors">{post.label}</span>
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-medium">
                                        {post.count}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Équipe Administrative */}
                {/* 2. Équipe Administrative */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-sm h-[400px] flex flex-col overflow-hidden">
                    <SearchableCardHeader
                        title="Équipe Administrative"
                        icon={Users}
                        iconColorClass="text-emerald-400"
                        onSearch={setSearchAdmins}
                        placeholder="Rechercher un membre..."
                    />
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
                        {members.filter(member => {
                            if (!searchAdmins) return true;
                            const query = searchAdmins.toLowerCase();
                            const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
                            const roleLabel = (ROLE_LABELS[member.role as keyof typeof ROLE_LABELS] || member.role).toLowerCase();
                            return fullName.includes(query) || roleLabel.includes(query);
                        }).map((member) => (
                            <div
                                key={member.id}
                                onClick={() => setSelectedMember(member)}
                                className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                                        {`${member.firstName.charAt(0)}${member.lastName.charAt(0)}`.toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{member.firstName} {member.lastName}</p>
                                        <p className="text-xs text-slate-400">
                                            {(() => {
                                                const baseRole = ROLE_LABELS[member.role as keyof typeof ROLE_LABELS] || member.role;
                                                if ((member.role === 'DIRECTOR' || member.role === 'SECRETARY') && member.directorType) {
                                                    let typeLabel = '';
                                                    switch (member.directorType) {
                                                        case 'PRIMARY_PRESCHOOL':
                                                            typeLabel = 'Maternelle - Primaire';
                                                            break;
                                                        case 'COLLEGE':
                                                            typeLabel = 'Collège';
                                                            break;
                                                        case 'BOTH':
                                                            typeLabel = 'Maternelle - Primaire - Collège';
                                                            break;
                                                    }
                                                    if (typeLabel) {
                                                        return `${baseRole} ${typeLabel}`;
                                                    }
                                                }
                                                return baseRole;
                                            })()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Status Dot */}
                                    <span className={`w-2 h-2 rounded-full ${member.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>

                                    {/* Action buttons (only if not readonly) */}
                                    {!readOnly && (
                                        <div className="flex gap-1">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleStatus(member);
                                                }}
                                                className="p-1.5 hover:bg-white/10 rounded transition-colors"
                                            >
                                                {member.status === 'active' ? (
                                                    <LockOpen size={14} className="text-emerald-500" />
                                                ) : (
                                                    <Lock size={14} className="text-red-500" />
                                                )}
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenMenuId(openMenuId === member.id ? null : member.id);
                                                }}
                                                className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors relative"
                                            >
                                                <Settings size={14} />
                                                {openMenuId === member.id && (
                                                    <div ref={menuRef} className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                                                        <div className="py-1">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); setEditingPermissionsMember(member); }}
                                                                className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10"
                                                            >
                                                                Permissions
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); handleResetPassword(member); }}
                                                                className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10"
                                                            >
                                                                Reset Password
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); handleDeleteMember(member); }}
                                                                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10"
                                                            >
                                                                Supprimer
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Gestion des Enseignants (Classes List) */}
                {/* 3. Gestion des Enseignants (Classes List) */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-sm h-[400px] flex flex-col overflow-hidden">
                    <SearchableCardHeader
                        title="Gestion des classes"
                        icon={School}
                        iconColorClass="text-blue-400"
                        onSearch={setSearchClasses}
                        placeholder="Rechercher une classe..."
                    />

                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
                        {classesList.filter(cls =>
                            searchClasses === '' ||
                            cls.name.toLowerCase().includes(searchClasses.toLowerCase())
                        ).map((cls) => (
                            <div
                                key={cls.id}
                                onClick={() => setSelectedClass(cls)}
                                className="flex justify-between items-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold">
                                        {cls.name.substring(0, 2)}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{cls.name}</p>
                                        <p className="text-xs text-white/50">{getFormattedCycle(cls.name)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-white/50">Élèves:</span>
                                    <span className={`px-2 py-0.5 rounded-md text-sm font-bold ${cls.studentCount > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-white/30'}`}>
                                        {cls.studentCount}
                                    </span>
                                    <span className="text-xs text-white/50">Enseignants:</span>
                                    <span className={`px-2 py-0.5 rounded-md text-sm font-bold ${((cls.teacherCount || 0) + (cls.mainTeacher ? 1 : 0)) > 0 ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/5 text-white/30'}`}>
                                        {(cls.teacherCount || 0) + (cls.mainTeacher ? 1 : 0)}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {classesList.length === 0 && (
                            <p className="text-center text-white/30 py-4">Aucune classe créée</p>
                        )}
                    </div>
                </div>

                {/* 4. Corps Enseignant (Teachers List) */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-sm h-[400px] flex flex-col overflow-hidden">
                    <SearchableCardHeader
                        title="Corps Enseignant"
                        icon={GraduationCap}
                        iconColorClass="text-yellow-400"
                        onSearch={setSearchTeachers}
                        placeholder="Rechercher un enseignant..."
                    />

                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
                        {teachersList.filter(teacher => {
                            if (!searchTeachers) return true;
                            const query = searchTeachers.toLowerCase();
                            const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
                            const subjects = teacher.subjects ? teacher.subjects.join(' ').toLowerCase() : '';
                            return fullName.includes(query) || subjects.includes(query);
                        }).map((teacher) => {
                            const assignedCount = (teacher.teachingClassCount || 0) + (teacher.mainTeacherClassCount || 0);
                            return (
                                <div
                                    key={teacher.id}
                                    onClick={() => setSelectedTeacher(teacher)}
                                    className="flex justify-between items-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-xs font-bold text-white">
                                            {`${teacher.firstName.charAt(0)}${teacher.lastName.charAt(0)}`.toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{teacher.firstName} {teacher.lastName}</p>
                                            <div className="flex flex-col">
                                                <p className="text-xs text-indigo-300 font-medium mb-0.5">{getTeacherContextLabel(teacher)}</p>
                                                <p className="text-xs text-slate-400">{teacher.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${assignedCount > 0 ? 'bg-cyan-500' : 'bg-gray-500'}`} title={assignedCount > 0 ? "Classe assignée" : "Aucune classe assignée"}></span>
                                        <span className="text-xs text-white/50">Classes:</span>
                                        <span className={`px-2 py-0.5 rounded-md text-sm font-bold ${assignedCount > 0 ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/5 text-white/30'}`}>
                                            {assignedCount}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        {teachersList.length === 0 && (
                            <p className="text-center text-white/30 py-4">Aucun enseignant</p>
                        )}
                    </div>
                </div>

            </div>

            {/* Modals */}
            {showResetModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl p-8 max-w-md w-full relative">
                        <button
                            onClick={() => setShowResetModal(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X size={20} className="text-white/70" />
                        </button>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lock size={32} className="text-emerald-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Mot de passe réinitialisé !</h2>
                            <p className="text-white/70">Voici les nouveaux identifiants de connexion</p>
                        </div>
                        <div className="space-y-4 mb-6">
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <p className="text-sm text-white/50 mb-1">Identifiant</p>
                                <p className="text-white font-mono font-medium">{resetCredentials.identifier}</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <p className="text-sm text-white/50 mb-1">Nouveau mot de passe temporaire</p>
                                <p className="text-white font-mono font-medium text-lg">{resetCredentials.password}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowResetModal(false)}
                            className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}

            {selectedMember && (
                <MemberDetailsModal
                    member={selectedMember}
                    onClose={() => setSelectedMember(null)}
                    onResetPassword={(m: Member) => { setSelectedMember(null); handleResetPassword(m); }}
                    onToggleStatus={(m: Member) => { handleToggleStatus(m); setSelectedMember(prev => prev ? { ...prev, status: m.status === 'active' ? 'inactive' : 'active' } : null); }}
                    onDelete={(m: Member) => { handleDeleteMember(m); setSelectedMember(null); }}
                    onEditPermissions={(m: Member) => { setSelectedMember(null); setEditingPermissionsMember(m); }}
                    readOnly={readOnly}
                />
            )}

            {editingPermissionsMember && (
                <EditPermissionsModal
                    isOpen={true}
                    onClose={() => setEditingPermissionsMember(null)}
                    member={editingPermissionsMember}
                    onSuccess={() => { fetchMembers(); setEditingPermissionsMember(null); }}
                />
            )}

            {/* New Modals */}
            <ClassTeachersModal
                isOpen={!!selectedClass}
                onClose={() => setSelectedClass(null)}
                classId={selectedClass?.id || ''}
                classNameStr={selectedClass?.name || ''}
                teachers={selectedClass?.teachers || []}
                mainTeacher={selectedClass?.mainTeacher?.user}
            />

            {selectedTeacher && (
                <TeacherClassesModal
                    isOpen={!!selectedTeacher}
                    onClose={() => setSelectedTeacher(null)}
                    teacher={selectedTeacher}
                />
            )}

            {/* Confirmation Modal */}
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

export default AdministrationSection;
