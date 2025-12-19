import { useEffect, useState } from 'react';
import { Users, Clock, CheckCircle } from 'lucide-react';

export const DailyStats = () => {
    const [stats, setStats] = useState({
        absent: 0,
        late: 0,
        present: 0, // This needs total students count to calculate accurately or be provided by backend
        rate: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mocking API call or implementing real one later
        // In real implementation, this would hit an endpoint like /vie-scolaire/attendance/today
        const fetchStats = async () => {
            try {
                // Simulating fetch
                setLoading(true);
                // const res = await api.get('/vie-scolaire/attendance/stats/daily');
                // setStats(res.data);

                // Temporary Mock
                setTimeout(() => {
                    setStats({ absent: 12, late: 5, present: 450, rate: 96.5 });
                    setLoading(false);
                }, 500);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { label: "Absences Aujourd'hui", value: stats.absent, icon: Users, color: "text-red-400", bg: "bg-red-500/20" },
        { label: "Retards", value: stats.late, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/20" },
        { label: "Taux Présence", value: `${stats.rate}%`, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/20" },
    ];

    if (loading) return <div className="h-24 bg-white/5 animate-pulse rounded-xl"></div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cards.map((stat, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
                    <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                        <stat.icon size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">{stat.label}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};
