import { Module } from '@nestjs/common';
import { ParentsController } from '../../interface/parents/parents.controller';
import { ParentsService } from './parents.service';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ParentsController],
  providers: [ParentsService],
  exports: [ParentsService],
})
export class ParentsModule {}
