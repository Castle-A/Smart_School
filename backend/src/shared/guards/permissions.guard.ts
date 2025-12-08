import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());

        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('User not authenticated');
        }

        // Platform roles bypass permission checks
        if (user.platformRole === 'SUPER_ADMIN_PLATFORM') {
            return true;
        }

        // Support tech has limited permissions
        if (user.platformRole === 'SUPPORT_TECH') {
            const allowedForSupport = ['schools.view', 'users.view', 'diagnostics.run'];
            const hasPermission = requiredPermissions.every(perm => allowedForSupport.includes(perm));

            if (!hasPermission) {
                throw new ForbiddenException('Support tech does not have this permission');
            }

            return true;
        }

        // Check if user has all required permissions
        const userPermissions = user.permissions || [];
        const hasAllPermissions = requiredPermissions.every(perm => userPermissions.includes(perm));

        if (!hasAllPermissions) {
            throw new ForbiddenException(`Missing required permissions: ${requiredPermissions.join(', ')}`);
        }

        return true;
    }
}
