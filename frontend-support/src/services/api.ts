import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3010/api',
    withCredentials: true,
    timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token if needed
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('support_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const supportApi = {
    getTickets: () => api.get('/support/tickets').then(res => res.data),
    getTicketMessages: (id: string) => api.get(`/support/tickets/${id}/messages`).then(res => res.data),
    addMessage: (ticketId: string, content: string) => api.post(`/support/tickets/${ticketId}/messages`, { content }),
    updateStatus: (id: string, status: string) => api.patch(`/support/tickets/${id}/status`, { status }),
    getUserContext: (userId: string) => api.get(`/support/tickets/user-context/${userId}`).then(res => res.data),
    requestAccess: (ticketId: string) => api.post(`/support/tickets/${ticketId}/request-access`).then(res => res.data),
    revokeAccess: (ticketId: string) => api.post(`/support/tickets/${ticketId}/revoke-access`).then(res => res.data),
    getAuditLogs: () => api.get('/support/audit-logs').then(res => res.data),
    getSupportAgents: () => api.get('/support/team/agents').then(res => res.data),
    createSupportAgent: (data: { email: string; firstName: string; lastName: string; phone?: string }) => api.post('/support/team/agents', data).then(res => res.data),

    // Auth Methods
    login: (identifier: string, password: string) => api.post('/auth/login', { identifier, password }).then(res => res.data),
    logout: () => api.post('/auth/logout').then(res => res.data),
    getProfile: () => api.get('/auth/profile').then(res => res.data),
};

export default api;
