import { Injectable, NotFoundException, ForbiddenException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { getDefaultPermissionsForRole, RoleType } from '../../shared/constants/permissions.constants';
import { PasswordUtil } from '../../shared/utils/password.util';

export interface CreateMemberDto {
    email?: string;
    phone: string;
    firstName: string;
    lastName: string;
    gender: string;
    role: string;
    loginMethod: 'email' | 'phone';
    schoolId: string;
    directorType?: string; // For DIRECTOR and SECRETARY
    permissionIds?: string[]; // Selected permission IDs (includes default + additional)
}

@Injectable()
export class MembersService {
    constructor(private prisma: PrismaService) { }

    private async validateRoleConstraints(schoolId: string, role: string, directorType?: string) {
        // Rôles uniques stricts
        if (['CENSOR', 'SUPERVISOR', 'ACCOUNTANT'].includes(role)) {
            const count = await this.prisma.schoolUser.count({
                where: {
                    schoolId,
                    role,
                    deletedAt: null
                }
            });
            if (count > 0) {
                throw new ConflictException(`Un seul membre avec le rôle ${role} est autorisé par école.`);
            }
        }

        // Rôles avec types (Directeur / Secrétaire)
        if (['DIRECTOR', 'SECRETARY'].includes(role)) {
            const existingUsers = await this.prisma.schoolUser.findMany({
                where: {
                    schoolId,
                    role,
                    deletedAt: null
                },
                select: { directorType: true }
            });

            if (existingUsers.length > 0) {
                // Si on essaie de créer un 'BOTH', c'est interdit s'il y a déjà quelqu'un
                if (directorType === 'BOTH') {
                    throw new ConflictException(`Un membre de type BOTH ne peut être créé s'il existe déjà d'autres membres de ce rôle.`);
                }

                // Vérifier les conflits existants
                const hasBoth = existingUsers.some(u => u.directorType === 'BOTH');
                if (hasBoth) {
                    throw new ConflictException(`Impossible de créer ce membre car un membre de type BOTH existe déjà.`);
                }

                const hasSameType = existingUsers.some(u => u.directorType === directorType);
                if (hasSameType) {
                    throw new ConflictException(`Un membre de type ${directorType} existe déjà pour ce rôle.`);
                }

                // Si on a déjà 2 membres (ex: PRIMARY et COLLEGE), on ne peut plus en ajouter
                if (existingUsers.length >= 2) {
                    throw new ConflictException(`Le nombre maximum de membres pour ce rôle est atteint (un par cycle).`);
                }
            }
        }
    }

    async createMember(dto: CreateMemberDto, tempPassword: string) {
        // Check if user already exists
        if (dto.email) {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: dto.email },
            });

            if (existingUser) {
                throw new ConflictException('Un utilisateur avec cet email existe déjà');
            }
        }

        // Validate directorType for DIRECTOR role
        if (dto.role === 'DIRECTOR' && !dto.directorType) {
            throw new BadRequestException('Le type de directeur est requis pour le rôle DIRECTEUR');
        }

        // Validate directorType for SECRETARY role (optional but if provided must be valid)
        if (dto.role === 'SECRETARY' && dto.directorType &&
            !['PRIMARY_PRESCHOOL', 'COLLEGE', 'BOTH'].includes(dto.directorType)) {
            throw new BadRequestException('Type de directeur invalide pour le secrétaire');
        }

        // Validation des contraintes de rôle (Unicité, Cycles)
        await this.validateRoleConstraints(dto.schoolId, dto.role, dto.directorType);

        // Hashage du mot de passe temporaire
        const hashedPassword = await PasswordUtil.hash(tempPassword);

        // Use transaction to create User, SchoolUser, and RolePermissions
        const result = await this.prisma.$transaction(async (prisma) => {
            // Create User
            const user = await prisma.user.create({
                data: {
                    email: dto.email,
                    phone: dto.phone,
                    password: hashedPassword,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    gender: dto.gender,
                    loginMethod: dto.loginMethod,
                    mustChangePassword: true,
                },
            });

            // Create SchoolUser
            const schoolUser = await prisma.schoolUser.create({
                data: {
                    userId: user.id,
                    schoolId: dto.schoolId,
                    role: dto.role.toUpperCase(),
                    directorType: dto.directorType,
                },
            });

            // Assign permissions: use provided IDs OR default permissions for the role
            let permissionsToAssign: string[] = [];

            if (dto.permissionIds && dto.permissionIds.length > 0) {
                permissionsToAssign = dto.permissionIds;
            } else {
                // Get default permissions for the role
                const defaultPermissions = getDefaultPermissionsForRole(dto.role as RoleType);
                const defaultCodes = defaultPermissions.map(p => p.code);

                if (defaultCodes.length > 0) {
                    // Find IDs for these codes
                    const definitions = await prisma.permissionDefinition.findMany({
                        where: {
                            code: { in: defaultCodes }
                        },
                        select: { id: true }
                    });
                    permissionsToAssign = definitions.map(d => d.id);
                }
            }

            if (permissionsToAssign.length > 0) {
                await prisma.rolePermission.createMany({
                    data: permissionsToAssign.map(permissionId => ({
                        schoolUserId: schoolUser.id,
                        permissionDefinitionId: permissionId,
                    })),
                });
            }

            return { user, schoolUser };
        });

        return {
            id: result.user.id,
            email: result.user.email,
            phone: result.user.phone,
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            role: result.schoolUser.role,
            directorType: result.schoolUser.directorType,
            loginMethod: dto.loginMethod,
        };
    }

    async getMembersBySchool(schoolId: string) {
        const schoolUsers = await this.prisma.schoolUser.findMany({
            where: {
                schoolId,
                deletedAt: null,
                role: {
                    in: ['DIRECTOR', 'SECRETARY', 'SUPERVISOR', 'CENSOR', 'ACCOUNTANT'],
                },
            },
            include: {
                user: true,
            },
        });

        // Récupérer les dernières connexions
        const userIds = schoolUsers.map(su => su.user.id);
        const lastLogins = await this.prisma.analyticsEvent.groupBy({
            by: ['userId'],
            _max: { timestamp: true },
            where: {
                userId: { in: userIds },
                type: 'LOGIN'
            }
        });

        // Créer une map pour accès rapide
        const lastLoginMap = new Map();
        lastLogins.forEach(log => {
            if (log.userId && log._max.timestamp) {
                lastLoginMap.set(log.userId, log._max.timestamp);
            }
        });

        return schoolUsers.map(su => ({
            id: su.user.id,
            email: su.user.email,
            phone: su.user.phone,
            firstName: su.user.firstName,
            lastName: su.user.lastName,
            gender: su.user.gender,
            role: su.role,
            directorType: su.directorType,
            createdAt: su.user.createdAt,
            mustChangePassword: su.user.mustChangePassword,
            isActive: su.user.isActive,
            loginMethod: su.user.loginMethod,
            lastLogin: lastLoginMap.get(su.user.id) || null
        }));
    }

    async resetMemberPassword(userId: string, tempPassword: string, schoolId: string) {
        // Verify user belongs to the school
        const schoolUser = await this.prisma.schoolUser.findFirst({
            where: { userId, schoolId, deletedAt: null },
        });

        if (!schoolUser) {
            throw new NotFoundException('Member not found in this school');
        }

        const hashedPassword = await PasswordUtil.hash(tempPassword);
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
                mustChangePassword: true,
            },
        });
    }

    async toggleMemberStatus(userId: string, schoolId: string) {
        // Verify user belongs to the school
        const schoolUser = await this.prisma.schoolUser.findFirst({
            where: { userId, schoolId, deletedAt: null },
        });

        if (!schoolUser) {
            throw new NotFoundException('Member not found in this school');
        }

        // Get current user status
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Toggle isActive status
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                isActive: !user.isActive,
            },
        });

        return {
            userId: updatedUser.id,
            isActive: updatedUser.isActive,
        };
    }

    async updateMemberPermissions(userId: string, permissionIds: string[], schoolId: string, directorType?: string) {
        // Verify user belongs to the school
        const schoolUser = await this.prisma.schoolUser.findFirst({
            where: { userId, schoolId, deletedAt: null },
        });

        if (!schoolUser) {
            throw new NotFoundException('Member not found in this school');
        }

        // Validate directorType if provided
        if (directorType && !['PRIMARY_PRESCHOOL', 'COLLEGE', 'BOTH'].includes(directorType)) {
            throw new BadRequestException('Invalid director type');
        }

        // Update directorType and permissions in transaction
        await this.prisma.$transaction(async (prisma) => {
            // Update directorType if provided
            if (directorType !== undefined) {
                await prisma.schoolUser.update({
                    where: { id: schoolUser.id },
                    data: { directorType },
                });
            }

            // Delete all current permissions
            await prisma.rolePermission.deleteMany({
                where: { schoolUserId: schoolUser.id },
            });

            // Create new permissions
            if (permissionIds && permissionIds.length > 0) {
                await prisma.rolePermission.createMany({
                    data: permissionIds.map(permissionId => ({
                        schoolUserId: schoolUser.id,
                        permissionDefinitionId: permissionId,
                    })),
                });
            }
        });

        return { success: true };
    }

    async getMemberPermissions(userId: string, schoolId: string) {
        const schoolUser = await this.prisma.schoolUser.findFirst({
            where: { userId, schoolId, deletedAt: null },
            include: {
                rolePermissions: {
                    include: {
                        permissionDefinition: true,
                    },
                },
            },
        });

        if (!schoolUser) {
            throw new NotFoundException('Member not found in this school');
        }

        return schoolUser.rolePermissions.map(rp => rp.permissionDefinition.id);
    }

    async deleteMember(userId: string, schoolId: string) {
        // Verify user belongs to the school
        const schoolUser = await this.prisma.schoolUser.findFirst({
            where: { userId, schoolId, deletedAt: null },
        });

        if (!schoolUser) {
            throw new NotFoundException('Member not found in this school');
        }

        // Soft Delete in transaction
        await this.prisma.$transaction(async (prisma) => {
            // Soft Delete SchoolUser relationship
            await prisma.schoolUser.update({
                where: { id: schoolUser.id },
                data: { deletedAt: new Date() }
            });

            // Check if user has other ACTIVE school relationships
            const otherSchools = await prisma.schoolUser.count({
                where: {
                    userId,
                    deletedAt: null,
                    NOT: { id: schoolUser.id }
                },
            });

            // If no other active schools, soft delete the user
            if (otherSchools === 0) {
                await prisma.user.update({
                    where: { id: userId },
                    data: { deletedAt: new Date(), isActive: false }
                });
            }
        });
    }
    async updateMemberSalary(userId: string, schoolId: string, monthlySalary: number) {
        const schoolUser = await this.prisma.schoolUser.findFirst({
            where: { userId, schoolId, deletedAt: null },
        });

        if (!schoolUser) throw new NotFoundException('Member not found in this school');

        return this.prisma.schoolUser.update({
            where: { id: schoolUser.id },
            data: { monthlySalary }
        });
    }
}
