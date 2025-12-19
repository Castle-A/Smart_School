import api from '../../shared/api/api';

export interface Payment {
    id: string;
    amount: number;
    method: string;
    reason: string;
    reference?: string;
    date: string;
    studentId: string;
}

export interface Expense {
    id: string;
    category: string;
    amount: number;
    description?: string;
    date: string;
}

export interface FinancialReport {
    labels: string[];
    income: number[];
    expense: number[];
    balance: number[];
}

export interface GlobalStats {
    year: number;
    totalIncome: number;
    totalExpense: number;
    balance: number;
}

export const FinanceService = {
    getStudentFinanceSummary: async (search?: string) => {
        const response = await api.get('/finance/students', { params: { search } });
        return response.data;
    },

    createPayment: async (data: any) => {
        const response = await api.post('/finance/payments', data);
        return response.data;
    },

    getReceipt: async (paymentId: string) => {
        const response = await api.get(`/finance/receipt/${paymentId}`, { responseType: 'blob' });
        return response.data;
    },

    getReport: async (startDate?: Date, endDate?: Date) => {
        const params: any = {};
        if (startDate) params.startDate = startDate.toISOString();
        if (endDate) params.endDate = endDate.toISOString();

        const response = await api.get('/finance/report', { params });
        return response.data as FinancialReport;
    },

    getGlobalStats: async () => {
        const response = await api.get('/finance/stats/global');
        return response.data as GlobalStats;
    }
};
