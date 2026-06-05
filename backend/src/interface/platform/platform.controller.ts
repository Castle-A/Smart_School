import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { PlatformService } from '../../application/platform/platform.service';
import { Roles } from '../../shared/decorators/roles.decorator';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { AuthenticatedRequest } from '../../shared/interfaces/authenticated-request.interface';

@Controller('platform')
@UseGuards(JwtAuthGuard, RolesGuard) // Pas de SchoolAccessGuard ici car c'est pour l'administration globale
export class PlatformController {
  constructor(private platformService: PlatformService) {}

  /**
   * Get all schools (SUPER_ADMIN_PLATFORM only)
   */
  @Get('schools')
  @Roles('SUPER_ADMIN_PLATFORM')
  async getAllSchools(@Request() req: AuthenticatedRequest) {
    return this.platformService.getAllSchools(
      req.user.userId,
      req.user.platformRole!,
    );
  }

  /**
   * Get school details (SUPER_ADMIN_PLATFORM or SUPPORT_TECH)
   */
  @Get('schools/:schoolId')
  @Roles('SUPER_ADMIN_PLATFORM', 'SUPPORT_TECH')
  async getSchoolDetails(
    @Param('schoolId') schoolId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.platformService.getSchoolDetails(
      schoolId,
      req.user.userId,
      req.user.platformRole!,
    );
  }

  /**
   * Get school users (SUPER_ADMIN_PLATFORM or SUPPORT_TECH)
   */
  @Get('schools/:schoolId/users')
  @Roles('SUPER_ADMIN_PLATFORM', 'SUPPORT_TECH')
  async getSchoolUsers(
    @Param('schoolId') schoolId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.platformService.getSchoolUsers(
      schoolId,
      req.user.userId,
      req.user.platformRole!,
    );
  }

  /**
   * Reset user password (SUPPORT_TECH or SUPER_ADMIN_PLATFORM)
   */
  @Post('users/:userId/reset-password')
  @Roles('SUPER_ADMIN_PLATFORM', 'SUPPORT_TECH')
  async resetUserPassword(
    @Param('userId') userId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.platformService.resetUserPassword(
      userId,
      req.user.userId,
      req.user.platformRole!,
    );
  }

  /**
   * Reactivate account (SUPPORT_TECH or SUPER_ADMIN_PLATFORM)
   */
  @Post('users/:userId/reactivate')
  @Roles('SUPER_ADMIN_PLATFORM', 'SUPPORT_TECH')
  async reactivateAccount(
    @Param('userId') userId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.platformService.reactivateAccount(
      userId,
      req.user.userId,
      req.user.platformRole!,
    );
  }

  /**
   * Get school diagnostics (SUPER_ADMIN_PLATFORM or SUPPORT_TECH)
   */
  @Get('schools/:schoolId/diagnostics')
  @Roles('SUPER_ADMIN_PLATFORM', 'SUPPORT_TECH')
  async getSchoolDiagnostics(
    @Param('schoolId') schoolId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.platformService.getSchoolDiagnostics(
      schoolId,
      req.user.userId,
      req.user.platformRole!,
    );
  }

  /**
   * Get audit logs (SUPER_ADMIN_PLATFORM only)
   */
  @Get('audit-logs')
  @Roles('SUPER_ADMIN_PLATFORM')
  async getAuditLogs(
    @Query() filters: any,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.platformService.getAuditLogs(
      filters,
      req.user.userId,
      req.user.platformRole!,
    );
  }

  /**
   * Get support logs (SUPER_ADMIN_PLATFORM only)
   */
  @Get('support-logs')
  @Roles('SUPER_ADMIN_PLATFORM')
  async getSupportLogs(
    @Query() filters: any,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.platformService.getSupportLogs(
      filters,
      req.user.userId,
      req.user.platformRole!,
    );
  }

  /**
   * Update school subscription (SUPER_ADMIN_PLATFORM only)
   */
  @Patch('schools/:schoolId/subscription')
  @Roles('SUPER_ADMIN_PLATFORM')
  async updateSchoolSubscription(
    @Param('schoolId') schoolId: string,
    @Body() body: { plan: string; status: string },
    @Request() req: AuthenticatedRequest,
  ) {
    return this.platformService.updateSchoolSubscription(
      schoolId,
      body.plan,
      body.status,
      req.user.userId,
      req.user.platformRole!,
    );
  }
}
