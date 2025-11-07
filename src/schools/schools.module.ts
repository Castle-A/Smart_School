import { Module } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { SchoolsController } from './schools.controller';
import { PrismaService } from '../prisma.service'; // <-- 1. On importe le service

@Module({
  controllers: [SchoolsController],
  providers: [
    SchoolsService,
    PrismaService, // <-- 2. On l'ajoute aux fournisseurs (providers)
  ],
})
export class SchoolsModule {}