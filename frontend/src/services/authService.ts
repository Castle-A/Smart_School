import axios from 'axios';

// NOUVELLE LOGIQUE : On utilise la variable d'environnement si elle existe,
// sinon le proxy local. En environnement de développement (Vite/Codespaces)
// il est souvent préférable d'utiliser le proxy dev ("/") pour éviter
// que le navigateur n'appelle directement l'URL publique du backend
// (qui peut être passée par un tunnel/proxy tiers et renvoyer 401 pour
// les requêtes preflight). Si une URL externe est configurée et qu'on
// est en production, on l'utilisera.
const rawApiUrl = import.meta.env.VITE_API_URL as string | undefined;
const isDev = import.meta.env.DEV === true;

// Si on est en dev et que VITE_API_URL pointe vers le host Codespaces du
// backend (par ex. ...-3000.app.github.dev), on préfère le proxy '/' pour
// éviter les problèmes de tunnel GitHub renvoyant 401 sur les preflight.
const shouldUseProxyInDev =
  isDev && rawApiUrl && rawApiUrl.includes('.app.github.dev') && rawApiUrl.includes(':3000')

const API_URL =
  rawApiUrl && rawApiUrl !== '' && !shouldUseProxyInDev ? rawApiUrl : '/';

console.log('[authService] rawApiUrl =', rawApiUrl, 'isDev =', isDev);
console.log('[authService] using API_URL =', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  withCredentials: true, // si cookies
});

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      return response.data;
    } catch (err: any) {
      console.error('Login error:', err?.response?.status, err?.response?.data);
      throw err;
    }
  },

  registerSchool: async (payload: {
    schoolName: string;
    schoolAddress: string;
    schoolPhone: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'FONDATEUR' | 'DIRECTEUR';
  }) => {
    try {
      const response = await api.post('/auth/register-school', payload);
      return response.data;
    } catch (err: any) {
      console.error('Register error:', err?.response?.status, err?.response?.data);
      throw err;
    }
  },

  updateAvatar: async (avatarUrl: string) => {
    try {
      const response = await api.patch('/auth/update-avatar', { avatarUrl });
      return response.data;
    } catch (err: any) {
      console.error('Update avatar error:', err?.response?.status, err?.response?.data);
      throw err;
    }
  },
};