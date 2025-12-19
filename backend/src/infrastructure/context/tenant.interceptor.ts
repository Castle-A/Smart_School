import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantContextService } from './tenant-context.service';

/**
 * Intercepteur qui extrait le schoolId du token JWT (déjà validé par JwtAuthGuard)
 * et initialise le TenantContextService pour la durée de la requête.
 */
@Injectable()
export class TenantInterceptor implements NestInterceptor {
    constructor(private readonly tenantContextService: TenantContextService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (user && user.schoolId) {
            // On enveloppe l'exécution de la suite du pipeline NestJS dans le contexte AsyncLocalStorage
            return new Observable((observer) => {
                this.tenantContextService.setSchoolId(user.schoolId, () => {
                    next.handle().subscribe({
                        next: (res) => observer.next(res),
                        error: (err) => observer.error(err),
                        complete: () => observer.complete(),
                    });
                });
            });
        }

        return next.handle();
    }
}
