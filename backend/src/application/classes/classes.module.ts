import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from '../../interface/classes/classes.controller';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

import { SupportModule } from '../support/support.module';

@Module({
  imports: [PrismaModule, NotificationsModule, SupportModule],
  controllers: [ClassesController],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule { }
