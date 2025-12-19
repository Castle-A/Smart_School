import { useState, useEffect } from 'react';
import {
    Users,
    GraduationCap,
    School,
    TrendingUp,
    AlertTriangle,
    Clock,
    CreditCard,
    UserPlus
} from 'lucide-react';
import { useAuth } from '../../../../shared/contexts/AuthContext';
import api from '../../../../shared/api/api';

interface SchoolKPIs {
    students: { total: number; trend: string };
    teachers: { total: number; active: number };
    classes: { total: number; occupancy: string };
    attendance: { absentToday: number; rate: string };
    finance: { revenueMonth: number };
}

const OverviewSection = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<SchoolKPIs | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (user?.schoolId) {
                try {
                    console.log('Fetching stats for school:', user.schoolId);
                    const response = await api.get(`/analytics/kpis/school/${user.schoolId}`);
                    console.log('Stats received:', response.data);
                    setStats(response.data);
                } catch (error) {
                    console.error("Failed to fetch dashboard stats", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchStats();
    }, [user?.schoolId]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Vue d'ensemble</h2>
                </div>
                <div className="text-right">
                    <p className="text-white font-medium">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="text-indigo-400 text-sm">Année scolaire 2024-2025</p>
                </div>
            </div>

            {/* KPI Principaux - Données Réelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    {
                        label: "Total Élèves",
                        value: loading ? "..." : (stats?.students?.total?.toString() || "0"),
                        sub: "Actifs sur la plateforme",
                        icon: GraduationCap,
                        color: "text-blue-400",
                        bg: "bg-blue-500/10",
                        trend: stats?.students?.trend || "0%"
                    },
                    {
                        label: "Enseignants",
                        value: loading ? "..." : (stats?.teachers?.total?.toString() || "0"),
                        sub: `Actifs: ${stats?.teachers?.active || 0}`,
                        icon: Users,
                        color: "text-indigo-400",
                        bg: "bg-indigo-500/10",
                        trend: "Stable"
                    },
                    {
                        label: "Classes & Groupes",
                        value: loading ? "..." : (stats?.classes?.total?.toString() || "0"),
                        sub: `Taux remplissage: ${stats?.classes?.occupancy || '0%'}`,
                        icon: School,
                        color: "text-emerald-400",
                        bg: "bg-emerald-500/10",
                        trend: "+0"
                    },
                    {
                        label: "Revenus (Mois)",
                        value: loading ? "..." : formatCurrency(stats?.finance?.revenueMonth || 0),
                        sub: `Absent d'ujour'hui: ${stats?.attendance?.absentToday || 0}`,
                        icon: TrendingUp,
                        color: "text-amber-400",
                        bg: "bg-amber-500/10",
                        trend: stats?.attendance?.rate || "0%"
                    }
                ].map((stat, idx) => (
                    <div key={idx} className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:shadow-lg hover:shadow-indigo-500/10 transition-all shadow-sm hover:z-10 hover:border-white/20">
                        <div className="flex justify-between items-start mb-3">
                            <div className={`p-2.5 rounded-lg ${stat.bg} ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-emerald-500/20 text-emerald-400' : stat.trend.startsWith('-') ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-gray-400'}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-sm text-slate-200 font-medium">{stat.label}</p>
                        <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Alertes Urgentes (Statique pour l'instant) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <AlertTriangle className="text-red-400" size={24} />
                            <h3 className="text-xl font-semibold text-white">Alertes & Attention Requise</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { title: "Paiements en retard", desc: `Plusieurs échéances dépassées ce mois-ci.`, type: "finance", time: "Ce mois" },
                                { title: "Absences élevées", desc: `Le taux d'absence a augmenté de 2% cette semaine.`, type: "academic", time: "Cette semaine" },
                            ].map((alert, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 bg-red-500/5 border border-red-500/10 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer">
                                    <div className={`mt-1 w-2 h-2 rounded-full ${idx === 0 ? 'bg-red-500 animate-pulse' : 'bg-red-400'}`}></div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-white font-medium text-sm">{alert.title}</h4>
                                            <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={10} /> {alert.time}</span>
                                        </div>
                                        <p className="text-sm text-slate-300 mt-1">{alert.desc}</p>
                                    </div>
                                    <button className="text-xs text-red-300 hover:text-white border border-red-500/30 px-2 py-1 rounded">
                                        Voir
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Activité Récente */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <Clock className="text-indigo-400" size={24} />
                            <h3 className="text-xl font-semibold text-white">Activité Récente</h3>
                        </div>
                        <div className="space-y-0 divide-y divide-white/10">
                            {[
                                { icon: UserPlus, color: "text-emerald-400", title: "Nouvelle Inscription", desc: "Consultation du module élèves...", time: "Récemment" },
                                { icon: CreditCard, color: "text-blue-400", title: "Mouvement Financier", desc: "Consultation du module finance...", time: "Récemment" },
                            ].map((activity, idx) => (
                                <div key={idx} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                                    <div className={`p-2 rounded-lg bg-white/10 ${activity.color}`}>
                                        <activity.icon size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white">{activity.title}</p>
                                        <p className="text-xs text-slate-400">{activity.desc}</p>
                                    </div>
                                    <span className="text-xs text-slate-400">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Right */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-6 text-white shadow-lg shadow-indigo-500/20">
                        <h3 className="font-bold text-lg mb-2">Support Premium</h3>
                        <p className="text-indigo-100 text-sm mb-4">Besoin d'aide ? Notre équipe est disponible 24/7 pour les fondateurs.</p>
                        <button className="w-full bg-white text-indigo-600 py-2 rounded-lg font-medium text-sm hover:bg-indigo-50 transition-colors">
                            Contacter le support
                        </button>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-white mb-4">Répartition Élèves</h3>
                        <div className="flex items-center justify-center p-4">
                            <p className="text-slate-400 text-sm">Données détaillées bientôt disponibles</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewSection;
