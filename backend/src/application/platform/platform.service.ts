import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditService } from '../../shared/services/audit.service';
import { DataMaskingService } from '../../shared/services/data-masking.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PlatformService {
    constructor(
        private prisma: PrismaService,
        private auditService: AuditService,
        private dataMaskingService: DataMaskingService,
    ) { }

    /**
     * Get all schools (SUPER_ADMIN_PLATFORM only)
     */
    async getAllSchools(userId: string, platformRole: string) {
        if (platformRole !== 'SUPER_ADMIN_PLATFORM') {
            throw new ForbiddenException('Only SuperAdmin can view all schools');
        }

        const schools = await this.prisma.school.findMany({
            include: {
                _count: {
                    select: {
                        users: true,
                        students: true,
                        teachers: true,
                        classes: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Log action
        await this.auditService.log({
            userId,
            action: 'VIEW_ALL_SCHOOLS',
            entity: 'School',
            metadata: { count: schools.length },
        });

        // Mask sensitive data
        return schools.map(school => this.dataMaskingService.maskSchoolData(school, platformRole));
    }

    /**
     * Get school details (SUPER_ADMIN_PLATFORM or SUPPORT_TECH)
     */
    async getSchoolDetails(schoolId: string, userId: string, platformRole: string) {
        if (platformRole !== 'SUPER_ADMIN_PLATFORM' && platformRole !== 'SUPPORT_TECH') {
            throw new ForbiddenException('Access denied');
        }

        const school = await this.prisma.school.findUnique({
            where: { id: schoolId },
            include: {
                _count: {
                    select: {
                        users: true,
                        students: true,
                        teachers: true,
                        classes: true,
                        subjects: true,
                    },
                },
                users: {
                    select: {
                        id: true,
                        role: true,
                        user: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true,
                                createdAt: true,
                            },
                        },
                    },
                },
            },
        });

        if (!school) {
            throw new NotFoundException('School not found');
        }

        // Log action
        await this.auditService.logSupportAction({
            supportId: userId,
            schoolId,
            action: 'VIEW_SCHOOL_DETAILS',
        });

        // Mask sensitive data
        return this.dataMaskingService.maskSchoolData(school, platformRole);
    }

    /**
     * Get school users (SUPER_ADMIN_PLATFORM or SUPPORT_TECH)
     */
    async getSchoolUsers(schoolId: string, userId: string, platformRole: string) {
        if (platformRole !== 'SUPER_ADMIN_PLATFORM' && platformRole !== 'SUPPORT_TECH') {
            throw new ForbiddenException('Access denied');
        }

        const users = await this.prisma.schoolUser.findMany({
            where: { schoolId },
            include: {
                user: true,
                rolePermissions: {
                    include: {
                        permissionDefinition: true
                    }
                },
            },
        });

        // Log action
        await this.auditService.logSupportAction({
            supportId: userId,
            schoolId,
            action: 'VIEW_SCHOOL_USERS',
            details: { userCount: users.length },
        });

        // Mask sensitive data
        return users.map(su => ({
            ...su,
            user: this.dataMaskingService.maskUserData(su.user, platformRole),
        }));
    }

    /**
     * Reset user password (SUPPORT_TECH or SUPER_ADMIN_PLATFORM)
     */
    async resetUserPassword(targetUserId: string, supportUserId: string, platformRole: string) {
        if (platformRole !== 'SUPER_ADMIN_PLATFORM' && platformRole !== 'SUPPORT_TECH') {
            throw new ForbiddenException('Access denied');
        }

        const user = await this.prisma.user.findUnique({
            where: { id: targetUserId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Generate temporary password
        const tempPassword = this.generateTempPassword();
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // Update user
        await this.prisma.user.update({
            where: { id: targetUserId },
            data: {
                password: hashedPassword,
                mustChangePassword: true,
            },
        });

        // Log action
        await this.auditService.logSupportAction({
            supportId: supportUserId,
            action: 'RESET_PASSWORD',
            details: { targetUserId },
        });

        await this.auditService.log({
            userId: supportUserId,
            action: 'PASSWORD_RESET_BY_SUPPORT',
            entity: 'User',
            entityId: targetUserId,
        });

        return { tempPassword };
    }

    /**
     * Reactivate blocked account (SUPPORT_TECH or SUPER_ADMIN_PLATFORM)
     */
    async reactivateAccount(targetUserId: string, supportUserId: string, platformRole: string) {
        if (platformRole !== 'SUPER_ADMIN_PLATFORM' && platformRole !== 'SUPPORT_TECH') {
            throw new ForbiddenException('Access denied');
        }

        const user = await this.prisma.user.findUnique({
            where: { id: targetUserId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Reactivate user (assuming there's an isActive field or similar)
        // For now, we'll just reset mustChangePassword
        await this.prisma.user.update({
            where: { id: targetUserId },
            data: {
                mustChangePassword: false,
            },
        });

        // Log action
        await this.auditService.logSupportAction({
            supportId: supportUserId,
            action: 'REACTIVATE_ACCOUNT',
            details: { targetUserId },
        });

        return { success: true };
    }

    /**
     * Get school diagnostics (SUPER_ADMIN_PLATFORM or SUPPORT_TECH)
     */
    async getSchoolDiagnostics(schoolId: string, userId: string, platformRole: string) {
        if (platformRole !== 'SUPER_ADMIN_PLATFORM' && platformRole !== 'SUPPORT_TECH') {
            throw new ForbiddenException('Access denied');
        }

        const school = await this.prisma.school.findUnique({
            where: { id: schoolId },
            include: {
                _count: {
                    select: {
                        users: true,
                        students: true,
                        teachers: true,
                        classes: true,
                        subjects: true,
                    },
                },
            },
        });

        if (!school) {
            throw new NotFoundException('School not found');
        }

        // Run diagnostics
        const diagnostics = {
            schoolId: school.id,
            schoolName: school.name,
            plan: school.plan,
            isActive: school.isActive,
            issues: [] as string[],
            warnings: [] as string[],
            stats: school._count,
        };

        // Check for issues
        if (school._count.users === 0) {
            diagnostics.issues.push('No users in school');
        }

        if (school._count.teachers === 0) {
            diagnostics.warnings.push('No teachers registered');
        }

        if (school._count.classes === 0) {
            diagnostics.warnings.push('No classes created');
        }

        if (school._count.subjects === 0) {
            diagnostics.warnings.push('No subjects configured');
        }

        // Log action
        await this.auditService.logSupportAction({
            supportId: userId,
            schoolId,
            action: 'RUN_DIAGNOSTICS',
            details: diagnostics,
        });

        return diagnostics;
    }

    /**
     * Get audit logs (SUPER_ADMIN_PLATFORM only)
     */
    async getAuditLogs(filters: any, userId: string, platformRole: string) {
        if (platformRole !== 'SUPER_ADMIN_PLATFORM') {
            throw new ForbiddenException('Only SuperAdmin can view audit logs');
        }

        const logs = await this.auditService.getAuditLogs(filters);

        // Log action
        await this.auditService.log({
            userId,
            action: 'VIEW_AUDIT_LOGS',
            entity: 'AuditLog',
            metadata: { filters },
        });

        return logs;
    }

    /**
     * Get support logs (SUPER_ADMIN_PLATFORM only)
     */
    async getSupportLogs(filters: any, userId: string, platformRole: string) {
        if (platformRole !== 'SUPER_ADMIN_PLATFORM') {
            throw new ForbiddenException('Only SuperAdmin can view support logs');
        }

        const logs = await this.auditService.getSupportLogs(filters);

        // Log action
        await this.auditService.log({
            userId,
            action: 'VIEW_SUPPORT_LOGS',
            entity: 'SupportLog',
            metadata: { filters },
        });

        return logs;
    }

    /**
     * Update school subscription (SUPER_ADMIN_PLATFORM only)
     */
    async updateSchoolSubscription(
        schoolId: string,
        plan: string,
        status: string,
        userId: string,
        platformRole: string,
    ) {
        if (platformRole !== 'SUPER_ADMIN_PLATFORM') {
            throw new ForbiddenException('Only SuperAdmin can update subscriptions');
        }

        const oldSchool = await this.prisma.school.findUnique({
            where: { id: schoolId },
        });

        if (!oldSchool) {
            throw new NotFoundException('School not found');
        }

        const updatedSchool = await this.prisma.school.update({
            where: { id: schoolId },
            data: {
                plan,
                subscriptionStatus: status,
            },
        });

        // Log action
        await this.auditService.log({
            userId,
            schoolId,
            action: 'UPDATE_SUBSCRIPTION',
            entity: 'School',
            entityId: schoolId,
            oldValue: { plan: oldSchool.plan, status: oldSchool.subscriptionStatus },
            newValue: { plan, status },
        });

        return this.dataMaskingService.maskSchoolData(updatedSchool, platformRole);
    }

    private generateTempPassword(): string {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
        let password = '';
        for (let i = 0; i < 8; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }
}
