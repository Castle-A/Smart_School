import { useState, useEffect } from 'react';
import {
    CreditCard,
    CheckCircle,
    AlertTriangle,
    Users,
    UserCheck,
    HardDrive,
    ArrowRight,
    Loader2
} from 'lucide-react';
import { subscriptionService, type SubscriptionResponse } from '../../../../../shared/api/subscription.service';

export const SubscriptionConfig = () => {
    const [data, setData] = useState<SubscriptionResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const response = await subscriptionService.getCurrent();
                setData(response);
            } catch (err: any) {
                console.error('Failed to fetch subscription:', err);
                setError('Impossible de charger les informations d\'abonnement.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubscription();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
                <p className="text-slate-400">Chargement de votre abonnement...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center">
                <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
                <h3 className="text-xl font-bold text-white mb-2">Erreur</h3>
                <p className="text-slate-400 mb-6">{error || 'Une erreur est survenue.'}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    const { subscription, usage } = data;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">ACTIF</span>;
            case 'TRIAL':
                return <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/30">ESSAI</span>;
            case 'PAST_DUE':
                return <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs font-bold border border-orange-500/30">EN RETARD</span>;
            default:
                return <span className="bg-slate-500/20 text-slate-400 px-3 py-1 rounded-full text-xs font-bold border border-slate-500/30">{status}</span>;
        }
    };

    const UsageBar = ({ label, current, max, icon: Icon }: any) => {
        const percent = Math.min(Math.round((current / max) * 100), 100);
        const isNearLimit = percent >= 90;

        return (
            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-300">
                        <Icon size={16} className="text-indigo-400" />
                        <span>{label}</span>
                    </div>
                    <span className={isNearLimit ? 'text-orange-400 font-bold' : 'text-slate-400'}>
                        {current} / {max}
                    </span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${isNearLimit ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-indigo-500'
                            }`}
                        style={{ width: `${percent}%` }}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Plan Actuel Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-indigo-600/20 transition-all duration-700" />

                        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-3xl font-black text-white tracking-tight">
                                        Plan {subscription.plan}
                                    </h3>
                                    {getStatusBadge(subscription.status)}
                                </div>
                                <p className="text-slate-400 text-lg">
                                    {subscription.plan === 'FREE'
                                        ? 'Idéal pour démarrer votre aventure scolaire.'
                                        : 'Plan professionnel pour une gestion optimisée.'}
                                </p>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center min-w-[200px]">
                                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Coût Mensuel</p>
                                <p className="text-3xl font-bold text-white">
                                    {subscription.amount.toLocaleString()} <span className="text-sm font-normal text-slate-400">{subscription.currency}</span>
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                                    <CheckCircle size={18} className="text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">Prochaine facturation</p>
                                    <p className="text-xs text-slate-500">
                                        {subscription.nextBillingDate
                                            ? new Date(subscription.nextBillingDate).toLocaleDateString('fr-FR', { dateStyle: 'long' })
                                            : 'Illimité (Gratuit)'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                                    <CreditCard size={18} className="text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">Moyen de paiement</p>
                                    <p className="text-xs text-slate-500">Wave / Mobile Money (Configuré)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Included */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                        <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <CheckCircle className="text-indigo-400" size={24} />
                            Fonctionnalités Incluses
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(subscription.features || ['Gestion administrative', 'Support email']).map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                    <span className="text-sm text-slate-300 capitalize">{feature.replace('-', ' ')}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Usage Statistics Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <h4 className="text-lg font-bold text-white mb-6">Utilisation des ressources</h4>
                        <div className="space-y-6">
                            <UsageBar
                                label="Élèves inscrits"
                                current={usage.students}
                                max={subscription.maxStudents}
                                icon={Users}
                            />
                            <UsageBar
                                label="Enseignants"
                                current={usage.teachers}
                                max={subscription.maxTeachers}
                                icon={UserCheck}
                            />
                            <UsageBar
                                label="Stockage Cloud (GB)"
                                current={usage.storage}
                                max={subscription.maxStorage}
                                icon={HardDrive}
                            />
                        </div>

                        <div className="mt-8 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                            <div className="flex gap-3">
                                <AlertTriangle className="text-orange-400 shrink-0" size={20} />
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-orange-400">Besoin de plus ?</p>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Vous approchez des limites de votre plan actuel. Passez au niveau supérieur pour une liberté totale.
                                    </p>
                                    <button className="text-xs font-bold text-white flex items-center gap-2 mt-2 hover:translate-x-1 transition-transform">
                                        Voir les plans <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-3 group">
                        UPGRADER MAINTENANT
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-400 font-medium rounded-2xl border border-white/10 transition-all">
                        Voir l'historique de facturation
                    </button>
                </div>
            </div>
        </div>
    );
};
