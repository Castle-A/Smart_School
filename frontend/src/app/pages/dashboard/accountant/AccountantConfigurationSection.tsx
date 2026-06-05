import { useState, useEffect } from 'react';
import { Loader2, Coins, CreditCard } from 'lucide-react';
import { schoolConfigService } from '../../../../shared/api/school-config.service';
import type { SchoolConfig, UpdateSchoolConfigDto } from '../../../../shared/api/school-config.service';
import { FinanceConfig } from './config/FinanceConfig';
import { SubscriptionConfig } from '../founder/config/SubscriptionConfig';
import { toastEvents } from '../../../../shared/utils/toast-events';
import { useAuth } from '../../../../shared/contexts/AuthContext';

const AccountantConfigurationSection = () => {
    const { user } = useAuth();
    const [config, setConfig] = useState<SchoolConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'finance' | 'subscription'>('finance');

    const canManageSubscription = user?.permissions?.includes('subscription.manage') || false;

    // Fetch School Config (for Finance Tab)
    const fetchConfig = async () => {
        try {
            const data = await schoolConfigService.getConfig();
            setConfig(data);
        } catch (error: any) {
            console.error('Failed to fetch config', error);
            // Fallback for demo/dev if API fails
            if (error?.response?.status === 404 || error?.message?.includes('Cannot GET')) {
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
            toastEvents.success('Configuration financière mise à jour');
        } catch (error) {
            toastEvents.error('Échec de la mise à jour');
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

    // Logic: If user clicks subscription but data not ready (unlikely here since component fetches self), UI handles it.

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Configuration</h2>
            </div>

            {/* TABS HEADER */}
            <div className="flex space-x-1 bg-white/5 p-1 rounded-xl border border-white/10 w-fit">
                <button
                    onClick={() => setActiveTab('finance')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'finance'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Coins size={18} />
                    Finance & Écolages
                </button>

                {canManageSubscription && (
                    <button
                        onClick={() => setActiveTab('subscription')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'subscription'
                                ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <CreditCard size={18} />
                        Mon Abonnement
                    </button>
                )}
            </div>

            {/* TAB CONTENT */}
            <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab === 'finance' && config && (
                    <FinanceConfig config={config} onUpdate={handleUpdate} />
                )}

                {activeTab === 'subscription' && canManageSubscription && (
                    <SubscriptionConfig />
                )}
            </div>
        </div>
    );
};

export default AccountantConfigurationSection;
