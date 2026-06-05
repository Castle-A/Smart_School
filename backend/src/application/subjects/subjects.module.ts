import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from '../../interface/subjects/subjects.controller';
import { PrismaSubjectsRepository } from '../../infrastructure/subjects/prisma-subjects.repository';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

import { SupportModule } from '../support/support.module';

@Module({
  imports: [PrismaModule, SupportModule],
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
