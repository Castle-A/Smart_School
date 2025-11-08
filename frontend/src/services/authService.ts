import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== ''
    ? import.meta.env.VITE_API_URL   //  Prod (ou si défini)
    : '/';                           //  Dev → passe par le proxy Vite

// Instance axios unique
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  // + éventuellement: user?: {...}
}

export const authService = {
  // Login (inchangé)
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  //  Register school (TYPE MIS À JOUR)
  registerSchool: async (payload: {
    schoolName: string;
    schoolAddress: string; // <-- AJOUTÉ
    schoolPhone: string;   // <-- AJOUTÉ
    email: string;
    password: string;
    role: 'FONDATEUR' | 'DIRECTEUR';
  }) => {
    const response = await api.post('/auth/register-school', payload);
    return response.data;
  },
};