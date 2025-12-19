import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from '../../interface/school/school.controller';
import { PrismaSchoolRepository } from '../../infrastructure/school/prisma-school.repository';
import { PrismaSchoolUserRepository } from '../../infrastructure/school/prisma-school-user.repository';
import { ConfigurationService } from './configuration.service';
import { ConfigurationController } from '../../interface/school/configuration.controller';

@Module({
    controllers: [SchoolController, ConfigurationController],
    providers: [
        SchoolService,
        ConfigurationService,
        {
            provide: 'ISchoolRepository',
            useClass: PrismaSchoolRepository,
        },
        {
            provide: 'ISchoolUserRepository',
            useClass: PrismaSchoolUserRepository,
        },
    ],
    exports: [SchoolService, ConfigurationService],
})
export class SchoolModule { }
