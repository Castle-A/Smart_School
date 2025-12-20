import api from './api';

export const SubscriptionPlan = {
    FREE: 'FREE',
    STARTER: 'STARTER',
    PROFESSIONAL: 'PROFESSIONAL',
    ENTERPRISE: 'ENTERPRISE',
    CUSTOM: 'CUSTOM',
} as const;

export type SubscriptionPlan = typeof SubscriptionPlan[keyof typeof SubscriptionPlan];

export const SubscriptionStatus = {
    TRIAL: 'TRIAL',
    ACTIVE: 'ACTIVE',
    PAST_DUE: 'PAST_DUE',
    CANCELLED: 'CANCELLED',
    EXPIRED: 'EXPIRED',
} as const;

export type SubscriptionStatus = typeof SubscriptionStatus[keyof typeof SubscriptionStatus];

export interface Subscription {
    id: string;
    schoolId: string;
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    startDate: string;
    endDate: string | null;
    trialEndDate: string | null;
    billingCycle: string;
    amount: number;
    currency: string;
    maxStudents: number;
    maxTeachers: number;
    maxStorage: number;
    features: string[] | null;
    lastBillingDate: string | null;
    nextBillingDate: string | null;
}

export interface Usage {
    students: number;
    teachers: number;
    storage: number;
}

export interface SubscriptionResponse {
    subscription: Subscription;
    usage: Usage;
}

export const subscriptionService = {
    async getCurrent(): Promise<SubscriptionResponse> {
        const response = await api.get<SubscriptionResponse>('/subscriptions/current');
        return response.data;
    },
};
