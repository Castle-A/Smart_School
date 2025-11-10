import api from './api';
// NOUVELLE LOGIQUE : On utilise la variable d'environnement si elle existe,
// sinon le proxy local. En environnement de développement (Vite/Codespaces)
// il est souvent préférable d'utiliser le proxy dev ("/") pour éviter
// que le navigateur n'appelle directement l'URL publique du backend
// (qui peut être passée par un tunnel/proxy tiers et renvoyer 401 pour
// les requêtes preflight). Si une URL externe est configurée et qu'on
// est en production, on l'utilisera.
const rawApiUrl = import.meta.env.VITE_API_URL;
const isDev = import.meta.env.DEV === true;
// Si on est en dev et que VITE_API_URL pointe vers le host Codespaces du
// backend (par ex. ...-3000.app.github.dev), on préfère le proxy '/' pour
// éviter les problèmes de tunnel GitHub renvoyant 401 sur les preflight.
const shouldUseProxyInDev = isDev && rawApiUrl && rawApiUrl.includes('.app.github.dev') && rawApiUrl.includes(':3000');
const API_URL = rawApiUrl && rawApiUrl !== '' && !shouldUseProxyInDev ? rawApiUrl : '/';
console.log('[authService] rawApiUrl =', rawApiUrl, 'isDev =', isDev);
console.log('[authService] using API_URL =', API_URL);
export const authService = {
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        }
        catch (err) {
            console.error('Login error:', err);
            throw err;
        }
    },
    changePassword: async (newPassword) => {
        try {
            const response = await api.patch('/auth/change-password', { newPassword });
            return response.data;
        }
        catch (err) {
            console.error('Change password error:', err);
            throw err;
        }
    },
    refresh: async (refreshToken) => {
        try {
            const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
            return response.data;
        }
        catch (err) {
            console.error('Refresh error:', err);
            throw err;
        }
    },
    registerSchool: async (payload) => {
        try {
            const response = await api.post('/auth/register-school', payload);
            return response.data;
        }
        catch (err) {
            console.error('Register error:', err);
            throw err;
        }
    },
    updateAvatar: async (avatarUrl) => {
        try {
            const response = await api.patch('/auth/update-avatar', { avatarUrl });
            return response.data;
        }
        catch (err) {
            console.error('Update avatar error:', err);
            throw err;
        }
    },
};
