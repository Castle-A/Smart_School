import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const ConfirmModal = ({ open, title = 'Confirmer', message, confirmLabel = 'Confirmer', cancelLabel = 'Annuler', variant = 'primary', onCancel, onConfirm, }) => {
    if (!open)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-black opacity-40", onClick: onCancel }), _jsxs("div", { className: "bg-white rounded-lg shadow-lg z-50 w-full max-w-lg p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: title }), message && _jsx("div", { className: "text-sm text-gray-600 mb-4", children: message }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx("button", { className: "px-3 py-2 rounded border", onClick: onCancel, children: cancelLabel }), _jsx("button", { className: `px-4 py-2 rounded text-white ${variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}`, onClick: onConfirm, children: confirmLabel })] })] })] }));
};
export default ConfirmModal;
