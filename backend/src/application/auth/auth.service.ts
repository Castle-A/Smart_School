import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { IAuthRepository } from '../../domain/auth/user.entity';
import { User } from '../../domain/auth/user.entity';

@Injectable()
export class AuthService {
    constructor(
        @Inject('IAuthRepository') private readonly authRepository: IAuthRepository,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.authRepository.findByEmail(email);
        if (user && user.password && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role, // Legacy
            schoolRole: user.schoolRole,
            schoolId: user.schoolId,
            platformRole: user.platformRole,
            gender: user.gender,
            firstName: user.firstName,
            lastName: user.lastName,
            mustChangePassword: user.mustChangePassword,
        };
        return {
            access_token: this.jwtService.sign(payload),
            mustChangePassword: user.mustChangePassword,
        };
    }

    async registerFounder(data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        gender?: string;
        phone?: string;
        schoolName: string;
        schoolAddress?: string;
        schoolPhone?: string;
        schoolEmail?: string;
        schoolCycles?: string[];
    }) {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Use Prisma transaction to create School, User, and SchoolUser atomically
        const result = await this.authRepository['prisma'].$transaction(async (prisma) => {
            // Create the school
            const school = await prisma.school.create({
                data: {
                    name: data.schoolName,
                    address: data.schoolAddress,
                    phone: data.schoolPhone,
                    email: data.schoolEmail,
                    cycles: data.schoolCycles?.join(','), // Store as comma-separated string
                },
            });

            // Create the user (founder)
            const user = await prisma.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    gender: data.gender,
                    phone: data.phone,
                    mustChangePassword: false, // Founder creates their own password
                },
            });

            // Create SchoolUser relationship with FOUNDER role
            const schoolUser = await prisma.schoolUser.create({
                data: {
                    userId: user.id,
                    schoolId: school.id,
                    role: 'FOUNDER',
                },
            });

            // Create founder permissions (full access)
            const founderPermissions = [
                'calendar.manage',
                'finance.view',
                'finance.manage',
                'students.manage',
                'staff.manage',
                'settings.manage',
            ];

            await prisma.permission.createMany({
                data: founderPermissions.map(code => ({
                    code,
                    schoolUserId: schoolUser.id,
                })),
            });

            return { user, school, schoolUser };
        });

        return new User(result.user);
    }

    async changePassword(userId: string, currentPassword: string, newPassword: string) {
        const user = await this.authRepository.findById(userId);

        if (!user || !user.password) {
            throw new UnauthorizedException('User not found');
        }

        // Vérifier l'ancien mot de passe
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            throw new UnauthorizedException('Current password is incorrect');
        }

        // Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Mettre à jour l'utilisateur
        await this.authRepository.update(userId, {
            password: hashedPassword,
            mustChangePassword: false,
        });
    }
}
