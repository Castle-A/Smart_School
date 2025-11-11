import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Toast from '../components/Toast';
import { motion, AnimatePresence } from 'framer-motion';
// Import des dashboards par rôle
import AdminDashboard from './dashboad/AdminDashboard';
import FounderDashboard from './dashboad/FounderDashboard';
import DirectorDashboard from './dashboad/DirectorDashboard';
import HeadTeacherDashboard from './dashboad/HeadTeacherDashboard';
import TeacherDashboard from './dashboad/TeacherDashboard';
import StudentDashboard from './dashboad/StudentDashboard';
import ParentDashboard from './dashboad/ParentDashboard';
import SecretaryDashboard from './dashboad/SecretaryDashboard';
const DashboardPage = () => {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();
    const [showWelcome, setShowWelcome] = useState(false);
    const nonNullUser = user;
    const renderRoleDashboard = (u) => {
        // Chaque dashboard reçoit l'utilisateur afin d'utiliser user.schoolId pour les requêtes multi-tenant
        switch (u.role) {
            case 'SUPER_ADMIN':
                return _jsx(AdminDashboard, {});
            case 'DIRECTEUR':
                return _jsx(DirectorDashboard, { user: u });
            case 'FONDATEUR':
                return _jsx(FounderDashboard, { user: u });
            case 'ENSEIGNANT':
                return _jsx(TeacherDashboard, { user: u });
            case 'CHEF_DECLASSE':
                return _jsx(HeadTeacherDashboard, { user: u });
            case 'ELEVE':
                return _jsx(StudentDashboard, { user: u });
            case 'PARENT':
                return _jsx(ParentDashboard, { user: u });
            case 'SECRETAIRE':
                return _jsx(SecretaryDashboard, { user: u });
            default:
                return (_jsxs("div", { className: "p-6 bg-white rounded shadow", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Tableau de bord" }), _jsxs("p", { children: ["R\u00F4le non reconnu : ", u.role] })] }));
        }
    };
    const getSalutation = () => {
        const gender = nonNullUser.gender || '';
        if (!nonNullUser || !nonNullUser.firstName)
            return 'Bonjour';
        const name = `${nonNullUser.firstName}${nonNullUser.lastName ? ' ' + nonNullUser.lastName : ''}`.trim();
        if (gender === 'MALE')
            return `M. ${name}`;
        if (gender === 'FEMALE')
            return `Mme ${name}`;
        if (gender === 'OTHER')
            return `Mx ${name}`;
        return `Bonjour ${name}`;
    };
    // === Helpers d'affichage demandés ===
    const isStudent = nonNullUser.role === 'ELEVE';
    const roleLabel = (r) => {
        switch (r) {
            case 'ELEVE':
                return 'Élève';
            case 'DIRECTEUR':
                return 'Directeur';
            case 'FONDATEUR':
                return 'Fondateur';
            case 'ENSEIGNANT':
                return 'Enseignant';
            case 'CHEF_DECLASSE':
                return 'Chef de classe';
            case 'PARENT':
                return 'Parent';
            case 'SECRETAIRE':
                return 'Secrétaire';
            case 'SUPER_ADMIN':
                return 'Super administrateur';
            default:
                return r;
        }
    };
    const genderLabel = (g) => {
        if (g === 'MALE')
            return 'Homme';
        if (g === 'FEMALE')
            return 'Femme';
        if (g === 'OTHER')
            return 'Autre';
        return 'Non renseigné';
    };
    const v = (x) => (x && String(x).trim().length ? String(x) : '—');
    useEffect(() => {
        // Affiche la bannière de bienvenue si on arrive de la création de compte
        const s = location.state?.welcome;
        if (s === 'account_created') {
            setShowWelcome(true);
            const t = setTimeout(() => setShowWelcome(false), 4000);
            return () => clearTimeout(t);
        }
    }, [location.state]);
    // Profile enrichment is handled centrally in AuthProvider; no-op here.
    if (!isAuthenticated || !user)
        return _jsx("div", { children: "Redirection en cours..." });
    return (_jsx("div", { className: "p-6", children: _jsxs("div", { children: [_jsx(Toast, { message: `Bienvenue ${user?.firstName || ''} ! Votre compte a été créé.`, type: "success", visible: showWelcome, onClose: () => setShowWelcome(false) }), _jsx(AnimatePresence, { children: showWelcome && (_jsx(motion.div, { initial: { opacity: 0, y: -10, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -10, scale: 0.98 }, transition: { duration: 0.45, ease: 'easeOut' }, className: "mb-6", children: _jsxs("div", { className: "p-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg shadow-md", children: [_jsxs("h2", { className: "text-xl font-semibold", children: ["Bienvenue ", user?.firstName, " \uD83C\uDF89"] }), _jsx("p", { className: "text-sm opacity-90", children: "Votre tableau de bord est pr\u00EAt." })] }) })) }), _jsx("div", { className: "mb-6", children: _jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "Tableau de bord" }) }), _jsxs("div", { className: "mt-4 p-3 bg-white rounded-lg shadow-sm w-full", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-700 mb-2", children: "\uD83D\uDC64 Vos informations personnelles" }), _jsxs("div", { className: "mb-4", children: [_jsxs("h2", { className: "text-lg font-semibold text-gray-800", children: [getSalutation(), " ", !['MALE', 'FEMALE', 'OTHER'].includes(user.gender || '') ? '!' : ''] }), _jsxs("p", { className: "text-sm text-gray-500", children: [`Vous êtes ${user.gender === 'FEMALE' ? 'connectée' : 'connecté'} en tant que `, _jsx("span", { className: "font-medium", children: roleLabel(user.role) }), ` de `, _jsx("span", { className: "font-medium text-blue-700", children: v(user.schoolName) })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [_jsxs("div", { className: "p-2 rounded-lg bg-white border border-gray-100", children: [_jsx("div", { className: "text-xs uppercase tracking-wide text-gray-400", children: "Pr\u00E9nom" }), _jsx("div", { className: "mt-1 text-gray-800 font-medium", children: v(user.firstName) })] }), _jsxs("div", { className: "p-2 rounded-lg bg-white border border-gray-100", children: [_jsx("div", { className: "text-xs uppercase tracking-wide text-gray-400", children: "Nom" }), _jsx("div", { className: "mt-1 text-gray-800 font-medium", children: v(user.lastName ?? '') })] }), _jsxs("div", { className: "p-2 rounded-lg bg-white border border-gray-100", children: [_jsx("div", { className: "text-xs uppercase tracking-wide text-gray-400", children: "Sexe" }), _jsx("div", { className: "mt-1 text-gray-800 font-medium", children: genderLabel(user.gender) })] }), _jsxs("div", { className: "p-2 rounded-lg bg-white border border-gray-100", children: [_jsx("div", { className: "text-xs uppercase tracking-wide text-gray-400", children: isStudent ? 'Matricule' : 'Téléphone' }), _jsx("div", { className: "mt-1 text-gray-800 font-medium", children: isStudent ? v(user.matricule) : (user.phoneNumber ? (_jsx("a", { href: `tel:${user.phoneNumber}`, className: "text-gray-800", children: user.phoneNumber })) : '—') })] }), !isStudent && (_jsxs("div", { className: "p-2 rounded-lg bg-white border border-gray-100", children: [_jsx("div", { className: "text-xs uppercase tracking-wide text-gray-400", children: "Email" }), _jsx("div", { className: "mt-1 text-gray-800 font-medium break-all", children: v(user.email) })] })), _jsxs("div", { className: "p-2 rounded-lg bg-white border border-gray-100", children: [_jsx("div", { className: "text-xs uppercase tracking-wide text-gray-400", children: "Profil" }), _jsx("div", { className: "mt-1 text-gray-800 font-semibold", children: roleLabel(user.role) })] })] })] }), _jsx("div", { className: "mt-6", children: renderRoleDashboard(user) })] }) }));
};
export default DashboardPage;
