import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'VOTRE_SECRET_SUPER_SECRET', // TODO: Mettre ceci dans .env
      signOptions: { expiresIn: '60m' }, // Le token expire en 1 heure
    }),
  ],
  // C'EST LA PARTIE LA PLUS IMPORTANTE :
  providers: [
    AuthService,
    PrismaService,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}