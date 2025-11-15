import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context';
import PasswordField from '../../components/PasswordField';
// Schéma de validation avec Yup
const loginSchema = yup.object().shape({
    email: yup.string().email('Format de l\'email invalide').required('L\'email est requis'),
    password: yup.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').required('Le mot de passe est requis'),
});
const LoginPage = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(loginSchema),
    });
    // ⬅️ On récupère aussi setJustLoggedIn pour le toast de bienvenue
    const { login, mustChangePassword, setJustLoggedIn } = useAuth();
    const onSubmit = async (data) => {
        console.log('!!! ÉTAPE 1: onSubmit appelé avec les données:', data);
        try {
            const res = await login(data.email, data.password);
            console.log('!!! ÉTAPE 2: AuthContext login réussi', res);
            if (res?.mustChangePassword || mustChangePassword) {
                navigate('/change-password');
                return;
            }
            // ✅ Flag “just logged in” pour la Home (toast de bienvenue)
            try {
                setJustLoggedIn(true);
                sessionStorage.setItem('justLoggedIn', '1');
            }
            catch {
                void 0;
            }
            // ✅ Redirection vers la Home
            navigate('/', { replace: true });
        }
        catch (error) {
            console.error('!!! ÉTAPE 3: Erreur capturée:', error);
            let message = 'Erreur inconnue';
            if (error instanceof Error)
                message = error.message;
            else if (typeof error === 'object' && error !== null) {
                const e = error;
                if (e && typeof e['response'] === 'object' && e['response'] !== null) {
                    const resp = e['response'];
                    const data = resp?.['data'];
                    if (data && typeof data?.['message'] === 'string')
                        message = String(data['message']);
                    else if (typeof e['message'] === 'string')
                        message = String(e['message']);
                    else
                        message = String(e);
                }
                else {
                    message = String(e);
                }
            }
            alert('Erreur de connexion : ' + message);
        }
    };
    return (_jsx("div", { className: "flex items-center justify-center min-h-[calc(100vh-200px)]", children: _jsxs("div", { className: "w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg", children: [_jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-3xl font-extrabold text-gray-900", children: "Connexion \u00E0 votre compte" }), _jsxs("p", { className: "mt-2 text-sm text-gray-600", children: ["Ou", ' ', _jsx(Link, { to: "/register", className: "font-medium text-blue-600 hover:text-blue-500", children: "cr\u00E9ez un nouveau compte" })] })] }), _jsxs("form", { className: "mt-8 space-y-6", onSubmit: handleSubmit(onSubmit), children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "Adresse email" }), _jsx("input", { id: "email", type: "email", autoComplete: "email", ...register('email'), className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm", placeholder: "vous@exemple.com" }), errors.email && _jsx("p", { className: "mt-2 text-sm text-red-600", children: errors.email.message })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: "Mot de passe" }), _jsx(PasswordField, { id: "password", autoComplete: "current-password", ...register('password'), className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }), errors.password && _jsx("p", { className: "mt-2 text-sm text-red-600", children: errors.password.message })] })] }), _jsx("div", { children: _jsx("button", { type: "submit", className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", children: "Se connecter" }) })] })] }) }));
};
export default LoginPage;
