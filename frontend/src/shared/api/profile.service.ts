import api from './api';

export interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    gender?: string;
    phone?: string;
    profilePicture?: string;
    initials: string;
    role: string;
    school: {
        id: string;
        name: string;
        address?: string;
        phone?: string;
        email?: string;
        cycles?: string;
        subscriptionPlan?: string;
        subscriptionStatus?: string;
    };
}

export const profileService = {
    async getProfile(): Promise<UserProfile> {
        const response = await api.get('/profile/me');
        return response.data;
    },

    async updateProfile(data: {
        firstName?: string;
        lastName?: string;
        phone?: string;
        gender?: string;
    }): Promise<UserProfile> {
        const response = await api.patch('/profile/me', data);
        return response.data;
    },

    async uploadProfilePicture(file: File): Promise<{ url: string }> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/profile/upload-picture', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
