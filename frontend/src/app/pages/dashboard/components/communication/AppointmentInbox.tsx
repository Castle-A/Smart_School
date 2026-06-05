import React, { useEffect, useState } from 'react';
import { appointmentService } from '../../../../api/appointment.service';
import { useTranslation } from 'react-i18next';
import { Check, X, Clock } from 'lucide-react';

export const AppointmentInbox: React.FC = () => {
    const { t } = useTranslation();
    // Use t or remove it. Let's use it for the title.
    const [pending, setPending] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPending();
    }, []);

    const loadPending = async () => {
        try {
            const data = await appointmentService.getPendingInvitations();
            setPending(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, status: 'ACCEPTED' | 'DECLINED') => {
        try {
            await appointmentService.validateInvitation(id, status);
            loadPending(); // Refresh list on success
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-4 text-center text-gray-500">Chargement...</div>;

    if (pending.length === 0) return (
        <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-500 text-sm">Aucune invitation en attente.</p>
        </div>
    );

    return (
        <div className="space-y-3">
            <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                {t('appointments.pending', 'À Valider')} ({pending.length})
            </h3>
            {pending.map(item => (
                <div key={item.appointmentId} className="bg-white p-3 rounded-lg shadow-sm border border-orange-100 flex justify-between items-center group hover:shadow-md transition-shadow">
                    <div>
                        <p className="font-semibold text-gray-800 text-sm">{item.appointment.title}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Clock size={12} /> {new Date(item.appointment.start).toLocaleString()}
                        </p>
                        <p className="text-xs text-indigo-600 mt-1">
                            Par: {item.appointment.organizer.firstName} {item.appointment.organizer.lastName}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleAction(item.appointment.id, 'ACCEPTED')}
                            title="Accepter"
                            className="p-1.5 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                        >
                            <Check size={16} />
                        </button>
                        <button
                            onClick={() => handleAction(item.appointment.id, 'DECLINED')}
                            title="Refuser"
                            className="p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};
