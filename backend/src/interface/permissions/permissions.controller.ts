import { Controller, Get, Param, Query } from '@nestjs/common';
import { PermissionsService } from '../../application/permissions/permissions.service';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('role/:role')
  async getPermissionsByRole(
    @Param('role') role: string,
    @Query('directorType') directorType?: string,
  ) {
    return this.permissionsService.getPermissionsByRole(role, directorType);
  }

  @Get()
  async getAllPermissions() {
    return this.permissionsService.getAllPermissions();
  }
}
