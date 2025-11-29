import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, X, ChevronDown, ChevronUp, Zap, CreditCard, Building2, Crown, Sparkles, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SubscriptionPlan {
    id: string;
    basePrice: number;
    popular?: boolean;
    icon: any;
    features: string[];
    limitations?: string[];
    targetAudience: string;
}

interface PaymentMethod {
    id: string;
    logo: string;
    available: boolean;
}

type BillingCycle = 'monthly' | 'semiannual' | 'annual';

export default function SubscriptionPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [selectedPlan, setSelectedPlan] = useState<string>('standard');
    const [selectedPayment, setSelectedPayment] = useState<string>('');
    const [billingCycle, setBillingCycle] = useState<BillingCycle>('annual');
    const [loading, setLoading] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    const plans: SubscriptionPlan[] = [
        {
            id: 'basic',
            basePrice: 25000,
            icon: Building2,
            targetAudience: "Petites écoles, CEG, écoles primaires",
            features: [
                "Gestion classes, élèves, professeurs",
                "Saisie des notes & moyennes",
                "Bulletins PDF simples",
                "Gestion des absences",
                "3 comptes administratifs max",
                "Calendrier en lecture seule"
            ],
            limitations: [
                "Pas de comptes Prof/Élève/Parent",
                "Pas de module Finance/Paie",
                "Pas de SMS/Email"
            ]
        },
        {
            id: 'standard',
            basePrice: 35000,
            icon: Zap,
            popular: true,
            targetAudience: "Écoles standards, collèges, lycées",
            features: [
                "Tout le plan BASIC",
                "Bulletins PDF professionnels",
                "4 comptes administratifs max",
                "Calendrier éditable",
                "Examens & événements internes",
                "Communication interne admin",
                "200 SMS / mois inclus",
                "Documents administratifs"
            ]
        },
        {
            id: 'premium',
            basePrice: 45000,
            icon: Crown,
            targetAudience: "Écoles avec besoins complets & IA",
            features: [
                "Tout le plan STANDARD",
                "IA : Analyse notes & suggestions",
                "IA : Alertes retards/absences",
                "500 SMS + 500 Emails / mois",
                "Module Finance complet",
                "Module Paie & RH",
                "Comptes Professeurs complets",
                "Personnalisation avancée"
            ]
        },
    ];

    const paymentMethods: PaymentMethod[] = [
        {
            id: 'momo',
            logo: '/assets/payments/mtn-momo.png',
            available: true,
        },
        {
            id: 'moov',
            logo: '/assets/payments/moov-money.png',
            available: true,
        },
        {
            id: 'celtiis',
            logo: '/assets/payments/celtiis-cash.png',
            available: true,
        },
        {
            id: 'card',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/2560px-MasterCard_Logo.svg.png',
            available: true,
        },
    ];

    const faqs = [
        {
            question: "Puis-je changer de plan plus tard ?",
            answer: "Oui, vous pouvez passer à un plan supérieur à tout moment. Le montant restant de votre abonnement actuel sera déduit."
        },
        {
            question: "Les SMS non utilisés sont-ils reportés ?",
            answer: "Non, le quota de SMS est mensuel. Cependant, vous pouvez acheter des packs de SMS supplémentaires si besoin."
        },
        {
            question: "Comment fonctionne l'IA ?",
            answer: "Notre IA analyse les tendances des notes et des absences pour détecter les élèves en difficulté et suggérer des actions pédagogiques."
        },
        {
            question: "Mes données sont-elles sécurisées ?",
            answer: "Absolument. Nous utilisons un chiffrement de niveau bancaire et des sauvegardes quotidiennes pour protéger les données de votre école."
        }
    ];

    const comparisonFeatures = [
        { name: "Comptes administratifs", basic: "3 max", standard: "4 max", premium: "Illimité" },
        { name: "Comptes Professeurs", basic: false, standard: false, premium: true },
        { name: "Comptes Élèves/Parents", basic: false, standard: false, premium: "Bientôt" },
        { name: "Bulletins PDF", basic: "Simples", standard: "Pro + Logo", premium: "Personnalisables" },
        { name: "Module Finance", basic: false, standard: "Basique", premium: "Complet + Reçus" },
        { name: "SMS inclus / mois", basic: "0", standard: "200", premium: "500" },
        { name: "Fonctionnalités IA", basic: false, standard: false, premium: true },
    ];

    const calculatePrice = (basePrice: number) => {
        switch (billingCycle) {
            case 'semiannual': return basePrice * 6;
            case 'annual': return basePrice * 9;
            case 'monthly': default: return basePrice;
        }
    };

    const getDurationLabel = () => {
        switch (billingCycle) {
            case 'semiannual': return "6 Mois";
            case 'annual': return "1 An (3 mois offerts)";
            case 'monthly': default: return "Mensuel";
        }
    };

    const handleSubscribe = async () => {
        if (!selectedPayment) {
            alert(t('subscription.payment.selectMethod'));
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate('/login', { state: { message: t('subscription.processingMessage') } });
        }, 2000);
    };

    const selectedPlanData = plans.find(p => p.id === selectedPlan);
    const currentPrice = selectedPlanData ? calculatePrice(selectedPlanData.basePrice) : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 font-sans text-slate-100">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="inline-flex items-center justify-center w-20 h-20 bg-white/5 backdrop-blur-xl rounded-3xl mb-6 shadow-2xl border border-white/10"
                    >
                        <GraduationCap className="w-10 h-10 text-yellow-400" />
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        Choisissez le plan qui correspond <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                            à votre école
                        </span>
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto">
                        SmartSchool s'adapte à la taille et aux besoins de votre établissement.
                    </p>
                </div>

                {/* Billing Cycle */}
                <div className="flex justify-center mb-16">
                    <div className="bg-white/5 backdrop-blur-xl p-1.5 rounded-2xl inline-flex border border-white/10 shadow-lg">
                        {(['monthly', 'semiannual', 'annual'] as const).map((cycle) => (
                            <button
                                key={cycle}
                                onClick={() => setBillingCycle(cycle)}
                                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${billingCycle === cycle
                                    ? 'bg-white text-purple-900 shadow-lg'
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {cycle === 'monthly' && "Mensuel"}
                                {cycle === 'semiannual' && "6 Mois"}
                                {cycle === 'annual' && "Annuel"}
                                {cycle === 'annual' && (
                                    <span className="ml-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        -25%
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {plans.map((plan) => {
                        const Icon = plan.icon;
                        const price = calculatePrice(plan.basePrice);
                        const isSelected = selectedPlan === plan.id;

                        return (
                            <motion.div
                                key={plan.id}
                                whileHover={{ y: -10 }}
                                onClick={() => setSelectedPlan(plan.id)}
                                className={`relative cursor-pointer rounded-3xl transition-all duration-300 ${isSelected ? 'ring-2 ring-yellow-400 shadow-2xl shadow-yellow-400/20' : 'hover:bg-white/5'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg z-10">
                                        ⭐ Le plus populaire
                                    </div>
                                )}

                                <div className={`h-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 border flex flex-col ${isSelected ? 'border-yellow-400/50 bg-white/15' : 'border-white/10'
                                    }`}>
                                    <div className="mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4 text-yellow-400">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">{t(`subscription.plans.${plan.id}.name`)}</h3>
                                        <p className="text-white/50 text-sm h-10">{plan.targetAudience}</p>
                                    </div>

                                    <div className="mb-8">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-bold text-white tracking-tight">
                                                {price.toLocaleString()}
                                            </span>
                                            <span className="text-white/60 text-sm font-medium ml-1">FCFA</span>
                                        </div>
                                        <p className="text-white/40 text-xs mt-2">
                                            {billingCycle === 'monthly' ? '/ mois' : `pour ${getDurationLabel()}`}
                                        </p>
                                    </div>

                                    <div className="flex-1 space-y-4 mb-8">
                                        {plan.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-3 text-sm text-white/80">
                                                <Check className="w-5 h-5 text-green-400 shrink-0" />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                        {plan.limitations?.map((limit, idx) => (
                                            <div key={idx} className="flex items-start gap-3 text-sm text-white/40">
                                                <X className="w-5 h-5 text-red-400/50 shrink-0" />
                                                <span>{limit}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${isSelected
                                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}>
                                        {isSelected ? 'Plan sélectionné' : 'Choisir ce plan'}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Comparison Table */}
                <div className="mb-24 overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
                    <div className="p-8 border-b border-white/10">
                        <h2 className="text-3xl font-bold text-white text-center">Comparatif détaillé</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5">
                                    <th className="p-6 text-white/50 font-medium">Fonctionnalité</th>
                                    <th className="p-6 text-white font-bold text-center">Basic</th>
                                    <th className="p-6 text-yellow-400 font-bold text-center bg-yellow-400/5">Standard</th>
                                    <th className="p-6 text-white font-bold text-center">Premium</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {comparisonFeatures.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                                        <td className="p-6 text-white/80 font-medium">{row.name}</td>
                                        <td className="p-6 text-center text-white/60">
                                            {typeof row.basic === 'boolean' ? (row.basic ? <Check className="w-5 h-5 mx-auto text-green-400" /> : <X className="w-5 h-5 mx-auto text-white/20" />) : row.basic}
                                        </td>
                                        <td className="p-6 text-center text-white bg-yellow-400/5 font-medium">
                                            {typeof row.standard === 'boolean' ? (row.standard ? <Check className="w-5 h-5 mx-auto text-green-400" /> : <X className="w-5 h-5 mx-auto text-white/20" />) : row.standard}
                                        </td>
                                        <td className="p-6 text-center text-white font-bold">
                                            {typeof row.premium === 'boolean' ? (row.premium ? <Check className="w-5 h-5 mx-auto text-green-400" /> : <span className="text-xs bg-white/10 px-2 py-1 rounded">{row.premium}</span>) : row.premium}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Payment Section */}
                <div className="max-w-4xl mx-auto mb-24">
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                            <CreditCard className="w-7 h-7 text-yellow-400" />
                            Paiement sécurisé
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {paymentMethods.map((method) => (
                                <div
                                    key={method.id}
                                    onClick={() => method.available && setSelectedPayment(method.id)}
                                    className={`relative cursor-pointer group h-24 rounded-2xl border-2 flex items-center justify-center p-4 transition-all duration-300 bg-white ${selectedPayment === method.id
                                        ? 'border-yellow-400 ring-4 ring-yellow-400/30 transform scale-105'
                                        : 'border-transparent hover:border-white/50 opacity-80 hover:opacity-100'
                                        }`}
                                >
                                    <img src={method.logo} alt={method.id} className="max-h-full max-w-full object-contain" />
                                    {selectedPayment === method.id && (
                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-md z-10">
                                            <Check className="w-3 h-3 text-purple-900" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleSubscribe}
                            disabled={loading || !selectedPayment}
                            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-4 rounded-2xl hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Traitement en cours...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Payer {currentPrice.toLocaleString()} FCFA
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto mb-24">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">Questions fréquentes</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
                                <button
                                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                                    className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                                >
                                    <span className="font-bold text-white/90">{faq.question}</span>
                                    {openFaqIndex === idx ? <ChevronUp className="text-white/50" /> : <ChevronDown className="text-white/50" />}
                                </button>
                                <AnimatePresence>
                                    {openFaqIndex === idx && (
                                        <motion.div
                                            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-6 pt-0 text-white/60 leading-relaxed">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Why SmartSchool */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {[
                        { title: "Gain de temps", desc: "Automatisez les tâches répétitives (bulletins, reçus) et gagnez jusqu'à 10h par semaine." },
                        { title: "Réduction des erreurs", desc: "Fini les erreurs de calcul de moyennes ou de caisse. Tout est calculé automatiquement." },
                        { title: "Modernisation", desc: "Offrez une image moderne et professionnelle aux parents avec des bulletins et reçus numériques." }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 text-center">
                            <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                            <p className="text-white/60">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Footer CTA */}
                <div className="text-center pb-12">
                    <h3 className="text-2xl font-bold text-white mb-4">Besoin d'aide pour choisir ?</h3>
                    <button className="text-yellow-400 hover:text-yellow-300 font-medium underline underline-offset-4">
                        Contacter un conseiller
                    </button>
                </div>

            </div>
        </div>
    );
}
