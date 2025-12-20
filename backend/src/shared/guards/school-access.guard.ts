import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class SchoolAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Platform roles (SUPER_ADMIN_PLATFORM, SUPPORT_TECH) bypass school-level checks
    if (
      user.platformRole === 'SUPER_ADMIN_PLATFORM' ||
      user.platformRole === 'SUPPORT_TECH'
    ) {
      return true;
    }

    // Regular users must have a schoolId
    if (!user.schoolId) {
      throw new ForbiddenException('User does not belong to any school');
    }

    // If endpoint has :schoolId param, verify it matches user's school
    const schoolIdParam = request.params.schoolId;
    if (schoolIdParam && user.schoolId !== schoolIdParam) {
      throw new ForbiddenException('Access to this school is denied');
    }

    return true;
  }
}
