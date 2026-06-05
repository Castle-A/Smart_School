import { Module } from '@nestjs/common';
import { AcademicCalendarService } from './academic-calendar.service';
import { AcademicCalendarController } from '../../interface/academic-calendar/academic-calendar.controller';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AdminRequestModule } from '../admin-requests/admin-requests.module';

import { SupportModule } from '../support/support.module';

@Module({
  imports: [PrismaModule, AdminRequestModule, SupportModule],
  providers: [AcademicCalendarService],
  controllers: [AcademicCalendarController],
  exports: [AcademicCalendarService],
})
export class AcademicCalendarModule { }
