import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

/**
 * Service gérant le cycle de vie du contexte multi-tenant.
 * Utilise AsyncLocalStorage pour permettre l'accès au schoolId de l'utilisateur
 * n'importe où dans le code sans avoir à le passer manuellement dans les arguments.
 */
@Injectable()
export class TenantContextService {
    private static readonly storage = new AsyncLocalStorage<string>();

    /**
     * Définit le schoolId pour la durée de la requête actuelle
     */
    setSchoolId(schoolId: string, callback: () => void) {
        TenantContextService.storage.run(schoolId, callback);
    }

    /**
     * Récupère le schoolId associé à la requête actuelle
     */
    getSchoolId(): string | undefined {
        return TenantContextService.storage.getStore();
    }
}
