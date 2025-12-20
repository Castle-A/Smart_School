import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  UseGuards,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { SchoolService } from '../../application/school/school.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { SchoolAccessGuard } from '../../shared/guards/school-access.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';

import {
  CreateSchoolDto,
  CreateStaffMemberDto,
  UpdatePermissionsDto,
} from '../../application/school/dto/school.dto';

@Controller('schools')
@UseGuards(JwtAuthGuard, RolesGuard, SchoolAccessGuard) // Triplet de sécurité expert : Auth + Rôles + Isolation Tenant
export class SchoolController {
  constructor(private schoolService: SchoolService) {}

  @Post()
  @Roles('FOUNDER', 'SUPER_ADMIN_PLATFORM')
  async createSchool(@Body() createSchoolDto: CreateSchoolDto) {
    // Utilisation du DTO validé pour la création d'école
    return this.schoolService.createSchool(
      createSchoolDto.name,
      createSchoolDto.founderId,
    );
  }

  @Post(':schoolId/staff')
  @Roles('FOUNDER', 'DIRECTOR')
  async createStaffMember(
    @Param('schoolId') schoolId: string,
    @Body() dto: CreateStaffMemberDto,
  ) {
    // Les permissions sont optionnelles dans le DTO
    return this.schoolService.createStaffMember(
      schoolId,
      dto.userId,
      dto.role,
      dto.permissions || [],
    );
  }

  @Get(':schoolId/staff')
  @Roles('FOUNDER', 'DIRECTOR', 'CENSOR')
  async getSchoolStaff(
    @Param('schoolId') schoolId: string,
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: PaginationQueryDto,
  ) {
    // Master Quality: Validation automatique avec PaginationQueryDto
    return this.schoolService.getSchoolStaff(schoolId, query);
  }

  @Get('user/:userId')
  async getUserSchools(@Param('userId') userId: string) {
    return this.schoolService.getUserSchools(userId);
  }

  @Put('staff/:schoolUserId/permissions')
  @Roles('FOUNDER', 'DIRECTOR')
  async updatePermissions(
    @Param('schoolUserId') schoolUserId: string,
    @Body() dto: UpdatePermissionsDto,
  ) {
    // Liste de permissions stricte via le DTO
    await this.schoolService.updatePermissions(schoolUserId, dto.permissions);
    return { success: true };
  }

  @Get(':schoolId/info')
  async getSchoolInfo(@Param('schoolId') schoolId: string) {
    return this.schoolService.getSchoolInfo(schoolId);
  }

  @Put(':schoolId/logo')
  @Roles('FOUNDER', 'DIRECTOR')
  async updateSchoolLogo(
    @Param('schoolId') schoolId: string,
    @Body() body: { logoUrl: string; userId: string }, // Sera également converti en DTO plus tard
  ) {
    return this.schoolService.updateSchoolLogo(
      schoolId,
      body.logoUrl,
      body.userId,
    );
  }
}
