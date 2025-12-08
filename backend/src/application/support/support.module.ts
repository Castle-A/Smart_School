import { Module } from '@nestjs/common';
import { SupportController } from '../../interface/support/support.controller';
import { SupportService } from './support.service';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [SupportController],
    providers: [SupportService],
})
export class SupportModule { }
