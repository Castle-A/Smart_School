import React, { useEffect, useState } from 'react';
import ConfirmModal from '../../components/ConfirmModal';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

type Gender = 'MALE' | 'FEMALE' | 'OTHER';

type UserItem = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
  gender?: Gender;
  phoneNumber?: string;
  schoolId?: string;
};

const AVAILABLE_ADMIN_ROLES = [
  'DIRECTEUR',
  'SECRETAIRE',
  'COMPTABLE',
  'SURVEILLANT',
  'CENSEUR',
] as const;

const PERMISSIONS = [
  { key: 'manage_users', label: 'Gérer les utilisateurs' },
  { key: 'manage_roles', label: 'Attribuer des rôles' },
  { key: 'view_reports', label: 'Consulter les rapports' },
  { key: 'manage_tasks', label: 'Gérer les tâches' },
  { key: 'manage_files', label: 'Gérer les fichiers' },
] as const;

const ROLE_PERMISSION_PRESETS: Record<string, string[]> = {
  DIRECTEUR: ['manage_users', 'manage_roles', 'view_reports', 'manage_tasks', 'manage_files'],
  SECRETAIRE: ['manage_users', 'manage_tasks', 'manage_files', 'view_reports'],
  COMPTABLE: ['view_reports', 'manage_files'],
  SURVEILLANT: ['manage_tasks', 'view_reports'],
  CENSEUR: ['manage_users', 'view_reports'],
};

const AdministrationManager: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] =
    useState<(typeof AVAILABLE_ADMIN_ROLES)[number]>(AVAILABLE_ADMIN_ROLES[0]);
  const [newPermissions, setNewPermissions] = useState<string[]>([]);
  const [newGender, setNewGender] = useState<Gender>('MALE');
  const [newPhone, setNewPhone] = useState('');

  // UI state
  const [creating, setCreating] = useState(false);
  const [createdPassword, setCreatedPassword] = useState<string | null>(null);
  const [showGeneratedModal, setShowGeneratedModal] = useState(false);
  const [generatedUserEmail, setGeneratedUserEmail] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  // Confirmation modal state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<{
    userId: string | null;
    email?: string | null;
    action?: 'delete' | 'reset' | null;
  }>({ userId: null, email: null, action: null });

  // Charger la liste
  useEffect(() => {
    loadUsers();
  }, []);

  // Appliquer preset d'autorisations quand rôle change (dans la modale)
  useEffect(() => {
    if (!showAddModal) return;
    const preset = ROLE_PERMISSION_PRESETS[newRole] ?? [];
    setNewPermissions(preset);
  }, [newRole, showAddModal, setNewPermissions]);

  // Ouvrir modal d'identifiants si un password est généré
  useEffect(() => {
    if (createdPassword) setShowGeneratedModal(true);
  }, [createdPassword]);

  async function loadUsers() {
    setLoading(true);
    try {
      const resp = await api.get<UserItem[]>('/api/users');
      setUsers(resp.data);
    } catch (err: any) {
      // axios error handling: try to show server message/details
      const serverMessage = err?.response?.data?.message || err?.response?.data || err?.message || String(err);
      setError(typeof serverMessage === 'string' ? serverMessage : JSON.stringify(serverMessage));
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(userId: string, role: string) {
    setSavingId(userId);
    setError(null);
    setSuccess(null);
    try {
      const resp = await api.patch(`/api/users/${userId}/role`, { role });
      const updated = resp.data as { role: string };
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: updated.role } : u)),
      );
      setSuccess('Rôle mis à jour avec succès');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      const serverMessage = err?.response?.data?.message || err?.response?.data || err?.message || String(err);
      setError(typeof serverMessage === 'string' ? serverMessage : JSON.stringify(serverMessage));
    } finally {
      setSavingId(null);
    }
  }

  function togglePermission(key: string) {
    setNewPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key],
    );
  }

  async function handleCreateMember(e?: React.FormEvent) {
    if (e) e.preventDefault();
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
      } as any;

      const createdResp = (await api.post('/api/users', payload)).data;
      const created = createdResp.user ?? createdResp;
      const generatedPwd = createdResp.password ?? null;

      setUsers((prev) => [created, ...prev]);
      if (created?.email) setGeneratedUserEmail(created.email as string);
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
    } catch (err: any) {
      const serverMessage = err?.response?.data?.message || err?.response?.data || err?.message || String(err);
      setError(typeof serverMessage === 'string' ? serverMessage : JSON.stringify(serverMessage));
    } finally {
      setCreating(false);
    }
  }

  async function handleResetPassword(userId: string) {
    setError(null);
    setSuccess(null);
    try {
      const data = (await api.post(`/api/users/${userId}/reset-password`)).data;
      setSuccess('Mot de passe réinitialisé');
      setCreatedPassword(data.password || null);
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      const serverMessage = err?.response?.data?.message || err?.response?.data || err?.message || String(err);
      setError(typeof serverMessage === 'string' ? serverMessage : JSON.stringify(serverMessage));
    }
  }

  const { user: currentUser } = useAuth();

  const filteredUsers = users.filter((u) => {
    if (!currentUser) return false;
    return (
      !!u.role &&
      AVAILABLE_ADMIN_ROLES.includes(u.role as any) &&
      u.schoolId === (currentUser as any).schoolId &&
      // Exclure explicitement le fondateur de la liste d'administration
      u.role !== 'FONDATEUR'
    );
  });

  // Actual API call to deactivate a user (performed after confirming in modal)
  async function performRemovePost(userId: string) {
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
    } catch (err: any) {
      const serverMessage = err?.response?.data?.message || err?.response?.data || err?.message || String(err);
      setError(typeof serverMessage === 'string' ? serverMessage : JSON.stringify(serverMessage));
    } finally {
      setSavingId(null);
    }
  }

  // Open the confirmation modal for delete or reset actions
  function openConfirm(action: 'delete' | 'reset', userId: string, email?: string) {
    setConfirmTarget({ userId, email: email ?? null, action });
    setConfirmModalOpen(true);
  }

  // Confirm and execute the chosen action
  async function confirmAction() {
    const { userId, action } = confirmTarget;
    if (!userId || !action) return;
    setConfirmModalOpen(false);
    if (action === 'delete') {
      await performRemovePost(userId);
    } else if (action === 'reset') {
      await handleResetPassword(userId);
    }
    setConfirmTarget({ userId: null, email: null, action: null });
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gérer l&apos;Administration</h1>
        <p className="text-sm text-gray-500">
          Attribuez des rôles d&apos;administration aux membres de votre école.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Aperçu rapide</h2>
        <p className="text-sm text-gray-600">
          Rôles disponibles : {AVAILABLE_ADMIN_ROLES.join(', ')}
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Liste des Utilisateurs</h2>

        <div className="mb-4">
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            onClick={() => setShowAddModal(true)}
          >
            Ajouter un membre de l&apos;administration
          </button>
        </div>

        {loading ? (
          <div className="text-gray-600">Chargement...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Nom et Prénoms
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden md:table-cell">
                    SEXE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden md:table-cell">
                    Numéro de téléphone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden sm:table-cell">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                  <th className="px-6 py-3 hidden md:table-cell" />
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-t">
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                      {u.firstName || '--'} {u.lastName || ''}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 hidden md:table-cell">
                      {u.gender === 'MALE' ? 'Homme' : u.gender === 'FEMALE' ? 'Femme' : u.gender === 'OTHER' ? 'Autre' : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 hidden md:table-cell">{u.phoneNumber || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 hidden sm:table-cell truncate max-w-[12rem]">{u.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                      {/* Après création on n'affiche plus de menu déroulant : rôle en lecture seule */}
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                        {u.role || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <div className="flex items-center gap-2">
                          <button
                            className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm hover:bg-indigo-200 whitespace-nowrap"
                            onClick={() => openConfirm('reset', u.id, u.email)}
                            title="Générer un mot de passe temporaire pour l'utilisateur"
                          >
                            Réinitialiser le mot de passe
                          </button>
                          <button
                            className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm hover:bg-red-200 whitespace-nowrap"
                            onClick={() => openConfirm('delete', u.id, u.email)}
                            title="Désactiver l'accès de cet utilisateur"
                          >
                            Supprimer le poste
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 hidden md:table-cell">
                      {savingId === u.id ? (
                        <span className="text-indigo-600">Sauvegarde...</span>
                      ) : (
                        <span className="text-gray-500 text-sm">
                          Dernière modification :{' '}
                          {u.updatedAt || u.createdAt
                            ? new Date(u.updatedAt || u.createdAt!).toLocaleDateString()
                            : '--'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {error && <div className="mt-4 text-gray-600">{error}</div>}
        {success && <div className="mt-4 text-green-600">{success}</div>}
        {createdPassword && (
          <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-sm">
            <strong>Mot de passe généré :</strong>{' '}
            <code className="ml-2 font-mono">{createdPassword}</code>
            <div className="text-xs text-gray-600 mt-1">
              Communiquez ce mot de passe à l&apos;utilisateur — il pourra le
              modifier après sa première connexion.
            </div>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-40"
            onClick={() => setShowAddModal(false)}
          />
          <div className="bg-white rounded-lg shadow-lg z-50 w-full max-w-xl p-6">
            <h3 className="text-xl font-semibold mb-4">
              Ajouter un membre de l&apos;administration
            </h3>
            <form onSubmit={handleCreateMember}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm">Prénom</label>
                  <input
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    className="mt-1 w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block text-sm">Nom</label>
                  <input
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    className="mt-1 w-full border rounded px-2 py-1"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm">Email</label>
                  <input
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    type="email"
                    required
                    className="mt-1 w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block text-sm">Sexe</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as Gender)}
                    className="mt-1 w-full border rounded px-2 py-1"
                    required
                  >
                    <option value="MALE">Homme</option>
                    <option value="FEMALE">Femme</option>
                    <option value="OTHER">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm">Numéro de téléphone</label>
                  <input
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    type="tel"
                    inputMode="tel"
                    pattern="^[0-9+()\\-\\s]{6,}$"
                    placeholder="+33 6 12 34 56 78"
                    className="mt-1 w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block text-sm">Rôle</label>
                  <select
                    value={newRole}
                    onChange={(e) =>
                      setNewRole(e.target.value as (typeof AVAILABLE_ADMIN_ROLES)[number])
                    }
                    className="mt-1 w-full border rounded px-2 py-1"
                    title="Le choix du rôle applique automatiquement des autorisations par défaut (modifiable ci-dessous)."
                  >
                    {AVAILABLE_ADMIN_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm">Droits</label>
                  <div className="mt-1 space-y-1">
                    {PERMISSIONS.map((p) => (
                      <label key={p.key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newPermissions.includes(p.key)}
                          onChange={() => togglePermission(p.key)}
                        />
                        <span className="text-sm">{p.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  className="px-3 py-2 rounded border"
                  onClick={() => setShowAddModal(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-indigo-600 text-white"
                  disabled={creating}
                >
                  {creating ? 'Création...' : 'Créer le membre'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generated credentials modal */}
      {showGeneratedModal && createdPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" />
          <div className="bg-white rounded-lg shadow-lg z-50 w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Identifiants créés</h3>
            <p className="text-sm">
              Compte créé pour : <strong>{generatedUserEmail || '—'}</strong>
            </p>
            <p className="mt-2 text-sm">
              Mot de passe généré :{' '}
              <code className="font-mono ml-2">{createdPassword}</code>
            </p>
            <p className="mt-3 text-xs text-gray-600">
              Notez ces identifiants et communiquez-les à l&apos;utilisateur. Il pourra changer son
              mot de passe après connexion.
            </p>
            <div className="mt-4 text-right">
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded"
                onClick={() => {
                  setShowGeneratedModal(false);
                  setCreatedPassword(null);
                  setGeneratedUserEmail(null);
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation modal (Tailwind) */}
      <ConfirmModal
        open={confirmModalOpen}
        title={confirmTarget.action === 'delete' ? 'Confirmer la suppression' : 'Confirmer la réinitialisation'}
        message={
          confirmTarget.action === 'delete'
            ? `Voulez-vous vraiment désactiver l'accès de ${confirmTarget.email || 'cet utilisateur'} ? Cette action empêche toute connexion.`
            : `Souhaitez-vous générer un nouveau mot de passe temporaire pour ${confirmTarget.email || 'cet utilisateur'} ?`
        }
        confirmLabel={confirmTarget.action === 'delete' ? 'Supprimer le poste' : 'Réinitialiser le mot de passe'}
        variant={confirmTarget.action === 'delete' ? 'danger' : 'primary'}
        onCancel={() => setConfirmModalOpen(false)}
        onConfirm={() => confirmAction()}
      />
    </div>
  );
};

export default AdministrationManager;
