// Interface de retour pour la validation de clôture
export interface ClosureValidation {
    // Vérifications principales (3 certifications indépendantes)
    financeCertified: boolean;            // ✓ Comptable a validé les finances GLOBALES
    maternellePrimaireCertified: boolean; // ✓ Directeur Mat/Prim a validé son cycle
    collegeLyceeCertified: boolean;       // ✓ Directeur Collège/Lycée a validé son cycle
    allStudentsDecided: boolean;          // ✓ 100% élèves ont décision de conseil
    // Vérifications additionnelles
    noOutstandingGrades: boolean;    // ✓ Toutes les notes sont saisies
    yearEndReportsGenerated: boolean; // ✓ Bulletins finaux générés

    // Résumé
    canClose: boolean;               // true si TOUTES les vérifications sont OK
    blockers: string[];             // Liste des problèmes bloquants (messages humains)

    // Statistiques
    stats: {
        totalStudents: number;           // Nombre total d'élèves actifs
        studentsWithDecision: number;    // Élèves avec décision conseil
        pendingGradesCount: number;      // Nombre de notes manquantes
        pendingReportsCount: number;     // Nombre de bulletins non générés
    };
}

// Interface de retour pour la prévisualisation de transition
export interface TransitionPreview {
    fromYear: {
        id: string;
        name: string;
    };

    toCreate: {
        yearName: string;
        classesCount: number;          // Nombre de classes à créer
        subjectsCount: number;         // Nombre de matières à dupliquer
        classSubjectsCount: number;    // Nombre de liens classe-matière
    };

    students: {
        toPromote: number;             // Élèves à promouvoir
        toRepeat: number;              // Élèves  qui redoublent
        toGraduate: number;            // Élèves diplômés (à archiver)
        toTransfer: number;            // Élèves transférés
        withoutDecision: number;       // Élèves sans décision conseil (BLOQUANT)
    };

    warnings: string[];                // Avertissements éventuels
}

// Interface de retour après rollover
export interface TransitionReport {
    success: boolean;
    newYearId: string;
    newYearName: string;

    created: {
        classes: number;
        subjects: number;
        classSubjects: number;
    };

    students: {
        promoted: number;
        repeated: number;
        graduated: number;
        transferred: number;
    };

    logsCreated: number;  // Nombre d'entrées dans YearTransitionLog
    duration: number;     // Durée de l'opération (ms)
}
