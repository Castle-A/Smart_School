import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import Toast from '@/components/Toast';
import { useAuth } from '@/context';
const DashboardLayout = ({ children }) => {
    const { user, justLoggedIn, setJustLoggedIn } = useAuth();
    const [showWelcome, setShowWelcome] = useState(false);
    useEffect(() => {
        const fromSession = sessionStorage.getItem('justLoggedIn') === '1';
        if (justLoggedIn || fromSession) {
            setShowWelcome(true);
            // consommer le flag pour ne pas réafficher au prochain rendu
            setJustLoggedIn(false);
            sessionStorage.removeItem('justLoggedIn');
        }
    }, [justLoggedIn, setJustLoggedIn]);
    return (_jsxs("div", { className: "min-h-screen bg-gray-100", children: [_jsx(Toast, { visible: showWelcome, type: "success", duration: 2500, onClose: () => setShowWelcome(false), message: `Bienvenue${user?.firstName ? `, ${user.firstName}` : ''} !` }), _jsx("main", { className: "p-8 overflow-y-auto", children: _jsx("div", { className: "p-0 w-full", children: _jsx("div", { className: "max-w-6xl mx-auto", children: children }) }) })] }));
};
export default DashboardLayout;
