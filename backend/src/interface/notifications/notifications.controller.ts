import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationsService } from '../../application/notifications/notifications.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { AuthenticatedRequest } from '../../shared/interfaces/authenticated-request.interface';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return this.notificationsService.findAll(userId);
  }

  @Get('unread-count')
  getUnreadCount(@Request() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return this.notificationsService.getUnreadCount(userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return this.notificationsService.markAsRead(id, userId);
  }

  @Patch('mark-all-read')
  markAllAsRead(@Request() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return this.notificationsService.markAllAsRead(userId);
  }
}
