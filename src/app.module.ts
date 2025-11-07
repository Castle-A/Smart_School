import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SchoolsModule } from './schools/schools.module';
import { PrismaService } from './prisma.service';
import { PlansModule } from './plans/plans.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { TasksModule } from './tasks/tasks.module'; // On garde l'import du module

@Module({
  imports: [
    SchoolsModule,
    PlansModule,
    SubscriptionsModule,
    TasksModule, // On garde l'import du module ici
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    // On supprime la ligne TasksService d'ici
  ],
})
export class AppModule {}