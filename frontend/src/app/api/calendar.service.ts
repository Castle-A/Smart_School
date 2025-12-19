import api from '../../shared/api/api';

export interface AcademicEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    type: string; // 'ACADEMIC_PERIOD', 'HOLIDAY', 'EXAM', 'FINANCIAL', 'MEETING', 'OTHER'
    description?: string;
    isSystem: boolean;
    audience: 'ADMIN_ONLY' | 'PUBLIC' | 'STUDENTS' | 'PARENTS' | 'TEACHERS';
    targetClass?: { name: string };
    classId?: string;
}

export interface CreateEventDto {
    title: string;
    start: string; // ISO String
    end: string;
    type: string;
    description?: string;
    isSystem?: boolean;
    audience: string;
    targetClassId?: string;
}

export const calendarService = {
    getEvents: async () => {
        const response = await api.get<AcademicEvent[]>('/academic-calendar');
        return response.data;
    },

    createEvent: async (data: CreateEventDto) => {
        const response = await api.post<AcademicEvent>('/academic-calendar', data);
        return response.data;
    },

    updateEvent: async (id: string, data: Partial<CreateEventDto>) => {
        const response = await api.put<AcademicEvent>(`/academic-calendar/${id}`, data);
        return response.data;
    },

    deleteEvent: async (id: string) => {
        await api.delete(`/academic-calendar/${id}`);
    }
};
