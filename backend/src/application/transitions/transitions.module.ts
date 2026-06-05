import { Module } from '@nestjs/common';
import { TransitionsService } from './transitions.service';
import { TransitionsController } from '../../interface/transitions/transitions.controller';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

import { SupportModule } from '../support/support.module';

@Module({
  imports: [PrismaModule, SupportModule],
  controllers: [TransitionsController],
  providers: [TransitionsService],
})
export class TransitionsModule { }
