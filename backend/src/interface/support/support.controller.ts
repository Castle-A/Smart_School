import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SupportService } from '../../application/support/support.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { PlatformRoleGuard } from './guards/platform-role.guard';
import { PlatformRoles } from './decorators/platform-roles.decorator';
import { AuthenticatedRequest } from '../../shared/interfaces/authenticated-request.interface';

@Controller('support')
@UseGuards(JwtAuthGuard, PlatformRoleGuard)
@PlatformRoles('SUPPORT_TECH', 'SUPER_ADMIN_PLATFORM')
export class SupportController {
  constructor(private supportService: SupportService) {}

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
}
