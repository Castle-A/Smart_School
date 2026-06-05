import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { SupportService } from '../../application/support/support.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { PlatformRoleGuard } from './guards/platform-role.guard';
import { PlatformRoles } from './decorators/platform-roles.decorator';
import { AuthenticatedRequest } from '../../shared/interfaces/authenticated-request.interface';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@Controller('support')
@UseGuards(JwtAuthGuard, PlatformRoleGuard)
@PlatformRoles('SUPPORT_TECH', 'SUPER_ADMIN_PLATFORM')
export class SupportController {
  constructor(private supportService: SupportService) { }

  @Get('schools')
  async getSchools() {
    return this.supportService.getSchools();
  }

  @Get('schools/:id/meta')
  async getSchoolMeta(@Param('id') id: string) {
    return this.supportService.getSchoolMeta(id);
  }

  @Post('users/:id/reset-password')
  async resetPassword(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.supportService.resetUserPassword(id, req.user.userId);
  }

  @Post('tickets/:ticketId/request-access')
  async requestAccess(
    @Param('ticketId') ticketId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.supportService.grantTemporaryAccess(req.user.userId, ticketId);
  }

  @Post('tickets/:ticketId/revoke-access')
  async revokeAccess(@Param('ticketId') ticketId: string) {
    return this.supportService.revokeTemporaryAccess(ticketId);
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Voir les journaux d\'audit (SuperAdmin / N2)' })
  async getAuditLogs() {
    // Note: auditService depends on SupportModule
    return (this.supportService as any).getAuditLogs();
  }

  @Get('team/agents')
  @PlatformRoles('SUPER_ADMIN_PLATFORM')
  async getSupportAgents() {
    return this.supportService.getSupportAgents();
  }

  @Post('team/agents')
  @PlatformRoles('SUPER_ADMIN_PLATFORM')
  async createSupportAgent(@Body() body: { email: string; firstName: string; lastName: string; phone?: string }) {
    return this.supportService.createSupportAgent(body);
  }
}
