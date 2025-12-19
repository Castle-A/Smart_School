import { useEffect, useState } from 'react';
import { Bell, Check, Shield, CreditCard, AlertTriangle, Info } from 'lucide-react';
import { type Notification, notificationService } from '../../../../api/notifications.service';

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationService.findAll();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error(error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error(error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'PAYMENT': return <CreditCard size={18} className="text-emerald-400" />;
            case 'SECURITY': return <Shield size={18} className="text-red-400" />;
            case 'VALIDATION': return <Check size={18} className="text-blue-400" />;
            case 'ABSENCE': return <AlertTriangle size={18} className="text-amber-400" />;
            default: return <Info size={18} className="text-gray-400" />;
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 min-h-[600px]">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Bell className="text-indigo-400" size={24} />
                        Centre de Notifications
                    </h2>
                    <p className="text-gray-400 text-sm">Gérez vos alertes et mises à jour importantes</p>
                </div>
                <button
                    onClick={handleMarkAllRead}
                    className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                    Tout marquer comme lu
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
            ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <Bell size={48} className="mb-4 opacity-20" />
                    <p>Aucune notification pour le moment.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`p-4 rounded-lg flex items-start gap-4 transition-colors ${notif.isRead ? 'bg-white/5 opacity-70' : 'bg-white/10 border-l-4 border-indigo-500 shadow-md'
                                }`}
                        >
                            <div className="p-2 bg-black/20 rounded-full">
                                {getIcon(notif.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className={`font-semibold text-white ${notif.isRead ? 'font-normal text-gray-300' : ''}`}>
                                        {notif.title}
                                    </h3>
                                    <span className="text-xs text-gray-500">
                                        {new Date(notif.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-400 mt-1">{notif.message}</p>
                            </div>
                            {!notif.isRead && (
                                <button
                                    onClick={() => handleMarkAsRead(notif.id)}
                                    className="p-1 text-gray-400 hover:text-white transition-colors"
                                    title="Marquer comme lu"
                                >
                                    <Check size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
