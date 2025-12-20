import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { IncidentsService } from '../../application/vie-scolaire/incidents/incidents.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { SchoolAccessGuard } from '../../shared/guards/school-access.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { RequirePermissions } from '../../shared/decorators/permissions.decorator';
import { CreateIncidentDto } from '../../application/vie-scolaire/incidents/dto/create-incident.dto';
import { AuthenticatedRequest } from '../../shared/interfaces/authenticated-request.interface';

@Controller('vie-scolaire/incidents')
@UseGuards(JwtAuthGuard, SchoolAccessGuard, RolesGuard, PermissionsGuard)
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  @Roles('DIRECTOR', 'CENSEUR', 'SURVEILLANT')
  @RequirePermissions('incidents.manage')
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateIncidentDto,
  ) {
    return this.incidentsService.create(
      req.user.schoolId,
      req.user.userId,
      dto,
    );
  }

  @Get()
  @RequirePermissions('incidents.view')
  async findAll(@Request() req: AuthenticatedRequest) {
    return this.incidentsService.findAll(req.user.schoolId);
  }

  @Delete(':id')
  @Roles('DIRECTOR')
  @RequirePermissions('incidents.manage')
  async delete(@Param('id') id: string) {
    return this.incidentsService.delete(id);
  }
}
