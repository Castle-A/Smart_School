import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ConfigurationService } from '../../application/school/configuration.service';
import { UpdateSchoolConfigDto } from '../../application/school/dto/update-school-config.dto';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { SchoolAccessGuard } from '../../shared/guards/school-access.guard';
import { Roles } from '../../shared/decorators/roles.decorator';

@Controller('schools/config')
@UseGuards(JwtAuthGuard, RolesGuard, SchoolAccessGuard) // Protection par école et par rôle
export class ConfigurationController {
    constructor(private readonly configService: ConfigurationService) { }

    /**
     * Récupérer la configuration de l'école actuelle
     */
    @Get()
    @Roles('FOUNDER', 'DIRECTOR')
    async getConfig(@Request() req) {
        return this.configService.getConfig(req.user.schoolId);
    }

    /**
     * Mettre à jour la configuration de l'école
     */
    @Patch()
    @Roles('FOUNDER', 'DIRECTOR')
    async updateConfig(@Request() req, @Body() dto: UpdateSchoolConfigDto) {
        return this.configService.updateConfig(req.user.schoolId, dto);
    }
}
