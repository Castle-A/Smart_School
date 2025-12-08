import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

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
        if (user.platformRole === 'SUPER_ADMIN_PLATFORM') {
            return true; // SuperAdmin can access everything
        }

        // Map French roles to English if necessary
        const roleMap: Record<string, string> = {
            'FONDATEUR': 'FOUNDER',
            'DIRECTEUR': 'DIRECTOR',
            'SECRETAIRE': 'SECRETARY',
            'SURVEILLANT': 'SUPERVISOR',
            'CENSEUR': 'CENSOR',
            'COMPTABLE': 'ACCOUNTANT',
            'PROFESSEUR': 'TEACHER',
            'ELEVE': 'STUDENT',
            'PARENT': 'PARENT'
        };

        const userRole = roleMap[user.role] || user.role;

        // Check if user has any of the required roles
        const hasRole = requiredRoles.some(role => userRole === role);

        if (!hasRole) {
            console.log(`⛔ Access denied. User role: ${user.role} (mapped to ${userRole}), Required: ${requiredRoles.join(', ')}`);
            throw new ForbiddenException(`Access denied. Required roles: ${requiredRoles.join(', ')}`);
        }

        return true;
    }
}
