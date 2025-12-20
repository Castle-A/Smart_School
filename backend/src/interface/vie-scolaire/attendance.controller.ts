import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AttendanceService } from '../../application/vie-scolaire/attendance/attendance.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { SchoolAccessGuard } from '../../shared/guards/school-access.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { AuthenticatedRequest } from '../../shared/interfaces/authenticated-request.interface';

@Controller('vie-scolaire/attendance')
@UseGuards(JwtAuthGuard, RolesGuard, SchoolAccessGuard) // Sécurité renforcée multi-tenant
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @Roles('SURVEILLANT', 'CENSOR', 'DIRECTOR', 'FOUNDER')
  async create(@Request() req: AuthenticatedRequest, @Body() body: any) {
    return this.attendanceService.create(req.user.schoolId, body);
  }

  @Get()
  @Roles('SURVEILLANT', 'CENSOR', 'DIRECTOR', 'FOUNDER', 'TEACHER')
  async findAll(
    @Request() req: AuthenticatedRequest,
    @Query('studentId') studentId: string,
  ) {
    return this.attendanceService.findAll(req.user.schoolId, studentId);
  }
}
