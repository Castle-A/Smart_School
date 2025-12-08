import { Module } from '@nestjs/common';
import { TeachersController } from '../../interface/teachers/teachers.controller';
import { TeachersService } from './teachers.service';
import { PrismaTeachersRepository } from '../../infrastructure/teachers/prisma-teachers.repository';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuditService } from '../../shared/services/audit.service';
import { MembersModule } from '../members/members.module';

@Module({
    imports: [PrismaModule, MembersModule],
    controllers: [TeachersController],
    providers: [
        TeachersService,
        AuditService,
        {
            provide: 'ITeachersRepository',
            useClass: PrismaTeachersRepository,
        },
    ],
    exports: [TeachersService, 'ITeachersRepository'],
})
export class TeachersModule { }
