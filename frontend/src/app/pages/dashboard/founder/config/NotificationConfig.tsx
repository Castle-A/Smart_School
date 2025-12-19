import { useState } from 'react';
import { Bell, Mail, MessageSquare } from 'lucide-react';
import type { SchoolConfig } from '../../../../../shared/api/school-config.service';

interface NotificationConfigProps {
    config: SchoolConfig;
    onUpdate: (data: any) => Promise<void>;
}

export const NotificationConfig = ({ config, onUpdate }: NotificationConfigProps) => {
    const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(config.smsAlertsEnabled);
    const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(config.emailAlertsEnabled);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onUpdate({ smsAlertsEnabled, emailAlertsEnabled });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Bell className="text-blue-400" size={24} />
                    <h3 className="text-xl font-semibold text-white">Système de Notifications</h3>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
                        <div className="flex items-center gap-3">
                            <MessageSquare className="text-blue-400" size={20} />
                            <div>
                                <p className="text-white font-medium">Alertes SMS</p>
                                <p className="text-xs text-slate-500">Notifications automatiques pour les parents</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={smsAlertsEnabled}
                                onChange={(e) => setSmsAlertsEnabled(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Mail className="text-blue-400" size={20} />
                            <div>
                                <p className="text-white font-medium">Alertes Email</p>
                                <p className="text-xs text-slate-500">Envoi automatique des bulletins et rapports</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={emailAlertsEnabled}
                                onChange={(e) => setEmailAlertsEnabled(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {isSaving ? 'Enregistrement...' : 'Enregistrer les alertes'}
                    </button>
                </div>
            </div>
        </div>
    );
};
