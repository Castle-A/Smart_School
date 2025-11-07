import axios from 'axios';

// URL de backend. Adaptable.
const API_URL = 'https://automatic-waffle-wr99w9j6vpr4h9vqx-3000.app.github.dev/'; // Mettez le port de votre backend NestJS

// Crée une instance d'axios pour ne pas avoir à répéter l'URL
const api = axios.create({
  baseURL: API_URL,
});

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  // Ajoutez d'autres champs si votre API les retourne (ex: user)
}

export const authService = {
  // Fonction pour se connecter
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  // Fonction pour s'inscrire (on l'ajoutera plus tard)
  // register: async (userData: RegisterRequest): Promise<any> => { ... }
};