import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    super({
      // Sécurisation Master : Le token est extrait du cookie HttpOnly
      jwtFromRequest: (req: Request) => {
        let token = null;
        if (req && req.cookies) {
          token = req.cookies['access_token'];
        }
        // Fallback to Authorization header if cookie not present
        return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      },
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    // Sécurité renforcée : vérifier l'état de l'utilisateur en base de données à chaque requête
    // Cela permet de rejeter immédiatement les utilisateurs désactivés ou supprimés
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { isActive: true, deletedAt: true },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    if (user.deletedAt) {
      throw new UnauthorizedException('Compte supprimé');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Compte désactivé');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      schoolRole: payload.schoolRole,
      schoolId: payload.schoolId,
      platformRole: payload.platformRole,
      firstName: payload.firstName,
      lastName: payload.lastName,
      permissions: payload.permissions,
      mustChangePassword: payload.mustChangePassword,
      directorType: payload.directorType, // Type de directeur pour les guards
    };
  }
}
