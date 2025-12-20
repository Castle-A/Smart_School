import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AppointmentService } from '../../application/communication/appointment.service';
import type { CreateAppointmentDto } from '../../application/communication/appointment.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { SchoolAccessGuard } from '../../shared/guards/school-access.guard';
import { AuthenticatedRequest } from '../../shared/interfaces/authenticated-request.interface';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard, SchoolAccessGuard) // Isolation des rendez-vous par école
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  create(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateAppointmentDto,
  ) {
    return this.appointmentService.requestAppointment(
      req.user.schoolId,
      req.user.userId,
      dto,
    );
  }

  @Get('my-calendar')
  getCalendar(@Request() req: AuthenticatedRequest) {
    return this.appointmentService.getMyAppointments(
      req.user.userId,
      req.user.schoolId,
    );
  }

  @Get('pending')
  getPending(@Request() req: AuthenticatedRequest) {
    return this.appointmentService.getPendingInvitations(req.user.userId);
  }

  @Patch(':id/validate')
  validate(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body('status') status: 'ACCEPTED' | 'DECLINED',
  ) {
    return this.appointmentService.validateParticipation(
      req.user.userId,
      id,
      status,
    );
  }
}
