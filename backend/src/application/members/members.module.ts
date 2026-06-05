import { Module } from '@nestjs/common';
import { MembersController } from '../../interface/members/members.controller';
import { MembersService } from './members.service';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

import { SupportModule } from '../support/support.module';
@Module({
  imports: [PrismaModule, SupportModule],
  controllers: [MembersController],
  providers: [MembersService],
  exports: [MembersService],
})
export class MembersModule { }
