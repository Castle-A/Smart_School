import { Module } from '@nestjs/common';
import { CommunicationService } from './communication.service';
import { CommunicationController } from '../../interface/communication/communication.controller';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AppointmentModule } from './appointment.module';
import { SmsModule } from '../../infrastructure/sms/sms.module';
import { NotificationsGateway } from '../../infrastructure/websocket/notifications.gateway';
import { WebhookController } from '../../interface/webhooks/webhook.controller';

import { SupportModule } from '../support/support.module';

@Module({
  imports: [PrismaModule, NotificationsModule, AppointmentModule, SmsModule, SupportModule],
  providers: [CommunicationService, NotificationsGateway],
  controllers: [CommunicationController, WebhookController],
  exports: [CommunicationService, NotificationsGateway],
})
export class CommunicationModule { }
