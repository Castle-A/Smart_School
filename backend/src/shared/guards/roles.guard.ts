import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_MAP, SUPER_ADMIN_ROLE } from '../config/roles.config';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('User not authenticated');
        }

        // Platform roles have special access
        if (user.platformRole === SUPER_ADMIN_ROLE) {
            return true; // SuperAdmin can access everything
        }

        const userRole = ROLE_MAP[user.role] || user.role;

        // Check if user has any of the required roles
        const hasRole = requiredRoles.some(role => userRole === role);

        if (!hasRole) {
            console.log(`⛔ Access denied. User role: ${user.role} (mapped to ${userRole}), Required: ${requiredRoles.join(', ')}`);
            throw new ForbiddenException(`Access denied. Required roles: ${requiredRoles.join(', ')}`);
        }

        return true;
    }
}
