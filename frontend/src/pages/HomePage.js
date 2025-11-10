import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import LandingNews from '../components/LandingNews';
// Importez tous vos tableaux de bord ici
import AdminDashboard from './dashboad/AdminDashboard';
import FounderDashboard from './dashboad/FounderDashboard';
import DirectorDashboard from './dashboad/DirectorDashboard';
// HeadTeacherDashboard removed from imports — not used on the landing
import TeacherDashboard from './dashboad/TeacherDashboard';
// SecretaryProfile import removed — not used on the landing
import StudentDashboard from './dashboad/StudentDashboard';
import ParentDashboard from './dashboad/ParentDashboard';
const HomePage = () => {
    const { user, isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
        return (_jsx("div", { className: "flex justify-center items-center min-h-screen bg-gray-100", children: _jsx("div", { className: "text-2xl font-bold text-gray-600", children: "Chargement..." }) }));
    }
    // Landing (utilisateur non connecté)
    if (!isAuthenticated) {
        return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50", children: [_jsx("header", { className: "py-16", children: _jsxs("div", { className: "container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center gap-12", children: [_jsxs("div", { className: "w-full lg:w-1/2", children: [_jsx("h1", { className: "text-4xl md:text-5xl font-extrabold text-gray-900 mb-4", children: "Smart School \u2014 Simplifiez la gestion scolaire" }), _jsx("p", { className: "text-gray-700 mb-6 text-lg", children: "Unifier les pr\u00E9sences, notes, communications et plannings dans une interface simple et s\u00E9curis\u00E9e. Pour les \u00E9coles, enseignants, parents et \u00E9l\u00E8ves." }), _jsxs("ul", { className: "space-y-3 mb-6", children: [_jsxs("li", { className: "flex items-start gap-3", children: [_jsx("span", { className: "bg-indigo-600 text-white rounded-full w-9 h-9 flex items-center justify-center", children: "\u2713" }), _jsx("span", { className: "text-gray-700", children: "Tableaux de bord adapt\u00E9s aux r\u00F4les" })] }), _jsxs("li", { className: "flex items-start gap-3", children: [_jsx("span", { className: "bg-indigo-600 text-white rounded-full w-9 h-9 flex items-center justify-center", children: "\u2713" }), _jsx("span", { className: "text-gray-700", children: "Communication instantan\u00E9e et gestion des t\u00E2ches" })] }), _jsxs("li", { className: "flex items-start gap-3", children: [_jsx("span", { className: "bg-indigo-600 text-white rounded-full w-9 h-9 flex items-center justify-center", children: "\u2713" }), _jsx("span", { className: "text-gray-700", children: "S\u00E9curit\u00E9 et permissions granulaires" })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [_jsx(Link, { to: "/register", className: "inline-flex items-center justify-center py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition", children: "Cr\u00E9er un compte" }), _jsx(Link, { to: "/login", className: "inline-flex items-center justify-center py-3 px-6 bg-white text-indigo-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition", children: "Se connecter" })] })] }), _jsx("div", { className: "w-full lg:w-1/2", children: _jsxs("div", { className: "rounded-2xl shadow-xl overflow-hidden bg-gradient-to-br from-white to-indigo-50 p-6", children: [_jsx("h3", { className: "text-xl font-semibold text-gray-800 mb-4", children: "Flux d'actualit\u00E9s" }), _jsx(LandingNews, {})] }) })] }) }), _jsx("section", { className: "py-12", children: _jsx("div", { className: "container mx-auto px-6 lg:px-20", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "p-6 bg-white rounded-xl shadow", children: [_jsx("h4", { className: "font-semibold text-lg mb-2", children: "Gagnez du temps" }), _jsx("p", { className: "text-sm text-gray-600", children: "Automatisez les t\u00E2ches r\u00E9currentes et concentrez-vous sur l\u2019enseignement." })] }), _jsxs("div", { className: "p-6 bg-white rounded-xl shadow", children: [_jsx("h4", { className: "font-semibold text-lg mb-2", children: "Communication fluide" }), _jsx("p", { className: "text-sm text-gray-600", children: "Messagerie, notifications et partages de documents en quelques clics." })] }), _jsxs("div", { className: "p-6 bg-white rounded-xl shadow", children: [_jsx("h4", { className: "font-semibold text-lg mb-2", children: "S\u00E9curit\u00E9 & confidentialit\u00E9" }), _jsx("p", { className: "text-sm text-gray-600", children: "Contr\u00F4lez qui voit quoi gr\u00E2ce \u00E0 des permissions claires." })] })] }) }) })] }));
    }
    // Utilisateur connecté → on rend le bon dashboard
    const renderDashboard = () => {
        switch (user?.role) {
            case 'ELEVE':
                return _jsx(StudentDashboard, { user: user });
            case 'PARENT':
                return _jsx(ParentDashboard, { user: user });
            case 'ENSEIGNANT':
                return _jsx(TeacherDashboard, { user: user });
            case 'DIRECTEUR':
                return _jsx(DirectorDashboard, { user: user });
            case 'FONDATEUR':
                return _jsx(FounderDashboard, { user: user });
            case 'SUPER_ADMIN':
                return _jsx(AdminDashboard, {});
            default:
                return (_jsxs("div", { className: "p-6 max-w-6xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-red-600", children: "Erreur" }), _jsxs("p", { children: ["R\u00F4le non reconnu : ", user?.role] })] }));
        }
    };
    return _jsx("div", { className: "min-h-screen bg-gray-100", children: renderDashboard() });
};
export default HomePage;
