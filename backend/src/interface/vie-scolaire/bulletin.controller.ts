import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { BulletinService } from '../../application/vie-scolaire/bulletins/bulletin.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { SchoolAccessGuard } from '../../shared/guards/school-access.guard';
import { Roles } from '../../shared/decorators/roles.decorator';

@Controller('vie-scolaire/bulletins')
@UseGuards(JwtAuthGuard, RolesGuard, SchoolAccessGuard) // Isolation des bulletins scolaires
export class BulletinController {
    constructor(private bulletinService: BulletinService) { }

    @Get('generate/:studentId/:term')
    @Roles('DIRECTOR', 'CENSOR', 'TEACHER')
    async generateBulletin(@Param('studentId') studentId: string, @Param('term') term: string) {
        return this.bulletinService.generateBulletinData(studentId, term);
    }
}
