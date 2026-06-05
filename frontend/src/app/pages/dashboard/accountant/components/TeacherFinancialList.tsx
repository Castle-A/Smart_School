import { useState, useEffect } from 'react';
import { User, Search, FileText } from 'lucide-react';
import api from '../../../../../shared/api/api';
import { toastEvents } from '../../../../../shared/utils/toast-events';

interface Teacher {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    matricule: string;
    contractType: string;
    hireDate: string;
    hourlyRate: number;
    baseSalary?: number; // Calculated or from DB? For now relying on hourlyRate * hours or similar logic, but user visualizes rate.
    // hoursWorked?: number; 
}

const TeacherFinancialList = ({ readOnly = false }: { readOnly?: boolean }) => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<number>(0);

    const fetchTeachers = async () => {
        try {
            const res = await api.get('/teachers');
            setTeachers(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const handleSaveSalary = async (id: string) => {
        try {
            await api.patch(`/teachers/${id}/salary`, { hourlyRate: editValue });
            setEditingId(null);
            fetchTeachers();
        } catch (error) {
            toastEvents.error("Erreur lors de la mise à jour du taux horaire");
        }
    };

    const filtered = teachers.filter(t =>
        t.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.matricule?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text" placeholder="Rechercher un enseignant..."
                        value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                </div>
            </div>

            {/* List */}
            <div className="grid gap-4">
                {filtered.map(teacher => (
                    <div key={teacher.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                {teacher.firstName[0]}{teacher.lastName[0]}
                            </div>
                            <div>
                                <h3 className="text-white font-medium">{teacher.firstName} {teacher.lastName}</h3>
                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                    <span className="flex items-center gap-1"><User size={12} /> {teacher.matricule || 'N/A'}</span>
                                    <span className="flex items-center gap-1"><FileText size={12} /> {teacher.contractType || 'Vacataire'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-right flex items-center gap-4">
                            <div>
                                <div className="text-sm text-gray-400">Taux Horaire</div>
                                {(!readOnly && editingId === teacher.id) ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            className="w-24 bg-black/40 border border-indigo-500 rounded px-2 py-1 text-right text-white text-sm"
                                            value={editValue}
                                            onChange={(e) => setEditValue(Number(e.target.value))}
                                            autoFocus
                                        />
                                        <button onClick={() => handleSaveSalary(teacher.id)} className="text-emerald-400 hover:text-emerald-300 text-xs font-bold">OK</button>
                                        <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-gray-300 text-xs">X</button>
                                    </div>
                                ) : (
                                    <div
                                        className={`text-white font-mono font-bold ${!readOnly ? 'cursor-pointer hover:text-indigo-400' : ''} flex items-center justify-end gap-2`}
                                        onClick={() => { if (!readOnly) { setEditingId(teacher.id); setEditValue(teacher.hourlyRate || 0); } }}
                                        title={!readOnly ? "Cliquer pour modifier" : ""}
                                    >
                                        {(teacher.hourlyRate || 0).toLocaleString()} F/h
                                        {!readOnly && <span className="text-xs text-gray-600">✎</span>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeacherFinancialList;
