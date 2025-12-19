import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { AppointmentService } from '../../application/communication/appointment.service';
import type { CreateAppointmentDto } from '../../application/communication/appointment.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { SchoolAccessGuard } from '../../shared/guards/school-access.guard';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard, SchoolAccessGuard) // Isolation des rendez-vous par école
export class AppointmentController {
    constructor(private readonly appointmentService: AppointmentService) { }

    @Post()
    create(@Request() req, @Body() dto: CreateAppointmentDto) {
        return this.appointmentService.requestAppointment(req.user.schoolId, req.user.id, dto);
    }

    @Get('my-calendar')
    getCalendar(@Request() req) {
        return this.appointmentService.getMyAppointments(req.user.id, req.user.schoolId);
    }

    @Get('pending')
    getPending(@Request() req) {
        return this.appointmentService.getPendingInvitations(req.user.id);
    }

    @Patch(':id/validate')
    validate(@Request() req, @Param('id') id: string, @Body('status') status: 'ACCEPTED' | 'DECLINED') {
        return this.appointmentService.validateParticipation(req.user.id, id, status);
    }
}
