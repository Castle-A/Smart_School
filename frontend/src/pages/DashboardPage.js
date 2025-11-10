import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showWelcome, setShowWelcome] = useState(false);
    if (!isAuthenticated || !user)
        return _jsx("div", { children: "Redirection en cours..." });
    const handleLogout = () => { logout(); navigate('/login'); };
    const renderRoleDashboard = () => {
        // Chaque dashboard reçoit l'utilisateur afin d'utiliser user.schoolId pour les requêtes multi-tenant
        switch (user.role) {
            case 'SUPER_ADMIN':
                return _jsx(AdminDashboard, {});
            case 'DIRECTEUR':
                return _jsx(DirectorDashboard, { user: user });
            case 'FONDATEUR':
                return _jsx(FounderDashboard, { user: user });
            case 'ENSEIGNANT':
                return _jsx(TeacherDashboard, { user: user });
            case 'CHEF_DECLASSE':
                return _jsx(HeadTeacherDashboard, { user: user });
            case 'ELEVE':
                return _jsx(StudentDashboard, { user: user });
            case 'PARENT':
                return _jsx(ParentDashboard, { user: user });
            case 'SECRETAIRE':
                return _jsx(SecretaryDashboard, { user: user });
            default:
                return (_jsxs("div", { className: "p-6 bg-white rounded shadow", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Tableau de bord" }), _jsxs("p", { children: ["R\u00F4le non reconnu : ", user.role] })] }));
        }
    };
    const getSalutation = () => {
        const gender = user.gender;
        if (!user || !user.firstName)
            return 'Bonjour';
        if (gender === 'MALE')
            return `M. ${user.firstName}`;
        if (gender === 'FEMALE')
            return `Mme ${user.firstName}`;
        if (gender === 'OTHER')
            return `Mx ${user.firstName}`;
        return `Bonjour ${user.firstName}`;
    };
    useEffect(() => {
        // show welcome if navigated from registration
        const s = location.state?.welcome;
        if (s === 'account_created') {
            setShowWelcome(true);
            // dismiss after 4s
            const t = setTimeout(() => setShowWelcome(false), 4000);
            return () => clearTimeout(t);
        }
    }, [location.state]);
    return (_jsxs("div", { className: "p-6", children: [_jsx(Toast, { message: `Bienvenue ${user?.firstName || ''} ! Votre compte a été créé.`, type: "success", visible: showWelcome, onClose: () => setShowWelcome(false) }), _jsx(AnimatePresence, { children: showWelcome && (_jsx(motion.div, { initial: { opacity: 0, y: -10, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -10, scale: 0.98 }, transition: { duration: 0.45, ease: 'easeOut' }, className: "mb-6", children: _jsxs("div", { className: "p-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg shadow-lg", children: [_jsxs("h2", { className: "text-xl font-semibold", children: ["Bienvenue ", user?.firstName, " \uD83C\uDF89"] }), _jsx("p", { className: "text-sm opacity-90", children: "Votre tableau de bord est pr\u00EAt." })] }) })) }), _jsx("div", { className: "mb-6", children: _jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "Tableau de bord" }) }), _jsx("div", { className: "mt-4 p-6 bg-white rounded-lg shadow", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("img", { src: user.avatarUrl || '/default-avatar.svg', alt: "Avatar", className: "w-12 h-12 rounded-full", crossOrigin: "anonymous", referrerPolicy: "no-referrer", onError: (e) => {
                                const t = e.currentTarget;
                                t.onerror = null;
                                if (t.src && !t.src.includes('/default-avatar.svg')) {
                                    t.src = '/default-avatar.svg';
                                }
                            } }), _jsxs("div", { children: [_jsxs("h2", { className: "text-xl font-semibold text-gray-700", children: [getSalutation(), " ", !['MALE', 'FEMALE', 'OTHER'].includes(user.gender || '') ? '!' : ''] }), _jsxs("p", { className: "text-gray-600", children: ["Connect\u00E9 en tant que ", _jsx("span", { className: "font-medium", children: user.role }), " de ", _jsx("span", { className: "font-bold text-blue-600", children: user.schoolName })] })] })] }) }), _jsx("div", { className: "mt-6", children: renderRoleDashboard() })] }));
};
export default DashboardPage;
