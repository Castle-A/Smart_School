import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { ISchoolUserRepository } from '../../domain/school/school.entity';
import { SchoolUser } from '../../domain/school/school.entity';

@Injectable()
export class PrismaSchoolUserRepository implements ISchoolUserRepository {
    constructor(private prisma: PrismaService) { }

    async create(schoolUser: SchoolUser): Promise<SchoolUser> {
        const created = await this.prisma.schoolUser.create({
            data: {
                userId: schoolUser.userId,
                schoolId: schoolUser.schoolId,
                role: schoolUser.role as any,
            },
        });
        return new SchoolUser(created);
    }

    async findByUserId(userId: string): Promise<SchoolUser[]> {
        const schoolUsers = await this.prisma.schoolUser.findMany({
            where: { userId },
            include: { permissions: true },
        });
        return schoolUsers.map(su => new SchoolUser({
            ...su,
            permissions: su.permissions.map(p => p.code),
        }));
    }

    async findBySchoolId(schoolId: string): Promise<SchoolUser[]> {
        const schoolUsers = await this.prisma.schoolUser.findMany({
            where: { schoolId },
            include: { permissions: true, user: true },
        });
        return schoolUsers.map(su => new SchoolUser({
            ...su,
            permissions: su.permissions.map(p => p.code),
        }));
    }

    async addPermission(schoolUserId: string, permission: string): Promise<void> {
        await this.prisma.permission.create({
            data: {
                code: permission,
                schoolUserId,
            },
        });
    }

    async removePermission(schoolUserId: string, permission: string): Promise<void> {
        await this.prisma.permission.deleteMany({
            where: {
                schoolUserId,
                code: permission,
            },
        });
    }

    async getPermissions(schoolUserId: string): Promise<string[]> {
        const permissions = await this.prisma.permission.findMany({
            where: { schoolUserId },
        });
        return permissions.map(p => p.code);
    }
}
