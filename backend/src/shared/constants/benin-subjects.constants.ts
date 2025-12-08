
export interface BeninSubjectTemplate {
    code: string;
    name: string;
    cycle: 'MATERNELLE' | 'PRIMAIRE' | 'COLLEGE' | 'LYCEE' | 'COLLEGE_LYCEE' | 'LYCEE_TECHNIQUE';
    defaultCoef: number;
    category: 'ACTIVITE' | 'LITTÉRAIRE' | 'SCIENTIFIQUE' | 'ÉVEIL' | 'ART' | 'SPORT' | 'LANGUES' | 'HUMANITÉS' | 'SCIENCES_SOCIALES' | 'TECHNIQUE';
}

export const BENIN_SUBJECTS_TEMPLATE: BeninSubjectTemplate[] = [
    // --- MATERNELLE (Activités) ---
    { code: 'MAT_VIE_PRAT', name: "Activités d'éducation pour la santé (Vie Pratique)", cycle: 'MATERNELLE', defaultCoef: 0, category: 'ACTIVITE' },
    { code: 'MAT_REFLEXE', name: "Activités d'éducation pour la santé (Éducation à la réflexe)", cycle: 'MATERNELLE', defaultCoef: 0, category: 'ACTIVITE' },
    { code: 'MAT_ORAL', name: "Activités d'expression orale", cycle: 'MATERNELLE', defaultCoef: 0, category: 'ACTIVITE' },
    { code: 'MAT_CORPO', name: "Activités d'expression corporelle", cycle: 'MATERNELLE', defaultCoef: 0, category: 'ACTIVITE' },
    { code: 'MAT_PLAST', name: "Activités d'expression plastique", cycle: 'MATERNELLE', defaultCoef: 0, category: 'ACTIVITE' },
    { code: 'MAT_EVEIL_ST', name: "Éducation d'éveil scientifique et technologique", cycle: 'MATERNELLE', defaultCoef: 0, category: 'ACTIVITE' },
    { code: 'MAT_PRE_LEC', name: "Pré-lecture", cycle: 'MATERNELLE', defaultCoef: 0, category: 'ACTIVITE' },
    { code: 'MAT_PRE_MATH', name: "Pré-mathématique", cycle: 'MATERNELLE', defaultCoef: 0, category: 'ACTIVITE' },
    { code: 'MAT_PRE_ECR', name: "Pré-écriture", cycle: 'MATERNELLE', defaultCoef: 0, category: 'ACTIVITE' },
    { code: 'MAT_LIBRE', name: "Activités libres", cycle: 'MATERNELLE', defaultCoef: 0, category: 'ACTIVITE' },

    // --- PRIMAIRE ---
    { code: 'PRI_LEC', name: 'Lecture', cycle: 'PRIMAIRE', defaultCoef: 1, category: 'LITTÉRAIRE' },
    { code: 'PRI_MATH', name: 'Mathématiques', cycle: 'PRIMAIRE', defaultCoef: 1, category: 'SCIENTIFIQUE' },
    { code: 'PRI_EXP', name: 'Expression écrite', cycle: 'PRIMAIRE', defaultCoef: 1, category: 'LITTÉRAIRE' },
    { code: 'PRI_DIC', name: 'Dictée', cycle: 'PRIMAIRE', defaultCoef: 1, category: 'LITTÉRAIRE' },
    { code: 'PRI_ES', name: 'Éducation sociale (ES)', cycle: 'PRIMAIRE', defaultCoef: 1, category: 'ÉVEIL' },
    { code: 'PRI_EST', name: 'Éducation scientifique et technologique (EST)', cycle: 'PRIMAIRE', defaultCoef: 1, category: 'ÉVEIL' },
    { code: 'PRI_EA_DESSIN', name: 'EA (Dessin)', cycle: 'PRIMAIRE', defaultCoef: 1, category: 'ART' },
    { code: 'PRI_EA_CHANT', name: 'EA (Chant)', cycle: 'PRIMAIRE', defaultCoef: 1, category: 'ART' },
    { code: 'PRI_EPS', name: 'EPS', cycle: 'PRIMAIRE', defaultCoef: 1, category: 'SPORT' },

    // --- SECONDAIRE (GÉNÉRAL & TECHNIQUE) ---
    // Tronc Commun & Série scientifiques (C, D)
    { code: 'SEC_FR', name: 'Français', cycle: 'COLLEGE_LYCEE', defaultCoef: 2, category: 'LITTÉRAIRE' },
    { code: 'SEC_MATH', name: 'Mathématiques', cycle: 'COLLEGE_LYCEE', defaultCoef: 3, category: 'SCIENTIFIQUE' },
    { code: 'SEC_PCT', name: 'Physique-Chimie-Technologie (PCT)', cycle: 'COLLEGE_LYCEE', defaultCoef: 2, category: 'SCIENTIFIQUE' },
    { code: 'SEC_SVT', name: 'Sciences de la Vie et de la Terre (SVT)', cycle: 'COLLEGE_LYCEE', defaultCoef: 2, category: 'SCIENTIFIQUE' },
    { code: 'SEC_ANG', name: 'Anglais', cycle: 'COLLEGE_LYCEE', defaultCoef: 2, category: 'LANGUES' },
    { code: 'SEC_HG', name: 'Histoire-Géographie', cycle: 'COLLEGE_LYCEE', defaultCoef: 2, category: 'HUMANITÉS' },
    { code: 'SEC_EPS', name: 'Éducation Physique et Sportive (EPS)', cycle: 'COLLEGE_LYCEE', defaultCoef: 1, category: 'SPORT' },

    // Spécialités Séries Littéraires (A1, A2) & B
    { code: 'SEC_PHILO', name: 'Philosophie', cycle: 'LYCEE', defaultCoef: 2, category: 'HUMANITÉS' },
    { code: 'SEC_ALL', name: 'Allemand (LV2)', cycle: 'LYCEE', defaultCoef: 2, category: 'LANGUES' },
    { code: 'SEC_ESP', name: 'Espagnol (LV2)', cycle: 'LYCEE', defaultCoef: 2, category: 'LANGUES' },
    { code: 'SEC_ECO', name: 'Économie', cycle: 'LYCEE', defaultCoef: 3, category: 'SCIENCES_SOCIALES' }, // Série B

    // Spécialités Séries Techniques (G1, G2, G3)
    { code: 'SEC_COMPTA', name: 'Comptabilité Générale', cycle: 'LYCEE_TECHNIQUE', defaultCoef: 3, category: 'TECHNIQUE' },
    { code: 'SEC_MATH_FIN', name: 'Mathématiques Financières', cycle: 'LYCEE_TECHNIQUE', defaultCoef: 3, category: 'TECHNIQUE' },
    { code: 'SEC_DROIT', name: 'Droit (Civil/Commercial)', cycle: 'LYCEE_TECHNIQUE', defaultCoef: 2, category: 'TECHNIQUE' },
    { code: 'SEC_INFO_GEST', name: 'Informatique de Gestion', cycle: 'LYCEE_TECHNIQUE', defaultCoef: 2, category: 'TECHNIQUE' },
    { code: 'SEC_TECH_COMM', name: 'Techniques Commerciales', cycle: 'LYCEE_TECHNIQUE', defaultCoef: 3, category: 'TECHNIQUE' },
    { code: 'SEC_TECH_ADMIN', name: 'Techniques Administratives', cycle: 'LYCEE_TECHNIQUE', defaultCoef: 3, category: 'TECHNIQUE' },
    { code: 'SEC_FISCALITE', name: 'Fiscalité', cycle: 'LYCEE_TECHNIQUE', defaultCoef: 3, category: 'TECHNIQUE' },
];
