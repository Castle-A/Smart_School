import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from '../../interface/notifications/notifications.controller';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [NotificationsController],
    providers: [NotificationsService],
    exports: [NotificationsService],
})
export class NotificationsModule { }
