import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const ProtectedRoute = ({ children, allowedRoles, requireSchool = false }) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    if (isLoading) {
        return (_jsx("div", { className: "flex justify-center items-center min-h-screen text-gray-600", children: "V\u00E9rification de la session..." }));
    }
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    // Vérification multi-tenant : si la route exige une école et que l'utilisateur
    // n'en a pas, on le redirige vers la landing
    if (requireSchool && !user?.schoolId) {
        return _jsx(Navigate, { to: "/home", replace: true });
    }
    // Vérification des rôles si fournis
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return _jsx("div", { className: "p-6", children: "Acc\u00E8s refus\u00E9 \u2014 r\u00F4le insuffisant." });
    }
    return _jsx(_Fragment, { children: children });
};
export default ProtectedRoute;
