import { Injectable, UnauthorizedException, Inject, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordUtil } from '../../shared/utils/password.util';
import type { IAuthRepository } from '../../domain/auth/user.entity';
import { User } from '../../domain/auth/user.entity';
import { AnalyticsService } from '../analytics/analytics.service';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CustomLogger } from '../../shared/logger/custom-logger.service';
import {
    DIRECTOR_PERMISSIONS,
    SECRETARY_PERMISSIONS,
    SUPERVISOR_PERMISSIONS,
    CENSOR_PERMISSIONS,
    ACCOUNTANT_PERMISSIONS
} from '../../shared/constants/permissions.constants';

@Injectable()
export class AuthService {
    private readonly logger = new CustomLogger();

    constructor(
        @Inject('IAuthRepository') private readonly authRepository: IAuthRepository,
        private readonly prisma: PrismaService, // Injection directe pour les transactions et requêtes globales
        private readonly jwtService: JwtService,
        private readonly analyticsService: AnalyticsService,
    ) { }

    /**
     * Valide un utilisateur via son email ou son numéro de téléphone.
     * Vérifie également le mot de passe et l'état du compte.
     */
    async validateUser(identifier: string, pass: string): Promise<any> {
        const user = await this.authRepository.findByIdentifier(identifier);

        if (!user) {
            return null;
        }

        if (!user.password) {
            return null;
        }

        // Vérification sécurisée du mot de passe
        const isMatch = await PasswordUtil.compare(pass, user.password);

        if (!isMatch) {
            return null;
        }

        // Vérification de l'état du compte (Sécurité)
        if (user.deletedAt) {
            throw new UnauthorizedException('Ce compte a été supprimé.');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('Votre compte est désactivé. Veuillez contacter l\'administration.');
        }

        const { password, ...result } = user;
        return { ...result, loginIdentifier: identifier };
    }

    /**
     * Génère un token JWT pour l'utilisateur authentifié.
     * Normalise les rôles et inclut les permissions.
     * Retourne le token (pour cookie) ET les données utilisateur (pour réponse).
     */
    async login(user: any) {
        // Normalisation des rôles (Gestion de l'historique français/anglais)
        let normalizedRole = user.role;
        if (user.role === 'CENSEUR') normalizedRole = 'CENSOR';
        if (user.role === 'SURVEILLANT') normalizedRole = 'SUPERVISOR';
        if (user.role === 'MAITRE') normalizedRole = 'TEACHER';
        if (user.role === 'DIRECTEUR') normalizedRole = 'DIRECTOR';

        const payload = {
            email: user.email,
            sub: user.id,
            role: normalizedRole,
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
            phone: user.phone,
            loginIdentifier: user.loginIdentifier,
        };

        // Enregistrement de l'événement de connexion (Analytics)
        try {
            await this.analyticsService.trackEvent({
                type: 'LOGIN',
                userId: user.id,
                schoolId: user.schoolId,
                metadata: { role: user.role, schoolRole: user.schoolRole },
            });
        } catch (error) {
            // Non critique, on log simplement (Master Observability)
            this.logger.warn(
                'Erreur non bloquante lors de l\'enregistrement analytics',
                'AuthService',
            );
        }

        // Clarification : Retour structuré avec token ET données utilisateur
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                userId: payload.sub,
                email: payload.email,
                firstName: payload.firstName,
                lastName: payload.lastName,
                role: payload.role,
                schoolRole: payload.schoolRole,
                platformRole: payload.platformRole,
                schoolId: payload.schoolId,
                schoolName: payload.schoolName,
                gender: payload.gender,
                directorType: payload.directorType,
                phone: payload.phone,
                permissions: payload.permissions,
                mustChangePassword: payload.mustChangePassword,
            },
            mustChangePassword: user.mustChangePassword,
        };
    }

    /**
     * Crée un compte fondateur et configure son école de manière atomique.
     */
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

        // Utilisation d'une transaction Prisma pour garantir l'intégrité des données
        const result = await this.prisma.$transaction(async (tx) => {
            // 1. Création de l'école
            const school = await tx.school.create({
                data: {
                    name: data.schoolName,
                    address: data.schoolAddress,
                    phone: data.schoolPhone,
                    email: data.schoolEmail,
                    cycles: data.schoolCycles?.join(','),
                },
            });

            // 2. Création de l'utilisateur fondateur
            const user = await tx.user.create({
                data: {
                    email: data.email,
                    password: await PasswordUtil.hash(data.password),
                    firstName: data.firstName,
                    lastName: data.lastName,
                    gender: data.gender,
                    phone: data.phone,
                    mustChangePassword: false,
                    termsAcceptedAt: new Date(),
                    termsVersion: '2025-01',
                },
            });

            // 3. Liaison utilisateur-école avec rôle FOUNDER
            const schoolUser = await tx.schoolUser.create({
                data: {
                    userId: user.id,
                    schoolId: school.id,
                    role: 'FOUNDER',
                },
            });

            // 4. Attribution de toutes les permissions (Super-Admin)
            const permissionCodes = new Set([
                ...DIRECTOR_PERMISSIONS.map(p => p.code),
                ...SECRETARY_PERMISSIONS.map(p => p.code),
                ...SUPERVISOR_PERMISSIONS.map(p => p.code),
                ...CENSOR_PERMISSIONS.map(p => p.code),
                ...ACCOUNTANT_PERMISSIONS.map(p => p.code)
            ]);
            const uniqueCodes = Array.from(permissionCodes);

            const permissionDefs = await tx.permissionDefinition.findMany({
                where: { code: { in: uniqueCodes } },
                select: { id: true }
            });

            if (permissionDefs.length > 0) {
                await tx.rolePermission.createMany({
                    data: permissionDefs.map(def => ({
                        schoolUserId: schoolUser.id,
                        permissionDefinitionId: def.id,
                    }))
                });
            }

            return { user, school, schoolUser };
        });

        return new User(result.user as any);
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
            const isValid = await PasswordUtil.compare(currentPassword, user.password);
            if (!isValid) {
                throw new UnauthorizedException('Current password is incorrect');
            }
        }

        try {
            // Hasher le nouveau mot de passe
            const hashedPassword = await PasswordUtil.hash(newPassword);

            // Mettre à jour l'utilisateur
            await this.authRepository.update(userId, {
                password: hashedPassword,
                mustChangePassword: false,
            });

            console.log(`[DEBUG] Password changed successfully for user ${userId}`);
        } catch (error) {
            this.logger.error(
                `[CRITICAL] Échec de la mise à jour du mot de passe pour l'utilisateur ${userId}`,
                error instanceof Error ? error.stack : String(error),
                'AuthService',
            );
            throw new InternalServerErrorException('Échec de la mise à jour du mot de passe.');
        }
    }
}
