import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { salutation } from '../utils/salutation';
import Toast from './Toast';
function parseExpiry(s) {
    const keys = ['subscriptionEndsAt', 'subscriptionEnd', 'expiresAt', 'subscriptionExpiresAt', 'endsAt', 'subscription_end', 'expires_at'];
    for (const k of keys) {
        if (k in s && s[k]) {
            const val = s[k];
            if (typeof val === 'string' || typeof val === 'number')
                return new Date(String(val));
        }
    }
    if ('subscription' in s && s.subscription && typeof s.subscription === 'object') {
        const sub = s.subscription;
        for (const k of ['endsAt', 'end', 'expiresAt', 'expires_at']) {
            if (k in sub && sub[k]) {
                const v = sub[k];
                if (typeof v === 'string' || typeof v === 'number')
                    return new Date(String(v));
            }
        }
    }
    return null;
}
export default function FounderDashboard({ user }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState(null);
    const [school, setSchool] = useState(null);
    const [showWelcome, setShowWelcome] = useState(false);
    const [persistentGreeting, setPersistentGreeting] = useState(null);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const welcomeText = useMemo(() => {
        if (!user)
            return '';
        const s = salutation(user);
        // salutation may return 'Bonjour <Name>' or 'M. <Name>' / 'Mme <Name>'
        if (s.startsWith('Bonjour'))
            return s;
        return `Bienvenue, ${s}`;
    }, [user]);
    // Charger l'école du fondateur (s'il a un schoolId)
    useEffect(() => {
        let mounted = true;
        async function run() {
            setLoading(true);
            try {
                if (user?.schoolId) {
                    const res = await api.get(`/api/schools/${user.schoolId}`);
                    if (mounted)
                        setSchool(res.data ?? null);
                }
                else {
                    if (mounted)
                        setSchool(null);
                }
            }
            catch {
                if (mounted)
                    setSchool(null);
            }
            finally {
                if (mounted)
                    setLoading(false);
            }
        }
        run();
        return () => { mounted = false; };
    }, [user?.schoolId]);
    // Afficher un message de bienvenue une seule fois par session au login
    useEffect(() => {
        // load persistent greeting for this session if any and prepare listeners
        try {
            const id = user?.id;
            if (id) {
                const g = sessionStorage.getItem(`greeting_${id}`);
                if (g)
                    setPersistentGreeting(g);
            }
        }
        catch {
            void 0;
        }
        const fadeMs = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 200;
        const displayMs = 2500;
        const onLogin = (e) => {
            try {
                const detail = e.detail;
                const u = detail?.user ?? user;
                if (!u)
                    return;
                const s = salutation(u);
                const text = s.startsWith('Bonjour') ? s : `Bienvenue, ${s}`;
                try {
                    const key = `welcome_shown_${u.id}`;
                    const already = sessionStorage.getItem(key);
                    if (!already) {
                        // show transient mounted banner and handle fade-out
                        setShowWelcome(true);
                        sessionStorage.setItem(key, '1');
                        // persist greeting in header for this session
                        sessionStorage.setItem(`greeting_${u.id}`, text);
                        setPersistentGreeting(text);
                        // fade-out schedule: start fading at displayMs - fadeMs, unmount at displayMs
                        const fadeStart = Math.max(0, displayMs - fadeMs);
                        const fadeTimer = setTimeout(() => setShowWelcome(false), fadeStart);
                        const unmountTimer = setTimeout(() => setShowWelcome(false), displayMs);
                        // both setShowWelcome(false) but fade effect is handled by CSS transition in render
                        return () => {
                            clearTimeout(fadeTimer);
                            clearTimeout(unmountTimer);
                        };
                    }
                }
                catch {
                    void 0;
                }
            }
            catch {
                void 0;
            }
        };
        const onTokenRefreshed = () => {
            try {
                const u = user ?? JSON.parse(localStorage.getItem('auth_user') || 'null');
                if (!u)
                    return;
                const s = salutation(u);
                const text = s.startsWith('Bonjour') ? s : `Bienvenue, ${s}`;
                setToastMessage(`Session renouvelée — ${text}`);
                setToastVisible(true);
            }
            catch {
                void 0;
            }
        };
        window.addEventListener('auth:login', onLogin);
        window.addEventListener('auth:token_refreshed', onTokenRefreshed);
        return () => {
            window.removeEventListener('auth:login', onLogin);
            window.removeEventListener('auth:token_refreshed', onTokenRefreshed);
        };
    }, [user]);
    // (Conserve ton petit résumé simulé)
    useEffect(() => {
        const t = setTimeout(() => {
            setSummary({ schools: 1, revenue: '12 400 €' });
        }, 350);
        return () => clearTimeout(t);
    }, []);
    // Dérivés : statut abonnement & expiration
    const subscriptionStatus = useMemo(() => {
        const s = school;
        if (!s)
            return { label: 'Non renseigné', variant: 'gray' };
        if (typeof s.subscriptionStatus === 'string') {
            const ss = s.subscriptionStatus;
            return { label: ss, variant: ss.toLowerCase() === 'active' ? 'green' : 'yellow' };
        }
        if (s.isActive === false)
            return { label: 'Inactif', variant: 'red' };
        return { label: 'Actif', variant: 'green' };
    }, [school]);
    const expiry = useMemo(() => {
        if (!school)
            return null;
        const r = parseExpiry(school);
        return r instanceof Date && !isNaN(r.getTime()) ? r : null;
    }, [school]);
    const daysLeft = useMemo(() => {
        if (!expiry)
            return null;
        return Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    }, [expiry]);
    const licenseText = useMemo(() => {
        if (!expiry || daysLeft === null)
            return 'Non renseignée';
        return daysLeft >= 0 ? `${daysLeft} jour(s) restants` : 'Expirée';
    }, [expiry, daysLeft]);
    const licenseShort = useMemo(() => {
        if (!expiry || daysLeft === null)
            return '—';
        return daysLeft >= 0 ? `${daysLeft} jour(s)` : 'Expirée';
    }, [expiry, daysLeft]);
    const schoolName = useMemo(() => {
        const s = school;
        return s?.name ?? user?.schoolName ?? '—';
    }, [school, user?.schoolName]);
    // Rendu
    return (_jsxs("div", { className: "p-6 max-w-6xl mx-auto", children: [showWelcome && user && (_jsxs("div", { className: "mb-4 p-3 bg-indigo-50 border-l-4 border-indigo-500 rounded text-indigo-800 flex items-center justify-between", style: typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
                    ? {}
                    : { transition: 'opacity 200ms ease', opacity: showWelcome ? 1 : 0 }, children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium", children: welcomeText }), _jsx("div", { className: "text-xs text-indigo-700", children: "Ravi de vous revoir" })] }), _jsx("button", { "aria-label": "Fermer", onClick: () => setShowWelcome(false), className: "ml-4 text-indigo-600 hover:text-indigo-800 text-sm", children: "\u00D7" })] })), persistentGreeting && (_jsx("div", { className: "mb-3 text-sm text-gray-700", children: persistentGreeting })), _jsx(Toast, { message: toastMessage, type: "info", visible: toastVisible, onClose: () => setToastVisible(false) }), user?.role === 'FONDATEUR' && (_jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "p-5 bg-white rounded-lg shadow flex flex-col md:flex-row md:items-center md:gap-6", children: [_jsxs("div", { className: "min-w-[200px]", children: [_jsx("div", { className: "text-xs text-gray-500", children: "\u00C9cole" }), _jsx("div", { className: "font-semibold text-gray-800", children: schoolName })] }), _jsxs("div", { className: "min-w-[200px]", children: [_jsx("div", { className: "text-xs text-gray-500", children: "Statut abonnement" }), _jsx("div", { className: `font-semibold ${subscriptionStatus.variant === 'green'
                                            ? 'text-green-600'
                                            : subscriptionStatus.variant === 'red'
                                                ? 'text-red-600'
                                                : subscriptionStatus.variant === 'yellow'
                                                    ? 'text-yellow-600'
                                                    : 'text-gray-600'}`, children: subscriptionStatus.label })] }), _jsxs("div", { className: "min-w-[200px]", children: [_jsx("div", { className: "text-xs text-gray-500", children: "Licence" }), _jsx("div", { className: "font-medium text-gray-800", children: licenseText })] }), _jsx("div", { className: "md:ml-auto", children: _jsx("button", { type: "button", className: "px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700", onClick: () => navigate('/admin/administration'), children: "G\u00E9rer l\u2019abonnement" }) })] }), _jsx("div", { className: "mt-3 md:hidden", children: _jsx("div", { className: "p-4 bg-white rounded-md shadow", children: _jsxs("div", { className: "flex justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: "\u00C9cole" }), _jsx("div", { className: "font-medium text-gray-800", children: schoolName })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-xs text-gray-500", children: "Statut" }), _jsx("div", { className: `text-sm ${subscriptionStatus.variant === 'green'
                                                    ? 'text-green-600'
                                                    : subscriptionStatus.variant === 'red'
                                                        ? 'text-red-600'
                                                        : subscriptionStatus.variant === 'yellow'
                                                            ? 'text-yellow-600'
                                                            : 'text-gray-600'}`, children: subscriptionStatus.label }), _jsx("div", { className: "text-xs text-gray-500", children: "Licence" }), _jsx("div", { className: "text-sm", children: licenseShort })] })] }) }) })] })), _jsx("div", { className: "mb-4", children: loading ? (_jsx("p", { className: "text-sm text-gray-500", children: "Chargement..." })) : (summary && (_jsxs("p", { className: "text-sm text-gray-600", children: ["\u00C9coles : ", summary.schools, " \u2014 Revenu estim\u00E9 : ", summary.revenue] }))) }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-700 mb-4", children: "\u2699\uFE0F Actions Principales" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx("button", { onClick: () => navigate('/admin/administration'), className: "w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100", children: "\uD83D\uDC65 G\u00E9rer l'Administration" }), _jsx("button", { className: "w-full text-left px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100", children: "\uD83D\uDCDA G\u00E9rer les Classes" }), _jsx("button", { className: "w-full text-left px-4 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100", children: "\uD83D\uDCCA Bulletins & Notes" }), _jsx("button", { className: "w-full text-left px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100", children: "\uD83D\uDCB0 Param\u00E8tres de l'\u00C9cole" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 mt-6", children: [_jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-700 mb-4", children: "\uD83D\uDCC8 Nouvelles Inscritions" }), _jsx("p", { className: "text-sm text-gray-500 mb-4", children: "Cliquez pour g\u00E9rer les demandes d'inscription en attente." }), _jsx("button", { className: "w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700", children: "Voir les demandes" })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-700 mb-4", children: "\uD83D\uDCB0 Gestion Financi\u00E8re" }), _jsx("p", { className: "text-sm text-gray-500 mb-4", children: "Suivez vos revenus et g\u00E9rez vos abonnements." }), _jsx("button", { className: "w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700", children: "Voir le Rapport Financier" })] })] })] }));
}
