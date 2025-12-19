import { Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { AcademicCalendarService } from '../../application/academic-calendar/academic-calendar.service';
import type { CreateEventDto } from '../../application/academic-calendar/academic-calendar.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { SchoolAccessGuard } from '../../shared/guards/school-access.guard';
import { Roles } from '../../shared/decorators/roles.decorator';

@Controller('academic-calendar')
@UseGuards(JwtAuthGuard, RolesGuard, SchoolAccessGuard) // Protection complète du calendrier académique
export class AcademicCalendarController {
    constructor(private calendarService: AcademicCalendarService) { }

    @Get()
    async findAll(@Request() req) {
        return this.calendarService.findAll(req.user.schoolId, req.user.role);
    }

    @Post()
    @Roles('FOUNDER', 'DIRECTOR', 'ACCOUNTANT', 'CENSOR')
    async create(@Request() req, @Body() dto: CreateEventDto) {
        // Convert strings to Date objects if necessary (NestJS DTO usually handles this with Transform, but we do manual check)
        const safeDto = {
            ...dto,
            start: new Date(dto.start),
            end: new Date(dto.end)
        };
        return this.calendarService.create(req.user.schoolId, req.user.id, req.user.role, safeDto);
    }

    @Put(':id')
    @Roles('FOUNDER', 'DIRECTOR', 'ACCOUNTANT', 'CENSOR')
    async update(@Request() req, @Param('id') id: string, @Body() dto: Partial<CreateEventDto>) {
        const safeDto = {
            ...dto,
            start: dto.start ? new Date(dto.start) : undefined,
            end: dto.end ? new Date(dto.end) : undefined
        };
        return this.calendarService.update(id, req.user.schoolId, req.user.role, safeDto);
    }

    @Delete(':id')
    @Roles('FOUNDER', 'DIRECTOR', 'ACCOUNTANT', 'CENSOR')
    async delete(@Request() req, @Param('id') id: string) {
        return this.calendarService.delete(id, req.user.schoolId, req.user.role);
    }
}
