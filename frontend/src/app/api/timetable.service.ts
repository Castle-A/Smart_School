import api from '../../shared/api/api';

export interface ClassSession {
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    room?: string;
    classId: string;
    subjectId: string;
    subject: { id: string; name: string };
    teacherId?: string;
    teacher?: { id: string; firstName: string; lastName: string };
}

export interface UpsertSessionDto {
    id?: string;
    classId: string;
    subjectId: string;
    teacherId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    room?: string;
}

export const TimetableService = {
    getSchedule: async (classId: string) => {
        const response = await api.get<ClassSession[]>(`/vie-scolaire/timetable/${classId}`);
        return response.data;
    },

    upsertSession: async (data: UpsertSessionDto) => {
        const response = await api.post<ClassSession>('/vie-scolaire/timetable', data);
        return response.data;
    },

    deleteSession: async (id: string) => {
        await api.delete(`/vie-scolaire/timetable/${id}`);
    }
};
