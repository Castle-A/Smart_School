import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export interface CalendarEvent {
    id: string;
    title: string;
    start: string | Date;
    end: string | Date;
    type: 'ACADEMIC_PERIOD' | 'HOLIDAY' | 'EXAM' | 'FINANCIAL' | 'MEETING' | 'OTHER';
    description?: string;
    isSystem?: boolean;
}

interface TimelineCalendarProps {
    events: CalendarEvent[];
    onDateClick?: (date: Date) => void;
    onEventClick?: (event: CalendarEvent) => void;
    onAddEvent?: () => void;
    canAdd?: boolean;
    loading?: boolean;
}

const TYPE_COLORS: Record<string, string> = {
    ACADEMIC_PERIOD: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    HOLIDAY: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
    EXAM: 'bg-red-500/20 text-red-300 border-red-500/50',
    FINANCIAL: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    MEETING: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
    OTHER: 'bg-gray-500/20 text-gray-300 border-gray-500/50',
};

const TimelineCalendar: React.FC<TimelineCalendarProps> = ({ events, onDateClick, onEventClick, onAddEvent, canAdd = false }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const startDate = startOfMonth(currentDate);
    const endDate = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    const getEventsForDay = (day: Date) => {
        return events.filter(event => {
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end);
            return (
                isSameDay(day, eventStart) ||
                (day > eventStart && day < eventEnd) ||
                isSameDay(day, eventEnd)
            );
        });
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col h-[600px]">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-4">
                    <h3 className="text-xl font-bold text-white capitalize">
                        {format(currentDate, 'MMMM yyyy', { locale: fr })}
                    </h3>
                    <div className="flex rounded-lg bg-black/20 p-1">
                        <button onClick={handlePrevMonth} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-xs font-medium text-gray-400 hover:text-white transition-colors border-x border-white/10 mx-1">
                            Aujourd'hui
                        </button>
                        <button onClick={handleNextMonth} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex gap-2">
                    {canAdd && (
                        <button
                            onClick={onAddEvent}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20 text-sm font-medium"
                        >
                            <Plus size={16} />
                            Nouvel Événement
                        </button>
                    )}
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-7 border-b border-white/10 sticky top-0 bg-[#1a1b23] z-10">
                    {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                        <div key={day} className="py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 min-h-full auto-rows-fr">
                    {/* Add empty cells for start of month spacing if needed using getDay() */}
                    {Array.from({ length: (startDate.getDay() + 6) % 7 }).map((_, i) => (
                        <div key={`empty-${i}`} className="border-b border-r border-white/5 bg-white/[0.02]" />
                    ))}

                    {days.map(day => {
                        const dayEvents = getEventsForDay(day);
                        const isToday = isSameDay(day, new Date());

                        return (
                            <div
                                key={day.toString()}
                                onClick={() => onDateClick?.(day)}
                                className={`min-h-[100px] border-b border-r border-white/10 p-2 transition-colors hover:bg-white/5 cursor-pointer relative group ${!isSameMonth(day, currentDate) ? 'bg-white/[0.02]' : ''
                                    }`}
                            >
                                <div className={`text-sm font-medium mb-2 w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-gray-400'
                                    }`}>
                                    {format(day, 'd')}
                                </div>

                                <div className="space-y-1">
                                    {dayEvents.map(event => (
                                        <div
                                            key={event.id}
                                            onClick={(e) => { e.stopPropagation(); onEventClick?.(event); }}
                                            className={`text-xs px-2 py-1 rounded border truncate transition-transform hover:scale-105 ${TYPE_COLORS[event.type] || TYPE_COLORS.OTHER}`}
                                            title={event.title}
                                        >
                                            {event.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Legend footer */}
            <div className="p-3 bg-white/5 border-t border-white/10 flex gap-4 text-xs text-gray-400 overflow-x-auto">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500/50"></span> Période
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/50"></span> Congés/Vacances
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-red-500/20 border border-red-500/50"></span> Examens
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-yellow-500/20 border border-yellow-500/50"></span> Finance
                </div>
            </div>
        </div>
    );
};

export default TimelineCalendar;
