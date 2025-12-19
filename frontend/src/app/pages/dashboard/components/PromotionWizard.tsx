import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, ArrowRightCircle } from 'lucide-react';
import api from '../../../../shared/api/api';

interface Student {
    id: string;
    firstName: string;
    lastName: string;
    matricule: string;
    // We should ideally fetch their decision history
    history?: { outcome: string, finalAverage: number };
}

interface ClassOption {
    id: string;
    name: string;
}

const PromotionWizard = () => {
    const [step, setStep] = useState(1);
    const [classes, setClasses] = useState<ClassOption[]>([]);
    const [sourceClassId, setSourceClassId] = useState('');
    const [targetClassId, setTargetClassId] = useState(''); // Default target for PASS
    const [repeatClassId, setRepeatClassId] = useState(''); // Default target for FAIL

    // Students grouped
    const [students, setStudents] = useState<Student[]>([]);

    // Final Assignments: studentId -> { action, targetClassId }
    const [assignments, setAssignments] = useState<{ [key: string]: { action: string, targetClassId?: string } }>({});

    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        api.get('/classes').then(res => setClasses(res.data));
    }, []);

    // Fetch students & history when source class selected
    const handleLoadClass = async () => {
        if (!sourceClassId) return;
        setLoading(true);
        try {
            // Get Students
            const sRes = await api.get('/students', { params: { classId: sourceClassId, status: 'ACTIVE' } });
            setStudents(sRes.data);

            // Theoretically we should get their 'Decisions' for current year. 
            // Currently no direct API for "Get Decisions for Class".
            // We can infer from `student.history` if includes it, or a separate endpoint `GET /transitions/decisions?classId=...`
            // Let's assume for now default is all PASS if no history found, or we rely on user manually setting content.
            // Better: Add `history` include in students endpoint or assume manual Review.
            // For MVP: We just list students and allow Bulk Assignment based on "Pass/Fail" input or manual check.

            // Initialize assignments
            const initial: any = {};
            sRes.data.forEach((s: any) => {
                initial[s.id] = { action: 'PROMOTE', targetClassId: '' };
            });
            setAssignments(initial);

            setStep(2);
        } catch (e) {
            console.error("Error loading class", e);
        } finally {
            setLoading(false);
        }
    };

    const handleBulkAssign = (targetId: string) => {
        // Here we ideally filter students who "Passed". Without history data, we might apply to ALL?
        // Or we just update the "Default Target" for everyone temporarily.
        setAssignments(prev => {
            const next = { ...prev };
            Object.keys(next).forEach(sid => {
                // If we had history, we'd check it.
                // For now, apply to all 'PROMOTE' actions
                if (next[sid].action === 'PROMOTE') next[sid].targetClassId = targetId;
            });
            return next;
        });
        setTargetClassId(targetId);
    };

    const handleBulkAssignRepeat = (targetId: string) => {
        setAssignments(prev => {
            const next = { ...prev };
            Object.keys(next).forEach(sid => {
                if (next[sid].action === 'REPEAT') next[sid].targetClassId = targetId;
            });
            return next;
        });
        setRepeatClassId(targetId);
    };

    const toggleAction = (studentId: string, action: string) => {
        setAssignments(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], action, targetClassId: action === 'REPEAT' ? repeatClassId : targetClassId }
        }));
    }

    const executePromotion = async () => {
        setProcessing(true);
        try {
            const transitions = Object.entries(assignments).map(([sid, data]) => ({
                studentId: sid,
                action: data.action,
                targetClassId: (data.action === 'PROMOTE' || data.action === 'REPEAT') ? data.targetClassId : undefined
            }));

            const payload = {
                academicYear: "2023-2024",
                transitions
            };

            const res = await api.post('/transitions/promote', payload);
            setResult(res.data);
            setStep(3);
        } catch (e) {
            console.error("Promotion failed", e);
            alert("Erreur lors de la promotion");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="bg-[#1e293b] rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <ArrowRightCircle className="text-indigo-400" /> Assistant de Promotion
            </h2>

            {step === 1 && (
                <div className="space-y-4 max-w-md">
                    <div>
                        <label className="block text-gray-400 mb-2">Classe de départ (Année actuelle)</label>
                        <select
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white"
                            value={sourceClassId} onChange={e => setSourceClassId(e.target.value)}
                        >
                            <option value="">Sélectionner...</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <button
                        onClick={handleLoadClass} disabled={!sourceClassId || loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg flex justify-center items-center gap-2"
                    >
                        {loading ? 'Chargement...' : <>Suivant <ArrowRight size={16} /></>}
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <h3 className="text-green-400 font-bold mb-2">Destination : Admis (Promote)</h3>
                            <select
                                className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white mb-2"
                                value={targetClassId} onChange={e => handleBulkAssign(e.target.value)}
                            >
                                <option value="">Choisir classe cible...</option>
                                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <p className="text-xs text-gray-500">Applique à tous les élèves marqués "PROMOTE"</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <h3 className="text-yellow-400 font-bold mb-2">Destination : Redoublants (Repeat)</h3>
                            <select
                                className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white mb-2"
                                value={repeatClassId} onChange={e => handleBulkAssignRepeat(e.target.value)}
                            >
                                <option value="">Choisir classe...</option>
                                <option value={sourceClassId}>Même classe ({classes.find(c => c.id === sourceClassId)?.name})</option>
                                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <p className="text-xs text-gray-500">Applique à tous les élèves marqués "REPEAT"</p>
                        </div>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto border border-white/10 rounded-lg">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-black/20 text-gray-200 sticky top-0">
                                <tr>
                                    <th className="p-3">Élève</th>
                                    <th className="p-3">Action</th>
                                    <th className="p-3">Classe Cible</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {students.map(s => {
                                    const assign = assignments[s.id] || {};
                                    return (
                                        <tr key={s.id} className="hover:bg-white/5">
                                            <td className="p-3 text-white">{s.firstName} {s.lastName}</td>
                                            <td className="p-3">
                                                <div className="flex gap-1 flex-wrap">
                                                    {['PROMOTE', 'REPEAT', 'GRADUATE', 'ARCHIVE'].map(act => (
                                                        <button
                                                            key={act}
                                                            onClick={() => toggleAction(s.id, act)}
                                                            className={`px-2 py-1 rounded text-xs border ${assign.action === act
                                                                ? (act === 'PROMOTE' ? 'bg-green-500/20 border-green-500 text-green-400' :
                                                                    act === 'REPEAT' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' :
                                                                        act === 'GRADUATE' ? 'bg-blue-500/20 border-blue-500 text-blue-400' :
                                                                            'bg-red-500/20 border-red-500 text-red-500')
                                                                : 'border-white/10 hover:bg-white/10'
                                                                }`}
                                                        >
                                                            {act === 'GRADUATE' ? 'DIPLÔMÉ' : act}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                {['ARCHIVE', 'GRADUATE'].includes(assign.action) ? (
                                                    <span className={`text-xs ${assign.action === 'GRADUATE' ? 'text-blue-400' : 'text-red-400'}`}>
                                                        {assign.action === 'GRADUATE' ? 'Sortie (Diplômé)' : 'Sortie (Archivé)'}
                                                    </span>
                                                ) : (
                                                    <select
                                                        className="bg-black/20 border border-white/10 rounded p-1 text-white text-xs w-full"
                                                        value={assign.targetClassId || ''}
                                                        onChange={e => setAssignments(prev => ({ ...prev, [s.id]: { ...prev[s.id], targetClassId: e.target.value } }))}
                                                    >
                                                        <option value="">Sélectionner...</option>
                                                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                    </select>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button onClick={() => setStep(1)} className="px-4 py-2 hover:bg-white/10 text-white rounded-lg">Retour</button>
                        <button
                            onClick={executePromotion} disabled={processing}
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-lg shadow-indigo-500/20"
                        >
                            {processing ? 'Exécution...' : 'Valider & Appliquer'}
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && result && (
                <div className="text-center py-12">
                    <div className="inline-flex p-4 rounded-full bg-green-500/20 text-green-400 mb-4">
                        <CheckCircle size={48} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Transition Terminée !</h3>
                    <p className="text-gray-400 mb-6">
                        {result.length} élèves ont été traités avec succès.
                    </p>
                    <button onClick={() => { setStep(1); setSourceClassId(''); setStudents([]); }} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg">
                        Traiter une autre classe
                    </button>
                </div>
            )}
        </div>
    );
};

export default PromotionWizard;
