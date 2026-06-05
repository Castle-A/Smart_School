import api from './api';

export interface LoginCredentials {
    identifier: string;
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

// Master Security: Nouvelle structure de réponse (plus de token exposé)
export interface AuthResponse {
    user: {
        userId: string;
        email: string;
        firstName: string;
        lastName: string;
        schoolRole?: string;
        role?: string;
        platformRole?: string;
        schoolId?: string;
        schoolName?: string;
        gender?: string;
        mustChangePassword?: boolean;
        directorType?: string;
        phone?: string;
        permissions?: string[];
    };
    mustChangePassword: boolean;
}

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        // Le backend définit automatiquement le cookie HttpOnly
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    async registerFounder(data: RegisterData): Promise<any> {
        const response = await api.post('/auth/register/founder', data);
        return response.data;
    },

    async logout(): Promise<void> {
        // Appel au backend pour effacer le cookie sécurisé
        await api.post('/auth/logout');
    },

    // Cette méthode n'est plus nécessaire avec les cookies
    // L'authentification est gérée automatiquement par le backend
    isAuthenticated(): boolean {
        // Deprecated: Utiliser le contexte d'authentification à la place
        return false;
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