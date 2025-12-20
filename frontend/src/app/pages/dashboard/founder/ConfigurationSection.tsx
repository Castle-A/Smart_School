import { useState, useEffect } from 'react';
import { Palette, Loader2, CreditCard, Calendar } from 'lucide-react';
import { schoolConfigService } from '../../../../shared/api/school-config.service';
import type { SchoolConfig, UpdateSchoolConfigDto } from '../../../../shared/api/school-config.service';
import { IdentityConfig } from './config/IdentityConfig';
import { toastEvents } from '../../../../shared/utils/toast-events';
import AcademicYearManager from '../components/AcademicYearManager';
import { SubscriptionConfig } from './config/SubscriptionConfig';
import { useAuth } from '../../../../shared/contexts/AuthContext';

type ConfigTab = 'identity' | 'years' | 'subscription';

const ConfigurationSection = () => {
    const [activeTab, setActiveTab] = useState<ConfigTab>('identity');
    const { user } = useAuth();
    const [config, setConfig] = useState<SchoolConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchConfig = async () => {
        try {
            const data = await schoolConfigService.getConfig();
            setConfig(data);
        } catch (error: any) {
            // Silently handle 404 errors - endpoint not implemented yet
            if (error?.response?.status === 404 || error?.message?.includes('Cannot GET')) {
                console.log('[ConfigurationSection] API endpoint not yet implemented, using default config');
                // Set default config with all required properties
                setConfig({
                    id: 'default-config',
                    schoolId: 'default-school',
                    motto: null,
                    officialColors: null,
                    reportTemplate: 'standard',
                    receiptTemplate: 'standard',
                    gradingScale: 20,
                    passingGrade: 10,
                    defaultCoefficient: 1,
                    currency: 'XOF',
                    penaltyRate: 0,
                    smsAlertsEnabled: false,
                    emailAlertsEnabled: true,
                    logo: null,
                    logoKey: null,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                });
            } else {
                console.error('Failed to fetch config', error);
            }
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
            toastEvents.success('Configuration mise à jour avec succès');
        } catch (error) {
            toastEvents.error('Échec de la mise à jour de la configuration');
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
        { id: 'years', label: 'Années Scolaires', icon: Calendar },
    ];

    // Ne montrer l'onglet abonnement qu'au fondateur
    if (user?.role === 'FOUNDER') {
        tabs.push({ id: 'subscription', label: 'Abonnement', icon: CreditCard });
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-white">Configuration de l'Établissement</h2>
            </div>

            {/* Navigation par onglets */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/10 custom-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as ConfigTab)}
                        className={`relative flex items-center gap-2 px-4 py-3 rounded-t-lg transition-colors whitespace-nowrap min-w-max ${activeTab === tab.id
                            ? 'bg-indigo-600 text-white border-b-2 border-indigo-400'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <tab.icon size={16} />
                        <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Contenu de l'onglet actif */}
            <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab === 'identity' && (
                    <IdentityConfig config={config} onUpdate={handleUpdate} />
                )}
                {activeTab === 'years' && (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                        <AcademicYearManager />
                    </div>
                )}
                {activeTab === 'subscription' && (
                    <SubscriptionConfig />
                )}
            </div>
        </div>
    );
};

export default ConfigurationSection;
