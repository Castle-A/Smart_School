import api from './api';

export interface AdminRequest {
    id: string;
    type: 'DELETE_TEACHER' | 'UPDATE_TEACHER' | 'CLASS_ASSEMBLY';
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    data: string; // JSON string
    requester: {
        firstName: string;
        lastName: string;
        profilePicture?: string;
    };
    resolver?: {
        firstName: string;
        lastName: string;
    };
    adminComment?: string;
    createdAt: string;
}

export const adminRequestService = {
    create: async (type: string, data: any) => {
        return api.post('/admin-requests', { type, data });
    },

    findAll: async (status?: string) => {
        const query = status ? `?status=${status}` : '';
        return api.get<AdminRequest[]>(`/admin-requests${query}`);
    },

    resolve: async (id: string, status: 'APPROVED' | 'REJECTED', comment?: string) => {
        return api.patch(`/admin-requests/${id}/resolve`, { status, comment });
    }
};
