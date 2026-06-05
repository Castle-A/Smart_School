import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { SupportTemporaryAccessService } from '../../application/support/temporary-access.service';

@Injectable()
export class SchoolAccessGuard implements CanActivate {
  constructor(private readonly temporaryAccessService: SupportTemporaryAccessService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // SuperAdmin has full bypass for platform management
    if (user.platformRole === 'SUPER_ADMIN_PLATFORM') {
      return true;
    }

    const schoolIdParam = request.params.schoolId || request.body.schoolId || request.query.schoolId;

    // Support Technician check
    if (user.platformRole === 'SUPPORT_TECH') {
      if (!schoolIdParam) {
        throw new ForbiddenException('Support access requires a school context');
      }

      // Check for valid temporary access grant
      const hasValidAccess = await this.temporaryAccessService.hasAccess(user.id, schoolIdParam);
      if (!hasValidAccess) {
        throw new ForbiddenException('No valid temporary access for this school. Please ensure you are assigned to an active ticket.');
      }
      return true;
    }

    // Regular users must have a schoolId and it must match the target school
    if (!user.schoolId) {
      throw new ForbiddenException('User does not belong to any school');
    }

    if (schoolIdParam && user.schoolId !== schoolIdParam) {
      throw new ForbiddenException('Access to this school is denied');
    }

    return true;
  }
}
