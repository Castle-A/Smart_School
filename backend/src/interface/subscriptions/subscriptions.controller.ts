import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { SubscriptionsService } from '../../application/subscriptions/subscriptions.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { SchoolAccessGuard } from '../../shared/guards/school-access.guard';
import { AuthenticatedRequest } from '../../shared/interfaces/authenticated-request.interface';

import { RequirePermissions } from '../../shared/decorators/permissions.decorator';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard, SchoolAccessGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) { }

  /**
   * Récupère l'abonnement et l'utilisation actuelle de l'école
   */
  @Get('current')
  @Roles('FOUNDER', 'ACCOUNTANT')
  @RequirePermissions('subscription.manage')
  async getCurrent(@Req() req: AuthenticatedRequest) {
    const schoolId = req.user.schoolId;

    const [subscription, usage] = await Promise.all([
      this.subscriptionsService.getCurrentSubscription(schoolId),
      this.subscriptionsService.getUsage(schoolId),
    ]);

    return {
      subscription,
      usage,
    };
  }
}
