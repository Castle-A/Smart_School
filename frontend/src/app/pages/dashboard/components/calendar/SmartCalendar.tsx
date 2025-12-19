import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { calendarService } from '../../../../api/calendar.service';
import type { AcademicEvent } from '../../../../api/calendar.service';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';

interface SmartCalendarProps {
    canCreate?: boolean; // If true, shows "Add Event" button
    onCreateClick?: () => void;
}

const EVENT_COLORS: Record<string, string> = {
    'ACADEMIC_PERIOD': '#3b82f6', // blue-500
    'HOLIDAY': '#10b981', // green-500
    'EXAM': '#ef4444', // red-500
    'FINANCIAL': '#f59e0b', // amber-500
    'MEETING': '#8b5cf6', // violet-500
    'OTHER': '#6b7280' // gray-500
};

export const SmartCalendar: React.FC<SmartCalendarProps> = ({ canCreate, onCreateClick }) => {
    const { t } = useTranslation();
    const [events, setEvents] = useState<AcademicEvent[]>([]);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const data = await calendarService.getEvents();
            setEvents(data);
        } catch (err) {
            console.error("Failed to load calendar events", err);
        }
    };

    const renderEventContent = (eventInfo: any) => {
        const isSystem = eventInfo.event.extendedProps.isSystem;

        return (
            <div className="flex flex-col px-1 overflow-hidden text-xs">
                <span className="font-semibold truncate">
                    {isSystem && "🔒 "}{eventInfo.event.title}
                </span>
                {eventInfo.timeText && <span className="text-[10px] opacity-80">{eventInfo.timeText}</span>}
            </div>
        );
    };

    // Transform backend events to FullCalendar format
    const calendarEvents = events.map(e => ({
        id: e.id,
        title: e.title,
        start: e.start,
        end: e.end,
        backgroundColor: EVENT_COLORS[e.type] || EVENT_COLORS['OTHER'],
        borderColor: EVENT_COLORS[e.type] || EVENT_COLORS['OTHER'],
        extendedProps: {
            type: e.type,
            isSystem: e.isSystem,
            description: e.description,
            audience: e.audience
        }
    }));

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    📅 {t('calendar.title', 'Calendrier Scolaire')}
                </h2>
                <div className="flex gap-2">
                    {/* Legend could go here */}
                    {canCreate && (
                        <button
                            onClick={onCreateClick}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                        >
                            <Plus size={16} />
                            {t('calendar.add', 'Ajouter un événement')}
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 calendar-container">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    events={calendarEvents}
                    eventContent={renderEventContent}
                    locale="fr" // Should be dynamic based on i18n
                    height="100%"
                    firstDay={1} // Monday
                    nowIndicator={true}
                    slotMinTime="07:00:00"
                    slotMaxTime="20:00:00"
                    allDaySlot={true}
                />
            </div>

            {/* Quick Legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600 border-t pt-2">
                {Object.entries(EVENT_COLORS).map(([type, color]) => (
                    <div key={type} className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>
                        {type}
                    </div>
                ))}
            </div>
        </div>
    );
};
