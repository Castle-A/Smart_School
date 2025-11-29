import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from '../../interface/school/school.controller';
import { PrismaSchoolRepository } from '../../infrastructure/school/prisma-school.repository';
import { PrismaSchoolUserRepository } from '../../infrastructure/school/prisma-school-user.repository';

@Module({
    controllers: [SchoolController],
    providers: [
        SchoolService,
        {
            provide: 'ISchoolRepository',
            useClass: PrismaSchoolRepository,
        },
        {
            provide: 'ISchoolUserRepository',
            useClass: PrismaSchoolUserRepository,
        },
    ],
    exports: [SchoolService],
})
export class SchoolModule { }
