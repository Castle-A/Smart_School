import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle, AlertTriangle, CreditCard, Shield, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationService } from '../api/notification.service';
import type { Notification } from '../api/notification.service';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadNotifications();
        // Poll for new notifications every minute
        const interval = setInterval(loadNotifications, 60000);
        return () => clearInterval(interval);
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

    const loadNotifications = async () => {
        try {
            const [list, count] = await Promise.all([
                notificationService.getAll(),
                notificationService.getUnreadCount(),
            ]);
            setNotifications(list);
            setUnreadCount(count);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.isRead) {
            try {
                await notificationService.markAsRead(notification.id);
                setUnreadCount(prev => Math.max(0, prev - 1));
                setNotifications(prev =>
                    prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
                );
            } catch (error) {
                console.error('Failed to mark as read:', error);
            }
        }

        if (notification.link) {
            navigate(notification.link);
            setIsOpen(false);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'PAYMENT': return <CreditCard className="w-5 h-5 text-green-400" />;
            case 'ABSENCE': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
            case 'VALIDATION': return <CheckCircle className="w-5 h-5 text-blue-400" />;
            case 'SECURITY': return <Shield className="w-5 h-5 text-red-400" />;
            default: return <Info className="w-5 h-5 text-purple-400" />;
        }
    };

    return (
        <div className="relative" ref={menuRef} onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            <button
                className="relative p-2 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-slate-900">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-50"
                    >
                        <div className="p-4 border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-white font-semibold">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="text-xs text-purple-400 hover:text-purple-300 font-medium"
                                >
                                    Tout marquer comme lu
                                </button>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-white/40">
                                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p className="text-sm">Aucune notification</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            onClick={() => handleNotificationClick(notification)}
                                            className={`p-4 hover:bg-white/5 transition-colors cursor-pointer flex gap-4 ${!notification.isRead ? 'bg-white/5' : ''}`}
                                        >
                                            <div className="mt-1 flex-shrink-0">
                                                {getIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-medium mb-1 ${!notification.isRead ? 'text-white' : 'text-white/60'}`}>
                                                    {notification.title}
                                                </p>
                                                <p className="text-xs text-white/50 line-clamp-2 mb-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-[10px] text-white/30">
                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: fr })}
                                                </p>
                                            </div>
                                            {!notification.isRead && (
                                                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
