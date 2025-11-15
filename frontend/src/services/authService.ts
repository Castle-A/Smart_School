import api from './api';
import type { AxiosError } from 'axios';

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


export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  mustChangePassword?: boolean;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      return response.data;
    } catch (err: unknown) {
      // Normalise l'erreur pour que les callers reçoivent toujours une Error
      const axiosErr = err as AxiosError | undefined;
      const serverData = axiosErr?.response?.data as any | undefined;
      const serverMessage = serverData?.message ?? serverData?.error ?? axiosErr?.message ?? 'Erreur inconnue lors de la connexion';
      console.error('Login error:', serverData ?? err);
      throw new Error(String(serverMessage));
    }
  },

  changePassword: async (newPassword: string) => {
    try {
      const response = await api.patch('/auth/change-password', { newPassword });
      return response.data;
    } catch (err: unknown) {
      // Normalise l'erreur Axios pour renvoyer un message lisible aux callers
      const axiosErr = err as AxiosError | undefined;
      const serverData = axiosErr?.response?.data as any | undefined;
      const serverMessage = serverData?.message ?? serverData?.error ?? axiosErr?.message ?? 'Erreur inconnue lors du changement de mot de passe';
      console.error('Change password error:', serverData ?? err);
      throw new Error(String(serverMessage));
    }
  },

  refresh: async (refreshToken: string) => {
    try {
      const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
      return response.data;
    } catch (err: unknown) {
      console.error('Refresh error:', err);
      throw err;
    }
  },

  registerSchool: async (payload: {
    schoolName: string;
    schoolAddress: string;
    schoolPhone: string;
    schoolEmail?: string;
    schoolCycles?: string[];
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'FONDATEUR' | 'DIRECTEUR';
    gender: 'MALE' | 'FEMALE' | 'OTHER';
  }) => {
    try {
  const response = await api.post('/auth/register-school', payload);
      return response.data;
    } catch (err: unknown) {
      console.error('Register error:', err);
      throw err;
    }
  },

  updateAvatar: async (avatarUrl: string) => {
    try {
  const response = await api.patch('/auth/update-avatar', { avatarUrl });
      return response.data;
    } catch (err: unknown) {
      console.error('Update avatar error:', err);
      throw err;
    }
  },
};