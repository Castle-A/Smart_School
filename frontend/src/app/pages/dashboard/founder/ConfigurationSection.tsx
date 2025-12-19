import { useState, useEffect } from 'react';
import { Settings, Palette, BookOpen, DollarSign, Bell, Loader2 } from 'lucide-react';
import { schoolConfigService } from '../../../../shared/api/school-config.service';
import type { SchoolConfig, UpdateSchoolConfigDto } from '../../../../shared/api/school-config.service';
import { IdentityConfig } from './config/IdentityConfig';
import { AcademicConfig } from './config/AcademicConfig';
import { FinanceConfig } from './config/FinanceConfig';
import { NotificationConfig } from './config/NotificationConfig';
import { toastEvents } from '../../../../shared/utils/toast-events';
import AcademicYearManager from '../components/AcademicYearManager';

type ConfigTab = 'identity' | 'academic' | 'finance' | 'notifications' | 'years';

const ConfigurationSection = () => {
    const [activeTab, setActiveTab] = useState<ConfigTab>('identity');
    const [config, setConfig] = useState<SchoolConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchConfig = async () => {
        try {
            const data = await schoolConfigService.getConfig();
            setConfig(data);
        } catch (error) {
            console.error('Failed to fetch config', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    const handleUpdate = async (dto: UpdateSchoolConfigDto) => {
        try {
            const updated = await schoolConfigService.updateConfig(dto);
            setConfig(updated);
            toastEvents.emit('success', 'Configuration mise à jour avec succès');
        } catch (error) {
            toastEvents.emit('error', 'Échec de la mise à jour de la configuration');
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-white mb-4" size={48} />
                <p className="text-slate-400">Chargement de la configuration...</p>
            </div>
        );
    }

    if (!config) return null;

    const tabs = [
        { id: 'identity', label: 'Identité & Branding', icon: Palette },
        { id: 'academic', label: 'Académique', icon: BookOpen },
        { id: 'finance', label: 'Finance', icon: DollarSign },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'years', label: 'Années Scolaires', icon: Settings },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-white">Configuration de l'Établissement</h2>
            </div>

            {/* Navigation par onglets */}
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as ConfigTab)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        <tab.icon size={18} />
                        <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Contenu de l'onglet actif */}
            <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab === 'identity' && (
                    <IdentityConfig config={config} onUpdate={handleUpdate} />
                )}
                {activeTab === 'academic' && (
                    <AcademicConfig config={config} onUpdate={handleUpdate} />
                )}
                {activeTab === 'finance' && (
                    <FinanceConfig config={config} onUpdate={handleUpdate} />
                )}
                {activeTab === 'notifications' && (
                    <NotificationConfig config={config} onUpdate={handleUpdate} />
                )}
                {activeTab === 'years' && (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                        <AcademicYearManager />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConfigurationSection;
