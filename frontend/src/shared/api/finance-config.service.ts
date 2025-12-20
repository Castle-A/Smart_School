import api from './api';

export interface FeeCategory {
    id?: string;
    name: string;
}

export interface Installment {
    name: string;
    amount: number;
    dueDate: string;
}

export interface ClassFee {
    classId: string;
    categoryId: string;
    tuitionAmount: number;
    registrationAmount: number;
    installments: Installment[];
}

export interface SchoolProduct {
    id?: string;
    name: string;
    price: number;
    category: string;
}

export interface FinanceGridData {
    categories: (FeeCategory & { classFees?: any[] })[];
    products: SchoolProduct[];
    currency: string;
    penaltyRate: number;
}

export interface SaveFinanceGridDto {
    currency?: string;
    penaltyRate?: number;
    categories: FeeCategory[];
    fees: ClassFee[];
    products: SchoolProduct[];
}

export const financeConfigService = {
    getConfig: async (): Promise<FinanceGridData> => {
        const res = await api.get('/finance-config');
        return res.data;
    },

    saveConfig: async (data: SaveFinanceGridDto): Promise<void> => {
        await api.post('/finance-config', data);
    }
};
