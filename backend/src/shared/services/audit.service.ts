import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

export interface AuditLogData {
    userId: string;
    schoolId?: string;
    action: string;
    entity: string;
    entityId?: string;
    oldValue?: any;
    newValue?: any;
    ipAddress?: string;
    userAgent?: string;
    metadata?: any;
}

@Injectable()
export class AuditService {
    constructor(private prisma: PrismaService) { }

    async log(data: AuditLogData): Promise<void> {
        try {
            await this.prisma.auditLog.create({
                data: {
                    userId: data.userId,
                    schoolId: data.schoolId || null,
                    action: data.action,
                    entity: data.entity,
                    entityId: data.entityId || null,
                    oldValue: data.oldValue ? JSON.stringify(data.oldValue) : null,
                    newValue: data.newValue ? JSON.stringify(data.newValue) : null,
                    ipAddress: data.ipAddress || null,
                    userAgent: data.userAgent || null,
                    metadata: data.metadata ? JSON.stringify(data.metadata) : null,
                },
            });
        } catch (error) {
            console.error('Failed to create audit log:', error);
            // Don't throw - audit logging should not break the main flow
        }
    }

    async logSupportAction(data: {
        supportId: string;
        schoolId?: string;
        action: string;
        details?: any;
    }): Promise<void> {
        try {
            await this.prisma.supportLog.create({
                data: {
                    supportId: data.supportId,
                    schoolId: data.schoolId || null,
                    action: data.action,
                    details: data.details ? JSON.stringify(data.details) : null,
                },
            });
        } catch (error) {
            console.error('Failed to create support log:', error);
        }
    }

    async getAuditLogs(filters: {
        userId?: string;
        schoolId?: string;
        action?: string;
        entity?: string;
        startDate?: Date;
        endDate?: Date;
        limit?: number;
    }) {
        const where: any = {};

        if (filters.userId) where.userId = filters.userId;
        if (filters.schoolId) where.schoolId = filters.schoolId;
        if (filters.action) where.action = filters.action;
        if (filters.entity) where.entity = filters.entity;

        if (filters.startDate || filters.endDate) {
            where.createdAt = {};
            if (filters.startDate) where.createdAt.gte = filters.startDate;
            if (filters.endDate) where.createdAt.lte = filters.endDate;
        }

        return this.prisma.auditLog.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: filters.limit || 100,
        });
    }

    async getSupportLogs(filters: {
        supportId?: string;
        schoolId?: string;
        action?: string;
        limit?: number;
    }) {
        const where: any = {};

        if (filters.supportId) where.supportId = filters.supportId;
        if (filters.schoolId) where.schoolId = filters.schoolId;
        if (filters.action) where.action = filters.action;

        return this.prisma.supportLog.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: filters.limit || 100,
        });
    }
}
