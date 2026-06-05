import { Request } from 'express';

export interface UserPayload {
  userId: string;
  email: string;
  role: string;
  schoolRole?: string;
  schoolId: string; // Assumed mandatory for most business logic
  platformRole?: string;
  supportLevel?: number;
  firstName: string;
  lastName: string;
  permissions?: string[];
  mustChangePassword?: boolean;
  directorType?: string;
}

export interface AuthenticatedRequest extends Request {
  user: UserPayload;
}
