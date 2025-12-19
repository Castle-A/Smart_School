import { motion } from 'framer-motion';
import { Users, TrendingUp, AlertTriangle, FileText } from 'lucide-react';

export const OverviewView = () => {
    const stats = [
        { label: 'Taux de Présence', value: '94%', trend: '+2%', color: 'text-emerald-400', icon: Users },
        { label: 'Absences Aujourd\'hui', value: '12', trend: 'vs 15 hier', color: 'text-blue-400', icon: TrendingUp },
        { label: 'Incidents Signalés', value: '3', trend: 'cette semaine', color: 'text-rose-400', icon: AlertTriangle },
        { label: 'Sanctions Actives', value: '5', trend: 'en cours', color: 'text-amber-400', icon: FileText },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-[#1a1f37] border border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-lg"
                    >
                        <div>
                            <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                            <p className={`text-xs mt-1 ${stat.color}`}>{stat.trend}</p>
                        </div>
                        <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                            <stat.icon size={20} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Placeholder for charts or lists */}
            <div className="bg-[#1a1f37] border border-white/5 rounded-2xl p-6 min-h-[300px] flex items-center justify-center text-gray-400">
                Graphiques d'assiduité (À venir)
            </div>
        </div>
    );
};
