// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { SchoolsModule } from './schools/schools.module';
import { PlansModule } from './plans/plans.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module'; 

@Module({
  imports: [
    SchoolsModule,
    PlansModule,
    SubscriptionsModule,
    TasksModule,
    AuthModule, 
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}