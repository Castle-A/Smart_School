import api from './api';

export interface SchoolConfig {
    id: string;
    schoolId: string;
    motto: string | null;
    officialColors: string | null;
    reportTemplate: string;
    receiptTemplate: string;
    gradingScale: number;
    passingGrade: number;
    defaultCoefficient: number;
    currency: string;
    penaltyRate: number;
    smsAlertsEnabled: boolean;
    emailAlertsEnabled: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateSchoolConfigDto {
    motto?: string;
    officialColors?: string;
    reportTemplate?: string;
    receiptTemplate?: string;
    gradingScale?: number;
    passingGrade?: number;
    defaultCoefficient?: number;
    currency?: string;
    penaltyRate?: number;
    smsAlertsEnabled?: boolean;
    emailAlertsEnabled?: boolean;
}

export const schoolConfigService = {
    /**
     * Récupère la configuration de l'école
     */
    async getConfig(): Promise<SchoolConfig> {
        const response = await api.get('/api/schools/config');
        return response.data;
    },

    /**
     * Met à jour la configuration de l'école
     */
    async updateConfig(dto: UpdateSchoolConfigDto): Promise<SchoolConfig> {
        const response = await api.patch('/api/schools/config', dto);
        return response.data;
    }
};
