import { jsx as _jsx } from "react/jsx-runtime";
// frontend/src/context/AuthContext.tsx
import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { authService } from '../services/authService';
import { TOKEN_KEY, USER_KEY, MUST_CHANGE_KEY, JUST_LOGGED_IN_SESSION, safeParse, decodeJwtPayload, strOr, strOrMulti } from './authHelpers';
// --- Types utilisateur ---
// auth-related types moved to ../types/auth.ts to keep this file focused on React context exports
import AuthContext from './authContextObj';
// helpers moved to ./authHelpers.ts to keep this file's exports focused on React context
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [mustChangePassword, setMustChangePassword] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [justLoggedIn, setJustLoggedIn] = useState(() => {
        try {
            return sessionStorage.getItem(JUST_LOGGED_IN_SESSION) === '1';
        }
        catch {
            return false;
        }
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
            const cachedUser = safeParse(localStorage.getItem(USER_KEY));
            if (cachedUser) {
                setUser(cachedUser);
                // récupérer/compléter le profil si des champs critiques manquent
                try {
                    const missingLast = !cachedUser?.lastName?.trim();
                    const missingPhone = !cachedUser?.phoneNumber?.trim();
                    if (missingLast || missingPhone) {
                        const resp = await api.get('/auth/profile');
                        const full = resp.data;
                        const merged = {
                            ...cachedUser,
                            lastName: strOrMulti(full, ['lastName', 'last_name'], cachedUser.lastName ?? ''),
                            phoneNumber: strOrMulti(full, ['phoneNumber', 'phone_number', 'phone'], cachedUser.phoneNumber ?? ''),
                            schoolName: (typeof full?.['school'] === 'object' && full?.['school'] !== null && typeof full['school']['name'] === 'string')
                                ? String(full['school']['name'])
                                : strOrMulti(full, ['schoolName', 'school_name'], cachedUser.schoolName),
                            avatarUrl: typeof full?.['avatarUrl'] === 'string' ? String(full['avatarUrl']) : cachedUser.avatarUrl,
                        };
                        setUser(merged);
                        localStorage.setItem(USER_KEY, JSON.stringify(merged));
                    }
                }
                catch { /* ignore */ }
                // restore mustChange flag
                setMustChangePassword(localStorage.getItem(MUST_CHANGE_KEY) === 'true');
                setIsLoading(false);
                return;
            }
            try {
                const payload = decodeJwtPayload(token);
                if (payload) {
                    const u = {
                        id: strOr(payload, 'sub', 'me'),
                        email: strOr(payload, 'email', ''),
                        firstName: strOrMulti(payload, ['firstName', 'first_name'], 'Utilisateur'),
                        lastName: strOrMulti(payload, ['lastName', 'last_name'], ''),
                        phoneNumber: strOrMulti(payload, ['phoneNumber', 'phone_number', 'phone'], ''),
                        role: strOr(payload, 'role', 'USER'),
                        schoolId: strOr(payload, 'schoolId', ''),
                        schoolName: strOrMulti(payload, ['schoolName', 'school_name'], 'École non définie'),
                        avatarUrl: typeof payload['avatarUrl'] === 'string' ? payload['avatarUrl'] : undefined,
                        gender: typeof payload['gender'] === 'string' ? payload['gender'] : undefined,
                    };
                    setUser(u);
                    localStorage.setItem(USER_KEY, JSON.stringify(u));
                    setMustChangePassword(localStorage.getItem(MUST_CHANGE_KEY) === 'true');
                }
                else {
                    localStorage.removeItem(TOKEN_KEY);
                    localStorage.removeItem(USER_KEY);
                    setIsAuthenticated(false);
                    setUser(null);
                }
            }
            finally {
                setIsLoading(false);
            }
        })();
    }, []);
    // Enrichir si champs manquants une fois authentifié
    useEffect(() => {
        if (!isAuthenticated || !user)
            return;
        const missingLast = !user?.lastName?.trim();
        const missingPhone = !user?.phoneNumber?.trim();
        if (!missingLast && !missingPhone)
            return;
        let mounted = true;
        (async () => {
            try {
                const resp = await api.get('/auth/profile');
                if (!mounted)
                    return;
                const full = resp.data;
                const merged = {
                    ...user,
                    lastName: strOrMulti(full, ['lastName', 'last_name'], user?.lastName ?? ''),
                    phoneNumber: strOrMulti(full, ['phoneNumber', 'phone_number', 'phone'], user?.phoneNumber ?? ''),
                    schoolName: (typeof full?.['school'] === 'object' && full?.['school'] !== null && typeof full['school']['name'] === 'string')
                        ? String(full['school']['name'])
                        : strOrMulti(full, ['schoolName', 'school_name'], user?.schoolName),
                    avatarUrl: typeof full?.['avatarUrl'] === 'string' ? String(full['avatarUrl']) : user?.avatarUrl,
                };
                setUser(merged);
                localStorage.setItem(USER_KEY, JSON.stringify(merged));
            }
            catch { /* ignore */ }
        })();
        return () => { mounted = false; };
    }, [isAuthenticated, user]);
    const login = async (email, password) => {
        try {
            const result = await authService.login({ email, password });
            const res = result;
            const access_token = typeof res?.['access_token'] === 'string' ? String(res['access_token']) : '';
            const mustFlag = !!res?.['mustChangePassword'];
            if (!access_token)
                throw new Error('Token non reçu du serveur.');
            localStorage.setItem(TOKEN_KEY, access_token);
            localStorage.setItem(MUST_CHANGE_KEY, mustFlag ? 'true' : 'false');
            setIsAuthenticated(true);
            const payload = decodeJwtPayload(access_token);
            if (!payload)
                throw new Error('Le token reçu est invalide.');
            const u = {
                id: strOr(payload, 'sub', 'me'),
                email: strOr(payload, 'email', email),
                firstName: strOrMulti(payload, ['firstName', 'first_name'], 'Utilisateur'),
                lastName: strOrMulti(payload, ['lastName', 'last_name'], ''),
                phoneNumber: strOrMulti(payload, ['phoneNumber', 'phone_number', 'phone'], ''),
                role: strOr(payload, 'role', 'USER'),
                schoolId: strOr(payload, 'schoolId', ''),
                schoolName: strOrMulti(payload, ['schoolName', 'school_name'], 'École non définie'),
                avatarUrl: typeof payload['avatarUrl'] === 'string' ? payload['avatarUrl'] : undefined,
                gender: typeof payload['gender'] === 'string' ? payload['gender'] : undefined,
            };
            setUser(u);
            localStorage.setItem(USER_KEY, JSON.stringify(u));
            setMustChangePassword(mustFlag);
            // Flag pour le toast (et sessionStorage pour survivre à la redirection)
            setJustLoggedIn(true);
            try {
                sessionStorage.setItem(JUST_LOGGED_IN_SESSION, '1');
            }
            catch {
                void 0;
            }
            // Event informatif si tu veux écouter ailleurs
            try {
                window.dispatchEvent(new CustomEvent('auth:login', { detail: { user: u } }));
            }
            catch {
                void 0;
            }
            return { mustChangePassword: mustFlag };
        }
        catch (e) {
            // cleanup en cas d'échec
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem(MUST_CHANGE_KEY);
            setIsAuthenticated(false);
            setUser(null);
            throw e;
        }
    };
    const setSessionFromToken = (token) => {
        if (!token)
            return;
        try {
            localStorage.setItem(TOKEN_KEY, token);
            const payload = decodeJwtPayload(token);
            if (!payload)
                throw new Error('Token invalide');
            const u = {
                id: strOr(payload, 'sub', 'me'),
                email: strOr(payload, 'email', ''),
                firstName: strOrMulti(payload, ['firstName', 'first_name'], 'Utilisateur'),
                lastName: strOrMulti(payload, ['lastName', 'last_name'], ''),
                phoneNumber: strOrMulti(payload, ['phoneNumber', 'phone_number', 'phone'], ''),
                role: strOr(payload, 'role', 'USER'),
                schoolId: strOr(payload, 'schoolId', ''),
                schoolName: strOrMulti(payload, ['schoolName', 'school_name'], 'École non définie'),
                avatarUrl: typeof payload['avatarUrl'] === 'string' ? payload['avatarUrl'] : undefined,
                gender: typeof payload['gender'] === 'string' ? payload['gender'] : undefined,
            };
            setUser(u);
            localStorage.setItem(USER_KEY, JSON.stringify(u));
            const mustFromToken = payload['mustChangePassword'] ?? payload['must_change_password'] ?? payload['mustChange'];
            const mustFlag = typeof mustFromToken === 'boolean' ? mustFromToken : false;
            setMustChangePassword(!!mustFlag);
            localStorage.setItem(MUST_CHANGE_KEY, mustFlag ? 'true' : 'false');
            setIsAuthenticated(true);
            // on considère cela comme une reconnexion : pas de toast par défaut
        }
        catch {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            setIsAuthenticated(false);
            setUser(null);
        }
    };
    const logout = () => {
        try {
            localStorage.removeItem(TOKEN_KEY);
        }
        catch {
            void 0;
        }
        try {
            localStorage.removeItem(USER_KEY);
        }
        catch {
            void 0;
        }
        try {
            localStorage.removeItem(MUST_CHANGE_KEY);
        }
        catch {
            void 0;
        }
        try {
            sessionStorage.removeItem(JUST_LOGGED_IN_SESSION);
        }
        catch {
            void 0;
        }
        setIsAuthenticated(false);
        setUser(null);
        setJustLoggedIn(false);
    };
    const value = useMemo(() => ({
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
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
