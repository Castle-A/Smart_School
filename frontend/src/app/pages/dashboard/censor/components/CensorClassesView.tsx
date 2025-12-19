import { useState, useEffect } from 'react';
import { Plus, School, Check, X, AlertCircle, Edit2, Trash2, ShieldAlert } from 'lucide-react';
import SearchFilterBar from '../../../../../shared/components/SearchFilterBar';
import api from '../../../../../shared/api/api';
import { useAuth } from '../../../../../shared/contexts/AuthContext';
import { adminRequestService } from '../../../../../shared/api/admin-requests.service';
// Import EditClassModal - we can reuse the Director's component
import EditClassModal from '../../director/components/EditClassModal';

interface ClassData {
    id: string;
    name: string;
    cycle: string;
    level?: string;
    series?: string;
    studentCount?: number;
    room?: string;
    mainTeacherId?: string;
    mainTeacher?: {
        firstName: string;
        lastName: string;
    };
}

interface Teacher {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    matricule: string;
    role: string;
}

interface CensorClassesViewProps {
    classes: ClassData[];
    onRefresh: () => void;
}

// Censor is restricted to "College" which user defined as 6eme to Terminale.
// This matches Premier Cycle and Second Cycle.
const RESTRICTED_CYCLES = [
    { value: 'PREMIER_CYCLE', label: 'Premier Cycle (Collège)' },
    { value: 'SECOND_CYCLE', label: 'Second Cycle (Lycée)' },
];

const LEVELS: Record<string, string[]> = {
    PREMIER_CYCLE: ['6ème', '5ème', '4ème', '3ème'],
    SECOND_CYCLE: ['2nde', '1ère', 'Tle'],
};

const SERIES: Record<string, string[]> = {
    PREMIER_CYCLE: ['A', 'B', 'C', 'D'],
    SECOND_CYCLE: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'Ti'], // Standard series
};

const CensorClassesView = ({ classes, onRefresh }: CensorClassesViewProps) => {
    const { } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Edit & Delete States
    const [editClassId, setEditClassId] = useState<string | null>(null);
    const [classToDelete, setClassToDelete] = useState<ClassData | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [pendingDeletionIds, setPendingDeletionIds] = useState<Set<string>>(new Set());

    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form states
    // Defaulting to PREMIER_CYCLE as it's the start of their scope
    const [formData, setFormData] = useState({
        cycle: 'PREMIER_CYCLE',
        level: '',
        series: '',
        room: '',
        mainTeacherId: '',
    });

    useEffect(() => {
        if (isAddModalOpen) {
            fetchTeachers();
        }
    }, [isAddModalOpen]);

    useEffect(() => {
        fetchPendingDeletions();
    }, []);

    const fetchPendingDeletions = async () => {
        try {
            const res = await adminRequestService.getMyRequests(false); // Active requests
            const pendingIds = new Set<string>();
            res.data.forEach(req => {
                if (req.type === 'DELETE_CLASS' && req.status === 'PENDING') {
                    const data = typeof req.data === 'string' ? JSON.parse(req.data) : req.data;
                    if (data.classId) {
                        pendingIds.add(data.classId);
                    }
                }
            });
            setPendingDeletionIds(pendingIds);
        } catch (err) {
            console.error('Error fetching pending deletions:', err);
        }
    };

    const fetchTeachers = async () => {
        try {
            const response = await api.get('/teachers');
            setTeachers(response.data);
        } catch (err) {
            console.error('Error fetching teachers:', err);
        }
    };

    const handleOpenAddModal = () => {
        setFormData({
            cycle: 'PREMIER_CYCLE',
            level: '',
            series: '',
            room: '',
            mainTeacherId: ''
        });
        setIsAddModalOpen(true);
        setError(null);
    };

    const handleRequestDelete = async () => {
        if (!classToDelete) return;
        setDeleteLoading(true);
        try {
            // Create Admin Request for Director to verify
            await adminRequestService.create('DELETE_CLASS', {
                classId: classToDelete.id,
                name: classToDelete.name
            });
            setDeleteSuccess(true);
            // Refresh pending list
            fetchPendingDeletions();
            setTimeout(() => {
                setClassToDelete(null);
                setDeleteSuccess(false);
            }, 2000);
        } catch (err) {
            console.error('Error requesting delete:', err);
            // Could show error toast
            alert("Erreur lors de l'envoi de la demande");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Construct class name: e.g. "6ème A" or just "6ème" if no series? 
            // User requested "Nom de la classe, cycle, serie...". 
            // Usually the Name is auto-generated or manually input?
            // "le modale de creation de classe... (nom de la classe cycle, serie...)"
            // implies "Name" is an input field OR "Name" is composite.
            // In CreateClassPage, logic is often composite.
            // Let's look at what the user said: "nom de la classe cycle, serie, salle et professeur principale".
            // It lists "Nom de la classe" as a field.
            // BUT usually "Nom" is e.g. "6eme A". 
            // If I provide separate fields for Level and Series, I should probably auto-generate the name to ensure consistency, OR allow manual override.
            // Let's auto-generate name from Level + Series to be safe and consistent with "SmartSchool" logic, but user listed "Nom" as a field.
            // Actually, if I allow manual Name, they might type "6eme Z".
            // Let's try to follow the "Director's" modal. I haven't seen the Director's *modal* code (it uses a Page). 
            // CreateClassPage.tsx uses: name (generated), cycle, level, series.
            // I will generate the name: `${level} ${series || ''}`.trim()

            const generatedName = `${formData.level} ${formData.series || ''}`.trim();

            const payload = {
                name: generatedName,
                cycle: formData.cycle,
                level: formData.level,
                series: formData.series,
                room: formData.room,
                mainTeacherId: formData.mainTeacherId ? parseInt(formData.mainTeacherId) : undefined
            };

            await api.post('/classes', payload);
            onRefresh();
            setIsAddModalOpen(false);
        } catch (err) {
            console.error(err);
            setError('Erreur lors de la création de la classe. Vérifiez les champs.');
        } finally {
            setLoading(false);
        }
    };

    const [filterCycle, setFilterCycle] = useState('ALL');
    const [filterLevel, setFilterLevel] = useState('ALL');
    const [showFilter, setShowFilter] = useState(false);

    const filteredClasses = classes.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.mainTeacher && `${c.mainTeacher.firstName} ${c.mainTeacher.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCycle = filterCycle === 'ALL' || c.cycle === filterCycle;
        // Level matching might be tricky if backend doesn't return 'level' in ClassData explicitly, 
        // but looking at interface ClassData, it has optional 'level'. Assuming it's populated.
        // If not, we might need to infer from name, but interface says it has `level`.
        const matchesLevel = filterLevel === 'ALL' || c.level === filterLevel;

        return matchesSearch && matchesCycle && matchesLevel;
    });

    const uniqueLevels = Array.from(new Set(classes.map(c => c.level).filter(Boolean)));

    return (
        <div className="space-y-6">
            <SearchFilterBar
                onSearch={setSearchTerm}
                placeholder="Rechercher..."
                isFilterEnabled={true}
                isFilterOpen={showFilter}
                onFilterClick={() => setShowFilter(!showFilter)}
                filterContent={
                    <div className="p-4 space-y-4 w-64">
                        <div>
                            <label className="text-xs font-medium text-gray-400 block mb-1.5 uppercase tracking-wider">Cycle</label>
                            <select
                                value={filterCycle}
                                onChange={(e) => {
                                    setFilterCycle(e.target.value);
                                    setFilterLevel('ALL'); // Reset level when cycle changes
                                }}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none"
                            >
                                <option value="ALL">Tous les cycles</option>
                                <option value="PREMIER_CYCLE">Collège</option>
                                <option value="SECOND_CYCLE">Lycée</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-400 block mb-1.5 uppercase tracking-wider">Niveau</label>
                            <select
                                value={filterLevel}
                                onChange={(e) => setFilterLevel(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none"
                            >
                                <option value="ALL">Tous les niveaux</option>
                                {uniqueLevels.map(l => (
                                    <option key={l} value={String(l)}>{l}</option>
                                ))}
                            </select>
                        </div>

                        <div className="pt-2 border-t border-white/5 flex justify-end">
                            <button
                                onClick={() => {
                                    setFilterCycle('ALL');
                                    setFilterLevel('ALL');
                                    setShowFilter(false);
                                }}
                                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                Réinitialiser
                            </button>
                        </div>
                    </div>
                }
                actions={
                    <button
                        onClick={handleOpenAddModal}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        <Plus size={18} />
                        <span className="hidden md:inline">Nouvelle Classe</span>
                    </button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredClasses.map((cls) => (
                    <div key={cls.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors group relative">
                        <div className="absolute top-14 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setEditClassId(cls.id);
                                }}
                                className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500 hover:text-white transition-colors"
                                title="Modifier la classe"
                            >
                                <Edit2 size={16} />
                            </button>
                            {pendingDeletionIds.has(cls.id) ? (
                                <div className="p-1.5 bg-yellow-500/20 text-yellow-500 rounded-lg cursor-not-allowed" title="Suppression en attente">
                                    <ShieldAlert size={16} />
                                </div>
                            ) : (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setClassToDelete(cls);
                                    }}
                                    className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                    title="Demander la suppression"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                        <div className="flex justify-between items-start mb-3">
                            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                <School size={20} />
                            </div>
                            <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400 border border-white/10">
                                {cls.cycle === 'PREMIER_CYCLE' ? 'Collège' : cls.cycle === 'SECOND_CYCLE' ? 'Lycée' : cls.cycle}
                            </span>
                        </div>

                        <h4 className="text-lg font-bold text-white mb-1">{cls.name}</h4>
                        <div className="space-y-1 text-sm text-gray-400">
                            <p>{cls.studentCount || 0} Élèves</p>
                            {cls.room && <p>Salle: {cls.room}</p>}
                            {cls.mainTeacher && (
                                <p className="text-indigo-300">PP: {cls.mainTeacher.firstName} {cls.mainTeacher.lastName}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* CREATE CLASS MODAL */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-lg relative shadow-2xl">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Nouvelle Classe</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Cycle</label>
                                    <select
                                        value={formData.cycle}
                                        onChange={(e) => setFormData({ ...formData, cycle: e.target.value, level: '', series: '' })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                                    >
                                        {RESTRICTED_CYCLES.map(c => (
                                            <option key={c.value} value={c.value}>{c.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Niveau</label>
                                    <select
                                        value={formData.level}
                                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                                        required
                                    >
                                        <option value="">Sélectionner</option>
                                        {LEVELS[formData.cycle]?.map(l => (
                                            <option key={l} value={l}>{l}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Série (Optionnel)</label>
                                    <select
                                        value={formData.series}
                                        onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                                    >
                                        <option value="">Aucune</option>
                                        {SERIES[formData.cycle]?.map(s => (
                                            <option key={s} value={s}>
                                                {formData.cycle === 'SECOND_CYCLE' ? `Série ${s}` : s}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Salle (Optionnel)</label>
                                    <input
                                        type="text"
                                        value={formData.room}
                                        onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                                        placeholder="Ex: Bat A, Salle 2"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Professeur Principal (Optionnel)</label>
                                <select
                                    value={formData.mainTeacherId}
                                    onChange={(e) => setFormData({ ...formData, mainTeacherId: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                                >
                                    <option value="">-- Choisir un professeur --</option>
                                    {teachers.map(t => (
                                        <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {loading ? 'Création...' : (
                                        <>
                                            <Check size={16} /> Créer la classe
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {editClassId && (
                <EditClassModal
                    classId={editClassId}
                    onClose={() => setEditClassId(null)}
                    onUpdate={onRefresh}
                />
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {classToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        {deleteSuccess ? (
                            <div className="text-center py-6">
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check size={32} className="text-green-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Demande envoyée</h3>
                                <p className="text-gray-400">Le Directeur a reçu votre demande de suppression.</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-red-500/20 rounded-xl">
                                        <ShieldAlert className="w-8 h-8 text-red-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Supprimer cette classe ?</h3>
                                        <p className="text-gray-400 text-sm">Action requérant approbation</p>
                                    </div>
                                </div>

                                <p className="text-gray-300 mb-8 leading-relaxed">
                                    Vous êtes sur le point de demander la suppression de la classe <span className="text-white font-bold">{classToDelete.name}</span>.
                                    <br /><br />
                                    Cette action n'est pas immédiate : une demande sera envoyée au Directeur pour validation.
                                </p>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setClassToDelete(null)}
                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleRequestDelete}
                                        disabled={deleteLoading}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        {deleteLoading ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Trash2 size={18} />
                                                Confirmer la demande
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CensorClassesView;
