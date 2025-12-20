import { Module } from '@nestjs/common';
import { SanctionsService } from './sanctions/sanctions.service';
import { SanctionsController } from '../../interface/vie-scolaire/sanctions.controller';
import { RewardsService } from './rewards/rewards.service';
import { RewardsController } from '../../interface/vie-scolaire/rewards.controller';
import { IncidentsService } from './incidents/incidents.service';
import { IncidentsController } from '../../interface/vie-scolaire/incidents.controller';
import { AttendanceService } from './attendance/attendance.service';
import { AttendanceController } from '../../interface/vie-scolaire/attendance.controller';
import { BulletinService } from './bulletins/bulletin.service';
import { BulletinController } from '../../interface/vie-scolaire/bulletin.controller';
import { TimetableService } from './timetable/timetable.service';
import { TimetableController } from '../../interface/vie-scolaire/timetable.controller';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { CommunicationModule } from '../communication/communication.module';

@Module({
  imports: [PrismaModule, CommunicationModule],
  controllers: [
    SanctionsController,
    RewardsController,
    IncidentsController,
    AttendanceController,
    BulletinController,
    TimetableController,
  ],
  providers: [
    SanctionsService,
    RewardsService,
    IncidentsService,
    AttendanceService,
    BulletinService,
    TimetableService,
  ],
  exports: [
    SanctionsService,
    RewardsService,
    IncidentsService,
    AttendanceService,
    BulletinService,
    TimetableService,
  ],
})
export class VieScolaireModule {}
