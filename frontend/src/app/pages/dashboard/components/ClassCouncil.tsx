import { useState, useEffect } from 'react';
import { Users, Save, CheckCircle, AlertTriangle, Filter, Lock } from 'lucide-react';
import api from '../../../../shared/api/api';
import { useAuth } from '../../../../shared/contexts/AuthContext';

interface Student {
    id: string;
    matricule: string;
    firstName: string;
    lastName: string;
    photo?: string;
}

interface Decision {
    studentId: string;
    average: number;
    decision: string; // 'PASS', 'FAIL', 'RETAKE'
    observation?: string;
}

const ClassCouncil = () => {
    const { user } = useAuth();
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [students, setStudents] = useState<Student[]>([]);
    const [decisions, setDecisions] = useState<{ [key: string]: Decision }>({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Permission Logic
    const role = user?.schoolRole || user?.role;
    const canEdit = ['DIRECTOR', 'CENSOR', 'TEACHER'].includes(role || '');
    // Founder explicitly Read Only per user request
    const isFounder = role === 'FOUNDER';
    const hasWriteAccess = canEdit && !isFounder;

    // Fetch Classes on Mount
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await api.get('/classes');
                setClasses(res.data);
            } catch (e) {
                console.error("Failed to fetch classes", e);
            }
        };
        fetchClasses();
    }, []);

    // Fetch Students when Class Selected
    useEffect(() => {
        if (!selectedClassId) return;

        const fetchStudents = async () => {
            setLoading(true);
            try {
                const res = await api.get('/students', { params: { classId: selectedClassId, status: 'ACTIVE' } });
                setStudents(res.data);
                // Initialize default decisions
                const initialDecisions: any = {};
                res.data.forEach((s: any) => {
                    initialDecisions[s.id] = {
                        studentId: s.id,
                        average: 0,
                        decision: 'PASS',
                        observation: ''
                    };
                });
                setDecisions(initialDecisions);
            } catch (e) {
                console.error("Failed to fetch students", e);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, [selectedClassId]);

    const handleDecisionChange = (studentId: string, field: keyof Decision, value: any) => {
        if (!hasWriteAccess) return;
        setDecisions(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [field]: value
            }
        }));
    };

    const handleSave = async () => {
        if (!selectedClassId || !hasWriteAccess) return;
        setSaving(true);
        setFeedback(null);

        try {
            const payload = {
                classId: selectedClassId,
                academicYear: "2023-2024", // Dynamic? Should come from context or active year API
                decisions: Object.values(decisions)
            };

            await api.post('/transitions/decisions', payload);
            setFeedback({ type: 'success', message: 'Décisions enregistrées avec succès.' });
        } catch (e) {
            console.error("Save failed", e);
            setFeedback({ type: 'error', message: "Erreur lors de l'enregistrement." });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header / Filter */}
            <div className="bg-[#1e293b] p-4 rounded-xl border border-white/10 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-indigo-400">
                        <Users size={20} />
                        <span className="font-semibold text-white">Conseil de Classe</span>
                    </div>
                    <select
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="bg-black/20 text-white border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 min-w-[200px]"
                    >
                        <option value="">-- Sélectionner une Classe --</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                <div className="flex items-center gap-3">
                    {!hasWriteAccess && (
                        <div className="px-4 py-2 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-lg flex items-center gap-2 text-sm">
                            <Lock size={14} />
                            <span>Lecture Seule ({role})</span>
                        </div>
                    )}

                    {hasWriteAccess && (
                        <button
                            onClick={handleSave}
                            disabled={saving || !selectedClassId}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors"
                        >
                            {saving ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div> : <Save size={18} />}
                            Enregistrer les Décisions
                        </button>
                    )}
                </div>
            </div>

            {feedback && (
                <div className={`p-4 rounded-lg flex items-center gap-2 ${feedback.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {feedback.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                    <p>{feedback.message}</p>
                </div>
            )}

            {/* List */}
            {selectedClassId && (
                <div className="bg-[#1e293b] rounded-xl border border-white/10 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-gray-400">Chargement de la liste...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-400">
                                <thead className="bg-[#0f172a] text-gray-200 uppercase font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Matricule</th>
                                        <th className="px-6 py-4">Nom & Prénoms</th>
                                        <th className="px-6 py-4 w-32">Moyenne</th>
                                        <th className="px-6 py-4 w-48">Décision</th>
                                        <th className="px-6 py-4">Observation</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {students.map((s) => {
                                        const d = decisions[s.id] || {};
                                        return (
                                            <tr key={s.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 font-mono text-xs">{s.matricule}</td>
                                                <td className="px-6 py-4 text-white font-medium">{s.lastName} {s.firstName}</td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        min="0" max="20" step="0.01"
                                                        value={d.average}
                                                        onChange={(e) => handleDecisionChange(s.id, 'average', Number(e.target.value))}
                                                        disabled={!hasWriteAccess}
                                                        className={`w-full bg-black/20 border rounded px-2 py-1 text-white text-center focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${d.average >= 10 ? 'border-green-500/30 focus:border-green-500' : 'border-red-500/30 focus:border-red-500'}`}
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={d.decision}
                                                        onChange={(e) => handleDecisionChange(s.id, 'decision', e.target.value)}
                                                        disabled={!hasWriteAccess}
                                                        className={`w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-white focus:border-indigo-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed ${d.decision === 'PASS' ? 'text-green-400' : (d.decision === 'FAIL' ? 'text-red-400' : 'text-yellow-400')}`}
                                                    >
                                                        <option value="PASS">Admis</option>
                                                        <option value="FAIL">Redouble</option>
                                                        <option value="RETAKE">Exclu</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="text"
                                                        value={d.observation || ''}
                                                        onChange={(e) => handleDecisionChange(s.id, 'observation', e.target.value)}
                                                        disabled={!hasWriteAccess}
                                                        className="w-full bg-transparent border-b border-white/10 focus:border-indigo-500 outline-none py-1 text-gray-300 placeholder-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        placeholder={hasWriteAccess ? "Optionnel..." : ""}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {students.length === 0 && (
                                <div className="p-8 text-center text-gray-500 italic">Aucun élève trouvé dans cette classe.</div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {!selectedClassId && (
                <div className="flex flex-col items-center justify-center h-64 bg-white/5 border border-white/10 rounded-xl border-dashed">
                    <Filter size={48} className="text-gray-600 mb-4" />
                    <p className="text-gray-400">Veuillez sélectionner une classe pour commencer.</p>
                </div>
            )}
        </div>
    );
};

export default ClassCouncil;
