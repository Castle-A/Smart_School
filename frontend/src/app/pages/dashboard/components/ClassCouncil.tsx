import { useState, useEffect } from 'react';
import { Save, RefreshCw, Check } from 'lucide-react';
import api from '../../../../shared/api/api';
import { toastEvents } from '../../../../shared/utils/toast-events';

const LEVELS: Record<string, string[]> = {
    MATERNELLE: ['Petite Section', 'Moyenne Section', 'Grande Section'],
    PRIMAIRE: ['CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'],
    PREMIER_CYCLE: ['6ème', '5ème', '4ème', '3ème'],
    SECOND_CYCLE: ['2nde', '1ère', 'Tle'],
};

const SERIES: Record<string, string[]> = {
    PREMIER_CYCLE: ['A', 'B', 'C', 'D'], // Groupes pédagogiques (ex: 6ème A)
    SECOND_CYCLE: [
        'A1', 'A2', 'B', 'C', 'D',
        'E',
        'F1', 'F2', 'F3', 'F4',
        'G1', 'G2', 'G3',
        'Ti', 'EA'
    ],
};

const DECISIONS = [
    { value: 'PASS', label: 'Admis (Pass)' },
    { value: 'FAIL', label: 'Redouble (Fail)' },
    { value: 'RETAKE', label: 'Rattrapage' }, // Si applicable
    { value: 'GRADUATED', label: 'Diplômé' },
    { value: 'TRANSFERRED', label: 'Transféré' },
    { value: 'LEFT', label: 'Abandon' },
];

// ... (Rest of component is same as Director version)
interface StudentDecision {
    studentId: string;
    firstName: string;
    lastName: string;
    matricule: string;
    average: number;
    decision: string;
    nextLevel: string;
    nextSeries: string; // "C", "A", or "C 1"
}

const ClassCouncil = () => {
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedClass, setSelectedClass] = useState<any>(null);
    const [activeYear, setActiveYear] = useState<any>(null);

    const [rows, setRows] = useState<StudentDecision[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (selectedClassId && activeYear) {
            fetchClassData(selectedClassId);
        } else {
            setRows([]);
            setSelectedClass(null);
        }
    }, [selectedClassId, activeYear]);

    const fetchInitialData = async () => {
        try {
            const [classesRes, schoolRes] = await Promise.all([
                api.get('/classes'),
                api.get('/schools/my')
            ]);
            setClasses(classesRes.data);
            setActiveYear(schoolRes.data.activeYear);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchClassData = async (classId: string) => {
        setLoading(true);
        try {
            // Get Class Info
            const cls = classes.find(c => c.id === classId);
            setSelectedClass(cls);

            // Get Students
            const studentsRes = await api.get(`/classes/${classId}`); // Specific endpoint usually returns details + students
            // NOTE: api.get('/classes/:id') returns { ...class, students: [...] } based on my previous views

            // Get Saved Decisions
            const decisionsRes = await api.get(`/transitions/decisions/${classId}/${activeYear.name}`);
            const savedDecisions = decisionsRes.data; // Array of History

            const students = studentsRes.data.students || [];

            // Merge Logic
            const merged = students.map((s: any) => {
                const saved = savedDecisions.find((d: any) => d.studentId === s.id);
                return {
                    studentId: s.id,
                    firstName: s.firstName,
                    lastName: s.lastName,
                    matricule: s.matricule,
                    average: saved ? saved.finalAverage : 0,
                    decision: saved ? saved.outcome : 'FAIL', // Default
                    nextLevel: saved ? (saved.nextLevel || '') : '',
                    nextSeries: saved ? (saved.nextSeries || '') : '',
                };
            });

            setRows(merged);

        } catch (err) {
            console.error('Error fetching class/decisions:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRowChange = (index: number, field: keyof StudentDecision, value: any) => {
        const newRows = [...rows];
        newRows[index] = { ...newRows[index], [field]: value };
        setRows(newRows);
    };

    const handleSave = async () => {
        if (!activeYear) return;
        setSaving(true);
        setSuccessMsg('');
        try {
            const payload = {
                classId: selectedClassId,
                academicYear: activeYear.name,
                decisions: rows.map(r => ({
                    studentId: r.studentId,
                    average: Number(r.average),
                    decision: r.decision,
                    nextLevel: r.nextLevel || undefined,
                    nextSeries: r.nextSeries || undefined
                }))
            };

            await api.post('/transitions/decisions', payload);
            setSuccessMsg('Décisions enregistrées avec succès !');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            console.error('Error saving decisions:', err);
            toastEvents.error("Erreur lors de l'enregistrement.");
        } finally {
            setSaving(false);
        }
    };

    // Helper to get next level options
    const getTargetLevels = () => {
        if (!selectedClass) return [];
        // Show all levels of the cycle, or all levels?
        // Better show all levels relevant to the school or cycle.
        // Simple: Merge all levels
        return [
            ...(LEVELS.MATERNELLE || []),
            ...(LEVELS.PRIMAIRE || []),
            ...(LEVELS.PREMIER_CYCLE || []),
            ...(LEVELS.SECOND_CYCLE || [])
        ];
    };

    // Helper to get series options
    const getTargetSeries = () => {
        if (!selectedClass) return [];
        // Show all series
        return [...(SERIES.PREMIER_CYCLE || []), ...(SERIES.SECOND_CYCLE || [])];
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Conseil de Classe</h2>
                {activeYear && (
                    <div className="bg-indigo-900/30 px-4 py-2 rounded-lg border border-indigo-500/30 text-indigo-300">
                        Année Active : <span className="font-bold text-white">{activeYear.name}</span>
                    </div>
                )}
            </div>

            {/* Toolbar */}
            <div className="bg-[#1e293b] border border-white/10 rounded-xl p-4 flex gap-4 items-end">
                <div className="flex-1 max-w-xs">
                    <label className="block text-xs font-medium text-gray-400 mb-1">Choisir une Classe</label>
                    <select
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                    >
                        <option value="">-- Sélectionner --</option>
                        {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex-1"></div>

                <button
                    onClick={handleSave}
                    disabled={saving || !selectedClassId}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                    Enregistrer les Décisions
                </button>
            </div>

            {successMsg && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-2 text-green-400">
                    <Check size={20} />
                    {successMsg}
                </div>
            )}

            {/* Table */}
            <div className="bg-[#1e293b] border border-white/10 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">Chargement...</div>
                ) : !selectedClassId ? (
                    <div className="p-12 text-center text-gray-500">Sélectionnez une classe pour commencer</div>
                ) : rows.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">Aucun élève trouvé dans cette classe</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="bg-black/20 text-xs uppercase font-medium text-gray-400">
                                <tr>
                                    <th className="p-4">Élève</th>
                                    <th className="p-4 w-32">Moyenne</th>
                                    <th className="p-4 w-40">Décision</th>
                                    <th className="p-4 w-40">Niveau Cible</th>
                                    <th className="p-4 w-64">Série / Groupe Cible</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {rows.map((row, idx) => (
                                    <tr key={row.studentId} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-medium text-white">
                                            {row.lastName} {row.firstName}
                                            <div className="text-xs text-gray-500">{row.matricule}</div>
                                        </td>
                                        <td className="p-4">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={row.average}
                                                onChange={(e) => handleRowChange(idx, 'average', e.target.value)}
                                                className={`w-full bg-black/20 border rounded-lg px-3 py-1 text-white focus:outline-none ${Number(row.average) >= 10 ? 'border-green-500/30 text-green-400' : 'border-red-500/30 text-red-400'}`}
                                            />
                                        </td>
                                        <td className="p-4">
                                            <select
                                                value={row.decision}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    handleRowChange(idx, 'decision', val);
                                                }}
                                                className={`w-full bg-black/20 border border-white/10 rounded-lg px-2 py-1 focus:outline-none ${row.decision === 'PASS' ? 'text-green-400' : row.decision === 'FAIL' ? 'text-red-400' : 'text-white'}`}
                                            >
                                                {DECISIONS.map(d => (
                                                    <option key={d.value} value={d.value}>{d.label}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-4">
                                            {row.decision === 'PASS' && (
                                                <select
                                                    value={row.nextLevel}
                                                    onChange={(e) => handleRowChange(idx, 'nextLevel', e.target.value)}
                                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-2 py-1 text-white focus:outline-none"
                                                >
                                                    <option value="">-- Choisir --</option>
                                                    {getTargetLevels().map(l => (
                                                        <option key={l} value={l}>{l}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {row.decision === 'PASS' && (
                                                <div className="flex gap-2">
                                                    <select
                                                        value={row.nextSeries.split(' ')[0]} // Only Series Base part
                                                        onChange={(e) => {
                                                            const base = e.target.value;
                                                            handleRowChange(idx, 'nextSeries', base);
                                                        }}
                                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-2 py-1 text-white focus:outline-none"
                                                    >
                                                        <option value="">(Série)</option>
                                                        {getTargetSeries().map(s => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>

                                                    {/* Indice / Groupe input for Next Year */}
                                                    <input
                                                        type="text"
                                                        placeholder="Gr."
                                                        className="w-12 bg-black/20 border border-white/10 rounded-lg px-1 text-center text-white text-xs"
                                                        value={row.nextSeries.split(' ').slice(1).join(' ')}
                                                        onChange={(e) => {
                                                            const suffix = e.target.value;
                                                            const base = row.nextSeries.split(' ')[0];
                                                            handleRowChange(idx, 'nextSeries', `${base} ${suffix}`.trim());
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClassCouncil;
