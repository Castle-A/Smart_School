import { Module } from '@nestjs/common';
import { AcademicYearsService } from './academic-years.service';
import { YearTransitionService } from './year-transition.service';
import { AcademicYearsController } from '../../interface/academic-years/academic-years.controller';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AcademicYearsController],
    providers: [
        AcademicYearsService,
        YearTransitionService, // Nouveau service pour les transitions
    ],
    exports: [AcademicYearsService, YearTransitionService]
})
export class AcademicYearsModule { }
