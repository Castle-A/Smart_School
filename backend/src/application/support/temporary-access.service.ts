
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { TicketStatus } from '@prisma/client';

@Injectable()
export class SupportTemporaryAccessService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Crée un accès temporaire pour un agent sur une école liée à un ticket.
     * Durée par défaut: 2 heures.
     */
    async grantAccess(agentId: string, ticketId: string, durationHours = 2) {
        const ticket = await (this.prisma as any).ticket.findUnique({
            where: { id: ticketId },
            include: { school: true },
        });

        if (!ticket) throw new NotFoundException('Ticket introuvable');
        if (!ticket.schoolId) throw new ForbiddenException('Ce ticket n\'est pas lié à une école spécifique');

        // Vérifier si l'agent est bien l'assigné du ticket
        if (ticket.assigneeId !== agentId) {
            throw new ForbiddenException('Vous n\'êtes pas assigné à ce ticket');
        }

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + durationHours);

        return (this.prisma as any).supportTemporaryAccess.upsert({
            where: { ticketId },
            update: { expiresAt },
            create: {
                ticketId,
                agentId,
                schoolId: ticket.schoolId,
                expiresAt,
            },
        });
    }

    /**
     * Vérifie si un agent a un accès valide pour une école.
     */
    async hasAccess(agentId: string, schoolId: string): Promise<boolean> {
        const activeAccess = await (this.prisma as any).supportTemporaryAccess.findFirst({
            where: {
                agentId,
                schoolId,
                expiresAt: { gt: new Date() },
                ticket: {
                    status: { in: [TicketStatus.ASSIGNED, TicketStatus.IN_PROGRESS] },
                },
            },
        });

        return !!activeAccess;
    }

    /**
     * Révoque manuellement ou à la clôture du ticket.
     */
    async revokeAccess(ticketId: string) {
        return (this.prisma as any).supportTemporaryAccess.deleteMany({
            where: { ticketId },
        });
    }
}
