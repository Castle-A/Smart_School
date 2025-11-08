import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/authService';

// --- Types utilisateur (adapte a mon backend) ---
type AuthUser = {
  id: string;
  email: string;
  firstName?: string;
  role?: string;
} | null;

// MODIFICATION : Ajout de `isLoading` au type
type AuthContextType = {
  user: AuthUser;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'access_token';
const USER_KEY  = 'auth_user';

// Helpers sûrs
function safeParse<T>(json: string | null): T | null {
  if (!json) return null;
  try { return JSON.parse(json) as T; } catch { return null; }
}

function decodeJwtPayload(token: string): any | null {
  try {
    const base64 = token.split('.')[1];
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser>(null);
  // MODIFICATION : On initialise l'état de chargement à `true`
  const [isLoading, setIsLoading] = useState(true);

  // Restaure la session au chargement
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      // MODIFICATION : S'il n'y a pas de token, on a fini de vérifier
      setIsLoading(false);
      return;
    }

    setIsAuthenticated(true);

    const cachedUser = safeParse<AuthUser>(localStorage.getItem(USER_KEY));
    if (cachedUser) {
      setUser(cachedUser);
      // MODIFICATION : On a fini de charger grâce au cache
      setIsLoading(false);
      return;
    }

    (async () => {
      try {
        // auth/me côté backend
        if ((authService as any).getProfile) {
          const { user } = await (authService as any).getProfile();
          setUser(user);
          localStorage.setItem(USER_KEY, JSON.stringify(user));
        } else {
          // Fallback: décoder le JWT
          const payload = decodeJwtPayload(token); // token est string ici
          if (payload) {
            const u = {
              id: payload.sub ?? 'me',
              email: payload.email ?? '',
              firstName: payload.firstName ?? 'Utilisateur',
              role: payload.role ?? 'USER',
            };
            setUser(u);
            localStorage.setItem(USER_KEY, JSON.stringify(u));
          }
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        // MODIFICATION : Dans tous les cas (succès ou erreur), le chargement est terminé
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    // Utilise email/password pour obtenir un token
    const result: any = await authService.login({ email, password });
    const access_token: string = result.access_token;

    // Stocker token
    localStorage.setItem(TOKEN_KEY, access_token);
    setIsAuthenticated(true);

    // Récupérer l’utilisateur
    let u: AuthUser = null;

    if (result.user) {
      u = result.user as AuthUser;
    } else if ((authService as any).getProfile) {
      const { user } = await (authService as any).getProfile();
      u = user as AuthUser;
    } else {
      const payload = decodeJwtPayload(access_token);
      u = {
        id: payload?.sub ?? 'me',
        email: payload?.email ?? email,   // fallback sur l’email saisi
        firstName: payload?.firstName ?? 'Utilisateur',
        role: payload?.role ?? 'USER',
      };
    }

    setUser(u);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    // MODIFICATION : On expose `isLoading` dans la valeur du contexte
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
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