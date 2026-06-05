import { useState, useEffect } from 'react';
import TimelineCalendar, { type CalendarEvent } from '../../../../shared/components/calendar/TimelineCalendar';
import CreateAcademicEventModal from '../../../../shared/components/calendar/modals/CreateAcademicEventModal';
import TimetableEditor from '../../../../shared/components/timetable/TimetableEditor';
import { Calendar, Table, Users } from 'lucide-react';
import api from '../../../../shared/api/api';
import { toastEvents } from '../../../../shared/utils/toast-events';

const SurveillantProgrammeSection = () => {
    const [activeTab, setActiveTab] = useState<'calendar' | 'timetable'>('calendar');
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);

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

    const fetchClasses = async () => {
        try {
            // Try fetching real classes. If fails, use mock.
            const res = await api.get('/classes');
            setClasses(res.data);
            if (res.data.length > 0) setSelectedClassId(res.data[0].id);
        } catch (error) {
            console.warn("Could not fetch classes, using mocks");
            setClasses([
                { id: 'mock-1', name: '6ème A' },
                { id: 'mock-2', name: '3ème B' },
                { id: 'mock-3', name: 'Tle C' }
            ]);
            setSelectedClassId('mock-1');
        }
    };

    useEffect(() => {
        fetchEvents();
        fetchClasses();
    }, []);

    const handleCreateEvent = async (data: any) => {
        try {
            await api.post('/academic-calendar', data);
            fetchEvents();
        } catch (error) {
            toastEvents.error("Erreur/Permission refusée.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Programme & Examens</h2>
                    <p className="text-gray-400 text-sm">Gestion des examens et emplois du temps</p>
                </div>

                <div className="flex bg-[#1a1b23] p-1 rounded-lg border border-white/10">
                    <button
                        onClick={() => setActiveTab('calendar')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${activeTab === 'calendar'
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Calendar size={18} /> Calendrier
                    </button>
                    <button
                        onClick={() => setActiveTab('timetable')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${activeTab === 'timetable'
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Table size={18} /> Emplois du Temps
                    </button>
                </div>
            </div>

            {activeTab === 'calendar' ? (
                <>
                    <TimelineCalendar
                        events={events}
                        loading={loading}
                        canAdd={true}
                        onAddEvent={() => setIsEventModalOpen(true)}
                    />
                    <CreateAcademicEventModal
                        isOpen={isEventModalOpen}
                        onClose={() => setIsEventModalOpen(false)}
                        onSubmit={handleCreateEvent}
                        allowedTypes={['EXAM', 'MEETING', 'OTHER']}
                    />
                </>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center gap-4 bg-[#1a1b23] p-4 rounded-xl border border-white/10">
                        <Users className="text-indigo-400" />
                        <div className="flex-1">
                            <label className="text-sm text-gray-400 block mb-1">Sélectionner une classe</label>
                            <select
                                className="bg-black/20 text-white border border-white/10 rounded-lg px-4 py-2 w-64 focus:outline-none focus:border-indigo-500"
                                value={selectedClassId}
                                onChange={(e) => setSelectedClassId(e.target.value)}
                            >
                                {classes.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <TimetableEditor classId={selectedClassId} />
                </div>
            )}
        </div>
    );
};

export default SurveillantProgrammeSection;
