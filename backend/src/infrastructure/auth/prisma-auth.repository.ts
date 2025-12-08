import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IAuthRepository } from '../../domain/auth/user.entity';
import { User } from '../../domain/auth/user.entity';

@Injectable()
export class PrismaAuthRepository implements IAuthRepository {
    constructor(private prisma: PrismaService) { }

    // Helper to convert Prisma null to undefined
    private toDomain(prismaUser: any): User {
        // Extract role from the first schoolUser entry if available
        const schoolUser = prismaUser.schoolUsers?.[0];
        const schoolRole = schoolUser?.role;
        const schoolId = schoolUser?.schoolId;

        // Extract permissions
        const permissions = schoolUser?.rolePermissions?.map((rp: any) => rp.permissionDefinition.code) || [];

        return new User({
            ...prismaUser,
            gender: prismaUser.gender ?? undefined,
            phone: prismaUser.phone ?? undefined,
            role: schoolRole, // Legacy support
            schoolRole: schoolRole,
            schoolId: schoolId,
            schoolName: schoolUser?.school?.name,
            directorType: schoolUser?.directorType,
            permissions: permissions,
            platformRole: prismaUser.platformRole ?? undefined,
            deletedAt: prismaUser.deletedAt ?? undefined,
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                schoolUsers: {
                    include: {
                        school: {
                            select: { name: true }
                        },
                        rolePermissions: {
                            include: {
                                permissionDefinition: true
                            }
                        }
                    }
                }
            }
        });
        if (!user) return null;
        return this.toDomain(user);
    }

    async findByIdentifier(identifier: string): Promise<User | null> {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { phone: identifier }
                ]
            },
            include: {
                schoolUsers: {
                    include: {
                        school: {
                            select: { name: true }
                        },
                        rolePermissions: {
                            include: {
                                permissionDefinition: true
                            }
                        }
                    }
                }
            }
        });
        if (!user) return null;
        return this.toDomain(user);
    }

    async create(user: User): Promise<User> {
        const created = await this.prisma.user.create({
            data: {
                email: user.email,
                password: user.password!,
                firstName: user.firstName,
                lastName: user.lastName,
                gender: user.gender,
                phone: user.phone,
                mustChangePassword: user.mustChangePassword,
            },
            include: { schoolUsers: true }
        });
        return this.toDomain(created);
    }

    async update(id: string, user: Partial<User>): Promise<User> {
        const updated = await this.prisma.user.update({
            where: { id },
            data: user,
            include: { schoolUsers: true }
        });
        return this.toDomain(updated);
    }

    async findById(id: string): Promise<User | null> {
        const found = await this.prisma.user.findUnique({
            where: { id },
            include: { schoolUsers: true }
        });
        if (!found) return null;
        return this.toDomain(found);
    }
}
