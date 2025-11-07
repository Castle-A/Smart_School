import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SchoolsModule } from './schools/schools.module';
import { PrismaService } from './prisma.service'; // On importe notre service
import { PlansModule } from './plans/plans.module';

@Module({
  imports: [SchoolsModule, PlansModule],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService, // On le fournit ici pour qu'il soit injectable partout
  ],
})
export class AppModule {}
