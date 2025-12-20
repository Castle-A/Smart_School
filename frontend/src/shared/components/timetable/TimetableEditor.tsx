import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import api from '../../api/api';
import AddSessionModal from './modals/AddSessionModal';
import type { TimetableSession } from '../../types/timetable';

interface TimetableEditorProps {
    classId: string;
}

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const HOURS = Array.from({ length: 11 }, (_, i) => i + 7); // 7h to 17h (start times)

const TimetableEditor: React.FC<TimetableEditorProps> = ({ classId }) => {
    const [sessions, setSessions] = useState<TimetableSession[]>([]);
    // Removed unused loading, hoveredCell states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalDefaults, setModalDefaults] = useState<{ day: number, time: string } | undefined>(undefined);

    const fetchSchedule = async () => {
        if (!classId) return;
        // setLoading(true); removed
        try {
            const res = await api.get(`/timetable/class/${classId}`);
            setSessions(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            // setLoading(false); removed
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, [classId]);

    const handleCellClick = (dayIndex: number, hour: number) => {
        setModalDefaults({ day: dayIndex + 1, time: `${hour.toString().padStart(2, '0')}:00` });
        setIsModalOpen(true);
    };

    const handleAddSession = async () => {
        try {
            fetchSchedule();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteSession = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('Supprimer ce cours ?')) return;
        try {
            await api.delete(`/timetable/${id}`);
            fetchSchedule();
        } catch (error) {
            console.error(error);
        }
    };

    // Helper to calculate position/height of a session block
    const getSessionStyle = (session: TimetableSession) => {
        const startHour = parseInt(session.startTime.split(':')[0]);
        const startMin = parseInt(session.startTime.split(':')[1]);
        const endHour = parseInt(session.endTime.split(':')[0]);
        const endMin = parseInt(session.endTime.split(':')[1]);

        const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
        const startOffsetMinutes = (startHour - 7) * 60 + startMin;

        // Assuming 60px height per hour
        return {
            top: `${(startOffsetMinutes / 60) * 60}px`, // 60px per hour
            height: `${(durationMinutes / 60) * 60}px`,
            left: '2px',
            right: '2px'
        };
    };

    if (!classId) return <div className="text-center text-gray-500 py-10">Veuillez sélectionner une classe.</div>;

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col h-[600px] relative">
            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-[50px_1fr_1fr_1fr_1fr_1fr_1fr] min-w-[800px]">
                    {/* Header Row */}
                    <div className="sticky top-0 z-10 bg-[#1a1b23] border-b border-white/10 p-2"></div>
                    {DAYS.map((day) => (
                        <div key={day} className="sticky top-0 z-10 bg-[#1a1b23] border-b border-l border-white/10 p-2 text-center font-medium text-gray-300">
                            {day}
                        </div>
                    ))}

                    {/* Time Rows */}
                    <div className="col-span-7 relative h-[720px]"> {/* 12 hours * 60px */}
                        {/* Grid Lines & Hours */}
                        {HOURS.map((hour) => (
                            <div key={hour} className="absolute w-full border-b border-white/5 flex" style={{ top: `${(hour - 7) * 60}px`, height: '60px' }}>
                                <div className="w-[50px] text-xs text-gray-500 text-right pr-2 -mt-2.5">
                                    {hour}:00
                                </div>
                                {/* Day Columns BG */}
                                {DAYS.map((_, dayIndex) => (
                                    <div
                                        key={dayIndex}
                                        onClick={() => handleCellClick(dayIndex, hour)}
                                        className="flex-1 border-l border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors"
                                    />
                                ))}
                            </div>
                        ))}

                        {/* Sessions Overlay */}
                        {sessions.map(session => {
                            const dayIndex = session.dayOfWeek - 1;
                            if (dayIndex < 0 || dayIndex > 5) return null;

                            return (
                                <div
                                    key={session.id}
                                    className="absolute rounded bg-indigo-600/80 border border-indigo-500/50 p-1 text-xs text-white overflow-hidden hover:bg-indigo-600 z-10 shadow-lg group"
                                    style={{
                                        ...getSessionStyle(session),
                                        left: `calc(50px + ${(100 / 6 * dayIndex)}% + 2px)`,
                                        width: `calc(${100 / 6}% - 4px)` // 100% of remaining width divided by 6
                                        // Simplify: Just use fixed grid math or absolute positioning based on col index
                                        // Actually "left" logic above assumes full width is query.
                                        // Better: Place them inside the grid column if I used grid.
                                        // But I used absolute for time.
                                        // Let's refine style:
                                    }}
                                >
                                    <div className="font-bold truncate">{session.subject?.name || 'Matière'}</div>
                                    <div className="text-indigo-200 truncate">{session.teacher?.lastName}</div>
                                    {session.roomId && <div className="absolute top-1 right-1 bg-black/30 px-1 rounded text-[9px]">{session.roomId}</div>}

                                    <button
                                        onClick={(e) => handleDeleteSession(e, session.id)}
                                        className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 p-1 bg-red-500/80 rounded hover:bg-red-600 transition-opacity"
                                    >
                                        <Trash2 size={10} />
                                    </button>
                                </div>
                            );
                        })}

                        {/* Improve Layout:
                             The "left" calculation above is tricky with responsive grid.
                             Alternative: Render a GRID logic instead of absolute Time logic?
                             Grid logic is better for columns. Absolute for rows (time).
                             So:
                             For each day column, render a relative container.
                             Inside that container, place sessions absolute.
                             Let's rewrite the render loop slightly to follow this.
                         */}
                    </div>
                </div>

                {/* Re-implementing clearer structure for columns */}
                <div className="absolute top-[40px] left-[50px] right-0 bottom-0 grid grid-cols-6 pointer-events-none">
                    {DAYS.map((_, dayIndex) => (
                        <div key={dayIndex} className="relative h-full border-l border-white/5 pointer-events-auto">
                            {sessions.filter(s => s.dayOfWeek === dayIndex + 1).map(session => (
                                <div
                                    key={session.id}
                                    className="absolute left-1 right-1 rounded bg-indigo-600/80 border border-indigo-500/50 p-1 text-xs text-white overflow-hidden hover:bg-indigo-600 z-10 shadow-lg group cursor-pointer"
                                    style={getSessionStyle(session)}
                                >
                                    <div className="font-bold truncate">{session.subject?.name || 'Matière'}</div>
                                    <div className="text-indigo-200 truncate">{session.teacher?.lastName}</div>
                                    {session.roomId && <div className="absolute top-1 right-1 bg-black/30 px-1 rounded text-[9px]">{session.roomId}</div>}

                                    <button
                                        onClick={(e) => handleDeleteSession(e, session.id)}
                                        className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 p-1 text-red-200 hover:text-white transition-opacity"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <AddSessionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddSession}
                classId={classId}
                dayDefault={modalDefaults?.day}
                timeDefault={modalDefaults?.time}
            />
        </div>
    );
};

export default TimetableEditor;
