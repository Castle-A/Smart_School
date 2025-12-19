import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Guard pour vérifier que le directeur est du bon type
 * Utilisé pour sécuriser les endpoints de certification par cycle
 */
@Injectable()
export class DirectorTypeGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // Récupérer le type requis depuis le décorateur
        const requiredType = this.reflector.get<string>(
            'requiredDirectorType',
            context.getHandler()
        );

        // Si pas de type requis, autoriser l'accès
        if (!requiredType) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Vérifier que l'utilisateur existe
        if (!user) {
            throw new ForbiddenException('Utilisateur non authentifié');
        }

        // FONDATEUR peut tout faire (bypass)
        if (user.role === 'FOUNDER') {
            return true;
        }

        // Vérifier que l'utilisateur est directeur
        if (user.role !== 'DIRECTOR') {
            throw new ForbiddenException('Seuls les directeurs peuvent certifier');
        }

        // Vérifier que le directeur est du bon type
        if (user.directorType !== requiredType) {
            const typeFr = requiredType === 'MATERNELLE_PRIMAIRE'
                ? 'Maternelle/Primaire'
                : 'Collège/Lycée';

            throw new ForbiddenException(
                `Cette action est réservée au Directeur ${typeFr}`
            );
        }

        return true;
    }
}
