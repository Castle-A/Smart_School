import { Module } from '@nestjs/common';
import { PlatformController } from '../../interface/platform/platform.controller';
import { PlatformService } from './platform.service';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuditService } from '../../shared/services/audit.service';
import { DataMaskingService } from '../../shared/services/data-masking.service';

@Module({
  imports: [PrismaModule],
  controllers: [PlatformController],
  providers: [PlatformService, AuditService, DataMaskingService],
  exports: [PlatformService],
})
export class PlatformModule {}
