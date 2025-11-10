import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
const AuthContext = createContext(undefined);
const TOKEN_KEY = 'access_token';
const USER_KEY = 'auth_user';
const MUST_CHANGE_KEY = 'must_change_password';
// Helpers sûrs
function safeParse(json) {
    if (!json)
        return null;
    try {
        return JSON.parse(json);
    }
    catch {
        return null;
    }
}
function decodeJwtPayload(token) {
    try {
        const base64 = token.split('.')[1];
        const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
        const decoded = JSON.parse(json);
        console.log('TOKEN DÉCODÉ PAR LE FRONTEND:', decoded);
        return decoded;
    }
    catch {
        return null;
    }
}
function strOr(payload, key, fallback = '') {
    const v = payload?.[key];
    return typeof v === 'string' ? v : fallback;
}
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [mustChangePassword, setMustChangePassword] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    // Restaure la session au chargement
    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
            setIsLoading(false);
            return;
        }
        setIsAuthenticated(true);
        const cachedUser = safeParse(localStorage.getItem(USER_KEY));
        if (cachedUser) {
            setUser(cachedUser);
            setIsLoading(false);
            return;
        }
        (async () => {
            try {
                const payload = decodeJwtPayload(token);
                if (payload) {
                    const u = {
                        id: strOr(payload, 'sub', 'me'),
                        email: strOr(payload, 'email', ''),
                        firstName: strOr(payload, 'firstName', 'Utilisateur'),
                        role: strOr(payload, 'role', 'USER'),
                        schoolId: strOr(payload, 'schoolId', ''),
                        schoolName: strOr(payload, 'schoolName', 'École non définie'),
                        avatarUrl: typeof payload['avatarUrl'] === 'string' ? payload['avatarUrl'] : undefined,
                        gender: typeof payload['gender'] === 'string' ? payload['gender'] : undefined,
                    };
                    setUser(u);
                    localStorage.setItem(USER_KEY, JSON.stringify(u));
                    // restore mustChange flag from localStorage if present
                    const m = localStorage.getItem(MUST_CHANGE_KEY);
                    setMustChangePassword(m === 'true');
                }
            }
            catch {
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(USER_KEY);
                setIsAuthenticated(false);
                setUser(null);
            }
            finally {
                setIsLoading(false);
            }
        })();
    }, []);
    const login = async (email, password) => {
        try {
            const result = await authService.login({ email, password });
            const access_token = result.access_token;
            const mustFlag = result?.mustChangePassword ?? false;
            if (!access_token) {
                throw new Error('Token non reçu du serveur.');
            }
            localStorage.setItem(TOKEN_KEY, access_token);
            localStorage.setItem(MUST_CHANGE_KEY, mustFlag ? 'true' : 'false');
            setIsAuthenticated(true);
            const payload = decodeJwtPayload(access_token);
            if (!payload) {
                throw new Error('Le token reçu est invalide.');
            }
            const u = {
                id: strOr(payload, 'sub', 'me'),
                email: strOr(payload, 'email', email),
                firstName: strOr(payload, 'firstName', 'Utilisateur'),
                role: strOr(payload, 'role', 'USER'),
                schoolId: strOr(payload, 'schoolId', ''),
                schoolName: strOr(payload, 'schoolName', 'École non définie'),
                avatarUrl: typeof payload['avatarUrl'] === 'string' ? payload['avatarUrl'] : undefined,
                gender: typeof payload['gender'] === 'string' ? payload['gender'] : undefined,
            };
            setUser(u);
            localStorage.setItem(USER_KEY, JSON.stringify(u));
            setMustChangePassword(!!mustFlag);
            return { mustChangePassword: !!mustFlag };
        }
        catch (error) {
            logout();
            throw error;
        }
    };
    const setSessionFromToken = (token) => {
        if (!token)
            return;
        try {
            localStorage.setItem(TOKEN_KEY, token);
            // decode token and build user object like in login
            const payload = decodeJwtPayload(token);
            if (!payload)
                throw new Error('Token invalide');
            const u = {
                id: strOr(payload, 'sub', 'me'),
                email: strOr(payload, 'email', ''),
                firstName: strOr(payload, 'firstName', 'Utilisateur'),
                role: strOr(payload, 'role', 'USER'),
                schoolId: strOr(payload, 'schoolId', ''),
                schoolName: strOr(payload, 'schoolName', 'École non définie'),
                avatarUrl: typeof payload['avatarUrl'] === 'string' ? payload['avatarUrl'] : undefined,
                gender: typeof payload['gender'] === 'string' ? payload['gender'] : undefined,
            };
            // set user and flags based on token payload (more robust than reading localStorage)
            setUser(u);
            localStorage.setItem(USER_KEY, JSON.stringify(u));
            // if backend encoded a mustChangePassword flag in the token, use it
            const mustFromToken = payload['mustChangePassword'] ?? payload['must_change_password'] ?? payload['mustChange'];
            const mustFlag = typeof mustFromToken === 'boolean' ? mustFromToken : false;
            setMustChangePassword(!!mustFlag);
            localStorage.setItem(MUST_CHANGE_KEY, mustFlag ? 'true' : 'false');
            setIsAuthenticated(true);
        }
        catch (e) {
            console.error('Failed to set session from token', e);
            // cleanup
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            setIsAuthenticated(false);
            setUser(null);
        }
    };
    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(MUST_CHANGE_KEY);
        setIsAuthenticated(false);
        setUser(null);
    };
    return (_jsx(AuthContext.Provider, { value: { user, isAuthenticated, isLoading, login, setSessionFromToken, logout, setUser, mustChangePassword, setMustChangePassword }, children: children }));
};
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
export default AuthContext;
