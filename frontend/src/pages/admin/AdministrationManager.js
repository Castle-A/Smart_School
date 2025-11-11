import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import ConfirmModal from '../../components/ConfirmModal';
import { useAuth } from '../../context';
import api from '../../services/api';
const AVAILABLE_ADMIN_ROLES = [
    'DIRECTEUR',
    'SECRETAIRE',
    'COMPTABLE',
    'SURVEILLANT',
    'CENSEUR',
];
const PERMISSIONS = [
    { key: 'manage_users', label: 'Gérer les utilisateurs' },
    { key: 'manage_roles', label: 'Attribuer des rôles' },
    { key: 'view_reports', label: 'Consulter les rapports' },
    { key: 'manage_tasks', label: 'Gérer les tâches' },
    { key: 'manage_files', label: 'Gérer les fichiers' },
];
const ROLE_PERMISSION_PRESETS = {
    DIRECTEUR: ['manage_users', 'manage_roles', 'view_reports', 'manage_tasks', 'manage_files'],
    SECRETAIRE: ['manage_users', 'manage_tasks', 'manage_files', 'view_reports'],
    COMPTABLE: ['view_reports', 'manage_files'],
    SURVEILLANT: ['manage_tasks', 'view_reports'],
    CENSEUR: ['manage_users', 'view_reports'],
};
const AdministrationManager = () => {
    const [users, setUsers] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    // Form state
    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newRole, setNewRole] = useState(AVAILABLE_ADMIN_ROLES[0]);
    const [newPermissions, setNewPermissions] = useState([]);
    const [newGender, setNewGender] = useState('MALE');
    const [newPhone, setNewPhone] = useState('');
    // UI state
    const [creating, setCreating] = useState(false);
    const [createdPassword, setCreatedPassword] = useState(null);
    const [showGeneratedModal, setShowGeneratedModal] = useState(false);
    const [generatedUserEmail, setGeneratedUserEmail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [savingId, setSavingId] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    // Confirmation modal state
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [confirmTarget, setConfirmTarget] = useState({ userId: null, email: null, action: null });
    // Charger la liste
    useEffect(() => {
        loadUsers();
    }, []);
    // Appliquer preset d'autorisations quand rôle change (dans la modale)
    useEffect(() => {
        if (!showAddModal)
            return;
        const preset = ROLE_PERMISSION_PRESETS[newRole] ?? [];
        setNewPermissions(preset);
    }, [newRole, showAddModal, setNewPermissions]);
    // Ouvrir modal d'identifiants si un password est généré
    useEffect(() => {
        if (createdPassword)
            setShowGeneratedModal(true);
    }, [createdPassword]);
    async function loadUsers() {
        setLoading(true);
        try {
            const resp = await api.get('/api/users');
            setUsers(resp.data);
        }
        catch (err) {
            const e = err;
            // axios-style error normalization without using `any`
            const axiosResp = e && typeof e['response'] === 'object' && e['response'] !== null ? e['response'] : null;
            const data = axiosResp?.['data'];
            const serverMessage = typeof data?.['message'] === 'string'
                ? String(data['message'])
                : typeof data?.['error'] === 'string'
                    ? String(data['error'])
                    : typeof e?.['message'] === 'string'
                        ? String(e['message'])
                        : String(e);
            setError(serverMessage);
        }
        finally {
            setLoading(false);
        }
    }
    // role change handler was removed because the UI shows roles in read-only mode
    function togglePermission(key) {
        setNewPermissions((prev) => prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]);
    }
    async function handleCreateMember(e) {
        if (e)
            e.preventDefault();
        setCreating(true);
        setError(null);
        setSuccess(null);
        setCreatedPassword(null);
        try {
            // Le serveur génère le mot de passe
            const payload = {
                firstName: newFirstName,
                lastName: newLastName,
                email: newEmail,
                role: newRole,
                permissions: newPermissions,
                gender: newGender,
                phoneNumber: newPhone || undefined,
            };
            const createdResp = (await api.post('/api/users', payload)).data;
            const created = createdResp.user ?? createdResp;
            const generatedPwd = createdResp.password ?? null;
            setUsers((prev) => [created, ...prev]);
            if (created?.email)
                setGeneratedUserEmail(String(created.email));
            setSuccess('Membre créé avec succès');
            setCreatedPassword(generatedPwd);
            // reset form
            setNewFirstName('');
            setNewLastName('');
            setNewEmail('');
            setNewRole(AVAILABLE_ADMIN_ROLES[0]);
            setNewPermissions([]);
            setNewGender('MALE');
            setNewPhone('');
            setShowAddModal(false);
            setTimeout(() => setSuccess(null), 4000);
        }
        catch (err) {
            const e = err;
            const axiosResp = e && typeof e['response'] === 'object' && e['response'] !== null ? e['response'] : null;
            const data = axiosResp?.['data'];
            const serverMessage = typeof data?.['message'] === 'string'
                ? String(data['message'])
                : typeof data?.['error'] === 'string'
                    ? String(data['error'])
                    : typeof e?.['message'] === 'string'
                        ? String(e['message'])
                        : String(e);
            setError(serverMessage);
        }
        finally {
            setCreating(false);
        }
    }
    async function handleResetPassword(userId) {
        setError(null);
        setSuccess(null);
        try {
            const data = (await api.post(`/api/users/${userId}/reset-password`)).data;
            setSuccess('Mot de passe réinitialisé');
            setCreatedPassword(data.password || null);
            setTimeout(() => setSuccess(null), 4000);
        }
        catch (err) {
            const e = err;
            const axiosResp = e && typeof e['response'] === 'object' && e['response'] !== null ? e['response'] : null;
            const data = axiosResp?.['data'];
            const serverMessage = typeof data?.['message'] === 'string'
                ? String(data['message'])
                : typeof data?.['error'] === 'string'
                    ? String(data['error'])
                    : typeof e?.['message'] === 'string'
                        ? String(e['message'])
                        : String(e);
            setError(serverMessage);
        }
    }
    const { user: currentUser } = useAuth();
    const filteredUsers = users.filter((u) => {
        if (!currentUser)
            return false;
        return (!!u.role &&
            AVAILABLE_ADMIN_ROLES.includes(u.role) &&
            u.schoolId === currentUser.schoolId &&
            // Exclure explicitement le fondateur de la liste d'administration
            u.role !== 'FONDATEUR');
    });
    // Actual API call to deactivate a user (performed after confirming in modal)
    async function performRemovePost(userId) {
        // Ask for a reason (simple prompt). You can replace this with a nicer modal.
        const reason = window.prompt('Raison de la suppression (facultatif):');
        setError(null);
        setSuccess(null);
        setSavingId(userId);
        try {
            // Soft-delete via API, send reason in body
            await api.delete(`/api/users/${userId}`, { data: { reason } });
            // retirer localement l'utilisateur désactivé pour ne pas l'afficher
            setUsers((prev) => prev.filter((u) => u.id !== userId));
            setSuccess("Le poste a été supprimé / l'accès désactivé.");
            setTimeout(() => setSuccess(null), 4000);
        }
        catch (err) {
            const e = err;
            const axiosResp = e && typeof e['response'] === 'object' && e['response'] !== null ? e['response'] : null;
            const data = axiosResp?.['data'];
            const serverMessage = typeof data?.['message'] === 'string'
                ? String(data['message'])
                : typeof data?.['error'] === 'string'
                    ? String(data['error'])
                    : typeof e?.['message'] === 'string'
                        ? String(e['message'])
                        : String(e);
            setError(serverMessage);
        }
        finally {
            setSavingId(null);
        }
    }
    // Open the confirmation modal for delete or reset actions
    function openConfirm(action, userId, email) {
        setConfirmTarget({ userId, email: email ?? null, action });
        setConfirmModalOpen(true);
    }
    // Confirm and execute the chosen action
    async function confirmAction() {
        const { userId, action } = confirmTarget;
        if (!userId || !action)
            return;
        setConfirmModalOpen(false);
        if (action === 'delete') {
            await performRemovePost(userId);
        }
        else if (action === 'reset') {
            await handleResetPassword(userId);
        }
        setConfirmTarget({ userId: null, email: null, action: null });
    }
    return (_jsxs("div", { className: "p-6 max-w-6xl mx-auto", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "G\u00E9rer l'Administration" }), _jsx("p", { className: "text-sm text-gray-500", children: "Attribuez des r\u00F4les d'administration aux membres de votre \u00E9cole." })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow mb-6", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-700 mb-4", children: "Aper\u00E7u rapide" }), _jsxs("p", { className: "text-sm text-gray-600", children: ["R\u00F4les disponibles : ", AVAILABLE_ADMIN_ROLES.join(', ')] })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-700 mb-4", children: "Liste des Utilisateurs" }), _jsx("div", { className: "mb-4", children: _jsx("button", { className: "bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700", onClick: () => setShowAddModal(true), children: "Ajouter un membre de l'administration" }) }), loading ? (_jsx("div", { className: "text-gray-600", children: "Chargement..." })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full table-auto", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-gray-100", children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider", children: "Nom et Pr\u00E9noms" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden md:table-cell", children: "SEXE" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden md:table-cell", children: "Num\u00E9ro de t\u00E9l\u00E9phone" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden sm:table-cell", children: "Email" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider", children: "R\u00F4le" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider", children: "Actions" }), _jsx("th", { className: "px-6 py-3 hidden md:table-cell" })] }) }), _jsx("tbody", { children: filteredUsers.map((u) => (_jsxs("tr", { className: "border-t", children: [_jsxs("td", { className: "px-4 py-3 text-sm text-gray-900 whitespace-nowrap", children: [u.firstName || '--', " ", u.lastName || ''] }), _jsx("td", { className: "px-4 py-3 text-sm text-gray-900 hidden md:table-cell", children: u.gender === 'MALE' ? 'Homme' : u.gender === 'FEMALE' ? 'Femme' : u.gender === 'OTHER' ? 'Autre' : '—' }), _jsx("td", { className: "px-4 py-3 text-sm text-gray-900 hidden md:table-cell", children: u.phoneNumber || '—' }), _jsx("td", { className: "px-4 py-3 text-sm text-gray-900 hidden sm:table-cell truncate max-w-[12rem]", children: u.email }), _jsx("td", { className: "px-4 py-3 text-sm text-gray-900 whitespace-nowrap", children: _jsx("span", { className: "inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm", children: u.role || '—' }) }), _jsx("td", { className: "px-4 py-3 text-sm", children: _jsx("div", { children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { className: "bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm hover:bg-indigo-200 whitespace-nowrap", onClick: () => openConfirm('reset', u.id, u.email), title: "G\u00E9n\u00E9rer un mot de passe temporaire pour l'utilisateur", children: "R\u00E9initialiser le mot de passe" }), _jsx("button", { className: "bg-red-100 text-red-700 px-2 py-1 rounded text-sm hover:bg-red-200 whitespace-nowrap", onClick: () => openConfirm('delete', u.id, u.email), title: "D\u00E9sactiver l'acc\u00E8s de cet utilisateur", children: "Supprimer le poste" })] }) }) }), _jsx("td", { className: "px-4 py-3 text-sm text-gray-900 hidden md:table-cell", children: savingId === u.id ? (_jsx("span", { className: "text-indigo-600", children: "Sauvegarde..." })) : (_jsxs("span", { className: "text-gray-500 text-sm", children: ["Derni\u00E8re modification :", ' ', u.updatedAt || u.createdAt
                                                            ? new Date(u.updatedAt || u.createdAt).toLocaleDateString()
                                                            : '--'] })) })] }, u.id))) })] }) })), error && _jsx("div", { className: "mt-4 text-gray-600", children: error }), success && _jsx("div", { className: "mt-4 text-green-600", children: success }), createdPassword && (_jsxs("div", { className: "mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-sm", children: [_jsx("strong", { children: "Mot de passe g\u00E9n\u00E9r\u00E9 :" }), ' ', _jsx("code", { className: "ml-2 font-mono", children: createdPassword }), _jsx("div", { className: "text-xs text-gray-600 mt-1", children: "Communiquez ce mot de passe \u00E0 l'utilisateur \u2014 il pourra le modifier apr\u00E8s sa premi\u00E8re connexion." })] }))] }), showAddModal && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-black opacity-40", onClick: () => setShowAddModal(false) }), _jsxs("div", { className: "bg-white rounded-lg shadow-lg z-50 w-full max-w-xl p-6", children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: "Ajouter un membre de l'administration" }), _jsxs("form", { onSubmit: handleCreateMember, children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm", children: "Pr\u00E9nom" }), _jsx("input", { value: newFirstName, onChange: (e) => setNewFirstName(e.target.value), className: "mt-1 w-full border rounded px-2 py-1" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm", children: "Nom" }), _jsx("input", { value: newLastName, onChange: (e) => setNewLastName(e.target.value), className: "mt-1 w-full border rounded px-2 py-1" })] }), _jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "block text-sm", children: "Email" }), _jsx("input", { value: newEmail, onChange: (e) => setNewEmail(e.target.value), type: "email", required: true, className: "mt-1 w-full border rounded px-2 py-1" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm", children: "Sexe" }), _jsxs("select", { value: newGender, onChange: (e) => setNewGender(e.target.value), className: "mt-1 w-full border rounded px-2 py-1", required: true, children: [_jsx("option", { value: "MALE", children: "Homme" }), _jsx("option", { value: "FEMALE", children: "Femme" }), _jsx("option", { value: "OTHER", children: "Autre" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm", children: "Num\u00E9ro de t\u00E9l\u00E9phone" }), _jsx("input", { value: newPhone, onChange: (e) => setNewPhone(e.target.value), type: "tel", inputMode: "tel", pattern: "^[0-9+()\\\\-\\\\s]{6,}$", placeholder: "+33 6 12 34 56 78", className: "mt-1 w-full border rounded px-2 py-1" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm", children: "R\u00F4le" }), _jsx("select", { value: newRole, onChange: (e) => setNewRole(e.target.value), className: "mt-1 w-full border rounded px-2 py-1", title: "Le choix du r\u00F4le applique automatiquement des autorisations par d\u00E9faut (modifiable ci-dessous).", children: AVAILABLE_ADMIN_ROLES.map((r) => (_jsx("option", { value: r, children: r }, r))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm", children: "Droits" }), _jsx("div", { className: "mt-1 space-y-1", children: PERMISSIONS.map((p) => (_jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", checked: newPermissions.includes(p.key), onChange: () => togglePermission(p.key) }), _jsx("span", { className: "text-sm", children: p.label })] }, p.key))) })] })] }), _jsxs("div", { className: "mt-4 flex items-center justify-end space-x-2", children: [_jsx("button", { type: "button", className: "px-3 py-2 rounded border", onClick: () => setShowAddModal(false), children: "Annuler" }), _jsx("button", { type: "submit", className: "px-4 py-2 rounded bg-indigo-600 text-white", disabled: creating, children: creating ? 'Création...' : 'Créer le membre' })] })] })] })] })), showGeneratedModal && createdPassword && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-black opacity-40" }), _jsxs("div", { className: "bg-white rounded-lg shadow-lg z-50 w-full max-w-md p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Identifiants cr\u00E9\u00E9s" }), _jsxs("p", { className: "text-sm", children: ["Compte cr\u00E9\u00E9 pour : ", _jsx("strong", { children: generatedUserEmail || '—' })] }), _jsxs("p", { className: "mt-2 text-sm", children: ["Mot de passe g\u00E9n\u00E9r\u00E9 :", ' ', _jsx("code", { className: "font-mono ml-2", children: createdPassword })] }), _jsx("p", { className: "mt-3 text-xs text-gray-600", children: "Notez ces identifiants et communiquez-les \u00E0 l'utilisateur. Il pourra changer son mot de passe apr\u00E8s connexion." }), _jsx("div", { className: "mt-4 text-right", children: _jsx("button", { className: "px-4 py-2 bg-indigo-600 text-white rounded", onClick: () => {
                                        setShowGeneratedModal(false);
                                        setCreatedPassword(null);
                                        setGeneratedUserEmail(null);
                                    }, children: "OK" }) })] })] })), _jsx(ConfirmModal, { open: confirmModalOpen, title: confirmTarget.action === 'delete' ? 'Confirmer la suppression' : 'Confirmer la réinitialisation', message: confirmTarget.action === 'delete'
                    ? `Voulez-vous vraiment désactiver l'accès de ${confirmTarget.email || 'cet utilisateur'} ? Cette action empêche toute connexion.`
                    : `Souhaitez-vous générer un nouveau mot de passe temporaire pour ${confirmTarget.email || 'cet utilisateur'} ?`, confirmLabel: confirmTarget.action === 'delete' ? 'Supprimer le poste' : 'Réinitialiser le mot de passe', variant: confirmTarget.action === 'delete' ? 'danger' : 'primary', onCancel: () => setConfirmModalOpen(false), onConfirm: () => confirmAction() })] }));
};
export default AdministrationManager;
