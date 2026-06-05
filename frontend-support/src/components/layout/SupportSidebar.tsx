
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Inbox,
    ShieldCheck,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    LifeBuoy,
    BarChart3,
    Users
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface NavItemProps {
    icon: any;
    label: string;
    href: string;
    isCollapsed: boolean;
    isActive: boolean;
}

const NavItem = ({ icon: Icon, label, href, isCollapsed, isActive }: NavItemProps) => (
    <Link to={href}>
        <motion.div
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
            )}
        >
            <Icon size={20} className={cn("shrink-0", isActive ? "text-white" : "group-hover:text-blue-400")} />
            {!isCollapsed && (
                <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm font-semibold tracking-wide"
                >
                    {label}
                </motion.span>
            )}
            {isActive && (
                <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                />
            )}
        </motion.div>
    </Link>
);

import { useAuth } from '../../context/AuthContext';

export default function SupportSidebar() {
    const { user, logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    const navItems = [
        { icon: Inbox, label: 'Inbox', href: '/inbox' },
        { icon: ShieldCheck, label: 'Logs d\'Audit', href: '/audit-logs' },
        { icon: Users, label: 'Écoles', href: '/schools' },
        ...(user?.platformRole === 'SUPER_ADMIN_PLATFORM' ? [
            { icon: Users, label: 'Équipe Support', href: '/team' }
        ] : []),
        { icon: BarChart3, label: 'Statistiques', href: '/stats' },
    ];

    const bottomItems = [
        { icon: LifeBuoy, label: 'Aide', href: '/help' },
        { icon: Settings, label: 'Paramètres', href: '/settings' },
    ];

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 80 : 260 }}
            className="relative flex flex-col h-screen bg-slate-950 border-r border-slate-800/50 z-50 transition-all duration-300 ease-in-out"
        >
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-blue-500/[0.02] backdrop-blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="p-6 flex items-center justify-between">
                <AnimatePresence mode="wait">
                    {!isCollapsed ? (
                        <motion.div
                            key="full-logo"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white shadow-xl shadow-blue-900/20">
                                S
                            </div>
                            <span className="font-black text-lg tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                SUPPORT <span className="text-blue-500">DESK</span>
                            </span>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="small-logo"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white shadow-xl mx-auto"
                        >
                            S
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2 mt-4">
                {navItems.map((item) => (
                    <NavItem
                        key={item.href}
                        {...item}
                        isCollapsed={isCollapsed}
                        isActive={location.pathname === item.href || (item.href === '/inbox' && location.pathname === '/')}
                    />
                ))}
            </nav>

            {/* Footer Items */}
            <div className="px-4 pb-6 space-y-2">
                <div className="h-px bg-slate-800/50 mx-2 mb-4" />
                {bottomItems.map((item) => (
                    <NavItem
                        key={item.href}
                        {...item}
                        isCollapsed={isCollapsed}
                        isActive={location.pathname === item.href}
                    />
                ))}

                <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all duration-200 group"
                >
                    <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                    {!isCollapsed && <span className="text-sm font-semibold">Déconnexion</span>}
                </button>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-all shadow-xl"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
        </motion.aside>
    );
}
