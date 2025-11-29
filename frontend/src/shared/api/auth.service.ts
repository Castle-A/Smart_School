import api from './api';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    gender?: string;
    phone?: string;
    schoolName: string;
    schoolAddress?: string;
    schoolPhone?: string;
    schoolEmail?: string;
    schoolCycles?: string[];
}

export interface AuthResponse {
    access_token: string;
    mustChangePassword: boolean;
}

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    async registerFounder(data: RegisterData): Promise<any> {
        const response = await api.post('/auth/register/founder', data);
        return response.data;
    },

    logout() {
        localStorage.removeItem('access_token');
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem('access_token');
    },

    async changePassword(currentPassword: string, newPassword: string): Promise<void> {
        try {
            const response = await api.post('/auth/change-password', {
                currentPassword,
                newPassword
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erreur lors du changement de mot de passe');
        }
    }
};