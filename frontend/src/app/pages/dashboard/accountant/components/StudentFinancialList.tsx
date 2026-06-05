import { useState } from 'react';
import { Search, CheckCircle } from 'lucide-react';
import api from '../../../../../shared/api/api';

interface Student {
    id: string;
    firstName: string;
    lastName: string;
    matricule: string;
    class?: { name: string };
    // We would need a backend field for 'balance' or 'status'
    balance?: number;
}

const StudentFinancialList = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const searchStudents = async () => {
        if (searchTerm.length < 2) return;
        setLoading(true);
        try {
            const res = await api.get(`/finance/students?search=${searchTerm}`);
            setStudents(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Auto-search debounce could be added here, or just button for now

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text" placeholder="Rechercher un élève (Nom, Matricule)..."
                        value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && searchStudents()}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                </div>
                <button onClick={searchStudents} className="px-4 py-2 bg-indigo-600 rounded-lg text-white">
                    Rechercher
                </button>
            </div>

            {/* List */}
            <div className="grid gap-3">
                {students.length === 0 && !loading && (
                    <div className="text-center py-12 text-gray-500">Recherchez un élève pour voir sa situation financière.</div>
                )}

                {students.map(student => (
                    <div key={student.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between transition-colors hover:bg-white/10 cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
                                {student.firstName[0]}{student.lastName[0]}
                            </div>
                            <div>
                                <h3 className="text-white font-medium">{student.firstName} {student.lastName}</h3>
                                <div className="text-xs text-gray-400">
                                    {student.matricule} • {student.class?.name || 'Sans Classe'}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            {/* Mock Status */}
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <CheckCircle size={12} />
                                À Jour
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentFinancialList;
