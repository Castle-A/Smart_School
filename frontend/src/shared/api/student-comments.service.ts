import api from './api';

export interface StudentComment {
    id: string;
    content: string;
    author: {
        firstName: string;
        lastName: string;
    };
    createdAt: string;
}

export const studentCommentService = {
    addComment: async (studentId: string, content: string) => {
        return api.post(`/students/${studentId}/comments`, { content });
    },

    getComments: async (studentId: string) => {
        return api.get<StudentComment[]>(`/students/${studentId}/comments`);
    }
};
