import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut } from 'lucide-react';
import type { UserProfile } from '../api/profile.service';
import { profileService } from '../api/profile.service';
import { authService } from '../api/auth.service';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadProfile();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const loadProfile = async () => {
        try {
            const data = await profileService.getProfile();
            setProfile(data);
        } catch (error) {
            console.error('Failed to load profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const handleSettings = () => {
        navigate('/settings');
        setIsOpen(false);
    };

    if (loading || !profile) {
        return (
            <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
        );
    }

    return (
        <div className="relative" ref={menuRef}>
            {/* Profile Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group"
            >
                {profile.profilePicture ? (
                    <img
                        src={profile.profilePicture}
                        alt={profile.fullName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white/20 transition-all group-hover:border-white/40 group-hover:shadow-lg group-hover:shadow-purple-500/20"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm border-2 border-white/20 transition-all group-hover:border-white/40 group-hover:shadow-lg group-hover:shadow-purple-500/20">
                        {profile.initials}
                    </div>
                )}
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden z-50"
                    >
                        {/* User Info */}
                        <div className="p-4 border-b border-white/10">
                            <div className="flex items-center gap-3 mb-2">
                                {profile.profilePicture ? (
                                    <img
                                        src={profile.profilePicture}
                                        alt={profile.fullName}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                        {profile.initials}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-semibold truncate">{profile.fullName}</p>
                                    <p className="text-white/60 text-xs truncate">{profile.role}</p>
                                </div>
                            </div>
                            <p className="text-white/50 text-xs truncate">{profile.email}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                            <button
                                onClick={handleSettings}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/90 hover:text-white"
                            >
                                <Settings className="w-4 h-4" />
                                <span className="text-sm font-medium">Paramètres</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/20 transition-colors text-red-400 hover:text-red-300"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm font-medium">Déconnexion</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
