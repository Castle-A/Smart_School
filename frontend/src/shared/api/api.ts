import axios from 'axios';

// Configuration de l'API
// Utilise des URLs relatives pour profiter du proxy Vite
// Cela fonctionne en localhost ET via ngrok avec une seule URL
const API_BASE_URL = '/api';

console.log(`🌐 API: Using Vite proxy (relative URLs)`);

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // Master Security: Support des cookies HttpOnly (credentials automatiques)
    withCredentials: true,
});

// IMPORTANT: L'intercepteur pour le token JWT a été supprimé
// Le token est maintenant envoyé automatiquement via les cookies HttpOnly
// Plus besoin de lire localStorage ou d'ajouter le header Authorization

import { toastEvents } from '../utils/toast-events';

export default api;

// Intercepteur pour gérer les erreurs globalement
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Allow skipping global error handling for batch operations
        // @ts-ignore
        if (error.config?.skipGlobalErrorHandler) {
            return Promise.reject(error);
        }

        // Silently ignore 404 errors for config endpoints (not implemented yet)
        const url = error.config?.url || '';
        if (error.response?.status === 404 && url.includes('/schools/config')) {
            return Promise.reject(error);
        }

        const message = error.response?.data?.message || 'Une erreur inattendue est survenue';
        const displayMessage = Array.isArray(message) ? message.join(', ') : message;

        if (error.response?.status === 401) {
            // Optionnel : ne pas spammer si on est déjà redirigé
            toastEvents.emit('warning', 'Session expirée.');
        } else if (error.response?.status >= 500) {
            toastEvents.emit('error', 'Erreur serveur. Veuillez réessayer plus tard.');
        } else if (error.code === 'ERR_NETWORK') {
            toastEvents.emit('error', 'Problème de connexion internet.');
        } else {
            toastEvents.emit('error', displayMessage);
        }

        return Promise.reject(error);
    }
);