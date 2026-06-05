import { Controller, Post, Get, Body, UseGuards, Request, Param, Patch } from '@nestjs/common';
import { TicketsService } from '../../application/support/tickets.service';
import { CreateTicketDto } from '../../application/support/dto/create-ticket.dto';
import { CreateTicketMessageDto } from '../../application/support/dto/create-ticket-message.dto';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TicketStatus } from '@prisma/client';

@ApiTags('Support')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('support/tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Post()
    @ApiOperation({ summary: 'Créer un nouveau ticket' })
    async create(@Request() req, @Body() dto: CreateTicketDto) {
        return this.ticketsService.createTicket(req.user.id, req.user.platformRole || 'SCHOOL_USER', dto);
    }

    @Get()
    @ApiOperation({ summary: 'Lister les tickets (filtre intelligent selon le rôle)' })
    async findAll(@Request() req) {
        return this.ticketsService.getTickets(req.user);
    }

    @Post(':id/messages')
    @ApiOperation({ summary: 'Ajouter un message à un ticket' })
    async addMessage(
        @Request() req,
        @Param('id') ticketId: string,
        @Body() dto: CreateTicketMessageDto,
    ) {
        return this.ticketsService.addMessage(req.user.id, { ...dto, ticketId });
    }

    @Get('user-context/:userId')
    @ApiOperation({ summary: 'Récupérer le contexte sécurisé d\'un utilisateur (Data Masking)' })
    async getContext(@Param('userId') userId: string) {
        return this.ticketsService.getSecureUserContext(userId);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Changer le statut d\'un ticket (Admin/Support)' })
    async updateStatus(
        @Request() req,
        @Param('id') ticketId: string,
        @Body('status') status: TicketStatus,
    ) {
        return this.ticketsService.updateTicketStatus(ticketId, status, req.user.id);
    }
}
