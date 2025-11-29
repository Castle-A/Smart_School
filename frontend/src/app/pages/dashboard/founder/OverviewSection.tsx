import {
    Users,
    GraduationCap,
    School,
    TrendingUp,
    AlertTriangle,
    Clock,
    CheckCircle,
    FileText,
    CreditCard,
    UserPlus
} from 'lucide-react';

const OverviewSection = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Vue d'ensemble</h2>
                    <p className="text-gray-400 text-sm">Bienvenue sur votre tableau de bord</p>
                </div>
                <div className="text-right">
                    <p className="text-white font-medium">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="text-indigo-400 text-sm">Année scolaire 2024-2025</p>
                </div>
            </div>

            {/* KPI Principaux */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total Élèves", value: "1,245", sub: "Pri: 450 | Col: 500 | Lyc: 295", icon: GraduationCap, color: "text-blue-400", bg: "bg-blue-500/10", trend: "+12%" },
                    { label: "Enseignants", value: "84", sub: "Actifs aujourd'hui: 78", icon: Users, color: "text-purple-400", bg: "bg-purple-500/10", trend: "Stable" },
                    { label: "Classes Actives", value: "42", sub: "Taux remplissage: 88%", icon: School, color: "text-emerald-400", bg: "bg-emerald-500/10", trend: "+2" },
                    { label: "Absentéisme", value: "3.2%", sub: "45 élèves absents ce jour", icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10", trend: "-0.5%" }
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                            <div className={`p-2.5 rounded-lg ${stat.bg} ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-emerald-500/20 text-emerald-400' : stat.trend.startsWith('-') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-gray-400'}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-sm text-gray-300 font-medium">{stat.label}</p>
                        <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Alertes Urgentes */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <AlertTriangle className="text-red-400" size={24} />
                            <h3 className="text-xl font-semibold text-white">Alertes Urgentes</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { title: "Tentatives de connexion suspectes", desc: "3 tentatives échouées sur le compte 'Admin' (IP inconnue)", type: "security", time: "Il y a 15 min" },
                                { title: "Impayés Critiques (> 30 jours)", desc: "12 élèves concernés - Montant total: 850.000 FCFA", type: "finance", time: "Aujourd'hui" },
                                { title: "Absences non justifiées", desc: "Classe 3ème B : 8 élèves absents sans motif ce matin", type: "academic", time: "Ce matin, 08:30" },
                                { title: "Documents en attente", desc: "5 bulletins de notes en attente de validation finale", type: "admin", time: "Hier" }
                            ].map((alert, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 bg-red-500/5 border border-red-500/10 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer">
                                    <div className={`mt-1 w-2 h-2 rounded-full ${idx === 0 ? 'bg-red-500 animate-pulse' : 'bg-red-400'}`}></div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-white font-medium text-sm">{alert.title}</h4>
                                            <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={10} /> {alert.time}</span>
                                        </div>
                                        <p className="text-sm text-gray-400 mt-1">{alert.desc}</p>
                                    </div>
                                    <button className="text-xs text-red-300 hover:text-white border border-red-500/30 px-2 py-1 rounded">
                                        Voir
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Activité Récente */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Clock className="text-indigo-400" size={24} />
                            <h3 className="text-xl font-semibold text-white">Activité Récente</h3>
                        </div>
                        <div className="space-y-0 divide-y divide-white/5">
                            {[
                                { icon: UserPlus, color: "text-emerald-400", title: "Nouvelle Inscription", desc: "Sophie K. inscrite en 6ème A", time: "10:45" },
                                { icon: CreditCard, color: "text-blue-400", title: "Paiement Reçu", desc: "Scolarité 2ème tranche - Jean M.", time: "10:30" },
                                { icon: FileText, color: "text-purple-400", title: "Bulletins Générés", desc: "Lot de 45 bulletins (Terminale C)", time: "09:15" },
                                { icon: CheckCircle, color: "text-amber-400", title: "Appel Validé", desc: "Classe 5ème B - Prof. Tournesol", time: "08:15" }
                            ].map((activity, idx) => (
                                <div key={idx} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                                    <div className={`p-2 rounded-lg bg-white/5 ${activity.color}`}>
                                        <activity.icon size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white">{activity.title}</p>
                                        <p className="text-xs text-gray-400">{activity.desc}</p>
                                    </div>
                                    <span className="text-xs text-gray-500">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions / Sidebar Right (Optional or just stats) */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white shadow-lg shadow-indigo-500/20">
                        <h3 className="font-bold text-lg mb-2">Support Premium</h3>
                        <p className="text-indigo-100 text-sm mb-4">Besoin d'aide ? Notre équipe est disponible 24/7 pour les fondateurs.</p>
                        <button className="w-full bg-white text-indigo-600 py-2 rounded-lg font-medium text-sm hover:bg-indigo-50 transition-colors">
                            Contacter le support
                        </button>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Répartition Élèves</h3>
                        <div className="space-y-4">
                            {[
                                { label: "Primaire", val: 35, color: "bg-emerald-500" },
                                { label: "Collège", val: 42, color: "bg-blue-500" },
                                { label: "Lycée", val: 23, color: "bg-purple-500" }
                            ].map((item, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-xs mb-1 text-gray-300">
                                        <span>{item.label}</span>
                                        <span>{item.val}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewSection;
