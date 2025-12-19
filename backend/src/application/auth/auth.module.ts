import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from '../../interface/auth/auth.controller';
import { ProfileController } from '../../interface/auth/profile.controller';
import { PrismaAuthRepository } from '../../infrastructure/auth/prisma-auth.repository';
import { JwtStrategy } from './jwt.strategy';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
    imports: [
        forwardRef(() => AnalyticsModule),
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const secret = configService.get<string>('JWT_SECRET');
                if (!secret) {
                    throw new Error('JWT_SECRET must be defined in environment variables');
                }
                return {
                    secret: secret,
                    signOptions: {
                        expiresIn: '1h'
                    },
                };
            },
            inject: [ConfigService],
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
    exports: [AuthService, 'IAuthRepository'],
})
export class AuthModule { }
