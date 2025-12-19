/**
 * Role Constants
 * Standard role definitions for the application
 */
export const ROLES = {
    FOUNDER: 'FOUNDER',
    DIRECTOR: 'DIRECTOR',
    CENSOR: 'CENSOR',
    SUPERVISOR: 'SUPERVISOR',
    SECRETARY: 'SECRETARY',
    TEACHER: 'TEACHER',
    ACCOUNTANT: 'ACCOUNTANT',
    PARENT: 'PARENT',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

/**
 * Role Labels for UI Display
 * French translations for each role
 */
export const ROLE_LABELS: Record<Role, string> = {
    [ROLES.FOUNDER]: 'Fondateur',
    [ROLES.DIRECTOR]: 'Directeur',
    [ROLES.CENSOR]: 'Censeur',
    [ROLES.SUPERVISOR]: 'Surveillant Général',
    [ROLES.SECRETARY]: 'Secrétaire',
    [ROLES.TEACHER]: 'Professeur / Maître',
    [ROLES.ACCOUNTANT]: 'Comptable',
    [ROLES.PARENT]: 'Parent',
};

/**
 * Gender Constants
 * Standard gender definitions for the application
 */
export const GENDERS = {
    HOMME: 'Homme',
    FEMME: 'Femme',
    DIVERS: 'Divers',
} as const;

export type Gender = typeof GENDERS[keyof typeof GENDERS];

/**
 * Gender Labels for UI Display
 */
export const GENDER_LABELS: Record<Gender, string> = {
    [GENDERS.HOMME]: 'Homme',
    [GENDERS.FEMME]: 'Femme',
    [GENDERS.DIVERS]: 'Divers',
};
