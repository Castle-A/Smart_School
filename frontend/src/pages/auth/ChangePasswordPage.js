import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import Toast from '../../components/Toast';
const schema = yup.object().shape({
    newPassword: yup.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères').required('Mot de passe requis'),
    confirmPassword: yup.string().oneOf([yup.ref('newPassword')], 'Les mots de passe doivent correspondre'),
});
export default function ChangePasswordPage() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
    const { setMustChangePassword } = useAuth();
    const [showSuccess, setShowSuccess] = useState(false);
    const onSubmit = async (data) => {
        try {
            await authService.changePassword(data.newPassword);
            // clear flag in context and localStorage
            setMustChangePassword(false);
            localStorage.setItem('must_change_password', 'false');
            // Show an inline success popup and redirect shortly after
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                navigate('/dashboard');
            }, 1300);
        }
        catch (err) {
            const message = typeof err === 'object' && err !== null && 'message' in err ? String(err.message) : 'Erreur';
            alert('Erreur: ' + message);
        }
    };
    return (_jsxs("div", { className: "flex items-center justify-center min-h-[calc(100vh-200px)]", children: [_jsx(Toast, { message: "Mot de passe mis \u00E0 jour avec succ\u00E8s. Redirection\u2026", type: "success", visible: showSuccess, onClose: () => setShowSuccess(false) }), _jsxs("div", { className: "w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Veuillez changer votre mot de passe" }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium", children: "Nouveau mot de passe" }), _jsx("input", { type: "password", ...register('newPassword'), className: "mt-1 block w-full px-3 py-2 border rounded" }), errors.newPassword && _jsx("p", { className: "text-sm text-red-600", children: errors.newPassword.message })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium", children: "Confirmer le mot de passe" }), _jsx("input", { type: "password", ...register('confirmPassword'), className: "mt-1 block w-full px-3 py-2 border rounded" }), errors.confirmPassword && _jsx("p", { className: "text-sm text-red-600", children: errors.confirmPassword.message })] }), _jsx("div", { children: _jsx("button", { type: "submit", className: "w-full py-2 bg-blue-600 text-white rounded", children: "Changer le mot de passe" }) })] })] })] }));
}
