import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from '../../interface/school/school.controller';
import { PrismaSchoolRepository } from '../../infrastructure/school/prisma-school.repository';
import { PrismaSchoolUserRepository } from '../../infrastructure/school/prisma-school-user.repository';
import { ConfigurationService } from './configuration.service';
import { ConfigurationController } from '../../interface/school/configuration.controller';
import { StorageModule } from '../../infrastructure/storage/storage.module';

import { SupportModule } from '../support/support.module';

@Module({
  imports: [StorageModule, SupportModule],
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
