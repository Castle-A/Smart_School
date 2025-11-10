import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // <-- Importer useAuth
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/ProfilePage'; // <-- Importer ProfilePage
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/dashboad/AdminDashboard';
import AdministrationManager from './pages/admin/AdministrationManager';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import ChangePasswordPage from './pages/auth/ChangePasswordPage';
function AppRoutes() {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
        return _jsx("div", { className: "flex justify-center items-center min-h-screen", children: "Chargement de l'authentification..." });
    }
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: isAuthenticated ? _jsx(Navigate, { to: "/dashboard", replace: true }) : _jsx(Navigate, { to: "/home", replace: true }) }), _jsx(Route, { path: "/home", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/register", element: _jsx(RegisterPage, {}) }), _jsx(Route, { path: "/profile", element: _jsx(ProtectedRoute, { requireSchool: true, children: _jsx(ProfilePage, {}) }) }), _jsx(Route, { path: "/change-password", element: _jsx(ProtectedRoute, { requireSchool: true, children: _jsx(ChangePasswordPage, {}) }) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { requireSchool: true, children: _jsx(DashboardPage, {}) }) }), _jsx(Route, { path: "/admin", element: _jsx(ProtectedRoute, { allowedRoles: ["SUPER_ADMIN"], children: _jsx(AdminDashboard, {}) }) }), _jsx(Route, { path: "/admin/administration", element: _jsx(ProtectedRoute, { requireSchool: true, allowedRoles: ["FONDATEUR", "DIRECTEUR", "SUPER_ADMIN"], children: _jsx(AdministrationManager, {}) }) }), _jsx(Route, { path: "*", element: _jsx("div", { children: "Page introuvable" }) })] }));
}
function App() {
    const { isAuthenticated } = useAuth();
    return (_jsxs("div", { className: "min-h-screen bg-gray-100", children: [isAuthenticated && _jsx(Header, {}), _jsx("main", { className: "container mx-auto p-8", children: _jsx(AppRoutes, {}) })] }));
}
export default App;
