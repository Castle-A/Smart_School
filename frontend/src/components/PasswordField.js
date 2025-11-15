import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useState } from 'react';
const PasswordField = forwardRef(({ className = '', ...rest }, ref) => {
    const [visible, setVisible] = useState(false);
    return (_jsxs("div", { className: "relative", children: [_jsx("input", { ...rest, ref: ref, type: visible ? 'text' : 'password', className: (className + ' pr-10').trim() }), _jsx("button", { type: "button", "aria-label": visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe', onClick: () => setVisible((v) => !v), className: "absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700", children: visible ? (
                // eye-off icon
                _jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M13.875 18.825A10.05 10.05 0 0 1 12 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 0 1 2.18-5.815M3 3l18 18" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9.88 9.88A3 3 0 1 0 14.12 14.12" })] })) : (
                // eye icon
                _jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })] })) })] }));
});
PasswordField.displayName = 'PasswordField';
export default PasswordField;
