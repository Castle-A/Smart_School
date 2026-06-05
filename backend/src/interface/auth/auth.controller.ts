import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UnauthorizedException,
  Res,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../../application/auth/auth.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { LoginDto } from '../../application/auth/dto/login.dto';
import { RegisterFounderDto } from '../../application/auth/dto/register-founder.dto';
import { ChangePasswordDto } from '../../application/auth/dto/change-password.dto';
import { CustomLogger } from '../../shared/logger/custom-logger.service';
import { AuthenticatedRequest } from '../../shared/interfaces/authenticated-request.interface';

@Controller('auth')
export class AuthController {
  private readonly logger = new CustomLogger();

  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      this.logger.log(
        `Tentative de connexion: ${loginDto.identifier}`,
        'AuthController',
      );

      const user = await this.authService.validateUser(
        loginDto.identifier,
        loginDto.password,
      );
      if (!user) {
        this.logger.warn(
          `Identifiants invalides pour: ${loginDto.identifier}`,
          'AuthController',
        );
        throw new UnauthorizedException('Invalid credentials');
      }

      this.logger.log(
        `Utilisateur validé: ${user.email || user.phone}`,
        'AuthController',
      );
      const result = await this.authService.login(user);

      // Sécurisation Master : Cookie HttpOnly pour empêcher le vol de token via XSS
      response.cookie('access_token', result.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Uniquement en HTTPS en prod
        sameSite: 'lax', // 'lax' permet le cookie entre localhost:5173 et localhost:3000
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
      });

      this.logger.log(
        'Token injecté en cookie HttpOnly avec succès',
        'AuthController',
      );

      // On retourne les infos utilisateur mais PAS le token (il est dans le cookie)
      return {
        user: result.user,
        mustChangePassword: result.mustChangePassword,
      };
    } catch (error) {
      this.logger.error(
        `Erreur lors de la connexion: ${error.message}`,
        error.stack,
        'AuthController',
      );
      throw error;
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    // Effacement du cookie sécurisé
    response.clearCookie('access_token');
    this.logger.log('Déconnexion réussie (Cookie effacé)', 'AuthController');
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: AuthenticatedRequest) {
    // Endpoint Master : Permet au frontend de récupérer le profil depuis le cookie
    this.logger.log(
      `Récupération du profil pour: ${req.user.userId}`,
      'AuthController',
    );
    return {
      user: req.user,
    };
  }

  @Post('register/founder')
  async register(@Body() registerDto: RegisterFounderDto) {
    try {
      this.logger.log(
        `Tentative d'inscription: ${registerDto.email}`,
        'AuthController',
      );

      const result = await this.authService.registerFounder({
        email: registerDto.email,
        password: registerDto.password,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        gender: registerDto.gender,
        phone: registerDto.phone,
        schoolName: registerDto.schoolName,
        schoolAddress: registerDto.schoolAddress,
        schoolPhone: registerDto.schoolPhone,
        schoolEmail: registerDto.schoolEmail,
        schoolCycles: registerDto.schoolCycles,
      });

      this.logger.log(
        `Inscription réussie pour: ${registerDto.email}`,
        'AuthController',
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Erreur lors de l'inscription: ${error.message}`,
        error.stack,
        'AuthController',
      );
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Request() req: AuthenticatedRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const userId = req.user.userId;
    this.logger.log(
      `Changement de mot de passe pour l'utilisateur: ${userId}`,
      'AuthController',
    );
    return this.authService.changePassword(
      userId,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }
}
