import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from '../../interface/classes/classes.controller';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ClassesController],
    providers: [ClassesService],
    exports: [ClassesService],
})
export class ClassesModule { }
