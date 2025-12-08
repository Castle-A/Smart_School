import axios from 'axios';

// Configuration de l'API
// Utilise des URLs relatives pour profiter du proxy Vite
// Cela fonctionne en localhost ET via ngrok avec une seule URL
const API_BASE_URL = '';

console.log(`🌐 API: Using Vite proxy (relative URLs)`);

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

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