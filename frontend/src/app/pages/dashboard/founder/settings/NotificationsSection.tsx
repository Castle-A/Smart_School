import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react';
import { useState } from 'react';

const NotificationsSection = () => {
    const [preferences, setPreferences] = useState({
        securityEmail: true,
        securitySms: true,
        systemEmail: true,
        systemSms: false,
        businessEmail: true,
        businessSms: false,
        pushEnabled: true
    });

    const togglePreference = (key: keyof typeof preferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-white">Notifications</h2>
                <p className="text-gray-400 mt-1">Gérez vos préférences de notifications</p>
            </div>

            {/* Notifications de sécurité */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Bell className="text-red-400" size={24} />
                    <h3 className="text-lg font-semibold text-white">Notifications de sécurité</h3>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                    Ces notifications sont toujours actives pour votre sécurité
                </p>
                <div className="space-y-3">
                    <NotificationToggle
                        icon={<Mail size={18} />}
                        label="Email"
                        description="Changements de mot de passe, nouvelle connexion"
                        enabled={preferences.securityEmail}
                        onChange={() => togglePreference('securityEmail')}
                        locked
                    />
                    <NotificationToggle
                        icon={<MessageSquare size={18} />}
                        label="SMS"
                        description="Alertes de sécurité critiques"
                        enabled={preferences.securitySms}
                        onChange={() => togglePreference('securitySms')}
                    />
                </div>
            </div>

            {/* Notifications système */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Smartphone className="text-blue-400" size={24} />
                    <h3 className="text-lg font-semibold text-white">Notifications système</h3>
                </div>
                <div className="space-y-3">
                    <NotificationToggle
                        icon={<Mail size={18} />}
                        label="Email"
                        description="Mises à jour, maintenance"
                        enabled={preferences.systemEmail}
                        onChange={() => togglePreference('systemEmail')}
                    />
                    <NotificationToggle
                        icon={<MessageSquare size={18} />}
                        label="SMS"
                        description="Alertes système importantes"
                        enabled={preferences.systemSms}
                        onChange={() => togglePreference('systemSms')}
                    />
                </div>
            </div>

            {/* Notifications métier */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Bell className="text-emerald-400" size={24} />
                    <h3 className="text-lg font-semibold text-white">Notifications métier</h3>
                </div>
                <div className="space-y-3">
                    <NotificationToggle
                        icon={<Mail size={18} />}
                        label="Email"
                        description="Nouvelles inscriptions, paiements"
                        enabled={preferences.businessEmail}
                        onChange={() => togglePreference('businessEmail')}
                    />
                    <NotificationToggle
                        icon={<MessageSquare size={18} />}
                        label="SMS"
                        description="Événements importants"
                        enabled={preferences.businessSms}
                        onChange={() => togglePreference('businessSms')}
                    />
                </div>
            </div>
        </div>
    );
};

interface NotificationToggleProps {
    icon: React.ReactNode;
    label: string;
    description: string;
    enabled: boolean;
    onChange: () => void;
    locked?: boolean;
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({
    icon,
    label,
    description,
    enabled,
    onChange,
    locked
}) => {
    return (
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
                <div className="text-gray-400">{icon}</div>
                <div>
                    <p className="text-white font-medium flex items-center gap-2">
                        {label}
                        {locked && <span className="text-xs text-yellow-400">(Obligatoire)</span>}
                    </p>
                    <p className="text-sm text-gray-400">{description}</p>
                </div>
            </div>
            <button
                onClick={onChange}
                disabled={locked}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-indigo-600' : 'bg-gray-600'
                    } ${locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                />
            </button>
        </div>
    );
};

export default NotificationsSection;
