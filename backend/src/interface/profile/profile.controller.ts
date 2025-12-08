
import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { ProfileService } from '../../application/profile/profile.service';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
    constructor(private profileService: ProfileService) { }

    @Get('me')
    async getProfile(@Request() req: any) {
        return this.profileService.getProfile(req.user.userId);
    }

    @Patch('me')
    async updateProfile(@Request() req: any, @Body() body: any) {
        return this.profileService.updateProfile(req.user.userId, body);
    }
}
