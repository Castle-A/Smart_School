import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { useAuth } from '@/context';
const RegisterPage = () => {
    const [formData, setFormData] = useState({
        schoolName: '',
        schoolAddress: '',
        schoolPhone: '',
        schoolEmail: '',
        schoolCycles: [],
        firstName: '',
        lastName: '',
        gender: 'MALE',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'FONDATEUR',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    // ⬅️ Récupère setSessionFromToken + setJustLoggedIn pour le toast
    const { setSessionFromToken, setJustLoggedIn } = useAuth();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const toggleCycle = (cycle) => {
        setFormData((prev) => {
            const exists = prev.schoolCycles.includes(cycle);
            return {
                ...prev,
                schoolCycles: exists ? prev.schoolCycles.filter((c) => c !== cycle) : [...prev.schoolCycles, cycle],
            };
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }
        setIsLoading(true);
        try {
            const result = await authService.registerSchool({
                schoolName: formData.schoolName,
                schoolAddress: formData.schoolAddress,
                schoolPhone: formData.schoolPhone,
                schoolEmail: formData.schoolEmail,
                schoolCycles: formData.schoolCycles,
                firstName: formData.firstName,
                lastName: formData.lastName,
                gender: formData.gender,
                email: formData.email,
                password: formData.password,
                role: formData.role,
            });
            const _res = result;
            const token = typeof _res?.['access_token'] === 'string' ? String(_res['access_token']) : undefined;
            if (token) {
                // ✅ Initialise la session immédiatement
                setSessionFromToken(token);
                // ✅ Flag “just logged in” pour le toast sur la Home
                try {
                    setJustLoggedIn(true);
                    sessionStorage.setItem('justLoggedIn', '1');
                }
                catch {
                    void 0;
                }
                // ✅ Redirige vers la Home
                navigate('/', { replace: true });
            }
            else {
                // Pas de login auto : on redirige vers /login (le toast viendra après login)
                navigate('/login', {
                    state: { message: 'Compte créé avec succès ! Veuillez vous connecter.' },
                });
            }
        }
        catch (err) {
            let message = 'Une erreur est survenue lors de l\'inscription.';
            if (typeof err === 'object' && err !== null) {
                const maybeResp = err.response;
                if (maybeResp && maybeResp.data && typeof maybeResp.data.message === 'string') {
                    message = maybeResp.data.message;
                }
            }
            setError(message);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-gray-100", children: _jsxs("div", { className: "px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg w-full max-w-lg", children: [_jsx("h3", { className: "text-2xl font-bold text-center text-gray-800", children: "Cr\u00E9er un compte" }), _jsxs("form", { onSubmit: handleSubmit, className: "mt-6 space-y-4", children: [error && _jsx("div", { className: "p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg", children: error }), _jsxs("div", { children: [_jsx("h4", { className: "text-lg font-semibold text-gray-700 mb-2", children: "Informations sur l'\u00E9tablissement" }), _jsx("input", { type: "text", name: "schoolName", placeholder: "Nom de l'\u00E9tablissement", value: formData.schoolName, onChange: handleChange, className: "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600", required: true }), _jsx("input", { type: "text", name: "schoolAddress", placeholder: "Adresse de l'\u00E9tablissement", value: formData.schoolAddress, onChange: handleChange, className: "w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600", required: true }), _jsx("input", { type: "tel", name: "schoolPhone", placeholder: "Num\u00E9ro de t\u00E9l\u00E9phone", value: formData.schoolPhone, onChange: handleChange, className: "w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600", required: true }), _jsx("input", { type: "email", name: "schoolEmail", placeholder: "Email de l'\u00E9tablissement", value: formData.schoolEmail, onChange: handleChange, className: "w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600", required: true }), _jsxs("div", { className: "mt-3", children: [_jsx("p", { className: "mb-2 text-sm font-medium text-gray-600", children: "Cycle d'\u00E9tude de l'\u00E9cole" }), _jsx("div", { className: "flex gap-2 flex-wrap", children: ['Primaire', 'Premier cycle', 'Second cycle'].map((cycle) => {
                                                const selected = formData.schoolCycles.includes(cycle);
                                                return (_jsxs("button", { type: "button", onClick: () => toggleCycle(cycle), className: `px-3 py-1.5 rounded-full border transition transform duration-150 ease-out flex items-center gap-2 ${selected ? 'bg-indigo-600 text-white border-indigo-600 scale-105 shadow-md' : 'bg-white text-gray-700 hover:scale-105'}`, "aria-pressed": selected, children: [_jsx("span", { className: `inline-block w-3 h-3 rounded-full ${selected ? 'bg-white' : 'bg-gray-200'}` }), _jsx("span", { className: "text-sm", children: cycle })] }, cycle));
                                            }) }), _jsx("div", { className: "mt-2 flex flex-wrap gap-2", children: formData.schoolCycles.map((c) => (_jsxs("span", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm transition-opacity duration-200", children: [c, _jsx("button", { type: "button", onClick: () => toggleCycle(c), "aria-label": `Retirer ${c}`, className: "ml-1 text-indigo-600 font-bold", children: "\u00D7" })] }, c))) })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-lg font-semibold text-gray-700 mb-2 mt-4", children: "Vos informations" }), _jsx("input", { type: "text", name: "firstName", placeholder: "Votre pr\u00E9nom", value: formData.firstName, onChange: handleChange, className: "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600", required: true }), _jsx("input", { type: "text", name: "lastName", placeholder: "Votre nom de famille", value: formData.lastName, onChange: handleChange, className: "w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600", required: true }), _jsxs("select", { name: "role", value: formData.role, onChange: handleChange, className: "w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600", children: [_jsx("option", { value: "FONDATEUR", children: "Fondateur" }), _jsx("option", { value: "DIRECTEUR", children: "Directeur" })] }), _jsxs("select", { name: "gender", value: formData.gender, onChange: handleChange, className: "w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600", children: [_jsx("option", { value: "MALE", children: "Homme" }), _jsx("option", { value: "FEMALE", children: "Femme" }), _jsx("option", { value: "OTHER", children: "Autre" })] }), _jsx("input", { type: "email", name: "email", placeholder: "Votre email", value: formData.email, onChange: handleChange, className: "w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600", required: true }), _jsx("input", { type: "password", name: "password", placeholder: "Votre mot de passe", value: formData.password, onChange: handleChange, className: "w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600", required: true }), _jsx("input", { type: "password", name: "confirmPassword", placeholder: "Confirmer le mot de passe", value: formData.confirmPassword, onChange: handleChange, className: "w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600", required: true })] }), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full py-2 mt-6 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50", children: isLoading ? 'Création...' : 'Créer le compte' })] }), _jsxs("p", { className: "mt-4 text-sm text-center text-gray-600", children: ["Vous avez d\u00E9j\u00E0 un compte ?", ' ', _jsx(Link, { to: "/login", className: "font-medium text-blue-600 hover:underline", children: "Connectez-vous" })] })] }) }));
};
export default RegisterPage;
