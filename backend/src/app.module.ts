import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransitionsModule } from './application/transitions/transitions.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrivacyInterceptor } from './shared/interceptors/privacy.interceptor';
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
import { SubscriptionsModule } from './application/subscriptions/subscriptions.module';

import { ClassesModule } from './application/classes/classes.module';
import { ProfileModule } from './application/profile/profile.module';
import { SubjectsModule } from './application/subjects/subjects.module';
import { CleanupModule } from './application/cleanup/cleanup.module';

import { StudentsModule } from './application/students/students.module';
import { AdminRequestModule } from './application/admin-requests/admin-requests.module';
import { VieScolaireModule } from './application/vie-scolaire/vie-scolaire.module';
import { FinanceModule } from './application/finance/finance.module';
import { AcademicCalendarModule } from './application/academic-calendar/academic-calendar.module';
import { CommunicationModule } from './application/communication/communication.module';
import { StorageModule } from './infrastructure/storage/storage.module';
import { ExternalCommunicationModule } from './infrastructure/external/external-communication.module';

import { AcademicYearsModule } from './application/academic-years/academic-years.module';
import { ParentsModule } from './application/parents/parents.module';
import { SmsModule } from './infrastructure/sms/sms.module';
import { TenantModule } from './infrastructure/context/tenant.module'; // Isolation multi-tenant par contexte

@Module({
  imports: [
    TenantModule, // Activation globale de l'intercepteur de tenant (Phase 3)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
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
    AdminRequestModule,
    VieScolaireModule,
    FinanceModule,
    AcademicCalendarModule,
    CommunicationModule,
    StorageModule,
    ExternalCommunicationModule,

    TransitionsModule,
    AcademicYearsModule,
    ParentsModule,
    SmsModule,
    SubscriptionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: PrivacyInterceptor,
    },
  ],
})
export class AppModule { }
