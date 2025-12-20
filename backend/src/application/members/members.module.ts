import { Module } from '@nestjs/common';
import { MembersController } from '../../interface/members/members.controller';
import { MembersService } from './members.service';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MembersController],
  providers: [MembersService],
  exports: [MembersService],
})
export class MembersModule {}
