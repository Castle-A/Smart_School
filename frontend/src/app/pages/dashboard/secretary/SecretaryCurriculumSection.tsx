import { useState, useEffect } from 'react';
import TimelineCalendar, { type CalendarEvent } from '../../../../shared/components/calendar/TimelineCalendar';
import CreateAcademicEventModal from '../../../../shared/components/calendar/modals/CreateAcademicEventModal';
import api from '../../../../shared/api/api';
import { toastEvents } from '../../../../shared/utils/toast-events';

const SecretaryCurriculumSection = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await api.get('/academic-calendar');
            setEvents(res.data);
        } catch (error) {
            console.error(error);
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
            fetchEvents();
        } catch (error) {
            toastEvents.error("Erreur lors de la création.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Programme Scolaire</h2>
                    <p className="text-gray-400 text-sm">Consultation du calendrier et gestion des réunions</p>
                </div>
            </div>

            <TimelineCalendar
                events={events}
                loading={loading}
                canAdd={true}
                onAddEvent={() => setIsModalOpen(true)}
            />

            <CreateAcademicEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateEvent}
                allowedTypes={['MEETING', 'OTHER']} // Secretary roles
            />
        </div>
    );
};

export default SecretaryCurriculumSection;
