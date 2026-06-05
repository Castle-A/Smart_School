import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateTicketMessageDto } from './dto/create-ticket-message.dto';
import { TicketStatus, TicketPriority } from '@prisma/client';
import { TicketAssignmentService } from './ticket-assignment.service';

@Injectable()
export class TicketsService {
    private readonly logger = new Logger(TicketsService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly assignmentService: TicketAssignmentService,
    ) { }

    /**
     * Crée un nouveau ticket et déclenche l'assignation automatique.
     */
    async createTicket(userId: string, userRole: string, dto: CreateTicketDto) {
        const ticket = await (this.prisma as any).ticket.create({
            data: {
                subject: dto.subject,
                description: dto.description,
                type: dto.type,
                priority: dto.priority || TicketPriority.MEDIUM,
                creatorId: userId,
                creatorRole: userRole,
                schoolId: dto.schoolId,
                status: TicketStatus.OPEN,
                history: [
                    {
                        action: 'CREATED',
                        by: userId,
                        at: new Date().toISOString(),
                    }
                ]
            },
        });

        // Déclencher l'assignation automatique
        await this.assignmentService.assignTicket(ticket.id);

        return ticket;
    }

    /**
     * Ajoute un message. Si c'est un agent, possible de mettre en "interne".
     */
    async addMessage(userId: string, dto: CreateTicketMessageDto, isInternal = false) {
        const ticket = await (this.prisma as any).ticket.findUnique({
            where: { id: dto.ticketId },
        });

        if (!ticket) throw new NotFoundException('Ticket introuvable');

        return (this.prisma as any).ticketMessage.create({
            data: {
                content: dto.content,
                ticketId: dto.ticketId,
                senderId: userId,
                isInternal,
            },
        });
    }

    /**
     * Liste intelligente basée sur les permissions.
     */
    async getTickets(user: any) {
        const { id: userId, platformRole, schoolId } = user;

        // Rôles Plateforme (Support/SuperAdmin)
        if (platformRole === 'SUPER_ADMIN_PLATFORM') {
            return (this.prisma as any).ticket.findMany({
                include: { creator: true, school: true, assignee: true },
                orderBy: { updatedAt: 'desc' },
            });
        }

        if (platformRole === 'SUPPORT_TECH') {
            // Un agent de support ne voit QUE ses tickets assignés
            return (this.prisma as any).ticket.findMany({
                where: { assigneeId: userId },
                include: { creator: true, school: true },
                orderBy: { updatedAt: 'desc' },
            });
        }

        // Utilisateurs d'école (Directeur, etc.) - voient les tickets de leur école
        if (schoolId) {
            return (this.prisma as any).ticket.findMany({
                where: { schoolId },
                include: { creator: true },
                orderBy: { updatedAt: 'desc' },
            });
        }

        // Par défaut : créateur uniquement
        return (this.prisma as any).ticket.findMany({
            where: { creatorId: userId },
            orderBy: { updatedAt: 'desc' },
        });
    }

    /**
     * Vue 360° sécurisée avec Masquage.
     */
    async getSecureUserContext(targetUserId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: targetUserId },
            include: {
                schoolUsers: { include: { school: true } },
            },
        });

        if (!user) throw new NotFoundException('Utilisateur introuvable');

        return {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            role: user.platformRole || 'SCHOOL_USER',
            phone: this.maskString(user.phone || 'N/A'),
            email: this.maskEmail(user.email || ''),
            school: user.schoolUsers[0]?.school?.name || 'N/A',
            isActive: user.isActive,
        };
    }

    private maskString(str: string): string {
        if (str.length <= 4) return '••••';
        return `${str.slice(0, 3)} •••• ${str.slice(-2)}`;
    }

    private maskEmail(email: string): string {
        const [name, domain] = email.split('@');
        if (!domain) return '••••@••••';
        return `${name[0]}••••@${domain}`;
    }

    async updateTicketStatus(ticketId: string, status: TicketStatus, userId: string) {
        const ticket = await (this.prisma as any).ticket.findUnique({ where: { id: ticketId } });
        const history = (ticket.history as any[]) || [];

        history.push({
            action: `STATUS_CHANGED_TO_${status}`,
            by: userId,
            at: new Date().toISOString(),
        });

        return (this.prisma as any).ticket.update({
            where: { id: ticketId },
            data: {
                status,
                history,
                updatedAt: new Date()
            },
        });
    }
}
