export class User {
    id: string;
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    gender?: string;
    phone?: string;
    role?: string; // Simplification pour le domain
    platformRole?: string;
    schoolRole?: string;
    schoolId?: string;
    schoolName?: string;
    directorType?: string;
    permissions?: string[];
    mustChangePassword: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
}

export interface IAuthRepository {
    findByEmail(email: string): Promise<User | null>;
    findByIdentifier(identifier: string): Promise<User | null>;
    create(user: User): Promise<User>;
    update(id: string, user: Partial<User>): Promise<User>;
    findById(id: string): Promise<User | null>;
}
