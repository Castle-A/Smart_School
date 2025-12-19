import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import api from '../../../../../shared/api/api';

const PendingRegistrationsList = () => {
    const [pendingStudents, setPendingStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPending = async () => {
            try {
                const res = await api.get('/students', { params: { status: 'PENDING' } });
                console.log('Pending Students Response:', res.data); // DEBUG
                setPendingStudents(res.data);
            } catch (err) {
                console.error("Failed to fetch pending students", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPending();
    }, []);

    if (loading) {
        return <div className="text-center py-4 text-gray-500">Chargement...</div>;
    }

    if (pendingStudents.length === 0) {
        return (
            <div className="text-center py-8 bg-white/5 rounded-lg border border-dashed border-white/10">
                <Clock className="mx-auto text-gray-600 mb-2" size={24} />
                <p className="text-gray-400 text-sm">Aucun dossier en attente.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {pendingStudents.slice(0, 5).map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold border border-amber-500/20 group-hover:bg-amber-500/20">
                            {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
                        </div>
                        <div>
                            <p className="text-white font-medium">{student.lastName} {student.firstName}</p>
                            <p className="text-sm text-gray-400 flex items-center gap-1">
                                {student.matricule || 'N/A'} • <span className="text-gray-500">{new Date(student.createdAt).toLocaleDateString()}</span>
                            </p>
                        </div>
                    </div>
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs rounded-full flex items-center gap-1 border border-amber-500/20">
                        <Clock size={12} />
                        En attente
                    </span>
                </div>
            ))}
            {pendingStudents.length > 5 && (
                <p className="text-xs text-center text-gray-500 mt-2">Et {pendingStudents.length - 5} autres dossiers...</p>
            )}
        </div>
    );
};

export default PendingRegistrationsList;
