import { Controller, Get, Post, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { RewardsService } from '../../application/vie-scolaire/rewards/rewards.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { SchoolAccessGuard } from '../../shared/guards/school-access.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { RequirePermissions } from '../../shared/decorators/permissions.decorator';
import { CreateRewardDto } from '../../application/vie-scolaire/rewards/dto/create-reward.dto';

@Controller('vie-scolaire/rewards')
@UseGuards(JwtAuthGuard, SchoolAccessGuard, RolesGuard, PermissionsGuard)
export class RewardsController {
    constructor(private readonly rewardsService: RewardsService) { }

    @Post()
    @Roles('DIRECTOR', 'CENSOR')
    @RequirePermissions('discipline.manage')
    async create(@Request() req: any, @Body() dto: CreateRewardDto) {
        return this.rewardsService.create(req.user.schoolId, dto);
    }

    @Get()
    @RequirePermissions('discipline.view')
    async findAll(@Request() req: any) {
        return this.rewardsService.findAll(req.user.schoolId);
    }

    @Delete(':id')
    @Roles('DIRECTOR', 'CENSOR')
    @RequirePermissions('discipline.manage')
    async delete(@Param('id') id: string) {
        return this.rewardsService.delete(id);
    }
}
