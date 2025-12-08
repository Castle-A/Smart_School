import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AuthModule } from './application/auth/auth.module';
import { SchoolModule } from './application/school/school.module';
import { MembersModule } from './application/members/members.module';
import { SupportModule } from './application/support/support.module';
import { NotificationsModule } from './application/notifications/notifications.module';
import { TeachersModule } from './application/teachers/teachers.module';
import { PlatformModule } from './application/platform/platform.module';
import { PermissionsModule } from './application/permissions/permissions.module';
import { AnalyticsModule } from './application/analytics/analytics.module';

import { ClassesModule } from './application/classes/classes.module';
import { ProfileModule } from './application/profile/profile.module';
import { SubjectsModule } from './application/subjects/subjects.module';
import { CleanupModule } from './application/cleanup/cleanup.module';

import { StudentsModule } from './application/students/students.module';
import { AdminRequestModule } from './application/admin-requests/admin-requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    SchoolModule,
    MembersModule,
    SupportModule,
    NotificationsModule,
    TeachersModule,
    PlatformModule,
    ClassesModule,
    PermissionsModule,
    ProfileModule,
    AnalyticsModule,
    SubjectsModule,
    CleanupModule,
    StudentsModule,
    AdminRequestModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
