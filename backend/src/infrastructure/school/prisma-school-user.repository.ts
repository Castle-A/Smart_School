import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { ISchoolUserRepository } from '../../domain/school/school.entity';
import { SchoolUser } from '../../domain/school/school.entity';

@Injectable()
export class PrismaSchoolUserRepository implements ISchoolUserRepository {
  constructor(private prisma: PrismaService) {}

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
      include: {
        rolePermissions: {
          include: {
            permissionDefinition: true,
          },
        },
      },
    });
    return schoolUsers.map(
      (su) =>
        new SchoolUser({
          ...su,
          permissions: su.rolePermissions.map(
            (rp) => rp.permissionDefinition.code,
          ),
        }),
    );
  }

  async findBySchoolId(schoolId: string): Promise<SchoolUser[]> {
    const schoolUsers = await this.prisma.schoolUser.findMany({
      where: { schoolId },
      include: {
        rolePermissions: {
          include: {
            permissionDefinition: true,
          },
        },
        user: true,
      },
    });
    return schoolUsers.map(
      (su) =>
        new SchoolUser({
          ...su,
          permissions: su.rolePermissions.map(
            (rp) => rp.permissionDefinition.code,
          ),
        }),
    );
  }

  async addPermission(
    schoolUserId: string,
    permissionCode: string,
  ): Promise<void> {
    const permissionDef = await this.prisma.permissionDefinition.findUnique({
      where: { code: permissionCode },
    });

    if (permissionDef) {
      await this.prisma.rolePermission.create({
        data: {
          schoolUserId,
          permissionDefinitionId: permissionDef.id,
        },
      });
    }
  }

  async removePermission(
    schoolUserId: string,
    permissionCode: string,
  ): Promise<void> {
    const permissionDef = await this.prisma.permissionDefinition.findUnique({
      where: { code: permissionCode },
    });

    if (permissionDef) {
      await this.prisma.rolePermission.deleteMany({
        where: {
          schoolUserId,
          permissionDefinitionId: permissionDef.id,
        },
      });
    }
  }

  async getPermissions(schoolUserId: string): Promise<string[]> {
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: { schoolUserId },
      include: { permissionDefinition: true },
    });
    return rolePermissions.map((rp) => rp.permissionDefinition.code);
  }

  async findWithCursor(
    schoolId: string,
    query: { take?: number; cursor?: string; search?: string },
  ): Promise<{
    data: SchoolUser[];
    nextCursor?: string;
    hasMore: boolean;
    count: number;
  }> {
    const { take = 50, cursor, search } = query || {};

    // Récupération avec +1 pour détecter s'il y a une page suivante
    const members = await this.prisma.schoolUser.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where: {
        schoolId,
        deletedAt: null,
        ...(search
          ? {
              user: {
                OR: [
                  { firstName: { contains: search, mode: 'insensitive' } },
                  { lastName: { contains: search, mode: 'insensitive' } },
                  { email: { contains: search, mode: 'insensitive' } },
                ],
              },
            }
          : {}),
      },
      select: {
        id: true,
        userId: true,
        schoolId: true,
        role: true,
        // Optimized Select: Only fetch necessary User fields
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            profilePicture: true,
            phone: true,
          },
        },
      },
      orderBy: { user: { createdAt: 'desc' } },
    });

    const hasMore = members.length > take;
    const data = hasMore ? members.slice(0, -1) : members;
    const nextCursor = hasMore ? data[data.length - 1].id : undefined;

    return {
      data: data.map(
        (m) =>
          new SchoolUser({
            ...m,
            // Permissions not loaded here for perf, can be fetched if needed
            permissions: [],
          }),
      ),
      nextCursor,
      hasMore,
      count: data.length,
    };
  }
}
