import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from '../../interface/auth/auth.controller';
import { ProfileController } from '../../interface/auth/profile.controller';
import { PrismaAuthRepository } from '../../infrastructure/auth/prisma-auth.repository';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: 'SECRET_KEY_TO_CHANGE', // TODO: Env var
            signOptions: { expiresIn: '60m' },
        }),
    ],
    controllers: [AuthController, ProfileController],
    providers: [
        AuthService,
        JwtStrategy,
        {
            provide: 'IAuthRepository',
            useClass: PrismaAuthRepository,
        },
    ],
    exports: [AuthService],
})
export class AuthModule { }
