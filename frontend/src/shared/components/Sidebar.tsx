import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    School,
    Users,
    Settings,
    ChevronLeft,
    ChevronRight,
    GraduationCap
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { icon: LayoutDashboard, label: "Vue d'ensemble", path: '/dashboard/founder' },
        { icon: Users, label: "Directeur", path: '/dashboard/director' },
        { icon: Settings, label: "Comptable", path: '/dashboard/accountant' },
        { icon: School, label: "Professeur", path: '/dashboard/teacher' },
    ];

    return (
        <motion.aside
            initial={false}
            animate={{ width: isOpen ? 256 : 80 }}
            className="fixed inset-y-0 left-0 z-50 bg-slate-900 border-r border-white/10 text-white flex flex-col transition-all duration-300 ease-in-out lg:relative"
        >
            {/* Logo Section */}
            <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="min-w-[32px] w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    {isOpen && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="font-bold text-lg tracking-wide whitespace-nowrap"
                        >
                            SmartSchool
                        </motion.span>
                    )}
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute -right-3 top-24 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-purple-500 transition-colors z-50"
            >
                {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`
                                w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
                                ${isActive
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }
                            `}
                        >
                            <Icon className={`w-5 h-5 min-w-[20px] ${isActive ? 'text-white' : 'group-hover:text-white transition-colors'}`} />
                            {isOpen && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="font-medium whitespace-nowrap"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                            {!isOpen && (
                                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                                    {item.label}
                                </div>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Footer / User Info */}
            <div className="p-4 border-t border-white/10">
                {isOpen ? (
                    <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-xs">
                            SS
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Support</p>
                            <p className="text-xs text-slate-400 truncate">support@smartschool.com</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-xs cursor-pointer" title="Support">
                            SS
                        </div>
                    </div>
                )}
            </div>
        </motion.aside>
    );
}
