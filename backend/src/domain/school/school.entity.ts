import {
  CursorPaginationQuery,
  CursorPaginationResult,
} from '../../shared/interfaces/cursor-pagination.interface';

export class School {
  id: string;
  name: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  plan: 'BASIC' | 'STANDARD' | 'PREMIUM';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<School>) {
    Object.assign(this, partial);
  }
}

export class SchoolUser {
  id: string;
  userId: string;
  schoolId: string;
  role: string;
  permissions: string[];
  user?: {
    firstName: string;
    lastName: string;
    email: string | null;
    // Add other fields as needed
  };

  constructor(partial: Partial<SchoolUser>) {
    Object.assign(this, partial);
  }
}

export interface ISchoolRepository {
  create(school: School): Promise<School>;
  findById(id: string): Promise<School | null>;
  findAll(): Promise<School[]>;
  update(id: string, data: Partial<School>): Promise<School>;
}

export interface ISchoolUserRepository {
  create(schoolUser: SchoolUser): Promise<SchoolUser>;
  findByUserId(userId: string): Promise<SchoolUser[]>;
  findBySchoolId(schoolId: string): Promise<SchoolUser[]>;
  addPermission(schoolUserId: string, permission: string): Promise<void>;
  removePermission(schoolUserId: string, permission: string): Promise<void>;
  getPermissions(schoolUserId: string): Promise<string[]>;
  findWithCursor(
    schoolId: string,
    query: CursorPaginationQuery,
  ): Promise<CursorPaginationResult<SchoolUser>>;
}
