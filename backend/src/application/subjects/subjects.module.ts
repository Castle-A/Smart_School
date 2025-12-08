import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from '../../interface/subjects/subjects.controller';
import { PrismaSubjectsRepository } from '../../infrastructure/subjects/prisma-subjects.repository';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [SubjectsController],
    providers: [
        SubjectsService,
        {
            provide: 'ISubjectsRepository',
            useClass: PrismaSubjectsRepository,
        },
    ],
    exports: [SubjectsService],
})
export class SubjectsModule { }
