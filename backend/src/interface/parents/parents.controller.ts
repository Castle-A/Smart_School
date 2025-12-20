import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ParentsService } from '../../application/parents/parents.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { SchoolAccessGuard } from '../../shared/guards/school-access.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { AuthenticatedRequest } from '../../shared/interfaces/authenticated-request.interface';

@Controller('parents')
@UseGuards(JwtAuthGuard, RolesGuard, SchoolAccessGuard) // Isolation des comptes parents
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Post()
  @Roles('FOUNDER', 'DIRECTOR', 'SECRETARY')
  async create(@Request() req: AuthenticatedRequest, @Body() body: any) {
    return this.parentsService.create(req.user.schoolId, body);
  }

  @Get()
  @Roles('FOUNDER', 'DIRECTOR', 'SECRETARY')
  async findAll(@Request() req: AuthenticatedRequest) {
    return this.parentsService.findAll(req.user.schoolId);
  }

  @Get(':id')
  @Roles('FOUNDER', 'DIRECTOR', 'SECRETARY')
  async findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.parentsService.findOne(id, req.user.schoolId);
  }
  @Get('mobile/children')
  @Roles('PARENT')
  async getChildren(@Request() req: AuthenticatedRequest) {
    return this.parentsService.getChildren(req.user.userId);
  }
  @Get('mobile/overview')
  @Roles('PARENT')
  async getOverview(@Request() req: AuthenticatedRequest) {
    return this.parentsService.getOverview(req.user.userId);
  }
}
