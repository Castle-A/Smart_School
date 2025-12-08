import { useState, useEffect } from 'react';
import { Save, Calculator } from 'lucide-react';
import api from '../../../../../shared/api/api';

const GradesInputView = () => {
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [students, setStudents] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchClasses();
        fetchSubjects();
    }, []);

    useEffect(() => {
        if (selectedClassId) {
            fetchStudents(selectedClassId);
        } else {
            setStudents([]);
        }
    }, [selectedClassId]);

    const fetchClasses = async () => {
        try {
            const res = await api.get('/classes');
            setClasses(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchSubjects = async () => {
        try {
            const res = await api.get('/subjects');
            setSubjects(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchStudents = async (classId: string) => {
        setLoading(true);
        try {
            const res = await api.get('/students');
            // Assuming API supports filtering by classId, or we filter client side
            const classStudents = res.data.filter((s: any) => s.classId === classId || s.class?.id === classId);
            setStudents(classStudents);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    return (
        <div className="space-y-6">
            {/* Context Header */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-wrap gap-4 items-end">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Classe</label>
                    <select
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white min-w-[200px]"
                    >
                        <option value="">-- Sélectionner --</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Matière</label>
                    <select
                        value={selectedSubjectId}
                        onChange={(e) => setSelectedSubjectId(e.target.value)}
                        className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white min-w-[200px]"
                    >
                        <option value="">-- Sélectionner --</option>
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Période</label>
                    <select className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white min-w-[150px]">
                        <option>Trimestre 1</option>
                        <option>Trimestre 2</option>
                        <option>Trimestre 3</option>
                    </select>
                </div>
                <div className="flex-1 text-right">
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 ml-auto transition-colors">
                        <Save size={18} />
                        Enregistrer les Notes
                    </button>
                </div>
            </div>

            {/* Grades Grid */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                {selectedClassId && selectedSubjectId ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#1e293b] text-gray-200">
                                <tr>
                                    <th className="p-4 min-w-[200px] sticky left-0 bg-[#1e293b] z-10">Élève</th>
                                    <th className="p-2 text-center border-l border-white/10" colSpan={3}>Interrogations (Coef 1)</th>
                                    <th className="p-2 text-center border-l border-white/10" colSpan={2}>Devoirs (Coef 2)</th>
                                    <th className="p-2 text-center border-l border-white/10 bg-indigo-900/20">Compo (Coef 3)</th>
                                    <th className="p-4 text-center border-l border-white/10 min-w-[100px]">Moyenne</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr><td colSpan={10} className="p-8 text-center text-indigo-400">Chargement des élèves...</td></tr>
                                ) : students.length === 0 ? (
                                    <tr><td colSpan={10} className="p-8 text-center text-gray-400">Aucun élève dans cette classe.</td></tr>
                                ) : (
                                    students.map((student) => (
                                        <tr key={student.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-3 font-medium text-white sticky left-0 bg-[#0f172a] group-hover:bg-[#1e293b]">
                                                {student.lastName} {student.firstName}
                                            </td>
                                            {/* Interrogations */}
                                            <td className="p-2 border-l border-white/5"><input type="text" className="w-12 bg-black/20 border border-white/10 rounded p-1 text-center text-white focus:border-indigo-500 outline-none" placeholder="-" /></td>
                                            <td className="p-2"><input type="text" className="w-12 bg-black/20 border border-white/10 rounded p-1 text-center text-white focus:border-indigo-500 outline-none" placeholder="-" /></td>
                                            <td className="p-2"><input type="text" className="w-12 bg-black/20 border border-white/10 rounded p-1 text-center text-white focus:border-indigo-500 outline-none" placeholder="-" /></td>

                                            {/* Devoirs */}
                                            <td className="p-2 border-l border-white/5"><input type="text" className="w-12 bg-black/20 border border-white/10 rounded p-1 text-center text-white focus:border-indigo-500 outline-none" placeholder="-" /></td>
                                            <td className="p-2"><input type="text" className="w-12 bg-black/20 border border-white/10 rounded p-1 text-center text-white focus:border-indigo-500 outline-none" placeholder="-" /></td>

                                            {/* Compo */}
                                            <td className="p-2 border-l border-white/5 bg-indigo-900/10 text-center">
                                                <input type="text" className="w-16 bg-black/20 border border-indigo-500/30 rounded p-1 text-center text-indigo-300 font-bold focus:border-indigo-500 outline-none" placeholder="-" />
                                            </td>

                                            {/* Moyenne */}
                                            <td className="p-2 border-l border-white/10 text-center font-mono font-bold text-gray-500">
                                                --
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                        <Calculator size={48} className="mb-4 opacity-30" />
                        <p>Veuillez sélectionner une Classe et une Matière pour commencer la saisie.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GradesInputView;
