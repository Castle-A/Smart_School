import React, { useState } from 'react';
import {
    Users,
    Clock,
    UserCheck,
    AlertTriangle,
    ArrowRight,
    MapPin,
    Calendar,
    Bell,
    CheckCircle,
    XCircle,
    Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SurveillantOverviewSectionProps {
    onNavigate: (section: string) => void;
}

const SurveillantOverviewSection: React.FC<SurveillantOverviewSectionProps> = ({ onNavigate }) => {
    const [selectedNotification, setSelectedNotification] = useState<any | null>(null);

    // Quick Actions Config
    const quickActions = [
        {
            id: 'incident',
            label: 'Signaler Incident',
            desc: 'Tenue, bagarre, matériel...',
            icon: AlertTriangle,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
            action: () => onNavigate('vie_scolaire')
        },
        {
            id: 'attendance',
            label: 'Faire l\'appel',
            desc: 'Noter les absents du cours',
            icon: UserCheck,
            color: 'text-indigo-400',
            bg: 'bg-indigo-500/10',
            border: 'border-indigo-500/20',
            action: () => onNavigate('vie_scolaire')
        },
        {
            id: 'schedule',
            label: 'Voir Planning',
            desc: 'Occupation des salles',
            icon: Calendar,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            action: () => onNavigate('programme_scolaire')
        }
    ];

    // Mock KPI Data
    const kpis = [
        {
            label: 'Absences du jour',
            value: '12',
            sub: '+2 vs hier',
            icon: UserCheck,
            color: 'text-red-400',
            path: 'vie_scolaire',
            bg: 'bg-red-500/10',
            border: 'border-red-500/20'
        },
        {
            label: 'Retards',
            value: '5',
            sub: 'Matinée',
            icon: Clock,
            color: 'text-amber-400',
            path: 'vie_scolaire',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20'
        },
        {
            label: 'Incidents',
            value: '3',
            sub: '1 grave',
            icon: AlertTriangle,
            color: 'text-orange-400',
            path: 'vie_scolaire',
            bg: 'bg-orange-500/10',
            border: 'border-orange-500/20'
        },
        {
            label: 'Élèves Présents',
            value: '95%',
            sub: 'Sur 450 élèves',
            icon: Users,
            color: 'text-emerald-400',
            path: 'administration',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20'
        }
    ];

    // Mock Notifications (Inspired by Censor)
    const notifications = [
        { id: 1, type: 'alert', title: 'Absence Professeur', desc: 'M. Kouassi absent (Maths - 3ème A). Salle 102 à surveiller.', time: '08:05', status: 'URGENT' },
        { id: 2, type: 'info', title: 'Changement de Salle', desc: 'Le cours de SVT (Tle D) déplacé en Salle 204.', time: '09:30', status: 'INFO' },
        { id: 3, type: 'request', title: 'Demande de Sortie', desc: 'Élève Koné (4ème B) - Motif médical. À valider.', time: '10:15', status: 'ACTION' },
    ];

    return (
        <div className="space-y-6 animate-fade-in pb-8">
            {/* Header with Date */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Tableau de Bord - Surveillance</h2>
                    <p className="text-gray-400">Suivi en temps réel de la vie scolaire et des mouvements.</p>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-white font-medium">
                        {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                    <p className="text-indigo-400 text-sm">Zone de Surveillance A</p>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action) => (
                    <motion.button
                        key={action.id}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={action.action}
                        className={`group relative flex items-start gap-4 p-4 rounded-xl border ${action.border} ${action.bg} text-left transition-all hover:shadow-lg hover:shadow-indigo-500/10 z-10 hover:z-20`}
                    >
                        <div className={`p-3 rounded-lg bg-[#1e293b] ${action.color} group-hover:scale-110 transition-transform`}>
                            <action.icon size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg group-hover:text-indigo-200 transition-colors">{action.label}</h3>
                            <p className="text-sm text-gray-400 mt-1">{action.desc}</p>
                        </div>
                        <ArrowRight className="absolute top-4 right-4 text-white/20 group-hover:text-white/60 transition-colors" size={20} />
                    </motion.button>
                ))}
            </div>

            {/* KPI Section - Explicitly Clickable */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ y: -4 }}
                        onClick={() => onNavigate(kpi.path)}
                        className={`relative p-4 rounded-xl border ${kpi.border} bg-[#1e293b] hover:bg-[#252f45] cursor-pointer transition-all shadow-md hover:shadow-xl hover:shadow-indigo-500/10 z-10 hover:z-20 group`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className={`p-2 rounded-lg ${kpi.bg}`}>
                                <kpi.icon size={20} className={kpi.color} />
                            </div>
                            <span className="text-[10px] text-gray-500 group-hover:text-white transition-colors bg-white/5 px-2 py-0.5 rounded-full">Voir détails</span>
                        </div>
                        <p className="text-3xl font-bold text-white mt-2">{kpi.value}</p>
                        <p className="text-gray-400 text-sm font-medium mt-1">{kpi.label}</p>
                        <p className="text-gray-500 text-xs mt-1">{kpi.sub}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Notifications & Actions (Censor Inspired) */}
                    <div className="bg-[#1e293b] rounded-xl border border-white/10 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/10 rounded-lg">
                                    <Bell className="text-indigo-400" size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-white">Notifications & Alertes</h3>
                            </div>
                            <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                                3 Nouvelles
                            </span>
                        </div>

                        <div className="space-y-3">
                            {notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => setSelectedNotification(notif)}
                                    className="group flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer"
                                >
                                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${notif.status === 'URGENT' ? 'bg-red-500 animate-pulse' :
                                        notif.status === 'ACTION' ? 'bg-amber-500' : 'bg-blue-500'
                                        }`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-white font-medium text-sm truncate">{notif.title}</h4>
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <Clock size={10} /> {notif.time}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm mt-1">{notif.desc}</p>
                                    </div>
                                    <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-lg transition-all text-gray-300 hover:text-white text-xs border border-white/10">
                                        Gérer
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 py-2 text-sm text-center text-gray-400 hover:text-white border border-dashed border-white/10 rounded-lg hover:bg-white/5 transition-all">
                            Voir toutes les notifications
                        </button>
                    </div>

                    {/* Planning / Occupation */}
                    <div className="bg-[#1e293b] rounded-xl border border-white/10 p-6 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                            <MapPin size={100} className="text-white" />
                        </div>
                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <MapPin className="text-emerald-400" size={20} />
                                Ma Surveillance Directe
                            </h3>
                            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded text-xs font-bold border border-emerald-500/30">
                                EN COURS
                            </span>
                        </div>

                        <div className="relative z-10 bg-black/40 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                            <div className="flex items-start md:items-center gap-5 flex-col md:flex-row">
                                <div className="p-4 bg-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-900/50">
                                    <Users size={32} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xl font-bold text-white">Permanence - Hall Principal</h4>
                                    <div className="flex flex-wrap gap-4 mt-2">
                                        <p className="text-gray-400 text-sm flex items-center gap-1">
                                            <Clock size={14} /> 10:00 - 12:00
                                        </p>
                                        <p className="text-gray-400 text-sm flex items-center gap-1">
                                            <AlertTriangle size={14} /> Zone à risque calme
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right w-full md:w-auto border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 mt-4 md:mt-0">
                                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Fin dans</p>
                                    <p className="text-2xl font-bold text-white font-mono">45 min</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Tools */}
                <div className="space-y-6">
                    {/* Annuaire Rapide */}
                    <div className="bg-[#1e293b] rounded-xl border border-white/10 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Users className="text-blue-400" size={20} />
                            <h3 className="text-lg font-bold text-white">Recherche Rapide</h3>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="text"
                                placeholder="Nom élève ou classe..."
                                className="w-full bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>
                        <div className="mt-4 space-y-2">
                            <p className="text-xs text-gray-500 uppercase font-bold">Suggestions</p>
                            {['3ème A', 'Tle D', 'Kouamé (6ème)'].map((tag) => (
                                <button key={tag} className="block w-full text-left px-3 py-2 rounded hover:bg-white/5 text-sm text-gray-300 transition-colors">
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Classes à Surveiller (Similar to Censor) */}
                    <div className="bg-[#1e293b] rounded-xl border border-white/10 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="text-orange-400" size={20} />
                            <h3 className="text-lg font-bold text-white">Classes Difficiles</h3>
                            <span className="text-xs text-gray-500 ml-auto">(Ate)</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {['4ème B', '5ème C', '2nde A'].map((cls) => (
                                <span key={cls} className="px-3 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-300 rounded-lg text-sm cursor-pointer hover:bg-orange-500/20 transition-colors">
                                    {cls}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* Notification Layout */}
            <AnimatePresence>
                {selectedNotification && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedNotification(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-xl font-bold text-white">Détails de la Notification</h3>
                                <button onClick={() => setSelectedNotification(null)} className="text-gray-400 hover:text-white">
                                    <XCircle size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-black/20 p-4 rounded-xl">
                                    <p className="text-gray-400 text-sm mb-1">Titre</p>
                                    <p className="text-white font-medium">{selectedNotification.title}</p>
                                </div>
                                <div className="bg-black/20 p-4 rounded-xl">
                                    <p className="text-gray-400 text-sm mb-1">Description</p>
                                    <p className="text-white text-sm leading-relaxed">{selectedNotification.desc}</p>
                                </div>
                                <div className="flex justify-between items-center bg-black/20 p-4 rounded-xl">
                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">Heure</p>
                                        <p className="text-white font-mono">{selectedNotification.time}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${selectedNotification.status === 'URGENT' ? 'bg-red-500/20 text-red-400' :
                                        selectedNotification.status === 'ACTION' ? 'bg-amber-500/20 text-amber-400' :
                                            'bg-blue-500/20 text-blue-400'
                                        }`}>
                                        {selectedNotification.status}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setSelectedNotification(null)}
                                    className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    Fermer
                                </button>
                                {selectedNotification.status === 'ACTION' && (
                                    <button
                                        onClick={() => {
                                            // Handle action
                                            setSelectedNotification(null);
                                        }}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2"
                                    >
                                        <CheckCircle size={16} />
                                        Traiter
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SurveillantOverviewSection;
