import { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import api from '../../../../../../../shared/api/api';
import { toastEvents } from '../../../../../../../shared/utils/toast-events';

export const RecentAbsences = () => {
    const [absences, setAbsences] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAbsences = async () => {
        setIsLoading(true);
        try {
            // Needed endpoint: GET /vie-scolaire/attendance/unjustified (or sorted by date)
            const res = await api.get('/students?simple=true'); // Temporary hack to show list
            // In reality we need: const res = await api.get('/vie-scolaire/attendance');
            // Mocking data based on student list for display purposes until endpoint is ready
            const mockAbsences = res.data.slice(0, 5).map((s: any, index: number) => ({
                id: index,
                student: s,
                date: new Date().toISOString(),
                type: index % 2 === 0 ? 'ABSENCE' : 'RETARD',
                duration: index % 2 === 0 ? 'Journée' : '15 min',
                isJustified: false
            }));
            setAbsences(mockAbsences);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAbsences();
    }, []);

    const handleJustify = (id: string) => {
        toastEvents.info(`Fonctionnalité de justification pour l'ID ${id} à venir`);
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                </div>
                <button className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10">
                    <Filter size={18} />
                </button>
            </div>

            <div className="space-y-2">
                {isLoading ? (
                    <div className="text-gray-400 text-center py-4">Chargement...</div>
                ) : (
                    absences.map((item) => (
                        <div key={item.id} className="bg-white/5 rounded-lg p-3 flex justify-between items-center group hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`w-1 h-10 rounded-full ${item.type === 'ABSENCE' ? 'bg-red-500' : 'bg-amber-500'}`} />
                                <div>
                                    <h4 className="text-white font-medium text-sm">{item.student.firstName} {item.student.lastName}</h4>
                                    <div className="flex gap-2 text-xs text-gray-400">
                                        <span className={item.type === 'ABSENCE' ? 'text-red-400' : 'text-amber-400'}>{item.type}</span>
                                        <span>•</span>
                                        <span>{new Date(item.date).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{item.duration}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleJustify(item.id)}
                                    className="px-3 py-1.5 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 rounded text-xs font-medium transition-colors"
                                >
                                    Justifier
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
