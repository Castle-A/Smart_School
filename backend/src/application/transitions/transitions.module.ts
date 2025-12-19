import { Module } from '@nestjs/common';
import { TransitionsService } from './transitions.service';
import { TransitionsController } from '../../interface/transitions/transitions.controller';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [TransitionsController],
    providers: [TransitionsService],
})
export class TransitionsModule { }
