import api from '../../shared/api/api';

export interface Notification {
    id: string;
    userId: string;
    type: 'PAYMENT' | 'ABSENCE' | 'VALIDATION' | 'SECURITY' | 'SYSTEM';
    title: string;
    message: string;
    link?: string;
    isRead: boolean;
    createdAt: string;
}

export const notificationService = {
    findAll: async () => {
        const response = await api.get<Notification[]>('/notifications');
        return response.data;
    },

    getUnreadCount: async () => {
        const response = await api.get<number>('/notifications/unread-count');
        return response.data;
    },

    markAsRead: async (id: string) => {
        return api.patch(`/notifications/${id}/read`);
    },

    markAllAsRead: async () => {
        return api.patch('/notifications/mark-all-read');
    }
};
