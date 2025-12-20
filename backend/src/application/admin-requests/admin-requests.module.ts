import { Module } from '@nestjs/common';
import { AdminRequestService } from './admin-requests.service';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AdminRequestController } from '../../interface/admin-requests/admin-requests.controller';

import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [AdminRequestController],
  providers: [AdminRequestService],
  exports: [AdminRequestService],
})
export class AdminRequestModule {}
