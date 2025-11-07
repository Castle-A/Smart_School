import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot() // Important pour activer les tâches planifiées
  ],
  providers: [
    TasksService,
    PrismaService, // Le service Tasks a besoin de Prisma
    SubscriptionsService, // Il a aussi besoin du service des abonnements
  ],
})
export class TasksModule {}