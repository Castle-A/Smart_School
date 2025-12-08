import { Controller, Post, Body, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../application/auth/auth.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { LoginDto } from '../../application/auth/dto/login.dto';
import { RegisterFounderDto } from '../../application/auth/dto/register-founder.dto';
import { ChangePasswordDto } from '../../application/auth/dto/change-password.dto';
import { CustomLogger } from '../../shared/logger/custom-logger.service';

@Controller('auth')
export class AuthController {
    private readonly logger = new CustomLogger();

    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        try {
            this.logger.log(`Tentative de connexion: ${loginDto.email}`, 'AuthController');

            const user = await this.authService.validateUser(loginDto.email, loginDto.password);
            if (!user) {
                this.logger.warn(`Identifiants invalides pour: ${loginDto.email}`, 'AuthController');
                throw new UnauthorizedException('Invalid credentials');
            }

            this.logger.log(`Utilisateur validé: ${user.email}`, 'AuthController');
            const result = await this.authService.login(user);
            this.logger.log('Token généré avec succès', 'AuthController');
            return result;
        } catch (error) {
            this.logger.error(`Erreur lors de la connexion: ${error.message}`, error.stack, 'AuthController');
            throw error;
        }
    }

    @Post('register/founder')
    async register(@Body() registerDto: RegisterFounderDto) {
        try {
            this.logger.log(`Tentative d'inscription: ${registerDto.email}`, 'AuthController');

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

            this.logger.log(`Inscription réussie pour: ${registerDto.email}`, 'AuthController');
            return result;
        } catch (error) {
            this.logger.error(`Erreur lors de l'inscription: ${error.message}`, error.stack, 'AuthController');
            throw error;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('change-password')
    async changePassword(@Request() req: any, @Body() changePasswordDto: ChangePasswordDto) {
        const userId = req.user.userId;
        this.logger.log(`Changement de mot de passe pour l'utilisateur: ${userId}`, 'AuthController');
        return this.authService.changePassword(userId, changePasswordDto.currentPassword, changePasswordDto.newPassword);
    }
}
