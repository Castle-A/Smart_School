import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from '../../interface/students/students.controller';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AdminRequestModule } from '../admin-requests/admin-requests.module';

@Module({
    imports: [PrismaModule, AdminRequestModule],
    controllers: [StudentsController],
    providers: [StudentsService],
    exports: [StudentsService],
})
export class StudentsModule { }
