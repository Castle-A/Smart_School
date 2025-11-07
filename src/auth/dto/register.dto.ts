import { Role } from '@prisma/client';

export class RegisterDto {
  email: string;
  password: string;
  role: Role; // On peut forcer un rôle par défaut, ex: 'ELEVE'
  schoolId: string; // L'utilisateur doit être rattaché à une école
  firstName?: string;
  lastName?: string;
}