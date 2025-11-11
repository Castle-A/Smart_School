import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
export default function HolidaysManager() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ start: '', end: '', label: '' });
    const [editingId, setEditingId] = useState(null);
    const headers = () => ({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
    });
    const load = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/holidays`);
            const data = await res.json();
            setItems(data || []);
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        load();
    }, []);
    const submit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                const res = await fetch(`${API}/holidays/${editingId}`, {
                    method: 'PUT',
                    headers: headers(),
                    body: JSON.stringify(form),
                });
                if (res.ok) {
                    await load();
                    setForm({ start: '', end: '', label: '' });
                    setEditingId(null);
                }
            }
            else {
                const res = await fetch(`${API}/holidays`, {
                    method: 'POST',
                    headers: headers(),
                    body: JSON.stringify(form),
                });
                if (res.ok) {
                    await load();
                    setForm({ start: '', end: '', label: '' });
                }
            }
        }
        catch (err) {
            console.error(err);
        }
    };
    const remove = async (id) => {
        if (!confirm('Supprimer cette période de vacances ?'))
            return;
        try {
            const res = await fetch(`${API}/holidays/${id}`, { method: 'DELETE', headers: headers() });
            if (res.ok)
                await load();
        }
        catch (err) {
            console.error(err);
        }
    };
    const startEdit = (h) => {
        setEditingId(h.id);
        setForm({ start: h.start, end: h.end, label: h.label ?? '' });
    };
    return (_jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsx("h1", { className: "text-2xl font-semibold mb-4", children: "G\u00E9rer les plages de vacances" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsx("div", { className: "bg-white p-4 rounded shadow", children: _jsxs("form", { onSubmit: submit, className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm", children: "Date de d\u00E9but" }), _jsx("input", { type: "date", className: "mt-1 w-full border rounded px-2 py-1", value: form.start, onChange: (e) => setForm((f) => ({ ...f, start: e.target.value })), required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm", children: "Date de fin" }), _jsx("input", { type: "date", className: "mt-1 w-full border rounded px-2 py-1", value: form.end, onChange: (e) => setForm((f) => ({ ...f, end: e.target.value })), required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm", children: "Libell\u00E9" }), _jsx("input", { type: "text", className: "mt-1 w-full border rounded px-2 py-1", value: form.label, onChange: (e) => setForm((f) => ({ ...f, label: e.target.value })) })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { className: "px-4 py-2 bg-indigo-600 text-white rounded", children: editingId ? 'Enregistrer' : 'Ajouter' }), editingId && _jsx("button", { type: "button", className: "px-4 py-2 bg-gray-200 rounded", onClick: () => { setEditingId(null); setForm({ start: '', end: '', label: '' }); }, children: "Annuler" })] })] }) }), _jsxs("div", { className: "bg-white p-4 rounded shadow max-h-[480px] overflow-y-auto", children: [_jsx("h2", { className: "text-lg font-medium mb-2", children: "Liste" }), loading ? (_jsx("div", { children: "Chargement\u2026" })) : (_jsxs("ul", { className: "space-y-2", children: [items.map((h) => (_jsxs("li", { className: "flex items-center justify-between border-b pb-2", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: h.label ?? 'Vacances' }), _jsxs("div", { className: "text-sm text-gray-600", children: [new Date(h.start).toLocaleDateString(), " \u2192 ", new Date(h.end).toLocaleDateString()] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => startEdit(h), className: "px-2 py-1 bg-yellow-100 rounded", children: "Modifier" }), _jsx("button", { onClick: () => remove(h.id), className: "px-2 py-1 bg-red-100 rounded", children: "Supprimer" })] })] }, h.id))), items.length === 0 && _jsx("li", { className: "text-sm text-gray-500", children: "Aucune plage d\u00E9finie." })] }))] })] })] }));
}
