import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '../../context/AuthContext';
import { salutation } from '../../utils/salutation';
import { useNavigate } from 'react-router-dom';
// Sous-pages supprimées (pas utilisées pour l'instant)
const StudentsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    return (_jsxs("div", { className: "p-6 max-w-6xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-6", children: "Espace \u00C9l\u00E8ve" }), _jsxs("p", { className: "text-gray-600", children: [salutation(user), user?.firstName ? (user.gender ? '' : ' !') : '', " Voici votre espace personnel."] }), _jsxs("div", { className: "flex flex-wrap justify-center gap-4 mb-8", children: [_jsx("button", { onClick: () => navigate('/dashboard/students/reports'), className: "px-4 py-2 bg-white shadow rounded-md hover:shadow-lg transition-all duration-300 hover:scale-105", children: "\uD83D\uDCC4 Mes Bulletins" }), _jsx("button", { onClick: () => navigate('/dashboard/students/grades'), className: "px-4 py-2 bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105", children: "\uD83D\uDCCA Mes Notes" }), _jsx("button", { onClick: () => navigate('/dashboard/students/schedule'), className: "px-4 py-2 bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105", children: "\u23F0 Mon Emploi du Temps" }), _jsx("button", { onClick: () => navigate('/dashboard/students/attendance'), className: "px-4 py-2 bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105", children: "\uD83D\uDCCB Mes Pr\u00E9sences" })] }), _jsx("main", { className: "bg-white p-6 rounded-lg shadow", children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-4", children: "Tableau de Bord" }), _jsx("p", { className: "text-gray-600", children: "Choisissez une section ci-dessus pour voir plus de d\u00E9tails." })] }) })] }));
};
export default StudentsPage;
