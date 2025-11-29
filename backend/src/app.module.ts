import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './application/auth/auth.module';
import { SchoolModule } from './application/school/school.module';
import { MembersModule } from './application/members/members.module';
import { SupportModule } from './support/support.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule, SchoolModule, MembersModule, SupportModule, NotificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
