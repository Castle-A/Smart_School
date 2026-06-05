export enum PaymentMethod {
    CASH = 'CASH',
    CHEQUE = 'CHEQUE',
    VIREMENT = 'VIREMENT',
    STRIPE = 'STRIPE',
    ORANGE_MONEY = 'ORANGE_MONEY',
    MTN_MOMO = 'MTN_MOMO',
    CELTIIS = 'CELTIIS',
    WAVE = 'WAVE',
}

export const SUPPORTED_PAYMENT_METHODS = Object.values(PaymentMethod);
