import { Module } from '@nestjs/common';
import { TimetableService } from './timetable.service';
import { TimetableController } from '../../interface/vie-scolaire/timetable.controller';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [TimetableService],
    controllers: [TimetableController],
    exports: [TimetableService],
})
export class TimetableModule { }
