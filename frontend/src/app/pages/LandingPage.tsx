import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    GraduationCap,
    Users,
    Calendar,
    TrendingUp,
    Shield,
    Zap,
    CheckCircle,
    ArrowRight,
    BarChart3,
    MessageSquare
} from 'lucide-react';
import LanguageSelector from '../../shared/components/LanguageSelector';

export default function LandingPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            icon: Users,
            title: t('home.features.management.title'),
            description: t('home.features.management.description'),
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: BarChart3,
            title: t('home.features.grades.title'),
            description: t('home.features.grades.description'),
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: Calendar,
            title: t('home.features.calendar.title'),
            description: t('home.features.calendar.description'),
            color: 'from-orange-500 to-red-500'
        },
        {
            icon: Shield,
            title: t('home.features.security.title'),
            description: t('home.features.security.description'),
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: TrendingUp,
            title: t('home.features.finance.title'),
            description: t('home.features.finance.description'),
            color: 'from-yellow-500 to-orange-500'
        },
        {
            icon: MessageSquare,
            title: t('home.features.communication.title'),
            description: t('home.features.communication.description'),
            color: 'from-indigo-500 to-purple-500'
        }
    ];

    const plans = [
        {
            name: t('home.pricing.plans.basic.name'),
            price: '25 000',
            features: t('home.pricing.plans.basic.features', { returnObjects: true }) as string[],
            color: 'from-gray-600 to-gray-800'
        },
        {
            name: t('home.pricing.plans.standard.name'),
            price: '35 000',
            features: t('home.pricing.plans.standard.features', { returnObjects: true }) as string[],
            color: 'from-blue-600 to-indigo-700',
            popular: true
        },
        {
            name: t('home.pricing.plans.premium.name'),
            price: '45 000',
            features: t('home.pricing.plans.premium.features', { returnObjects: true }) as string[],
            color: 'from-purple-600 to-pink-600'
        }
    ];

    const stats = [
        { value: '500+', label: t('home.stats.schools') },
        { value: '50K+', label: t('home.stats.students') },
        { value: '99.9%', label: t('home.stats.uptime') },
        { value: '24/7', label: t('home.stats.support') }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-white">{t('app.name')}</span>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-white/80 hover:text-white transition">{t('home.nav.features')}</a>
                            <a href="#pricing" className="text-white/80 hover:text-white transition">{t('home.nav.pricing')}</a>
                            <a href="#contact" className="text-white/80 hover:text-white transition">{t('home.nav.contact')}</a>

                            <LanguageSelector />

                            <button
                                onClick={() => navigate('/login')}
                                className="px-4 py-2 text-white/80 hover:text-white transition"
                            >
                                {t('home.nav.login')}
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                            >
                                {t('home.nav.start')}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div
                        className="absolute w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
                        style={{
                            top: '10%',
                            left: '10%',
                            transform: `translateY(${scrollY * 0.5}px)`
                        }}
                    />
                    <div
                        className="absolute w-96 h-96 bg-pink-500/30 rounded-full blur-3xl"
                        style={{
                            bottom: '10%',
                            right: '10%',
                            transform: `translateY(${-scrollY * 0.3}px)`
                        }}
                    />
                </div>

                <div className="relative max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 mb-8">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-white/90 text-sm">{t('app.tagline')}</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        {t('home.hero.title')}
                        <br />
                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                            {t('home.hero.intelligently')}
                        </span>
                    </h1>

                    <p className="text-xl text-white/70 mb-12 max-w-3xl mx-auto">
                        {t('home.hero.subtitle')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/register')}
                            className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
                        >
                            {t('home.hero.cta')}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white rounded-2xl font-semibold border border-white/20 hover:bg-white/20 transition-all"
                        >
                            {t('home.hero.demo')}
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-white/60">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            {t('home.features.title')}
                        </h2>
                        <p className="text-xl text-white/70">
                            {t('home.features.subtitle')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group p-8 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all hover:scale-105"
                            >
                                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-white/70">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 px-4 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            {t('home.pricing.title')}
                        </h2>
                        <p className="text-xl text-white/70">
                            {t('home.pricing.subtitle')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {plans.map((plan, index) => (
                            <div
                                key={index}
                                className={`relative p-8 bg-white/5 backdrop-blur-lg rounded-3xl border ${plan.popular ? 'border-purple-500 scale-105' : 'border-white/10'
                                    } hover:scale-105 transition-all`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm font-semibold">
                                        {t('home.pricing.popular')}
                                    </div>
                                )}

                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-5xl font-bold text-white">{plan.price}</span>
                                        <span className="text-white/60">{t('home.pricing.perMonth')}</span>
                                    </div>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-white/80">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => navigate('/register')}
                                    className={`w-full py-3 rounded-xl font-semibold transition-all ${plan.popular
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}
                                >
                                    {t('home.pricing.start')}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="p-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            {t('home.cta.title')}
                        </h2>
                        <p className="text-xl text-white/90 mb-8">
                            {t('home.cta.subtitle')}
                        </p>
                        <button
                            onClick={() => navigate('/register')}
                            className="px-8 py-4 bg-white text-purple-600 rounded-2xl font-semibold hover:shadow-2xl transition-all"
                        >
                            {t('home.cta.button')}
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 border-t border-white/10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-white">{t('app.name')}</span>
                            </div>
                            <p className="text-white/60">
                                {t('home.hero.subtitle')}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">{t('home.footer.product')}</h4>
                            <ul className="space-y-2 text-white/60">
                                <li><a href="#features" className="hover:text-white transition">{t('home.footer.links.features')}</a></li>
                                <li><a href="#pricing" className="hover:text-white transition">{t('home.footer.links.pricing')}</a></li>
                                <li><a href="#" className="hover:text-white transition">{t('home.footer.links.docs')}</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">{t('home.footer.company')}</h4>
                            <ul className="space-y-2 text-white/60">
                                <li><a href="#" className="hover:text-white transition">{t('home.footer.links.about')}</a></li>
                                <li><a href="#" className="hover:text-white transition">{t('home.footer.links.blog')}</a></li>
                                <li><a href="#contact" className="hover:text-white transition">{t('home.footer.links.contact')}</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">{t('home.footer.legal')}</h4>
                            <ul className="space-y-2 text-white/60">
                                <li><a href="#" className="hover:text-white transition">{t('home.footer.links.privacy')}</a></li>
                                <li><a href="#" className="hover:text-white transition">{t('home.footer.links.terms')}</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-white/10 text-center text-white/60">
                        <p>{t('home.footer.rights')}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
