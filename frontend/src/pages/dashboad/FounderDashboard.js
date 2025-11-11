import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import DashboardLayout from '@/components/layouts/DashboardLayout';
const FounderDashboard = ({ user }) => {
    const schoolId = user.schoolId;
    const navigate = useNavigate();
    const [school, setSchool] = useState(user.school ?? null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        let mounted = true;
        async function load() {
            if (!schoolId)
                return;
            setLoading(true);
            setError(null);
            try {
                const res = await api.get(`/api/schools/${schoolId}`);
                // debug: log response to help diagnose missing data in the UI
                // (will appear in browser console)
                console.log('[FounderDashboard] school API response:', res?.data);
                if (mounted)
                    setSchool(res.data ?? null);
            }
            catch {
                if (mounted)
                    setError('Impossible de charger les informations de l\'école');
            }
            finally {
                if (mounted)
                    setLoading(false);
            }
        }
        load();
        return () => { mounted = false; };
    }, [schoolId]);
    const subscriptionStatus = useMemo(() => {
        const s = school;
        if (!s)
            return { label: 'Non renseigné', color: 'gray' };
        const subscriptionStatusVal = s['subscriptionStatus'];
        if (typeof subscriptionStatusVal === 'string') {
            const label = subscriptionStatusVal;
            const lc = label.toLowerCase();
            const color = lc.includes('active') ? 'green' : lc.includes('expir') || lc.includes('inactive') ? 'red' : 'yellow';
            return { label, color };
        }
        if (s['isActive'] === false)
            return { label: 'Inactif', color: 'red' };
        return { label: 'Actif', color: 'green' };
    }, [school]);
    const googleMapsLink = useMemo(() => {
        if (!school?.address)
            return null;
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school.address)}`;
    }, [school]);
    return (_jsx(DashboardLayout, { children: _jsx("div", { className: "p-0 w-full", children: _jsxs("div", { children: [_jsxs("div", { className: "bg-white p-6 rounded-lg shadow mb-6 w-full", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-700 mb-4", children: "\uD83D\uDCCA R\u00E9sum\u00E9 de votre \u00C9cole" }), loading ? (_jsx("p", { className: "text-sm text-gray-500", children: "Chargement des informations de l'\u00E9cole\u2026" })) : error ? (_jsx("p", { className: "text-sm text-red-500", children: error })) : (_jsxs(_Fragment, { children: [(!school || Object.keys(school).length === 0) && (_jsxs("div", { className: "mb-4 p-3 bg-yellow-50 border border-yellow-100 text-yellow-800 rounded", children: [_jsx("strong", { children: "Aucune information d\u00E9taill\u00E9e disponible pour l'\u00E9cole." }), user.schoolName && (_jsxs("div", { className: "text-sm text-gray-700", children: ["Nom connu: ", _jsx("span", { className: "font-medium", children: user.schoolName })] }))] })), (!school || Object.keys(school).length === 0) && (_jsxs("div", { className: "mb-4 p-4 bg-white rounded border border-gray-100 text-sm text-gray-700", children: [_jsx("div", { className: "font-semibold mb-2", children: "Informations disponibles (fallback)" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: "Nom de l'\u00E9cole" }), _jsx("div", { className: "font-medium", children: user.schoolName ?? '—' })] }), _jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: "Email" }), _jsx("div", { className: "font-medium", children: user.email ?? '—' })] }), _jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: "Responsable (utilisateur)" }), _jsx("div", { className: "font-medium", children: user.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : '—' })] }), _jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: "T\u00E9l\u00E9phone" }), _jsx("div", { className: "font-medium", children: String((user['phoneNumber']) ?? '—') })] })] })] })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: "Nom de l'\u00E9cole" }), _jsx("div", { className: "text-2xl font-bold text-gray-900", children: school?.name ?? user.schoolName ?? '—' })] }), _jsx("div", { children: _jsx("span", { className: `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${subscriptionStatus.color === 'green'
                                                                        ? 'bg-green-100 text-green-700'
                                                                        : subscriptionStatus.color === 'red'
                                                                            ? 'bg-red-100 text-red-700'
                                                                            : 'bg-yellow-100 text-yellow-800'}`, children: subscriptionStatus.label }) })] }), _jsxs("div", { className: "mt-4 space-y-3 text-sm text-gray-700", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: "Adresse" }), _jsx("div", { className: "font-medium", children: school?.address ?? 'Non renseignée' }), school?.address && (_jsx("a", { href: googleMapsLink ?? '#', target: "_blank", rel: "noreferrer", className: "text-indigo-600 text-sm", children: "Voir sur la carte" }))] }), _jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: "Email" }), _jsx("div", { className: "font-medium", children: school?.email ?? 'Non renseigné' }), school?.email && (_jsx("div", { className: "mt-1", children: _jsx("a", { href: `mailto:${school.email}`, className: "text-indigo-600 text-sm", children: "Contacter par e-mail" }) }))] }), _jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: "T\u00E9l\u00E9phone" }), _jsx("div", { className: "font-medium", children: school?.phone ?? 'Non renseigné' }), school?.phone && (_jsx("div", { className: "mt-1", children: _jsx("a", { href: `tel:${school.phone}`, className: "text-indigo-600 text-sm", children: "Appeler" }) }))] })] }), _jsxs("details", { className: "mt-4 text-sm text-gray-600", children: [_jsx("summary", { className: "cursor-pointer", children: "D\u00E9tails & champs bruts" }), _jsx("pre", { className: "mt-2 p-3 bg-gray-50 rounded text-xs overflow-x-auto", children: JSON.stringify(school ?? {}, null, 2) })] })] }), _jsx("div", { children: _jsxs("div", { className: "flex flex-col h-full justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: "Responsable" }), _jsx("div", { className: "text-lg font-medium text-gray-900", children: String((school?.['contactName']) ?? (user.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : '—')) }), _jsxs("div", { className: "text-xs text-gray-500 mt-1", children: ["R\u00F4le: ", String((school?.['contactRole']) ?? '—')] })] }), _jsxs("div", { className: "mt-6 grid grid-cols-1 gap-3", children: [_jsx("button", { onClick: () => navigate('/admin/administration'), className: "w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700", children: "G\u00E9rer l'\u00E9cole" }), _jsx("button", { onClick: () => (school ? navigate(`/admin/schools/${school.id}/edit`) : null), className: "w-full px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 text-gray-700", children: "Modifier les informations" }), _jsx("a", { className: "inline-block text-sm text-indigo-600 mt-2", href: school?.email ? `mailto:${school.email}` : '#', children: "Envoyer un message rapide" })] })] }) })] })] }))] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow w-full mb-6", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-700 mb-4", children: "\u2699\uFE0F Actions Principales" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx("button", { onClick: () => navigate('/admin/administration'), className: "w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100", children: "\uD83D\uDC65 G\u00E9rer l'Administration" }), _jsx("button", { className: "w-full text-left px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100", children: "\uD83D\uDCDA G\u00E9rer les Classes" }), _jsx("button", { className: "w-full text-left px-4 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100", children: "\uD83D\uDCCA Bulletins & Notes" }), _jsx("button", { className: "w-full text-left px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100", children: "\uD83D\uDCB0 Param\u00E8tres de l'\u00C9cole" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 mt-6", children: [_jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-700 mb-4", children: "\uD83D\uDCC8 Nouvelles Inscritions" }), _jsx("p", { className: "text-sm text-gray-500 mb-4", children: "Cliquez pour g\u00E9rer les demandes d'inscription en attente." }), _jsx("button", { className: "w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700", children: "Voir les demandes" })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-700 mb-4", children: "\uD83D\uDCB0 Gestion Financi\u00E8re" }), _jsx("p", { className: "text-sm text-gray-500 mb-4", children: "Suivez vos revenus et g\u00E9rez vos abonnements." }), _jsx("button", { className: "w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700", children: "Voir le Rapport Financier" })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-700 mb-4", children: "\uD83D\uDC65 Gestion du personnel" }), _jsx("p", { className: "text-sm text-gray-500 mb-4", children: "G\u00E9rez les membres du personnel, leurs r\u00F4les et acc\u00E8s." }), _jsx("button", { className: "w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700", children: "G\u00E9rer le personnel" })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-700 mb-4", children: "\uD83D\uDCE3 Communication" }), _jsx("p", { className: "text-sm text-gray-500 mb-4", children: "Envoyez des annonces, notifications et messages aux utilisateurs." }), _jsx("button", { className: "w-full px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700", children: "Ouvrir la messagerie" })] })] })] }) }) }));
};
export default FounderDashboard;
