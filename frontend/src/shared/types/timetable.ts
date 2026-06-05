export interface TimetableSession {
    id: string;
    classId: string;
    subjectId: string;
    teacherId?: string;
    roomId?: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    subject?: {
        id: string;
        name: string;
        code?: string;
    };
    teacher?: {
        id: string;
        firstName: string;
        lastName: string;
    };
}
