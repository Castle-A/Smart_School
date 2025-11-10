import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
const Header = () => {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const navRef = useRef(null);
    const navigate = useNavigate();
    useEffect(() => {
        function onDocClick(e) {
            if (!navRef.current)
                return;
            if (!navRef.current.contains(e.target))
                setOpen(false);
        }
        document.addEventListener('click', onDocClick);
        return () => document.removeEventListener('click', onDocClick);
    }, []);
    const handleLogout = () => {
        logout();
        navigate('/home');
    };
    return (_jsxs("header", { className: "w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg", children: [_jsxs("div", { className: "container mx-auto flex items-center justify-between py-3 px-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg", children: "SS" }), _jsxs("div", { children: [_jsx(Link, { to: "/dashboard", className: "text-xl font-semibold tracking-tight", children: "Smart School" }), _jsx("div", { className: "text-xs opacity-80", children: user?.schoolName ?? '' })] })] }), _jsxs("div", { className: "flex items-center gap-4", ref: navRef, children: [_jsx("div", { className: "hidden sm:block text-sm opacity-90", children: user?.firstName }), _jsx("button", { onClick: () => setOpen((s) => !s), className: "relative focus:outline-none", "aria-expanded": open, "aria-label": "Menu utilisateur", children: _jsx("img", { src: user?.avatarUrl ?? '/src/assets/default-avatar.svg', alt: "avatar", className: "w-10 h-10 rounded-full border-2 border-white shadow", onError: (e) => {
                                        const t = e.currentTarget;
                                        if (!t.src.includes('default-avatar.svg'))
                                            t.src = '/src/assets/default-avatar.svg';
                                    } }) }), _jsx(AnimatePresence, { children: open && (_jsx(motion.div, { initial: { opacity: 0, scale: 0.95, y: -6 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: -6 }, transition: { duration: 0.18 }, className: "absolute top-16 right-4 w-48 bg-white text-gray-800 rounded-lg shadow-lg origin-top-right", style: { zIndex: 60 }, children: _jsxs("div", { className: "py-2", children: [_jsx(Link, { to: "/profile", className: "block px-4 py-2 hover:bg-gray-100", children: "Mon profil" }), _jsx(Link, { to: "/profile#settings", className: "block px-4 py-2 hover:bg-gray-100", children: "Param\u00E8tres" }), _jsx("button", { onClick: handleLogout, className: "w-full text-left px-4 py-2 hover:bg-gray-100", children: "Se d\u00E9connecter" })] }) })) })] })] }), _jsx("div", { className: "h-1 bg-gradient-to-r from-white/10 via-white/5 to-white/10 animate-pulse" })] }));
};
export default Header;
