import React, { useState, useEffect } from 'react';
import {
    UserPlus,
    FileText,
    Search,
    Printer,
    Users,
    ArrowRight,
    CheckCircle,
    Clock,
    Filter,
    Bell
} from 'lucide-react';
import { useAuth } from '../../../../shared/contexts/AuthContext';
import api from '../../../../shared/api/api';

const SecretaryOverviewSection = () => {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [showSearch, setShowSearch] = useState(false);
    const [showFilter, setShowFilter] = useState(false);

    // Real Data States
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);

    // Debounce Search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.length > 1) {
                setSearching(true);
                try {
                    const response = await api.get('/students', { params: { search: searchQuery } });
                    setSearchResults(response.data);
                } catch (error) {
                    console.error("Erreur recherche:", error);
                } finally {
                    setSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Fetch Notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await api.get('/notifications');
                if (Array.isArray(res.data)) {
                    setNotifications(res.data);
                } else {
                    console.warn("Notifications response is not an array:", res.data);
                    setNotifications([]);
                }
            } catch (err) {
                console.error("Failed to fetch notifications", err);
                setNotifications([]);
            }
        };
        fetchNotifications();
    }, []);


    const getScopeLabel = () => {
        if (user?.directorType === 'PRIMARY_PRESCHOOL') return 'Primaire & Maternelle';
        if (user?.directorType === 'COLLEGE') return 'Collège & Lycée';
        return 'Tout l\'établissement';
    };

    const getNotifStyle = (type: string) => {
        switch (type) {
            case 'SECURITY': return 'bg-red-500 animate-pulse';
            case 'VALIDATION': return 'bg-amber-500';
            default: return 'bg-indigo-500'; // PAYMENT, SYSTEM, etc.
        }
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHrs < 1) return 'À l\'instant';
        if (diffHrs < 24) return `Il y a ${diffHrs}h`;
        return date.toLocaleDateString();
    };

    const [stats, setStats] = useState({ today: 0, pending: 0, documents: 0 });

    // ... (existing search useEffect)

    // Fetch Stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [pendingRes, allRes] = await Promise.all([
                    api.get('/students', { params: { status: 'PENDING' } }),
                    api.get('/students')
                ]);

                const pendingCount = Array.isArray(pendingRes.data) ? pendingRes.data.length : 0;

                const today = new Date().toISOString().split('T')[0];
                const todayCount = Array.isArray(allRes.data)
                    ? allRes.data.filter((s: any) => s.createdAt.startsWith(today)).length
                    : 0;

                setStats({
                    today: todayCount,
                    pending: pendingCount,
                    documents: 28 // Mock for now or calculate based on requests
                });
            } catch (e) {
                console.error("Failed to fetch stats", e);
            }
        };
        fetchStats();
    }, []);

    // ... (existing notifications useEffect)

    // ...

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Vue d'Ensemble</h2>
                    <p className="text-gray-400">
                        Espace Secrétariat • <span className="text-indigo-400 font-medium">{getScopeLabel()}</span>
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-400">Aujourd'hui</p>
                    <p className="text-xl font-bold text-white">
                        {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>
            </div>

            {/* KPIs Interactifs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-lg bg-indigo-500/10">
                            <UserPlus className="text-indigo-400" size={24} />
                        </div>
                        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full flex items-center gap-1">
                            <ArrowRight size={12} /> Voir liste
                        </span>
                    </div>
                    <div className="mb-1">
                        <h3 className="text-3xl font-bold text-white">{stats.today}</h3>
                        <p className="text-sm text-gray-400">Inscriptions ce jour</p>
                    </div>
                    <div className="w-full bg-white/5 h-1 mt-4 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full w-[45%]"></div>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-lg bg-amber-500/10">
                            <Clock className="text-amber-400" size={24} />
                        </div>
                        <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full">
                            Action requise
                        </span>
                    </div>
                    <div className="mb-1">
                        <h3 className="text-3xl font-bold text-white">{stats.pending}</h3>
                        <p className="text-sm text-gray-400">Dossiers en attente</p>
                    </div>
                    {stats.pending > 0 && (
                        <p className="text-xs text-amber-400 mt-4">{stats.pending} à valider par le Directeur</p>
                    )}
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-lg bg-emerald-500/10">
                            <Printer className="text-emerald-400" size={24} />
                        </div>
                        <span className="text-xs bg-white/10 text-gray-400 px-2 py-1 rounded-full">
                            Semaine en cours
                        </span>
                    </div>
                    <div className="mb-1">
                        <h3 className="text-3xl font-bold text-white">{stats.documents}</h3>
                        <p className="text-sm text-gray-400">Documents générés</p>
                    </div>
                    <p className="text-xs text-emerald-400 mt-4">+12% vs semaine dernière</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Widget Guichet Rapide */}
                <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900/40 to-slate-900/40 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6 relative overflow-visible transition-all duration-300"
                    style={{ minHeight: '150px' }}>
                    <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>

                    {/* Click Outside Handler Wrapper */}
                    <ClickOutsideHandler onOutside={() => { setShowSearch(false); setShowFilter(false); setSearching(false); setSearchResults([]); }}>
                        {/* Header Interactif */}
                        {/* Header Interactif */}
                        <div className="flex items-center justify-between mb-6 relative z-20 h-10 gap-4">
                            <div className="flex-shrink-0 flex items-center gap-3">
                                <h3 className="text-xl font-semibold text-white">Guichet Rapide</h3>
                            </div>

                            {/* Barre de Recherche Dynamique (Remplit l'espace vide) */}
                            <div className={`flex-1 relative transition-all duration-300 ${showSearch ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                                {showSearch && (
                                    <div className="w-full relative animate-in fade-in zoom-in-95 duration-200">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={20} />
                                        <input
                                            id="quick-search"
                                            autoFocus
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setSelectedStudent(null);
                                            }}
                                            placeholder="Rechercher..."
                                            className="w-full pl-10 pr-10 py-2 bg-white/10 border border-indigo-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:bg-white/20 transition-all font-medium"
                                        />
                                        {searching && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        )}

                                        {/* Dropdown Résultats */}
                                        {searchResults.length > 0 && !selectedStudent && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1f3c] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 max-h-60 overflow-y-auto custom-scrollbar">
                                                {searchResults.map((student: any) => (
                                                    <div
                                                        key={student.id}
                                                        onClick={() => {
                                                            setSelectedStudent(student);
                                                            setSearchQuery(`${student.firstName} ${student.lastName}`);
                                                            setSearchResults([]);
                                                        }}
                                                        className="p-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 flex justify-between items-center group"
                                                    >
                                                        <div>
                                                            <p className="text-white font-medium group-hover:text-indigo-300 transition-colors uppercase text-sm">{student.lastName} {student.firstName}</p>
                                                            <p className="text-[10px] text-gray-400">{student.matricule || 'Sans Matricule'}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Actions Buttons */}
                            <div className="flex gap-2 ml-2 relative">
                                {!showSearch && (
                                    <button
                                        onClick={() => { setShowSearch(true); setShowFilter(false); }}
                                        className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                    >
                                        <Search size={20} />
                                    </button>
                                )}
                                <div className="relative">
                                    <button
                                        onClick={() => { setShowFilter(!showFilter); setShowSearch(false); }}
                                        className={`p-2 rounded-lg transition-colors ${showFilter ? 'bg-indigo-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                                    >
                                        <Filter size={20} />
                                    </button>

                                    {/* Popup Filtre */}
                                    {showFilter && (
                                        <div className="absolute top-full right-0 mt-2 w-64 bg-[#1e293b] border border-white/10 rounded-xl shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                                            <p className="text-gray-400 text-xs mb-3 font-medium uppercase tracking-wider">Filtrer par</p>
                                            <div className="space-y-2">
                                                {['Inscriptions du jour', 'Dossiers Incomplets', 'Nouveaux Élèves', 'Documents en attente'].map(filter => (
                                                    <button key={filter} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-between group">
                                                        {filter}
                                                        <CheckCircle size={14} className="opacity-0 group-hover:opacity-100 text-indigo-400 transition-opacity" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 mt-4 min-h-[100px]">
                            {/* Message par défaut */}
                            {!selectedStudent && (
                                <div className="text-center text-gray-500 py-8 italic border border-dashed border-white/10 rounded-xl bg-white/5">
                                    {showSearch ? 'Tapez le nom d\'un élève...' : 'Recherchez un élève pour accéder aux actions rapides.'}
                                </div>
                            )}

                            {/* Actions Suggérées après sélection */}
                            {selectedStudent && (
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10 animate-in fade-in slide-in-from-bottom-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-white font-medium flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                            <span className="text-indigo-400 uppercase font-bold">{selectedStudent.lastName} {selectedStudent.firstName}</span>
                                        </h4>
                                        <button
                                            onClick={() => {
                                                setSelectedStudent(null);
                                                setSearchQuery('');
                                            }}
                                            className="text-xs text-gray-400 hover:text-white underline decoration-gray-600 hover:decoration-white underline-offset-2"
                                        >
                                            Effacer
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {[
                                            { label: 'Certificat', icon: Printer, color: 'text-indigo-400', bg: 'hover:bg-indigo-500/10' },
                                            { label: 'Parents', icon: UserPlus, color: 'text-emerald-400', bg: 'hover:bg-emerald-500/10' },
                                            { label: 'Bulletin', icon: FileText, color: 'text-amber-400', bg: 'hover:bg-amber-500/10' },
                                            { label: 'Dossier', icon: Users, color: 'text-blue-400', bg: 'hover:bg-blue-500/10' },
                                        ].map((action, i) => (
                                            <button key={i} className={`flex flex-col items-center justify-center gap-2 p-3 bg-black/20 ${action.bg} border border-white/5 hover:border-white/20 rounded-lg transition-all text-sm text-gray-300 hover:text-white group`}>
                                                <action.icon size={20} className={`${action.color} group-hover:scale-110 transition-transform`} />
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </ClickOutsideHandler>
                </div>

                {/* Notifications & Tâches */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Bell className="text-amber-400" size={24} />
                            <h3 className="text-xl font-semibold text-white">Notifications & Alertes</h3>
                        </div>
                    </div>

                    <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                        {!Array.isArray(notifications) || notifications.length === 0 ? (
                            <p className="text-center text-gray-500 py-4">Aucune notification</p>
                        ) : (
                            notifications.map((notif, idx) => (
                                <div key={idx} className="group flex items-start gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-white/10">
                                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${getNotifStyle(notif.type)}`} />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm font-medium text-white group-hover:text-indigo-400 transition-colors">
                                                {notif.title}
                                            </p>
                                            <p className="text-xs text-gray-500">{formatTime(notif.createdAt)}</p>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">{notif.message}</p>
                                    </div>
                                    {!notif.isRead && (
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1 hover:bg-white/10 rounded">
                                                <CheckCircle size={16} className="text-gray-400 hover:text-emerald-400" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                    <button className="w-full mt-6 py-3 text-sm text-indigo-300 hover:text-white border border-indigo-500/30 hover:bg-indigo-500/20 rounded-xl transition-all">
                        Voir toutes les notifications
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SecretaryOverviewSection;

// Helper to handle clicks outside
const ClickOutsideHandler = ({ onOutside, children }: { onOutside: () => void, children: React.ReactNode }) => {
    const wrapperRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                onOutside();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef, onOutside]);

    return <div ref={wrapperRef} className="h-full">{children}</div>;
};
