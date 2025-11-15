import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { Role } from '@prisma/client'; // Prisma enum für Role
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, role, schoolId, firstName, lastName } = registerDto;

    // 1. Vérifier si l'utilisateur existe déjà
   const existingUser = await this.prisma.user.findFirst({
      where: { email: { equals: email.toLowerCase().trim() } },
    });

    if (existingUser) {
     throw new UnauthorizedException('Cet utilisateur existe déjà.');
    }

    // 2. Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Créer l'utilisateur en passant l'objet DTO complet
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        schoolId,
        firstName,
        lastName,
      },
    });

    // 4. Retourner l'utilisateur sans le mot de passe
    const { password: _password, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const { email, password, schoolId } = loginDto;

    // CORRECTION : Utiliser les deux critères pour la recherche
    const user = await this.prisma.user.findFirst({
    where: {
      email: email.toLowerCase().trim(),
      schoolId: schoolId,
    },
    });

    if (!user) {
    throw new UnauthorizedException('Identifiants invalides.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
    throw new UnauthorizedException('Mot de passe incorrect.');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
  }
}
