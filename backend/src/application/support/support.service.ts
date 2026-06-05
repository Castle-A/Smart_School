import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { SupportTemporaryAccessService } from './temporary-access.service';
import * as bcrypt from 'bcrypt';
import { SupportAuditService } from './support-audit.service';

@Injectable()
export class SupportService {
  constructor(
    private prisma: PrismaService,
    private temporaryAccessService: SupportTemporaryAccessService,
    private auditService: SupportAuditService,
  ) { }

  async createSupportAgent(data: { email: string; firstName: string; lastName: string; phone?: string }) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new ConflictException('Un utilisateur avec cet email existe déjà');

    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: hashedPassword,
        phone: data.phone,
        platformRole: 'SUPPORT_TECH',

        isActive: true,
      },
    });

    return { user, tempPassword };
  }

  async getSupportAgents() {
    return this.prisma.user.findMany({
      where: { platformRole: 'SUPPORT_TECH' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSchools() {
    const schools = await this.prisma.school.findMany({
      include: {
        _count: {
          select: { users: true, students: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return schools.map((school) => ({
      id: school.id,
      name: school.name,
      plan: school.plan,
      subscriptionStatus: school.subscriptionStatus,
      isActive: school.isActive,
      createdAt: school.createdAt,
      userCount: school._count.users,
      studentCount: school._count.students,
    }));
  }

  async getSchoolMeta(id: string) {
    const school = await this.prisma.school.findUnique({
      where: { id },
      include: {
        _count: {
          select: { users: true, students: true, classes: true },
        },
        users: {
          where: { role: 'FOUNDER' },
          select: { userId: true },
        },
      },
    });

    if (!school) {
      throw new NotFoundException('School not found');
    }

    return {
      ...school,
      stats: school._count,
      founderId: school.users[0]?.userId,
    };
  }

  async resetUserPassword(userId: string, adminId: string) {
    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    await this.prisma.$transaction(async (prisma) => {
      // Update user password
      await prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
          mustChangePassword: true,
        },
      });

      // Log the action
      await (prisma as any).supportLog.create({
        data: {
          supportId: adminId,
          action: 'RESET_PASSWORD',
          details: JSON.stringify({ targetUserId: userId }),
        },
      });
    });

    return { tempPassword };
  }

  async grantTemporaryAccess(agentId: string, ticketId: string) {
    return this.temporaryAccessService.grantAccess(agentId, ticketId);
  }

  async revokeTemporaryAccess(ticketId: string) {
    return this.temporaryAccessService.revokeAccess(ticketId);
  }

  async getAuditLogs(filters: any = {}) {
    return this.auditService.getAuditLogs(filters);
  }
}
