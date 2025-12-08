import { useState, useEffect } from 'react';
import { Search, Plus, School, Check, X, AlertCircle } from 'lucide-react';
import api from '../../../../../shared/api/api';
import { useAuth } from '../../../../../shared/contexts/AuthContext';

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
    PREMIER_CYCLE: [], // Usually no series in college, maybe A/B but typically standard. Leaving empty or allow custom if needed. Check CreateClassPage for parity. User said "Nom, cycle, serie, salle, prof".
    SECOND_CYCLE: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'Ti'], // Standard series
};

const CensorClassesView = ({ classes, onRefresh }: CensorClassesViewProps) => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
                mainTeacherId: formData.mainTeacherId ? parseInt(formData.mainTeacherId) : undefined,
                schoolId: user?.schoolId
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

    const filteredClasses = classes.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.mainTeacher && `${c.mainTeacher.firstName} ${c.mainTeacher.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                <div>
                    <h3 className="text-xl font-bold text-white">Gestion des Classes</h3>
                    <p className="text-gray-400 text-sm">Collège et Lycée</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    {/* Censor can create classes for College (which includes Lycee in this context) */}
                    <button
                        onClick={handleOpenAddModal}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        <Plus size={18} />
                        <span className="hidden md:inline">Nouvelle Classe</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredClasses.map((cls) => (
                    <div key={cls.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors group relative">
                        {/* Censor Action: Request Delete? Or just View? 
                            User didn't specify Censor actions on classes, just creation.
                            Usually Censor manages classes. I'll leave basic view or maybe Edit if they created it?
                            For now, minimal View.
                        */}
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
                                            <option key={s} value={s}>Série {s}</option>
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
        </div>
    );
};

export default CensorClassesView;
