import { SetMetadata } from '@nestjs/common';

// Décorateur pour spécifier le type de directeur requis
export const RequireDirectorType = (type: 'MATERNELLE_PRIMAIRE' | 'COLLEGE_LYCEE') =>
    SetMetadata('requiredDirectorType', type);
