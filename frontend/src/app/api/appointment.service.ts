import api from '../../shared/api/api';

export interface Appointment {
    id: string;
    title: string;
    description?: string;
    start: string;
    end: string;
    mode: 'PRESENTIAL' | 'PHONE' | 'ONLINE';
    location?: string;
    status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED';
    organizer: { firstName: string; lastName: string };
    participants: AppointmentParticipant[];
}

export interface AppointmentParticipant {
    user: { firstName: string; lastName: string };
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
}

export interface CreateAppointmentDto {
    title: string;
    description?: string;
    start: string;
    end: string;
    mode: 'PRESENTIAL' | 'PHONE' | 'ONLINE';
    location?: string;
    participantIds: string[];
}

export const appointmentService = {
    requestAppointment: async (data: CreateAppointmentDto) => {
        const response = await api.post<Appointment>('/appointments', data);
        return response.data;
    },

    getMyCalendar: async () => {
        const response = await api.get<Appointment[]>('/appointments/my-calendar');
        return response.data;
    },

    getPendingInvitations: async () => {
        const response = await api.get<any[]>('/appointments/pending');
        return response.data;
    },

    validateInvitation: async (id: string, status: 'ACCEPTED' | 'DECLINED') => {
        return api.patch(`/appointments/${id}/validate`, { status });
    }
};
