import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CommunicationService } from '../../application/communication/communication.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { SchoolAccessGuard } from '../../shared/guards/school-access.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { AuthenticatedRequest } from '../../shared/interfaces/authenticated-request.interface';

@Controller('communication')
@UseGuards(JwtAuthGuard, RolesGuard, SchoolAccessGuard) // Sécurisation des annonces et rappels
export class CommunicationController {
  constructor(private communicationService: CommunicationService) {}

  @Get('announcements')
  async getAnnouncements(@Request() req: AuthenticatedRequest) {
    return this.communicationService.getAnnouncements(req.user.schoolId);
  }

  @Post('announcements')
  @Roles('FOUNDER', 'DIRECTOR', 'ACCOUNTANT', 'CENSOR')
  async createAnnouncement(
    @Request() req: AuthenticatedRequest,
    @Body() body: { title: string; content: string; scope: string },
  ) {
    return this.communicationService.createAnnouncement(
      req.user.schoolId,
      req.user.userId,
      body,
    );
  }

  @Post('remind/:studentId')
  @Roles('ACCOUNTANT', 'DIRECTOR', 'FOUNDER')
  async sendReminder(
    @Request() req: AuthenticatedRequest,
    @Param('studentId') studentId: string,
    @Body() body: { method: 'EMAIL' | 'SMS' },
  ) {
    return this.communicationService.sendPaymentReminder(
      req.user.schoolId,
      studentId,
      body.method,
    );
  }
}
