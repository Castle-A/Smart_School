import { Injectable, Inject } from '@nestjs/common';
import type { ISchoolRepository, ISchoolUserRepository } from '../../domain/school/school.entity';
import { School, SchoolUser } from '../../domain/school/school.entity';
import { CursorPaginationQuery, CursorPaginationResult } from '../../shared/interfaces/cursor-pagination.interface';

@Injectable()
export class SchoolService {
    constructor(
        @Inject('ISchoolRepository') private readonly schoolRepository: ISchoolRepository,
        @Inject('ISchoolUserRepository') private readonly schoolUserRepository: ISchoolUserRepository,
    ) { }

    async createSchool(name: string, founderId: string): Promise<School> {
        // Créer l'école
        const school = new School({
            name,
            plan: 'BASIC',
            isActive: true,
        });

        const createdSchool = await this.schoolRepository.create(school);

        // Associer le fondateur à l'école
        const schoolUser = new SchoolUser({
            userId: founderId,
            schoolId: createdSchool.id,
            role: 'FOUNDER',
            permissions: [
                'calendar.manage',
                'communication.global',
                'classes.manage',
                'subjects.manage',
                'teachers.assign',
                'bulletins.validate',
                'finance.view',
                'subscription.manage',
            ],
        });

        await this.schoolUserRepository.create(schoolUser);

        // Ajouter les permissions
        for (const perm of schoolUser.permissions) {
            await this.schoolUserRepository.addPermission(schoolUser.id, perm);
        }

        return createdSchool;
    }

    async createStaffMember(
        schoolId: string,
        userId: string,
        role: string,
        permissions: string[] = []
    ): Promise<SchoolUser> {
        const schoolUser = new SchoolUser({
            userId,
            schoolId,
            role,
            permissions,
        });

        const created = await this.schoolUserRepository.create(schoolUser);

        // Ajouter les permissions
        for (const perm of permissions) {
            await this.schoolUserRepository.addPermission(created.id, perm);
        }

        return created;
    }

    /**
     * Récupère le personnel de l'école avec pagination par curseur (Master Performance).
     * Support de la recherche textuelle et pagination optimisée O(1).
     */
    async getSchoolStaff(
        schoolId: string,
        query?: CursorPaginationQuery
    ): Promise<CursorPaginationResult<SchoolUser>> {
        const { take = 50, cursor, search } = query || {};

        // Récupération avec +1 pour détecter s'il y a une page suivante
        const members = await this.schoolUserRepository['prisma'].schoolUser.findMany({
            take: take + 1,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            where: {
                schoolId,
                deletedAt: null,
                ...(search ? {
                    user: {
                        OR: [
                            { firstName: { contains: search, mode: 'insensitive' } },
                            { lastName: { contains: search, mode: 'insensitive' } },
                            { email: { contains: search, mode: 'insensitive' } },
                        ]
                    }
                } : {})
            },
            include: { user: true },
            orderBy: { createdAt: 'desc' },
        });

        const hasMore = members.length > take;
        const data = hasMore ? members.slice(0, -1) : members;
        const nextCursor = hasMore ? data[data.length - 1].id : undefined;

        return {
            data,
            nextCursor,
            hasMore,
            count: data.length,
        };
    }

    async getUserSchools(userId: string): Promise<SchoolUser[]> {
        return this.schoolUserRepository.findByUserId(userId);
    }

    async updatePermissions(schoolUserId: string, permissions: string[]): Promise<void> {
        // Récupérer les permissions actuelles
        const currentPermissions = await this.schoolUserRepository.getPermissions(schoolUserId);

        // Supprimer les permissions qui ne sont plus présentes
        for (const perm of currentPermissions) {
            if (!permissions.includes(perm)) {
                await this.schoolUserRepository.removePermission(schoolUserId, perm);
            }
        }

        // Ajouter les nouvelles permissions
        for (const perm of permissions) {
            if (!currentPermissions.includes(perm)) {
                await this.schoolUserRepository.addPermission(schoolUserId, perm);
            }
        }
    }

    async getSchoolInfo(schoolId: string) {
        const school = await this.schoolRepository['prisma'].school.findUnique({
            where: { id: schoolId },
            select: {
                id: true,
                name: true,
                logo: true,
                address: true,
                phone: true,
                email: true,
            },
        });

        if (!school) {
            throw new Error('School not found');
        }

        return school;
    }

    async updateSchoolLogo(schoolId: string, logoUrl: string, userId: string) {
        // Verify user is founder of this school
        const schoolUser = await this.schoolUserRepository['prisma'].schoolUser.findFirst({
            where: {
                userId,
                schoolId,
                role: 'FOUNDER',
            },
        });

        if (!schoolUser) {
            throw new Error('Only founder can update school logo');
        }

        const updatedSchool = await this.schoolRepository['prisma'].school.update({
            where: { id: schoolId },
            data: { logo: logoUrl },
        });

        return {
            id: updatedSchool.id,
            name: updatedSchool.name,
            logo: updatedSchool.logo,
        };
    }
}
