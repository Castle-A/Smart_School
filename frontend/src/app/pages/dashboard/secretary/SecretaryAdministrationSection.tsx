import { useState, useEffect } from 'react';
import {
    Users,
    FileText,
    Printer,
    UserPlus,
    Search,
    Download,
    Filter,
    CheckCircle,
    ClipboardList,
    GraduationCap
} from 'lucide-react';
import { useAuth } from '../../../../shared/contexts/AuthContext';
import api from '../../../../shared/api/api';
import StudentEnrollmentForm from './components/StudentEnrollmentForm';
import StudentReEnrollmentModal from './components/StudentReEnrollmentModal';
import PendingRegistrationsList from './components/PendingRegistrationsList';
import StudentDepartureModal from './components/StudentDepartureModal';

const SecretaryAdministrationSection = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'registration' | 'students' | 'documents' | 'teachers'>('registration');

    const renderContent = () => {
        switch (activeTab) {
            case 'registration':
                return <RegistrationTab scope={user?.directorType} />;
            case 'students':
                return <StudentsTab />;
            case 'documents':
                return <DocumentsTab scope={user?.directorType} />;
            case 'teachers':
                return <TeachersTab />;
            default:
                return <RegistrationTab scope={user?.directorType} />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Administration</h2>
                    <p className="text-gray-400">
                        Gestion Administrative • <span className="text-indigo-400 font-medium">
                            {user?.directorType === 'PRIMARY_PRESCHOOL' ? 'Primaire & Maternelle' :
                                user?.directorType === 'COLLEGE' ? 'Collège & Lycée' : 'Tout Établissement'}
                        </span>
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/10 scrollbar-hide">
                {[
                    { id: 'registration', label: 'Inscriptions', icon: UserPlus },
                    { id: 'students', label: 'Dossiers Élèves', icon: Users },
                    { id: 'documents', label: 'Documents', icon: Printer },
                    { id: 'teachers', label: 'Corps Enseignant', icon: GraduationCap },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-indigo-600 text-white border-b-2 border-indigo-400'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {renderContent()}
        </div>
    );
};

// --- Sub-Components ---

const RegistrationTab = ({ scope }: { scope?: string }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReEnrollOpen, setIsReEnrollOpen] = useState(false);
    const [classes, setClasses] = useState<any[]>([]);
    const [loadingClasses, setLoadingClasses] = useState(false);

    // Logic to determine available cycles based on scope
    const isPrimary = scope === 'PRIMARY_PRESCHOOL' || !scope;
    const isCollege = scope === 'COLLEGE' || !scope;

    useEffect(() => {
        const fetchClasses = async () => {
            setLoadingClasses(true);
            try {
                const res = await api.get('/classes');
                if (Array.isArray(res.data)) {
                    setClasses(processClasses(res.data));
                }
            } catch (error) {
                console.error("Failed to fetch classes", error);
            } finally {
                setLoadingClasses(false);
            }
        };
        fetchClasses();
    }, [scope]); // Re-fetch or re-process if scope changes (though scope is usually static per user session)

    const processClasses = (data: any[]) => {
        // 1. Sort Order Definition
        const LEVEL_ORDER: { [key: string]: number } = {
            'MATERNELLE_PS': 1, 'PS': 1, 'Petite Section': 1,
            'MATERNELLE_MS': 2, 'MS': 2, 'Moyenne Section': 2,
            'MATERNELLE_GS': 3, 'GS': 3, 'Grande Section': 3,
            'CI': 10,
            'CP': 11,
            'CE1': 12,
            'CE2': 13,
            'CM1': 14,
            'CM2': 15,
            '6eme': 20, '6ème': 20,
            '5eme': 21, '5ème': 21,
            '4eme': 22, '4ème': 22,
            '3eme': 23, '3ème': 23,
            '2nde': 30, 'Seconde': 30,
            '1ere': 31, 'Première': 31,
            'Tle': 32, 'Terminale': 32
        };

        // 2. Filter by Scope
        // Scope 'PRIMARY_PRESCHOOL' -> levels < 20
        // Scope 'COLLEGE' -> levels >= 20
        // Else -> Show all
        let filtered = data.filter(cls => {
            const levelRank = LEVEL_ORDER[cls.level] || LEVEL_ORDER[cls.name] || 999;
            if (scope === 'PRIMARY_PRESCHOOL') return levelRank < 20;
            if (scope === 'COLLEGE') return levelRank >= 20;
            return true;
        });

        // 3. Sort
        return filtered.sort((a, b) => {
            const rankA = LEVEL_ORDER[a.level] || LEVEL_ORDER[a.name] || 999;
            const rankB = LEVEL_ORDER[b.level] || LEVEL_ORDER[b.name] || 999;
            return rankA - rankB;
        });
    };

    return (
        <div className="space-y-6">
            <StudentEnrollmentForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                scope={scope}
            />
            <StudentReEnrollmentModal
                isOpen={isReEnrollOpen}
                onClose={() => setIsReEnrollOpen(false)}
                scope={scope}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Actions & Stats */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gradient-to-r from-indigo-900/40 to-slate-900/40 border border-indigo-500/20 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Nouvelle Inscription</h3>
                        <div className="flex flex-wrap gap-3">
                            {isPrimary && (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center gap-3 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
                                >
                                    <UserPlus size={20} />
                                    Maternelle / Primaire
                                </button>
                            )}
                            {isCollege && (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center gap-3 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
                                >
                                    <UserPlus size={20} />
                                    Collège / Lycée
                                </button>
                            )}

                            <button
                                onClick={() => setIsReEnrollOpen(true)}
                                className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-emerald-600 border border-white/10 hover:border-emerald-500 text-white rounded-lg transition-all font-medium group"
                            >
                                <Users size={20} className="text-emerald-400 group-hover:text-white" />
                                Réinscription (Anciens)
                            </button>
                        </div>
                        <p className="text-sm text-gray-400 mt-4">
                            L'inscription crée un dossier "En attente". La validation du Directeur sera requise.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-white">Dossiers en cours de traitement</h3>
                            <button className="text-xs text-indigo-400 hover:text-white transition-colors">Tout voir</button>
                        </div>

                        <PendingRegistrationsList />
                    </div>
                </div>

                {/* Stats Latérales */}
                <div className="space-y-4">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="text-blue-400" size={20} />
                            <h4 className="text-white font-medium">Capacité Classes</h4>
                        </div>

                        <div className="space-y-3 mt-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                            {loadingClasses ? (
                                <p className="text-center text-sm text-gray-500">Chargement...</p>
                            ) : classes.length === 0 ? (
                                <p className="text-center text-sm text-gray-500">Aucune classe trouvée.</p>
                            ) : (
                                classes.map((cls: any) => {
                                    const count = cls.students?.length || cls._count?.students || 0;
                                    const capacity = cls.capacity || 0;
                                    const percentage = capacity > 0 ? (count / capacity) * 100 : 0;

                                    // Color logic: < 80% Green, < 95% Orange, >= 95% Red
                                    let progressColor = 'bg-emerald-500';
                                    if (percentage >= 95) progressColor = 'bg-red-500';
                                    else if (percentage >= 80) progressColor = 'bg-amber-500';

                                    return (
                                        <div key={cls.id}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-400">{cls.name}</span>
                                                <span className="text-white">{count} / {capacity}</span>
                                            </div>
                                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className={`${progressColor} h-full transition-all duration-500`}
                                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StudentsTab = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Departure Modal State
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [isDepartureModalOpen, setIsDepartureModalOpen] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/students');
            setStudents(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDepartureClick = (student: any) => {
        setSelectedStudent(student);
        setIsDepartureModalOpen(true);
    };

    const filteredStudents = students.filter(student =>
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.matricule.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            {selectedStudent && (
                <StudentDepartureModal
                    isOpen={isDepartureModalOpen}
                    onClose={() => setIsDepartureModalOpen(false)}
                    student={selectedStudent}
                    onSuccess={fetchStudents}
                />
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-semibold text-white">Base Élèves Validée ({filteredStudents.length})</h3>
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Rechercher (Nom, Mlle)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full sm:w-64 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>
                    <button
                        onClick={fetchStudents}
                        className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                        title="Actualiser"
                    >
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Student Table */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-[#1e293b] text-gray-200 uppercase font-medium">
                        <tr>
                            <th className="p-4">Matricule</th>
                            <th className="p-4">Nom & Prénoms</th>
                            <th className="p-4">Classe</th>
                            <th className="p-4">Genre</th>
                            <th className="p-4">Statut</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">Chargement des dossiers...</td>
                            </tr>
                        ) : filteredStudents.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">Aucun élève trouvé.</td>
                            </tr>
                        ) : (
                            filteredStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-mono text-indigo-300">{student.matricule}</td>
                                    <td className="p-4 text-white font-medium">{student.lastName} {student.firstName}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                                            {student.class?.name || 'Sans classe'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {student.gender === 'HOMME' ? 'M' : student.gender === 'FEMME' ? 'F' : student.gender}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${student.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' :
                                            student.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400' :
                                                'bg-red-500/10 text-red-500'
                                            }`}>
                                            {student.status === 'ACTIVE' ? 'Actif' : student.status === 'PENDING' ? 'En attente' : 'Inactif'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <button className="text-indigo-400 hover:text-indigo-300 font-medium text-xs">
                                            VOIR DOSSIER
                                        </button>
                                        {student.status === 'ACTIVE' && (
                                            <button
                                                onClick={() => handleDepartureClick(student)}
                                                className="text-red-400 hover:text-red-300 font-medium text-xs border border-red-500/30 px-2 py-1 rounded hover:bg-red-500/10"
                                            >
                                                SORTIE
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const DocumentsTab = ({ scope }: { scope?: string }) => {
    const isPrimary = scope === 'PRIMARY_PRESCHOOL';
    const isCollege = scope === 'COLLEGE';

    const documents = [
        { title: "Certificat de Scolarité", desc: "Standard pour tous les élèves", icon: FileText, color: "text-blue-400" },
        { title: "Attestation de Fréquentation", desc: "Pour les dossiers CAF/Allocations", icon: CheckCircle, color: "text-emerald-400" },
        { title: "Badge Scolaire", desc: "Format Carte ID (Recto/Verso)", icon: UserPlus, color: "text-purple-400" },
    ];

    if (isPrimary || !scope) {
        documents.push({ title: "Livret de Compétences", desc: "Format Maternelle/Primaire", icon: ClipboardList, color: "text-amber-400" });
    }
    if (isCollege || !scope) {
        documents.push({ title: "Relevé de Notes", desc: "Extrait de notes trimestriel", icon: FileText, color: "text-indigo-400" });
    }

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Centre d'Impression Rapide</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc, idx) => (
                    <div key={idx} className="bg-white/5 p-5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-16 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none group-hover:bg-white/10 transition-colors"></div>

                        <div className="flex justify-between items-start mb-3 relative z-10">
                            <div className={`p-2 rounded-lg bg-white/5 ${doc.color}`}>
                                <doc.icon size={24} />
                            </div>
                            <Download size={20} className="text-gray-600 group-hover:text-white transition-colors" />
                        </div>
                        <h4 className="text-white font-medium relative z-10">{doc.title}</h4>
                        <p className="text-sm text-gray-500 relative z-10 mt-1">{doc.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TeachersTab = () => {
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/teachers');
            setTeachers(response.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTeachers = teachers.filter(t => {
        const fullName = `${t.firstName} ${t.lastName}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Corps Enseignant <span className="text-sm font-normal text-gray-400 ml-2">(Lecture Seule)</span></h3>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Rechercher (Nom)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-[#1e293b] text-gray-200 uppercase font-medium">
                        <tr>
                            <th className="p-4">Identité</th>
                            <th className="p-4">Matricule</th>
                            <th className="p-4">Affectation</th>
                            <th className="p-4">Contact</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan={4} className="p-6 text-center">Chargement...</td></tr>
                        ) : filteredTeachers.length === 0 ? (
                            <tr><td colSpan={4} className="p-6 text-center">Aucun enseignant trouvé.</td></tr>
                        ) : (
                            filteredTeachers.map((teacher: any) => (
                                <tr key={teacher.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30">
                                            {teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{teacher.firstName} {teacher.lastName}</p>
                                            <p className="text-xs text-gray-500">{teacher.gender === 'HOMME' ? 'M' : 'F'}</p>
                                        </div>
                                    </td>
                                    <td className="p-4 font-mono text-indigo-300">
                                        {teacher.matricule || '---'}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1">
                                            {teacher.mainClass ? (
                                                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-xs border border-indigo-500/30 w-fit">
                                                    PP {teacher.mainClass}
                                                </span>
                                            ) : (
                                                <span className="text-gray-600 text-xs italic">Pas de classe principale</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-white">{teacher.phone}</p>
                                        <p className="text-xs">{teacher.email}</p>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SecretaryAdministrationSection;
