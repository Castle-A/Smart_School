
import { Module } from '@nestjs/common';
import { ProfileController } from '../../interface/profile/profile.controller';
import { ProfileService } from './profile.service';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { TeachersModule } from '../teachers/teachers.module';

@Module({
    imports: [PrismaModule, AuthModule, TeachersModule],
    controllers: [ProfileController],
    providers: [ProfileService],
    exports: [ProfileService],
})
export class ProfileModule { }
