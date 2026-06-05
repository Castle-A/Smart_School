import api from './api';

export interface Notification {
    id: string;
    type: 'PAYMENT' | 'ABSENCE' | 'VALIDATION' | 'SECURITY' | 'SYSTEM';
    title: string;
    message: string;
    link?: string;
    isRead: boolean;
    createdAt: string;
}

export const notificationService = {
    async getAll(): Promise<Notification[]> {
        const response = await api.get('/notifications');
        return response.data;
    },

    async getUnreadCount(): Promise<number> {
        const response = await api.get('/notifications/unread-count');
        return response.data;
    },

    async markAsRead(id: string): Promise<void> {
        await api.patch(`/notifications/${id}/read`);
    },

    async markAllAsRead(): Promise<void> {
        await api.patch('/notifications/mark-all-read');
    },
};
