import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PlatformRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'platformRoles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.platformRole) {
      throw new ForbiddenException('Access denied: No platform role');
    }

    if (!requiredRoles.includes(user.platformRole)) {
      throw new ForbiddenException(
        'Access denied: Insufficient platform permissions',
      );
    }

    return true;
  }
}
