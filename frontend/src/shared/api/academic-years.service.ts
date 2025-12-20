import api from './api';

export interface CreateAcademicYearDto {
    name: string;
    startDate: string;
    endDate: string;
    periodType?: 'TRIMESTER' | 'SEMESTER';
    autoClosureEnabled?: boolean;
    autoClosureDate?: string;
    sourceYearId?: string;
}

export interface UpdateAcademicYearDto {
    name?: string;
    startDate?: string;
    endDate?: string;
    autoClosureEnabled?: boolean;
    autoClosureDate?: string;
    sourceYearId?: string;
    keepTeachers?: boolean;
}

export const academicYearsService = {
    /**
     * Récupère toutes les années scolaires de l'établissement
     */
    async findAll() {
        const response = await api.get('/academic-years');
        return response.data;
    },

    /**
     * Récupère l'année active
     */
    async getActive() {
        const response = await api.get('/academic-years/active');
        return response.data;
    },

    /**
     * Crée une nouvelle année scolaire
     */
    async create(data: CreateAcademicYearDto) {
        const response = await api.post('/academic-years', data);
        return response.data;
    },

    /**
     * Met à jour une année scolaire
     */
    async update(id: string, data: UpdateAcademicYearDto) {
        const response = await api.patch(`/academic-years/${id}`, data);
        return response.data;
    },

    /**
     * Active une année scolaire (bascule globale)
     */
    async activate(id: string) {
        const response = await api.post(`/academic-years/${id}/activate`);
        return response.data;
    },

    /**
     * Clôture une année scolaire
     */
    /**
     * Clôture une année scolaire
     */
    async close(id: string) {
        const response = await api.post(`/academic-years/${id}/close`);
        return response.data;
    },

    /**
     * Preview rollover transition
     */
    async previewNext(id: string) {
        const response = await api.get(`/academic-years/${id}/preview-next`);
        return response.data;
    },

    /**
     * Execute rollover transition
     */
    async createNext(id: string, data: any) {
        const response = await api.post(`/academic-years/${id}/create-next`, data);
        return response.data;
    }
};
