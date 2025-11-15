import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import type { User, School } from '@/types';
import { salutation } from '../utils/salutation';
import Toast from './Toast';

type Summary = { schools?: number; revenue?: string } | null;

function parseExpiry(s: Record<string, unknown>) {
  const keys = ['subscriptionEndsAt', 'subscriptionEnd', 'expiresAt', 'subscriptionExpiresAt', 'endsAt', 'subscription_end', 'expires_at'];
  for (const k of keys) {
    if (k in s && s[k]) {
      const val = s[k];
      if (typeof val === 'string' || typeof val === 'number') return new Date(String(val));
    }
  }
  if ('subscription' in s && s.subscription && typeof s.subscription === 'object') {
    const sub = s.subscription as Record<string, unknown>;
    for (const k of ['endsAt', 'end', 'expiresAt', 'expires_at']) {
      if (k in sub && sub[k]) {
        const v = sub[k];
        if (typeof v === 'string' || typeof v === 'number') return new Date(String(v));
      }
    }
  }
  return null;
}

export default function FounderDashboard({ user }: { user?: User }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<Summary>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [persistentGreeting, setPersistentGreeting] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // show duration (ms) for the welcome popover per login
  const displayMs = 6000; // 6 seconds as requested

  const welcomeText = useMemo(() => {
    if (!user) return '';
    const s = salutation(user);
    // salutation may return 'Bonjour <Name>' or 'Bonsoir <Name>' or titles like 'M. <Name>'
    const alreadyGreeting = s.startsWith('Bonjour') || s.startsWith('Bonsoir');
    return alreadyGreeting ? s : `Bienvenue, ${s}`;
  }, [user]);

  // Charger l'école du fondateur (s'il a un schoolId)
  useEffect(() => {
    let mounted = true;
    async function run() {
      setLoading(true);
      try {
        if (user?.schoolId) {
          const res = await api.get(`/api/schools/${user.schoolId}`);
          if (mounted) setSchool((res.data as School) ?? null);
        } else {
          if (mounted) setSchool(null);
        }
      } catch {
          if (mounted) setSchool(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => { mounted = false; };
  }, [user?.schoolId]);

  // Afficher un message de bienvenue une seule fois par session au login
  useEffect(() => {
    // load persistent greeting for this session if any and prepare listeners
    try {
      const id = user?.id;
      if (id) {
        const g = sessionStorage.getItem(`greeting_${id}`);
        if (g) setPersistentGreeting(g);
      }
    } catch { void 0; }

  // show duration (ms) for the welcome popover per login
  const displayMs = 6000; // 6 seconds as requested

    const onLogin = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail as { user?: User } | undefined;
        const u = detail?.user ?? user;
        if (!u) return;
  const s = salutation(u);
  const alreadyGreeting = s.startsWith('Bonjour') || s.startsWith('Bonsoir');
  const text = alreadyGreeting ? s : `Bienvenue, ${s}`;

        try {
          const key = `welcome_shown_${u.id}`;
          const already = sessionStorage.getItem(key);
          if (!already) {
            // show transient mounted banner and handle fade-out
            setShowWelcome(true);
            sessionStorage.setItem(key, '1');
            // persist greeting in header for this session
            sessionStorage.setItem(`greeting_${u.id}`, text);
            setPersistentGreeting(text);

            // hide after displayMs (Toast handles the fade animation)
            const t = setTimeout(() => setShowWelcome(false), displayMs);
            return () => clearTimeout(t);
          }
        } catch { void 0; }
      } catch { void 0; }
    };

    const onTokenRefreshed = () => {
      try {
  const u = user ?? (JSON.parse(localStorage.getItem('auth_user') || 'null') as User | null);
  if (!u) return;
  const s = salutation(u);
  const alreadyGreeting = s.startsWith('Bonjour') || s.startsWith('Bonsoir');
  const text = alreadyGreeting ? s : `Bienvenue, ${s}`;
        setToastMessage(`Session renouvelée — ${text}`);
        setToastVisible(true);
  } catch { void 0; }
    };

    window.addEventListener('auth:login', onLogin as EventListener);
    window.addEventListener('auth:token_refreshed', onTokenRefreshed as EventListener);

    return () => {
      window.removeEventListener('auth:login', onLogin as EventListener);
      window.removeEventListener('auth:token_refreshed', onTokenRefreshed as EventListener);
    };
  }, [user]);

  // (Conserve ton petit résumé simulé)
  useEffect(() => {
    const t = setTimeout(() => {
      setSummary({ schools: 1, revenue: '12 400 €' });
    }, 350);
    return () => clearTimeout(t);
  }, []);

  // Dérivés : statut abonnement & expiration
  const subscriptionStatus = useMemo(() => {
    const s = school as unknown as Record<string, unknown> | null;
    if (!s) return { label: 'Non renseigné', variant: 'gray' as const };
    if (typeof s.subscriptionStatus === 'string') {
      const ss = s.subscriptionStatus as string;
      return { label: ss, variant: ss.toLowerCase() === 'active' ? 'green' as const : 'yellow' as const };
    }
    if (s.isActive === false) return { label: 'Inactif', variant: 'red' as const };
    return { label: 'Actif', variant: 'green' as const };
  }, [school]);

  const expiry = useMemo(() => {
    if (!school) return null;
    const r = parseExpiry(school as unknown as Record<string, unknown>);
    return r instanceof Date && !isNaN(r.getTime()) ? r : null;
  }, [school]);

  const daysLeft = useMemo(() => {
    if (!expiry) return null;
    return Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  }, [expiry]);

  const licenseText = useMemo(() => {
    if (!expiry || daysLeft === null) return 'Non renseignée';
    return daysLeft >= 0 ? `${daysLeft} jour(s) restants` : 'Expirée';
  }, [expiry, daysLeft]);

  const licenseShort = useMemo(() => {
    if (!expiry || daysLeft === null) return '—';
    return daysLeft >= 0 ? `${daysLeft} jour(s)` : 'Expirée';
  }, [expiry, daysLeft]);

  const schoolName = useMemo(() => {
    const s = school as unknown as { name?: string } | null;
    return s?.name ?? user?.schoolName ?? '—';
  }, [school, user?.schoolName]);

  // Rendu
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* welcome toast: independent element, top-right, fades slowly and displays for displayMs */}
      {user && (
        <Toast
          message={`${welcomeText} — Ravi de vous revoir`}
          type="success"
          visible={showWelcome}
          duration={displayMs}
          onClose={() => setShowWelcome(false)}
        />
      )}
      {/* persistent greeting (header) */}
      {persistentGreeting && (
        <div className="mb-3 text-sm text-gray-700">{persistentGreeting}</div>
      )}
      <Toast message={toastMessage} type="info" visible={toastVisible} onClose={() => setToastVisible(false)} />
      {/* ✅ Bandeau d'information École / Abonnement / Licence — réservé au Fondateur */}
      {user?.role === 'FONDATEUR' && (
        <div className="mb-6">
          <div className="p-5 bg-white rounded-lg shadow flex flex-col md:flex-row md:items-center md:gap-6">
            <div className="min-w-[200px]">
              <div className="text-xs text-gray-500">École</div>
              <div className="font-semibold text-gray-800">{schoolName}</div>
            </div>
            <div className="min-w-[200px]">
              <div className="text-xs text-gray-500">Statut abonnement</div>
              <div
                className={`font-semibold ${
                  subscriptionStatus.variant === 'green'
                    ? 'text-green-600'
                    : subscriptionStatus.variant === 'red'
                    ? 'text-red-600'
                    : subscriptionStatus.variant === 'yellow'
                    ? 'text-yellow-600'
                    : 'text-gray-600'
                }`}
              >
                {subscriptionStatus.label}
              </div>
            </div>
            <div className="min-w-[200px]">
              <div className="text-xs text-gray-500">Licence</div>
              <div className="font-medium text-gray-800">{licenseText}</div>
            </div>
            <div className="md:ml-auto">
              <button
                type="button"
                className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                onClick={() => navigate('/admin/administration')}
              >
                Gérer l’abonnement
              </button>
            </div>
          </div>

          {/* Version compacte mobile */}
          <div className="mt-3 md:hidden">
            <div className="p-4 bg-white rounded-md shadow">
              <div className="flex justify-between">
                <div>
                  <div className="text-xs text-gray-500">École</div>
                  <div className="font-medium text-gray-800">{schoolName}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Statut</div>
                  <div
                    className={`text-sm ${
                      subscriptionStatus.variant === 'green'
                        ? 'text-green-600'
                        : subscriptionStatus.variant === 'red'
                        ? 'text-red-600'
                        : subscriptionStatus.variant === 'yellow'
                        ? 'text-yellow-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {subscriptionStatus.label}
                  </div>
                  <div className="text-xs text-gray-500">Licence</div>
                  <div className="text-sm">{licenseShort}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Résumé rapide (conserve ce que tu avais) */}
      <div className="mb-4">
        {loading ? (
          <p className="text-sm text-gray-500">Chargement...</p>
        ) : (
          summary && (
            <p className="text-sm text-gray-600">
              Écoles : {summary.schools} — Revenu estimé : {summary.revenue}
            </p>
          )
        )}
      </div>

      {/* Actions Principales */}
      <div className="bg-white p-6 rounded-lg shadow">
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
      </div>
    </div>
  );
}
