
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { TicketStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class TicketAssignmentService {
    private readonly logger = new Logger(TicketAssignmentService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationsService: NotificationsService,
    ) { }

    /**
     * Automatiquement assigne un ticket à l'agent le moins chargé.
     */
    async assignTicket(ticketId: string) {
        this.logger.log(`🤖 Attempting to assign ticket ${ticketId}...`);

        try {
            // 1. Trouver les agents de support actifs (platformRole = SUPPORT_TECH or SUPER_ADMIN_PLATFORM)
            const agents = await this.prisma.user.findMany({
                where: {
                    isActive: true,
                    platformRole: { in: ['SUPPORT_TECH', 'SUPER_ADMIN_PLATFORM'] },
                },
                select: {
                    id: true,
                    email: true,
                    _count: {
                        select: {
                            assignedTickets: {
                                where: {
                                    status: { in: [TicketStatus.ASSIGNED, TicketStatus.IN_PROGRESS] },
                                },
                            },
                        },
                    },
                },
            });

            if (agents.length === 0) {
                this.logger.warn('⚠️ No active support agents found to assign the ticket.');
                return null;
            }

            // 2. Sélectionner l'agent avec le moins de tickets ouverts
            const sortedAgents = agents.sort((a, b) => a._count.assignedTickets - b._count.assignedTickets);
            const chosenAgent = sortedAgents[0];

            // 3. Mettre à jour le ticket
            const ticket = await (this.prisma as any).ticket.update({
                where: { id: ticketId },
                data: {
                    assigneeId: chosenAgent.id,
                    status: TicketStatus.ASSIGNED,
                    // On pourrait aussi ajouter une entrée dans l'historique ici
                    history: {
                        push: {
                            action: 'AUTOMATIC_ASSIGNMENT',
                            to: chosenAgent.email,
                            at: new Date().toISOString(),
                        }
                    }
                },
            });

            this.logger.log(`✅ Ticket ${ticketId} assigned to agent ${chosenAgent.email}`);

            // 4. Envoyer une notification interne à l'agent
            await this.notificationsService.create({
                userId: chosenAgent.id,
                type: 'SYSTEM',
                title: 'Nouveau ticket assigné',
                message: `Le ticket #${ticketId.slice(0, 8)} vous a été automatiquement assigné.`,
                link: `/inbox`, // Lien vers le cockpit support
            });

            return ticket;

        } catch (error) {
            this.logger.error(`❌ Failed to assign ticket ${ticketId}:`, error.message);
            throw error;
        }
    }

    /**
     * Logique d'escalade (N1 -> N2 ou SuperAdmin)
     */
    async escalateTicket(ticketId: string) {
        // TODO: Implement escalation levels logic
    }
}
