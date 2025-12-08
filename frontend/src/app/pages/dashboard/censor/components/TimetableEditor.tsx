import { useState, useEffect } from 'react';
import { Calendar, Save, Plus } from 'lucide-react';
import api from '../../../../../shared/api/api';

const TimetableEditor = () => {
    const [selectedClassId, setSelectedClassId] = useState('');
    const [classes, setClasses] = useState<any[]>([]);
    const [schedule, setSchedule] = useState<any[]>([]);

    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    const slots = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00'];

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await api.get('/classes');
            setClasses(res.data);
        } catch (err) { console.error(err); }
    };

    // Mock fetch schedule for class
    useEffect(() => {
        if (!selectedClassId) {
            setSchedule([]);
            return;
        }
        // Mock data logic
        const mockSchedule = [
            { day: 'Lundi', slot: '08:00 - 09:00', subject: 'Mathématiques', teacher: 'M. Kouassi' },
            { day: 'Lundi', slot: '09:00 - 10:00', subject: 'Mathématiques', teacher: 'M. Kouassi' },
            { day: 'Mardi', slot: '10:00 - 11:00', subject: 'Français', teacher: 'Mme. Diallo' },
        ];
        setSchedule(mockSchedule);
    }, [selectedClassId]);

    const getEvent = (day: string, slot: string) => {
        return schedule.find(s => s.day === day && s.slot === slot);
    };

    return (
        <div className="space-y-6">
            {/* Header / Config */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Classe à planifier</label>
                        <select
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(e.target.value)}
                            className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white min-w-[200px]"
                        >
                            <option value="">-- Choisir une classe --</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>
                {selectedClassId && (
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                        <Save size={18} />
                        Sauvegarder
                    </button>
                )}
            </div>

            {/* Timetable Grid */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden overflow-x-auto">
                {selectedClassId ? (
                    <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-[#1e293b] text-gray-200">
                            <tr>
                                <th className="p-4 border-r border-white/10 text-center w-[150px]">Heure</th>
                                {days.map(day => (
                                    <th key={day} className="p-4 border-r border-white/10 text-center min-w-[200px]">{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {slots.map(slot => (
                                <tr key={slot}>
                                    <td className="p-4 border-r border-white/5 font-mono text-gray-400 text-center bg-[#0f172a] sticky left-0">
                                        {slot}
                                    </td>
                                    {days.map(day => {
                                        const event = getEvent(day, slot);
                                        return (
                                            <td key={`${day}-${slot}`} className="p-2 border-r border-white/5 relative h-[80px] hover:bg-white/5 transition-colors cursor-pointer group">
                                                {event ? (
                                                    <div className="bg-indigo-500/20 border border-indigo-500/30 p-2 rounded h-full flex flex-col justify-center">
                                                        <span className="text-white font-bold block">{event.subject}</span>
                                                        <span className="text-xs text-indigo-300 block">{event.teacher}</span>
                                                    </div>
                                                ) : (
                                                    <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                        <Plus className="text-gray-500" />
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-12 text-center text-gray-500">
                        <Calendar size={48} className="mx-auto mb-4 opacity-30" />
                        <p>Veuillez sélectionner une classe pour afficher l'emploi du temps.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimetableEditor;
