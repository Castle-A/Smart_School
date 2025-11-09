import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/authService';

// --- Types utilisateur (mis à jour) ---
export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  role: string;
  schoolId: string;
  schoolName: string;
  avatarUrl?: string; // <-- AJOUTÉ : Le champ pour l'URL de l'avatar
} | null;

export type AuthContextType = {
  user: AuthUser;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  // Expose a setter so les pages (ex: ProfilePage) puissent mettre à jour
  // l'utilisateur après un changement de profil (avatar, nom, ...)
  setUser: (u: AuthUser) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'access_token';
const USER_KEY = 'auth_user';

// Helpers sûrs
function safeParse<T>(json: string | null): T | null {
  if (!json) return null;
  try { return JSON.parse(json) as T; } catch { return null; }
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split('.')[1];
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    const decoded = JSON.parse(json) as Record<string, unknown>;
    console.log('TOKEN DÉCODÉ PAR LE FRONTEND:', decoded);
    return decoded;
  } catch {
    return null;
  }
}

function strOr(payload: Record<string, unknown> | null, key: string, fallback = ''): string {
  const v = payload?.[key];
  return typeof v === 'string' ? v : fallback;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaure la session au chargement
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsAuthenticated(true);

    const cachedUser = safeParse<AuthUser>(localStorage.getItem(USER_KEY));
    if (cachedUser) {
      setUser(cachedUser);
      setIsLoading(false);
      return;
    }

    (async () => {
      try {
        const payload = decodeJwtPayload(token);
        if (payload) {
          const u: AuthUser = {
            id: strOr(payload, 'sub', 'me'),
            email: strOr(payload, 'email', ''),
            firstName: strOr(payload, 'firstName', 'Utilisateur'),
            role: strOr(payload, 'role', 'USER'),
            schoolId: strOr(payload, 'schoolId', ''),
            schoolName: strOr(payload, 'schoolName', 'École non définie'),
            avatarUrl: typeof payload['avatarUrl'] === 'string' ? (payload['avatarUrl'] as string) : undefined,
          };
          setUser(u);
          localStorage.setItem(USER_KEY, JSON.stringify(u));
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await authService.login({ email, password });
      const access_token: string = result.access_token;

      if (!access_token) {
        throw new Error('Token non reçu du serveur.');
      }

      localStorage.setItem(TOKEN_KEY, access_token);
      setIsAuthenticated(true);

      const payload = decodeJwtPayload(access_token);

      if (!payload) {
        throw new Error('Le token reçu est invalide.');
      }

      const u: AuthUser = {
        id: strOr(payload, 'sub', 'me'),
        email: strOr(payload, 'email', email),
        firstName: strOr(payload, 'firstName', 'Utilisateur'),
        role: strOr(payload, 'role', 'USER'),
        schoolId: strOr(payload, 'schoolId', ''),
        schoolName: strOr(payload, 'schoolName', 'École non définie'),
        avatarUrl: typeof payload['avatarUrl'] === 'string' ? (payload['avatarUrl'] as string) : undefined,
      };

      setUser(u);
      localStorage.setItem(USER_KEY, JSON.stringify(u));

    } catch (error) {
      logout();
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;