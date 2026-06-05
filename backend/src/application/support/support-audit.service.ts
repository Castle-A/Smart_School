
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class SupportAuditService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Enregistre une action sensible effectuée par un agent de support.
     */
    async logAction(params: {
        agentId: string;
        action: string;
        entity: string;
        schoolId?: string;
        ticketId?: string;
        details?: any;
    }) {
        return (this.prisma as any).supportAuditLog.create({
            data: {
                agentId: params.agentId,
                action: params.action,
                entity: params.entity,
                schoolId: params.schoolId,
                ticketId: params.ticketId,
                details: params.details ? JSON.stringify(params.details) : null,
            },
        });
    }

    /**
     * Récupère les logs pour le SuperAdmin.
     */
    async getAuditLogs(filters: any = {}) {
        return (this.prisma as any).supportAuditLog.findMany({
            where: filters,
            include: {
                agent: { select: { email: true, firstName: true, lastName: true } },
                school: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}
