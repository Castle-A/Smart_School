import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import api from '../../../../../shared/api/api';
import { toastEvents } from '../../../../../shared/utils/toast-events';

interface SchoolUser {
    id: string;
    role: string;
    monthlySalary: number;
    user: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
}

const AdminStaffList = ({ readOnly = false }: { readOnly?: boolean }) => {
    const [staff, setStaff] = useState<SchoolUser[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<number>(0);

    const fetchStaff = async () => {
        try {
            const res = await api.get('/members/list'); // Corrected endpoint if needed, usually /members/list based on controller
            // Filter out non-admin roles if necessary, currently fetches all school users
            setStaff(res.data.filter((u: any) => ['SECRETARY', 'SURVEILLANT', 'CENSEUR', 'ACCOUNTANT', 'DIRECTOR'].includes(u.role)));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleSaveSalary = async (id: string) => {
        try {
            await api.patch(`/members/${id}/salary`, { monthlySalary: editValue });
            setEditingId(null);
            fetchStaff();
        } catch (error) {
            toastEvents.error("Erreur mise à jour salaire");
        }
    };

    const roleLabel = (role: string) => {
        switch (role) {
            case 'DIRECTOR': return 'Directeur';
            case 'ACCOUNTANT': return 'Comptable';
            case 'SECRETARY': return 'Secrétaire';
            case 'SURVEILLANT': return 'Surveillant';
            case 'CENSEUR': return 'Censeur';
            default: return role;
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid gap-4">
                {staff.map(member => (
                    <div key={member.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold border border-blue-500/30">
                                {member.user.firstName[0]}{member.user.lastName[0]}
                            </div>
                            <div>
                                <h3 className="text-white font-medium">{member.user.firstName} {member.user.lastName}</h3>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-white/10 text-gray-300 border border-white/10">
                                    <Shield size={10} />
                                    {roleLabel(member.role)}
                                </span>
                            </div>
                        </div>

                        <div className="text-right flex items-center gap-4">
                            <div>
                                <div className="text-sm text-gray-400">Salaire Mensuel</div>
                                {(!readOnly && editingId === member.id) ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            className="w-28 bg-black/40 border border-indigo-500 rounded px-2 py-1 text-right text-white text-sm"
                                            value={editValue}
                                            onChange={(e) => setEditValue(Number(e.target.value))}
                                            autoFocus
                                        />
                                        <button onClick={() => handleSaveSalary(member.id)} className="text-emerald-400 hover:text-emerald-300 text-xs font-bold">OK</button>
                                        <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-gray-300 text-xs">X</button>
                                    </div>
                                ) : (
                                    <div
                                        className={`text-white font-mono font-bold ${!readOnly ? 'cursor-pointer hover:text-indigo-400' : ''} flex items-center justify-end gap-2`}
                                        onClick={() => { if (!readOnly) { setEditingId(member.id); setEditValue(member.monthlySalary || 0); } }}
                                        title={!readOnly ? "Cliquer pour modifier" : ""}
                                    >
                                        {(member.monthlySalary || 0).toLocaleString()} F
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

export default AdminStaffList;
