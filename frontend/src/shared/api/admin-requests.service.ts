import api from './api';

export interface AdminRequest {
    id: string;
    type: 'DELETE_TEACHER' | 'UPDATE_TEACHER' | 'CLASS_ASSEMBLY' | 'DELETE_CLASS' | 'VALIDATE_STUDENT_REGISTRATION' | string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    data: any; // Changed from string to any to support pre-parsed or object data
    payload?: any; // Add payload as alias or complementary field
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

    findAll: async (status?: string, archived = false) => {
        const queryParams = new URLSearchParams();
        if (status) queryParams.append('status', status);
        if (archived) queryParams.append('archived', 'true');
        return api.get<AdminRequest[]>(`/admin-requests?${queryParams.toString()}`);
    },

    getMyRequests: async (archived = false) => {
        return api.get<AdminRequest[]>(`/admin-requests/my-requests?archived=${archived}`);
    },

    resolve: async (id: string, status: 'APPROVED' | 'REJECTED', comment?: string) => {
        return api.patch(`/admin-requests/${id}/resolve`, { status, comment });
    },

    archive: async (id: string) => {
        return api.patch(`/admin-requests/${id}/archive`);
    },

    archiveAllProcessed: async () => {
        return api.patch('/admin-requests/archive-all-processed');
    }
};
