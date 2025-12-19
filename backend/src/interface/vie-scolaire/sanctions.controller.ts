import { Controller, Get, Post, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { SanctionsService } from '../../application/vie-scolaire/sanctions/sanctions.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { SchoolAccessGuard } from '../../shared/guards/school-access.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { RequirePermissions } from '../../shared/decorators/permissions.decorator';
import { CreateSanctionDto } from '../../application/vie-scolaire/sanctions/dto/create-sanction.dto';

@Controller('vie-scolaire/sanctions')
@UseGuards(JwtAuthGuard, SchoolAccessGuard, RolesGuard, PermissionsGuard)
export class SanctionsController {
    constructor(private readonly sanctionsService: SanctionsService) { }

    @Post()
    @Roles('DIRECTOR', 'CENSOR', 'SUPERVISOR')
    @RequirePermissions('discipline.manage')
    async create(@Request() req: any, @Body() dto: CreateSanctionDto) {
        return this.sanctionsService.create(req.user.schoolId, req.user.id, dto);
    }

    @Get()
    @RequirePermissions('discipline.view')
    async findAll(@Request() req: any) {
        return this.sanctionsService.findAll(req.user.schoolId);
    }

    @Delete(':id')
    @Roles('DIRECTOR', 'CENSOR') // Supervisors might not delete sanctions
    @RequirePermissions('discipline.manage')
    async delete(@Param('id') id: string) {
        return this.sanctionsService.delete(id);
    }
}
