import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { SupportService } from './support.service';
import { TicketAssignmentService } from './ticket-assignment.service';
import { SupportTemporaryAccessService } from './temporary-access.service';
import { SupportAuditService } from './support-audit.service';
import { TicketsController } from '../../interface/support/tickets.controller';
import { SupportController } from '../../interface/support/support.controller';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  providers: [
    TicketsService,
    SupportService,
    TicketAssignmentService,
    SupportTemporaryAccessService,
    SupportAuditService,
  ],
  controllers: [TicketsController, SupportController],
  exports: [
    TicketsService,
    SupportService,
    TicketAssignmentService,
    SupportTemporaryAccessService,
    SupportAuditService,
  ],
})
export class SupportModule { }
