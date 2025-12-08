// Permissions constants for administrative roles
// Based on African school context (Bénin/West Africa)

export const PERMISSION_CATEGORIES = {
    STUDENTS: 'students',
    FINANCE: 'finance',
    DISCIPLINE: 'discipline',
    ACADEMICS: 'academics',
    COMMUNICATION: 'communication',
    REPORTS: 'reports',
    SCHEDULE: 'schedule',
    STAFF: 'staff',
    PEDAGOGY: 'pedagogy', // New
    SERVICES: 'services', // Canteen, Boarding
} as const;

export interface PermissionDefinition {
    code: string;
    name: string;
    description: string;
    category: string;
    isDefault: boolean;
    directorType?: 'PRIMARY_PRESCHOOL' | 'COLLEGE' | 'BOTH'; // Context restriction
}

// SECRÉTAIRE (SECRETARY)
export const SECRETARY_PERMISSIONS: PermissionDefinition[] = [
    // --- ADMINISTRATION (Standard) ---
    { code: 'students.enroll', name: 'Gérer les inscriptions', description: 'Inscrire de nouveaux élèves', category: PERMISSION_CATEGORIES.STUDENTS, isDefault: true },
    { code: 'students.view', name: 'Consulter dossiers élèves', description: 'Voir les informations des élèves', category: PERMISSION_CATEGORIES.STUDENTS, isDefault: true },
    { code: 'students.edit', name: 'Modifier informations élèves', description: 'Éditer les données des élèves', category: PERMISSION_CATEGORIES.STUDENTS, isDefault: true },
    { code: 'documents.certificates', name: 'Générer certificats', description: 'Créer certificats de scolarité et bulletins', category: PERMISSION_CATEGORIES.STUDENTS, isDefault: true },
    { code: 'schedule.view', name: 'Consulter emploi du temps', description: 'Voir les emplois du temps', category: PERMISSION_CATEGORIES.SCHEDULE, isDefault: true },

    // --- FINANCE / CAISSE (Optionnel - Primaire) ---
    { code: 'finance.cashier', name: 'Encaissement Scolarité', description: 'Tenue de caisse journalière (Scolarité)', category: PERMISSION_CATEGORIES.FINANCE, isDefault: false, directorType: 'PRIMARY_PRESCHOOL' },
    { code: 'finance.payments', name: 'Saisie des Versements', description: 'Enregistrer les paiements', category: PERMISSION_CATEGORIES.FINANCE, isDefault: false },

    // --- VIE SCOLAIRE / SERVICES (Optionnel) ---
    { code: 'attendance.manage', name: 'Saisie Absences/Retards', description: 'Enregistrer présences quotidiennement', category: PERMISSION_CATEGORIES.DISCIPLINE, isDefault: false },
    { code: 'canteen.manage', name: 'Gestion Cantine', description: 'Gérer les inscriptions et repas cantine', category: PERMISSION_CATEGORIES.SERVICES, isDefault: false, directorType: 'PRIMARY_PRESCHOOL' },

    // --- COMMUNICATION ---
    { code: 'communication.parents', name: 'Liaison Parents', description: 'Envoyer messages et circulaires', category: PERMISSION_CATEGORIES.COMMUNICATION, isDefault: false },

    // --- ACADEMIC ---
    { code: 'grades.enter', name: 'Saisir les notes', description: 'Saisie des notes (Secrétariat)', category: PERMISSION_CATEGORIES.ACADEMICS, isDefault: false },
    { code: 'reports.statistics', name: 'Générer statistiques', description: 'Créer rapports statistiques', category: PERMISSION_CATEGORIES.REPORTS, isDefault: false },
];

// SURVEILLANT GÉNÉRAL (SURVEILLANT)
export const SURVEILLANT_PERMISSIONS: PermissionDefinition[] = [
    { code: 'discipline.manage', name: 'Maintien de l\'Ordre', description: 'Superviser comportement élèves', category: PERMISSION_CATEGORIES.DISCIPLINE, isDefault: true },
    { code: 'attendance.record', name: 'Contrôle Assiduité', description: 'Marquer présences/absences', category: PERMISSION_CATEGORIES.DISCIPLINE, isDefault: true },
    { code: 'surveillance.general', name: 'Surveillance générale', description: 'Surveiller établissement', category: PERMISSION_CATEGORIES.DISCIPLINE, isDefault: true },
    { code: 'schoollife.manage', name: 'Gérer vie scolaire', description: 'Organiser activités', category: PERMISSION_CATEGORIES.DISCIPLINE, isDefault: true },

    { code: 'discipline.sanctions', name: 'Attribuer sanctions', description: 'Donner punitions/sanctions', category: PERMISSION_CATEGORIES.DISCIPLINE, isDefault: false },
    { code: 'communication.convocations', name: 'Convoquer parents', description: 'Envoyer convocations', category: PERMISSION_CATEGORIES.COMMUNICATION, isDefault: false },
    { code: 'boarding.manage', name: 'Gestion de l\'Internat', description: 'Superviser l\'internat', category: PERMISSION_CATEGORIES.SERVICES, isDefault: false },
    { code: 'reports.discipline', name: 'Rapports disciplinaires', description: 'Rédiger rapports incidents', category: PERMISSION_CATEGORIES.REPORTS, isDefault: false },
];

// CENSEUR DES ÉTUDES (CENSEUR)
export const CENSEUR_PERMISSIONS: PermissionDefinition[] = [
    // --- PEDAGOGIE ---
    { code: 'curriculum.manage', name: 'Pilotage des Programmes', description: 'Superviser programmes scolaires', category: PERMISSION_CATEGORIES.PEDAGOGY, isDefault: true },
    { code: 'exams.organize', name: 'Organisation Examens', description: 'Planifier évaluations et examens blancs', category: PERMISSION_CATEGORIES.PEDAGOGY, isDefault: true },
    { code: 'evaluations.supervise', name: 'Superviser évaluations', description: 'Contrôler déroulement examens', category: PERMISSION_CATEGORIES.PEDAGOGY, isDefault: true },
    { code: 'councils.lead', name: 'Présidence Conseils Classe', description: 'Animer les conseils', category: PERMISSION_CATEGORIES.PEDAGOGY, isDefault: true },

    // --- STAFF (Optionnel) ---
    { code: 'teachers.manage', name: 'Gestion Service Enseignants', description: 'Gérer emplois du temps profs', category: PERMISSION_CATEGORIES.STAFF, isDefault: false },
    { code: 'teachers.view', name: 'Consulter Dossiers Profs', description: 'Voir la liste des enseignants', category: PERMISSION_CATEGORIES.STAFF, isDefault: false },

    // --- OPTIONNEL ---
    { code: 'schedule.edit', name: 'Ingénierie Emploi du Temps', description: 'Concevoir emplois du temps complexe', category: PERMISSION_CATEGORIES.SCHEDULE, isDefault: false },
    { code: 'staff.evaluate', name: 'Évaluation Pédagogique', description: 'Visites de classe et notations', category: PERMISSION_CATEGORIES.PEDAGOGY, isDefault: false },
    { code: 'library.manage', name: 'Gérer bibliothèque', description: 'Superviser ressources', category: PERMISSION_CATEGORIES.ACADEMICS, isDefault: false },
    { code: 'reports.academic', name: 'Statistiques académiques', description: 'Générer rapports résultats', category: PERMISSION_CATEGORIES.REPORTS, isDefault: false },
];

// COMPTABLE (ACCOUNTANT)
export const ACCOUNTANT_PERMISSIONS: PermissionDefinition[] = [
    { code: 'finance.fees', name: 'Configuration Écolages', description: 'Configurer tous les frais', category: PERMISSION_CATEGORIES.FINANCE, isDefault: true },
    { code: 'finance.cashier', name: 'Gestion de Caisse', description: 'Tenir caisse quotidienne', category: PERMISSION_CATEGORIES.FINANCE, isDefault: true },
    { code: 'finance.invoices', name: 'Facturation', description: 'Émettre et gérer factures', category: PERMISSION_CATEGORIES.FINANCE, isDefault: true },
    { code: 'finance.payments', name: 'Enregistrer paiements', description: 'Saisir règlements', category: PERMISSION_CATEGORIES.FINANCE, isDefault: true },

    { code: 'finance.payroll', name: 'Gestion de la Paie', description: 'Calculer et verser salaires', category: PERMISSION_CATEGORIES.FINANCE, isDefault: false },
    { code: 'finance.budget', name: 'Élaborer budgets', description: 'Créer prévisions budgétaires', category: PERMISSION_CATEGORIES.FINANCE, isDefault: false },
    { code: 'finance.suppliers', name: 'Gestion Fournisseurs', description: 'Suivre achats et fournisseurs', category: PERMISSION_CATEGORIES.FINANCE, isDefault: false },
    { code: 'reports.financial', name: 'Rapports financiers', description: 'Générer bilans détaillés', category: PERMISSION_CATEGORIES.REPORTS, isDefault: false },
];

// DIRECTEUR (DIRECTOR)
export const DIRECTOR_PERMISSIONS: PermissionDefinition[] = [
    // --- RH & GOUVERNANCE ---
    { code: 'admin.full', name: 'Super-Administration', description: 'Accès total administration', category: PERMISSION_CATEGORIES.STAFF, isDefault: true },
    { code: 'staff.manage', name: 'Gestion Globale Personnel', description: 'Recruter, contrats, RH', category: PERMISSION_CATEGORIES.STAFF, isDefault: true },
    { code: 'teachers.manage', name: 'Gestion Corps Enseignant', description: 'Recrutement et affectation', category: PERMISSION_CATEGORIES.STAFF, isDefault: true },
    { code: 'teachers.view', name: 'Consultation Dossiers Profs', description: 'Voir dossiers enseignants', category: PERMISSION_CATEGORIES.STAFF, isDefault: true },

    // --- SCOLARITÉ & PEDAGOGIE ---
    { code: 'students.full', name: 'Autorité sur les Élèves', description: 'Contrôle total scolarité', category: PERMISSION_CATEGORIES.STUDENTS, isDefault: true },
    { code: 'classes.manage', name: 'Structure Pédagogique', description: 'Créer classes et groupes', category: PERMISSION_CATEGORIES.ACADEMICS, isDefault: true },
    { code: 'classes.view', name: 'Consulter classes', description: 'Voir les classes', category: PERMISSION_CATEGORIES.ACADEMICS, isDefault: true },

    // Contextuel: Inspection (Primaire) vs Supervision (Secondaire)
    { code: 'pedagogy.inspection', name: 'Inspection Pédagogique', description: 'Inspecter les classes (Maîtres)', category: PERMISSION_CATEGORIES.PEDAGOGY, isDefault: true, directorType: 'PRIMARY_PRESCHOOL' },
    { code: 'academics.supervise', name: 'Supervision des Résultats', description: 'Suivi global résultats', category: PERMISSION_CATEGORIES.ACADEMICS, isDefault: true }, // Delegated to Censor in College usually, but Director has right

    // --- DISCIPLINE & FINANCE ---
    { code: 'discipline.oversight', name: 'Supervision discipline', description: 'Droit de regard discipline', category: PERMISSION_CATEGORIES.DISCIPLINE, isDefault: true },
    { code: 'config.school', name: 'Paramétrage Établissement', description: 'Modifier paramètres école', category: PERMISSION_CATEGORIES.STAFF, isDefault: true }, // Made default for Director

    // --- OPTIONNEL ---
    { code: 'finance.view', name: 'Audit Financier (Lecture)', description: 'Voir tous les rapports financiers', category: PERMISSION_CATEGORIES.FINANCE, isDefault: false },
    { code: 'finance.approve', name: 'Validation des Dépenses', description: 'Valider décaissements', category: PERMISSION_CATEGORIES.FINANCE, isDefault: false },
    { code: 'reports.all', name: 'Tous les rapports', description: 'Accès global reporting', category: PERMISSION_CATEGORIES.REPORTS, isDefault: false },
];

export const PERMISSIONS_BY_ROLE = {
    DIRECTOR: DIRECTOR_PERMISSIONS,
    SECRETARY: SECRETARY_PERMISSIONS,
    SURVEILLANT: SURVEILLANT_PERMISSIONS,
    CENSEUR: CENSEUR_PERMISSIONS,
    CENSOR: CENSEUR_PERMISSIONS, // Alias for English consistency
    ACCOUNTANT: ACCOUNTANT_PERMISSIONS,
} as const;

export type RoleType = keyof typeof PERMISSIONS_BY_ROLE;

export function getPermissionsForRole(role: RoleType): PermissionDefinition[] {
    return PERMISSIONS_BY_ROLE[role] || [];
}

export function getDefaultPermissionsForRole(role: RoleType): PermissionDefinition[] {
    return getPermissionsForRole(role).filter(p => p.isDefault);
}

export function getAdditionalPermissionsForRole(role: RoleType): PermissionDefinition[] {
    return getPermissionsForRole(role).filter(p => !p.isDefault);
}
