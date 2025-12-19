import { Module } from '@nestjs/common';
import { AppointmentController } from '../../interface/communication/appointment.controller';
import { AppointmentService } from './appointment.service';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [PrismaModule, NotificationsModule],
    controllers: [AppointmentController],
    providers: [AppointmentService],
    exports: [AppointmentService],
})
export class AppointmentModule { }
