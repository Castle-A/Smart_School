import api from './api';

// Basic payloads
export interface UpdateTeacherPayload {
    teacherId: string;
    updates: Record<string, unknown>;
}

export interface DeleteTeacherPayload {
    teacherId: string;
    reason: string;
}

export interface ClassAssemblyPayload {
    classId: string;
    reason: string;
}

export interface StudentRegistrationPayload {
    studentId: string;
    matricule?: string;
    [key: string]: unknown;
}

// Union type for possible data structures
export type RequestData =
    | UpdateTeacherPayload
    | DeleteTeacherPayload
    | ClassAssemblyPayload
    | StudentRegistrationPayload
    | Record<string, unknown>; // Fallback for flexibility

export interface AdminRequest {
    id: string;
    type: 'DELETE_TEACHER' | 'UPDATE_TEACHER' | 'CLASS_ASSEMBLY' | 'DELETE_CLASS' | 'VALIDATE_STUDENT_REGISTRATION' | string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    data: RequestData;
    payload?: RequestData; // Keep optional alias but typed
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
    create: async (type: string, data: RequestData) => {
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
