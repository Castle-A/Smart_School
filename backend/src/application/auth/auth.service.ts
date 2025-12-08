import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { IAuthRepository } from '../../domain/auth/user.entity';
import { User } from '../../domain/auth/user.entity';
import { AnalyticsService } from '../analytics/analytics.service';
import { DIRECTOR_PERMISSIONS } from '../../shared/constants/permissions.constants';

@Injectable()
export class AuthService {
    constructor(
        @Inject('IAuthRepository') private readonly authRepository: IAuthRepository,
        private readonly jwtService: JwtService,
        private readonly analyticsService: AnalyticsService,
    ) { }

    // ... validateUser remains the same ...

    async validateUser(identifier: string, pass: string): Promise<any> {
        console.log(`[DEBUG] validateUser called for: ${identifier}`);
        const user = await this.authRepository.findByIdentifier(identifier);

        if (!user) {
            console.log('[DEBUG] User not found by identifier');
            return null;
        }

        console.log(`[DEBUG] User found: ${user.id}, Active: ${user.isActive}, Deleted: ${user.deletedAt}`);

        if (!user.password) {
            console.log('[DEBUG] User has no password');
            return null;
        }

        const isMatch = await bcrypt.compare(pass, user.password);
        console.log(`[DEBUG] Password check: InputLen=${pass.length}, HashLen=${user.password.length}, MATCH=${isMatch}`);

        // Check if user exists, has password, is NOT deleted, and is ACTIVE
        if (!user.deletedAt && user.isActive && isMatch) {
            const { password, ...result } = user;
            return result;
        }

        console.log('[DEBUG] Validation failed due to flags or mismatch');
        return null;
    }

    async login(user: any) {
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role, // Legacy
            schoolRole: user.schoolRole,
            schoolId: user.schoolId,
            schoolName: user.schoolName,
            platformRole: user.platformRole,
            gender: user.gender,
            firstName: user.firstName,
            lastName: user.lastName,
            permissions: user.permissions,
            directorType: user.directorType,
            mustChangePassword: user.mustChangePassword,
        };

        // Track Login Event
        try {
            await this.analyticsService.trackEvent({
                type: 'LOGIN',
                userId: user.id,
                schoolId: user.schoolId,
                metadata: { role: user.role, schoolRole: user.schoolRole },
            });
        } catch (error) {
            console.error('Failed to track login event:', error);
        }

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
        const existingUser = await this.authRepository.findByIdentifier(data.email);
        if (existingUser) {
            throw new UnauthorizedException('Un utilisateur avec cet email existe déjà.');
        }

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
                    termsAcceptedAt: new Date(), // Record Terms acceptance
                    termsVersion: '2025-01', // Current Terms version
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
            // Create founder permissions (Use ALL Director permissions as base for Founder)
            const founderPermissions = DIRECTOR_PERMISSIONS.map(p => p.code);

            // Assign permissions to founder
            for (const code of founderPermissions) {
                const permissionDef = await prisma.permissionDefinition.findUnique({
                    where: { code }
                });

                if (permissionDef) {
                    await prisma.rolePermission.create({
                        data: {
                            schoolUserId: schoolUser.id,
                            permissionDefinitionId: permissionDef.id,
                        },
                    });
                }
            }

            return { user, school, schoolUser };
        });

        return new User(result.user);
    }

    async changePassword(userId: string, currentPassword: string | undefined, newPassword: string) {
        const user = await this.authRepository.findById(userId);

        if (!user || !user.password) {
            throw new UnauthorizedException('User not found');
        }

        // Si l'utilisateur doit changer son mot de passe (première connexion après réinitialisation),
        // on ne vérifie pas l'ancien mot de passe
        if (!user.mustChangePassword) {
            // Vérifier l'ancien mot de passe uniquement si ce n'est pas une première connexion
            if (!currentPassword) {
                throw new UnauthorizedException('Current password is required');
            }
            const isValid = await bcrypt.compare(currentPassword, user.password);
            if (!isValid) {
                throw new UnauthorizedException('Current password is incorrect');
            }
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
