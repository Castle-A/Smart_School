import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { AnalyticsService } from '../../application/analytics/analytics.service';
import { AuthenticatedRequest } from '../../shared/interfaces/authenticated-request.interface';

@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  // Endpoint pour tracker une action depuis le frontend
  @UseGuards(JwtAuthGuard)
  @Post('track')
  async track(@Request() req: AuthenticatedRequest, @Body() body: any) {
    // J'ajoute l'IP et le User Agent pour avoir plus de contexte si besoin
    return this.analyticsService.trackEvent({
      type: body.type, // ex: "PAGE_VIEW", "BUTTON_CLICK"
      userId: req.user.userId,
      schoolId: req.user.schoolId,
      metadata: body.metadata,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  // Endpoint pour afficher mes stats d'école
  @UseGuards(JwtAuthGuard)
  @Get('kpis/school/:id')
  async getSchoolKPIs(@Param('id') id: string) {
    return this.analyticsService.getSchoolKPIs(id);
  }

  // Endpoint pour mon dashboard global (Fondateur uniquement à terme)
  @UseGuards(JwtAuthGuard)
  @Get('kpis/global')
  async getGlobalKPIs() {
    return this.analyticsService.getGlobalKPIs();
  }

  // Endpoint temporaire de debug
  @Get('debug/dump')
  async debugDump() {
    // console.log('Debug dump requested');
    return this.analyticsService.debugDump();
  }
}
