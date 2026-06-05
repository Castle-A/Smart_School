import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  TimetableService,
  UpsertSessionDto,
} from '../../application/vie-scolaire/timetable/timetable.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { SchoolAccessGuard } from '../../shared/guards/school-access.guard';
import { Roles } from '../../shared/decorators/roles.decorator';

@Controller('vie-scolaire/timetable')
@UseGuards(JwtAuthGuard, RolesGuard, SchoolAccessGuard) // Isolation multi-tenant et rôles
export class TimetableController {
  constructor(private timetableService: TimetableService) {}

  @Get(':classId')
  @Roles('DIRECTOR', 'CENSOR', 'TEACHER', 'STUDENT')
  async getSchedule(@Param('classId') classId: string) {
    return this.timetableService.getWeeklySchedule(classId);
  }

  @Post()
  @Roles('DIRECTOR', 'CENSOR')
  async upsertSession(@Body() body: UpsertSessionDto) {
    return this.timetableService.upsertSession(body);
  }

  @Delete(':id')
  @Roles('DIRECTOR', 'CENSOR')
  async deleteSession(@Param('id') id: string) {
    return this.timetableService.deleteSession(id);
  }
}
