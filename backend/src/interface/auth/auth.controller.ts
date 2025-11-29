import { Controller, Post, Body, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../application/auth/auth.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() req: any) {
        try {
            console.log('🔐 Tentative de connexion:', req.email);

            const user = await this.authService.validateUser(req.email, req.password);
            if (!user) {
                console.log('❌ Identifiants invalides pour:', req.email);
                throw new UnauthorizedException('Invalid credentials');
            }

            console.log('✅ Utilisateur validé:', { email: user.email, role: user.role });
            const result = await this.authService.login(user);
            console.log('✅ Token généré avec succès');
            return result;
        } catch (error) {
            console.error('❌ Erreur lors de la connexion:', error.message, error.stack);
            throw error;
        }
    }

    @Post('register/founder')
    async register(@Body() body: any) {
        try {
            console.log('📝 Tentative d\'inscription:', {
                email: body.email,
                firstName: body.firstName,
                lastName: body.lastName,
                schoolName: body.schoolName
            });

            const result = await this.authService.registerFounder({
                email: body.email,
                password: body.password,
                firstName: body.firstName,
                lastName: body.lastName,
                gender: body.gender,
                phone: body.phone,
                schoolName: body.schoolName,
                schoolAddress: body.schoolAddress,
                schoolPhone: body.schoolPhone,
                schoolEmail: body.schoolEmail,
                schoolCycles: body.schoolCycles,
            });

            console.log('✅ Inscription réussie pour:', body.email);
            return result;
        } catch (error) {
            console.error('❌ Erreur lors de l\'inscription:', error.message);
            throw error;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('change-password')
    async changePassword(@Request() req: any, @Body() body: any) {
        const userId = req.user.userId;
        return this.authService.changePassword(userId, body.currentPassword, body.newPassword);
    }
}
