// frontend/src/context/AuthContext.tsx
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { authService } from '../services/authService';
import { TOKEN_KEY, USER_KEY, MUST_CHANGE_KEY, JUST_LOGGED_IN_SESSION, safeParse, decodeJwtPayload, strOr, strOrMulti } from './authHelpers';
import type { Gender, AuthUser, AuthContextType } from '../types/auth';

// --- Types utilisateur ---
// auth-related types moved to ../types/auth.ts to keep this file focused on React context exports

import AuthContext from './authContextObj';

// helpers moved to ./authHelpers.ts to keep this file's exports focused on React context

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser>(null);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [justLoggedIn, setJustLoggedIn] = useState<boolean>(() => {
    try { return sessionStorage.getItem(JUST_LOGGED_IN_SESSION) === '1'; } catch { return false; }
  });

  // Restaure la session au chargement
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setIsLoading(false);
        return;
      }
      setIsAuthenticated(true);

      const cachedUser = safeParse<AuthUser>(localStorage.getItem(USER_KEY));
      if (cachedUser) {
        setUser(cachedUser);
        // récupérer/compléter le profil si des champs critiques manquent
        try {
          const missingLast = !cachedUser?.lastName?.trim();
          const missingPhone = !cachedUser?.phoneNumber?.trim();
            if (missingLast || missingPhone) {
            const resp = await api.get('/auth/profile');
            const full = resp.data as unknown as Record<string, unknown> | null;
            const merged = {
              ...cachedUser,
              lastName: strOrMulti(full, ['lastName', 'last_name'], cachedUser.lastName ?? ''),
              phoneNumber: strOrMulti(full, ['phoneNumber', 'phone_number', 'phone'], cachedUser.phoneNumber ?? ''),
              schoolName: (typeof full?.['school'] === 'object' && full?.['school'] !== null && typeof (full!['school'] as Record<string, unknown>)['name'] === 'string')
                ? String((full!['school'] as Record<string, unknown>)['name'])
                : strOrMulti(full, ['schoolName', 'school_name'], cachedUser.schoolName),
              avatarUrl: typeof full?.['avatarUrl'] === 'string' ? String(full['avatarUrl']) : cachedUser.avatarUrl,
            } as unknown as AuthUser;
            setUser(merged);
            localStorage.setItem(USER_KEY, JSON.stringify(merged));
          }
        } catch {/* ignore */}
        // restore mustChange flag
        setMustChangePassword(localStorage.getItem(MUST_CHANGE_KEY) === 'true');
        setIsLoading(false);
        return;
      }

      try {
        const payload = decodeJwtPayload(token);
        if (payload) {
          const u: AuthUser = {
            id: strOr(payload, 'sub', 'me'),
            email: strOr(payload, 'email', ''),
            firstName: strOrMulti(payload, ['firstName', 'first_name'], 'Utilisateur'),
            lastName: strOrMulti(payload, ['lastName', 'last_name'], ''),
            phoneNumber: strOrMulti(payload, ['phoneNumber', 'phone_number', 'phone'], ''),
            role: strOr(payload, 'role', 'USER'),
            schoolId: strOr(payload, 'schoolId', ''),
            schoolName: strOrMulti(payload, ['schoolName', 'school_name'], 'École non définie'),
            avatarUrl: typeof payload['avatarUrl'] === 'string' ? (payload['avatarUrl'] as string) : undefined,
            gender: typeof payload['gender'] === 'string' ? (payload['gender'] as Gender) : undefined,
          };
          setUser(u);
          localStorage.setItem(USER_KEY, JSON.stringify(u));
          setMustChangePassword(localStorage.getItem(MUST_CHANGE_KEY) === 'true');
        } else {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setIsAuthenticated(false);
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Enrichir si champs manquants une fois authentifié
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    const missingLast = !user?.lastName?.trim();
    const missingPhone = !user?.phoneNumber?.trim();
    if (!missingLast && !missingPhone) return;

    let mounted = true;
    (async () => {
      try {
        const resp = await api.get('/auth/profile');
        if (!mounted) return;
        const full = resp.data as unknown as Record<string, unknown> | null;
        const merged = {
          ...user,
          lastName: strOrMulti(full, ['lastName', 'last_name'], user?.lastName ?? ''),
          phoneNumber: strOrMulti(full, ['phoneNumber', 'phone_number', 'phone'], user?.phoneNumber ?? ''),
          schoolName: (typeof full?.['school'] === 'object' && full?.['school'] !== null && typeof (full!['school'] as Record<string, unknown>)['name'] === 'string')
            ? String((full!['school'] as Record<string, unknown>)['name'])
            : strOrMulti(full, ['schoolName', 'school_name'], user?.schoolName),
          avatarUrl: typeof full?.['avatarUrl'] === 'string' ? String(full['avatarUrl']) : user?.avatarUrl,
        } as unknown as AuthUser;
        setUser(merged);
        localStorage.setItem(USER_KEY, JSON.stringify(merged));
      } catch {/* ignore */}
    })();
    return () => { mounted = false; };
  }, [isAuthenticated, user]);

  const login = async (email: string, password: string) => {
    try {
  const result = await authService.login({ email, password });
  const res = result as unknown as Record<string, unknown> | null;
  const access_token: string = typeof res?.['access_token'] === 'string' ? String(res['access_token']) : '';
  const mustFlag = !!res?.['mustChangePassword'];

      if (!access_token) throw new Error('Token non reçu du serveur.');

      localStorage.setItem(TOKEN_KEY, access_token);
      localStorage.setItem(MUST_CHANGE_KEY, mustFlag ? 'true' : 'false');
      setIsAuthenticated(true);

      const payload = decodeJwtPayload(access_token);
      if (!payload) throw new Error('Le token reçu est invalide.');

      const u: AuthUser = {
        id: strOr(payload, 'sub', 'me'),
        email: strOr(payload, 'email', email),
        firstName: strOrMulti(payload, ['firstName', 'first_name'], 'Utilisateur'),
        lastName: strOrMulti(payload, ['lastName', 'last_name'], ''),
        phoneNumber: strOrMulti(payload, ['phoneNumber', 'phone_number', 'phone'], ''),
        role: strOr(payload, 'role', 'USER'),
        schoolId: strOr(payload, 'schoolId', ''),
        schoolName: strOrMulti(payload, ['schoolName', 'school_name'], 'École non définie'),
        avatarUrl: typeof payload['avatarUrl'] === 'string' ? (payload['avatarUrl'] as string) : undefined,
        gender: typeof payload['gender'] === 'string' ? (payload['gender'] as Gender) : undefined,
      };

      setUser(u);
      localStorage.setItem(USER_KEY, JSON.stringify(u));
      setMustChangePassword(mustFlag);

      // Flag pour le toast (et sessionStorage pour survivre à la redirection)
      setJustLoggedIn(true);
  try { sessionStorage.setItem(JUST_LOGGED_IN_SESSION, '1'); } catch { void 0; }

      // Event informatif si tu veux écouter ailleurs
  try { window.dispatchEvent(new CustomEvent('auth:login', { detail: { user: u } })); } catch { void 0; }

      return { mustChangePassword: mustFlag };
    } catch (e) {
      // cleanup en cas d'échec
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(MUST_CHANGE_KEY);
      setIsAuthenticated(false);
      setUser(null);
      throw e;
    }
  };

  const setSessionFromToken = (token: string) => {
    if (!token) return;
    try {
      localStorage.setItem(TOKEN_KEY, token);
      const payload = decodeJwtPayload(token);
      if (!payload) throw new Error('Token invalide');
      const u: AuthUser = {
        id: strOr(payload, 'sub', 'me'),
        email: strOr(payload, 'email', ''),
        firstName: strOrMulti(payload, ['firstName', 'first_name'], 'Utilisateur'),
        lastName: strOrMulti(payload, ['lastName', 'last_name'], ''),
        phoneNumber: strOrMulti(payload, ['phoneNumber', 'phone_number', 'phone'], ''),
        role: strOr(payload, 'role', 'USER'),
        schoolId: strOr(payload, 'schoolId', ''),
        schoolName: strOrMulti(payload, ['schoolName', 'school_name'], 'École non définie'),
        avatarUrl: typeof payload['avatarUrl'] === 'string' ? (payload['avatarUrl'] as string) : undefined,
        gender: typeof payload['gender'] === 'string' ? (payload['gender'] as Gender) : undefined,
      };
      setUser(u);
      localStorage.setItem(USER_KEY, JSON.stringify(u));
      const mustFromToken = payload['mustChangePassword'] ?? payload['must_change_password'] ?? payload['mustChange'];
      const mustFlag = typeof mustFromToken === 'boolean' ? mustFromToken : false;
      setMustChangePassword(!!mustFlag);
      localStorage.setItem(MUST_CHANGE_KEY, mustFlag ? 'true' : 'false');
      setIsAuthenticated(true);

      // on considère cela comme une reconnexion : pas de toast par défaut
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const navigate = useNavigate();

  const [idleModalOpen, setIdleModalOpen] = useState(false);
  const [idleCountdown, setIdleCountdown] = useState<number>(0);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const logout = () => {
  try { localStorage.removeItem(TOKEN_KEY); } catch { void 0; }
  try { localStorage.removeItem(USER_KEY); } catch { void 0; }
  try { localStorage.removeItem(MUST_CHANGE_KEY); } catch { void 0; }
  try { sessionStorage.removeItem(JUST_LOGGED_IN_SESSION); } catch { void 0; }
    setIsAuthenticated(false);
    setUser(null);
    setJustLoggedIn(false);
    // After logout, navigate to the public homepage
    try { navigate('/', { replace: true }); } catch { try { window.location.href = '/'; } catch { void 0; } }
  };

  // Déconnexion automatique après 10 minutes d'inactivité (600000 ms)
  // Affiche un modal d'avertissement 60s avant la déconnexion pour permettre à l'utilisateur
  // de rester connecté.
  useEffect(() => {
    if (!isAuthenticated) return;

    const INACTIVITY_MS = 10 * 60 * 1000; // 10 minutes
    const WARN_MS = 60 * 1000; // 1 minute before

    const clearAll = () => {
      if (inactivityTimerRef.current) { clearTimeout(inactivityTimerRef.current); inactivityTimerRef.current = null; }
      if (warnTimerRef.current) { clearTimeout(warnTimerRef.current); warnTimerRef.current = null; }
      if (countdownIntervalRef.current) { clearInterval(countdownIntervalRef.current); countdownIntervalRef.current = null; }
    };

    const startTimers = () => {
      clearAll();
      const warnDelay = Math.max(0, INACTIVITY_MS - WARN_MS);

      warnTimerRef.current = setTimeout(() => {
        // open modal and start countdown
        setIdleModalOpen(true);
        let remaining = Math.ceil(WARN_MS / 1000);
        setIdleCountdown(remaining);
        countdownIntervalRef.current = setInterval(() => {
          remaining -= 1;
          setIdleCountdown(remaining);
          if (remaining <= 0 && countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
        }, 1000) as unknown as ReturnType<typeof setInterval>;
      }, warnDelay) as unknown as ReturnType<typeof setTimeout>;

      inactivityTimerRef.current = setTimeout(() => {
        // force logout when inactivity reached
        try { logout(); } catch { /* ignore */ }
      }, INACTIVITY_MS) as unknown as ReturnType<typeof setTimeout>;
    };

    const resetHandler = () => {
      // hide modal and reset timers
      setIdleModalOpen(false);
      setIdleCountdown(0);
      startTimers();
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    events.forEach((ev) => window.addEventListener(ev, resetHandler, true));
    // also listen for programmatic reset from modal confirm
    window.addEventListener('auth:idle-reset', resetHandler as EventListener);

    // start on mount
    startTimers();

    return () => {
      clearAll();
      events.forEach((ev) => window.removeEventListener(ev, resetHandler, true));
      window.removeEventListener('auth:idle-reset', resetHandler as EventListener);
      setIdleModalOpen(false);
      setIdleCountdown(0);
    };
  }, [isAuthenticated, logout]);

  const value = useMemo<AuthContextType>(() => ({
    user,
    isAuthenticated,
    isLoading,
    login,
    setSessionFromToken,
    logout,
    mustChangePassword,
    setMustChangePassword,
    setUser,
    justLoggedIn,
    setJustLoggedIn,
  }), [user, isAuthenticated, isLoading, mustChangePassword, justLoggedIn]);

  return (
    <AuthContext.Provider value={value}>
      {children}
      <ConfirmModal
        open={idleModalOpen}
        title="Inactivité détectée"
        message={
          <div>
            <p>Vous allez être déconnecté dans <strong>{idleCountdown}s</strong> pour cause d'inactivité.</p>
            <p>Souhaitez-vous rester connecté ?</p>
          </div>
        }
        confirmLabel="Rester connecté"
        cancelLabel="Se déconnecter"
        variant="primary"
        onCancel={() => { /* logout on cancel */ logout(); setIdleModalOpen(false); }}
        onConfirm={() => { /* keep alive */ setIdleModalOpen(false); setIdleCountdown(0); try { window.dispatchEvent(new CustomEvent('auth:idle-reset')); } catch {} }}
      />
    </AuthContext.Provider>
  );
};

// `useAuth` is exported from `context/useAuth.ts` to keep this module export-clean for Fast Refresh.
