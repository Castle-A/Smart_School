import { useState, useEffect } from 'react';
import TimelineCalendar, { type CalendarEvent } from '../../../../shared/components/calendar/TimelineCalendar';
import CreateAcademicEventModal from '../../../../shared/components/calendar/modals/CreateAcademicEventModal';
import api from '../../../../shared/api/api';
import { toastEvents } from '../../../../shared/utils/toast-events';

const AccountantCurriculumSection = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await api.get('/academic-calendar');
            setEvents(res.data);
        } catch (error) {
            console.error("Failed to fetch calendar", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleCreateEvent = async (data: any) => {
        try {
            await api.post('/academic-calendar', data);
            await fetchEvents();
        } catch (error) {
            console.error("Failed to create event", error);
            toastEvents.error("Erreur lors de la création de l'événement.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Programme Scolaire & Calendrier</h2>
                    <p className="text-gray-400 text-sm">Gestion du calendrier académique et échéances</p>
                </div>
            </div>

            <TimelineCalendar
                events={events}
                loading={loading}
                canAdd={true} // Accountant can add NO, wait. Accountant can add FINANCIAL.
                onAddEvent={() => setIsModalOpen(true)}
                onEventClick={(event) => console.log("Clicked", event)}
            />

            <CreateAcademicEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateEvent}
                allowedTypes={['FINANCIAL', 'OTHER', 'MEETING']} // Restricted types for Accountant
            />
        </div>
    );
};

export default AccountantCurriculumSection;
