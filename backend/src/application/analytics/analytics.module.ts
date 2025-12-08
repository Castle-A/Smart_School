
import { forwardRef, Module } from '@nestjs/common';
import { AnalyticsController } from '../../interface/analytics/analytics.controller';
import { AnalyticsService } from './analytics.service';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [PrismaModule, forwardRef(() => AuthModule)],
    controllers: [AnalyticsController],
    providers: [AnalyticsService],
    exports: [AnalyticsService],
})
export class AnalyticsModule { }
