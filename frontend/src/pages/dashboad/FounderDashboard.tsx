import React, { useEffect, useMemo, useState } from 'react';
import type { User, School } from '../../types';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import DashboardLayout from '@/components/layouts/DashboardLayout';

interface FounderDashboardProps {
  user: User;
}

const FounderDashboard: React.FC<FounderDashboardProps> = ({ user }) => {
  const schoolId = user.schoolId;
  const navigate = useNavigate();

  const [school, setSchool] = useState<School | null>(user.school ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!schoolId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/api/schools/${schoolId}`);
        // debug: log response to help diagnose missing data in the UI
        // (will appear in browser console)
         
        console.log('[FounderDashboard] school API response:', res?.data);
        if (mounted) setSchool((res.data as School) ?? null);
      } catch {
        if (mounted) setError('Impossible de charger les informations de l\'école');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [schoolId]);

  const subscriptionStatus = useMemo(() => {
    const s = school as unknown as Record<string, unknown> | null;
    if (!s) return { label: 'Non renseigné', color: 'gray' };
    const subscriptionStatusVal = s['subscriptionStatus'];
    if (typeof subscriptionStatusVal === 'string') {
      const label = subscriptionStatusVal;
      const lc = label.toLowerCase();
      const color = lc.includes('active') ? 'green' : lc.includes('expir') || lc.includes('inactive') ? 'red' : 'yellow';
      return { label, color };
    }
    if (s['isActive'] === false) return { label: 'Inactif', color: 'red' };
    return { label: 'Actif', color: 'green' };
  }, [school]);

  const googleMapsLink = useMemo(() => {
    if (!school?.address) return null;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school.address)}`;
  }, [school]);

  return (
    <DashboardLayout>{/* ⬅️ le toast Bienvenue est géré dans le layout */}
      <div className="p-0 w-full">
        <div>
  {/* Résumé de l'École (même largeur que le bloc 'Vos informations personnelles') */}
  <div className="bg-white p-6 rounded-lg shadow mb-6 w-full">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">📊 Résumé de votre École</h2>

          {loading ? (
            <p className="text-sm text-gray-500">Chargement des informations de l'école…</p>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : (
            <>
              {(!school || Object.keys(school).length === 0) && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-100 text-yellow-800 rounded">
                  <strong>Aucune information détaillée disponible pour l'école.</strong>
                  {user.schoolName && (
                    <div className="text-sm text-gray-700">Nom connu: <span className="font-medium">{user.schoolName}</span></div>
                  )}
                </div>
              )}

              {/* Fallback: show minimal known info from `user` when `school` is empty */}
              {(!school || Object.keys(school).length === 0) && (
                <div className="mb-4 p-4 bg-white rounded border border-gray-100 text-sm text-gray-700">
                  <div className="font-semibold mb-2">Informations disponibles (fallback)</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-500">Nom de l'école</div>
                      <div className="font-medium">{user.schoolName ?? '—'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="font-medium">{user.email ?? '—'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Responsable (utilisateur)</div>
                      <div className="font-medium">{user.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : '—'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Téléphone</div>
                      <div className="font-medium">{String(((user as unknown as Record<string, unknown>)['phoneNumber']) ?? '—')}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500">Nom de l'école</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {school?.name ?? user.schoolName ?? '—'}
                    </div>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        subscriptionStatus.color === 'green'
                          ? 'bg-green-100 text-green-700'
                          : subscriptionStatus.color === 'red'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {subscriptionStatus.label}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-3 text-sm text-gray-700">
                  <div>
                    <div className="text-xs text-gray-500">Adresse</div>
                    <div className="font-medium">{school?.address ?? 'Non renseignée'}</div>
                    {school?.address && (
                      <a href={googleMapsLink ?? '#'} target="_blank" rel="noreferrer" className="text-indigo-600 text-sm">
                        Voir sur la carte
                      </a>
                    )}
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">Email</div>
                    <div className="font-medium">{school?.email ?? 'Non renseigné'}</div>
                    {school?.email && (
                      <div className="mt-1">
                        <a href={`mailto:${school.email}`} className="text-indigo-600 text-sm">
                          Contacter par e-mail
                        </a>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">Téléphone</div>
                    <div className="font-medium">{school?.phone ?? 'Non renseigné'}</div>
                    {school?.phone && (
                      <div className="mt-1">
                        <a href={`tel:${school.phone}`} className="text-indigo-600 text-sm">
                          Appeler
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <details className="mt-4 text-sm text-gray-600">
                  <summary className="cursor-pointer">Détails & champs bruts</summary>
                  <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-x-auto">
                    {JSON.stringify(school ?? {}, null, 2)}
                  </pre>
                </details>
              </div>

              <div>
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="text-xs text-gray-500">Responsable</div>
                    <div className="text-lg font-medium text-gray-900">
                      {String(((school as unknown as Record<string, unknown>)?.['contactName']) ?? (user.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : '—'))}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Rôle: {String(((school as unknown as Record<string, unknown>)?.['contactRole']) ?? '—')}</div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-3">
                    <button
                      onClick={() => navigate('/admin/administration')}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Gérer l'école
                    </button>
                    <button
                      onClick={() => (school ? navigate(`/admin/schools/${school.id}/edit`) : null)}
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 text-gray-700"
                    >
                      Modifier les informations
                    </button>
                    <a
                      className="inline-block text-sm text-indigo-600 mt-2"
                      href={school?.email ? `mailto:${school.email}` : '#'}
                    >
                      Envoyer un message rapide
                    </a>
                  </div>
                </div>
              </div>
            </div>
            </>
          )}
        </div>

  {/* Actions Principales */}
  <div className="bg-white p-6 rounded-lg shadow w-full mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">⚙️ Actions Principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/admin/administration')}
              className="w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
            >
              👥 Gérer l'Administration
            </button>
            <button className="w-full text-left px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100">
              📚 Gérer les Classes
            </button>
            <button className="w-full text-left px-4 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100">
              📊 Bulletins & Notes
            </button>
            <button className="w-full text-left px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100">
              💰 Paramètres de l'École
            </button>
          </div>
        </div>

        {/* Widgets Rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 mt-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">📈 Nouvelles Inscritions</h3>
            <p className="text-sm text-gray-500 mb-4">Cliquez pour gérer les demandes d'inscription en attente.</p>
            <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Voir les demandes
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">💰 Gestion Financière</h3>
            <p className="text-sm text-gray-500 mb-4">Suivez vos revenus et gérez vos abonnements.</p>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Voir le Rapport Financier
            </button>
          </div>
          {/* Nouvelles cartes demandées */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">👥 Gestion du personnel</h3>
            <p className="text-sm text-gray-500 mb-4">Gérez les membres du personnel, leurs rôles et accès.</p>
            <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700">
              Gérer le personnel
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">📣 Communication</h3>
            <p className="text-sm text-gray-500 mb-4">Envoyez des annonces, notifications et messages aux utilisateurs.</p>
            <button className="w-full px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700">
              Ouvrir la messagerie
            </button>
          </div>
        </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FounderDashboard;
