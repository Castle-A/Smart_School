import { BadRequestException } from '@nestjs/common';
import { validate as validateUUID } from 'uuid';

/**
 * Utilitaires de validation pour les requêtes SQL brutes (Master Security).
 * Protège contre les injections SQL et les données malformées.
 */
export class ValidationUtils {
    /**
     * Valide qu'une chaîne est un UUID v4 valide.
     * Critique pour les paramètres utilisés dans $queryRaw.
     */
    static validateUUID(value: string, paramName: string): string {
        if (!validateUUID(value)) {
            throw new BadRequestException(
                `Le paramètre "${paramName}" doit être un UUID valide (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)`
            );
        }
        return value;
    }

    /**
     * Valide et normalise une date.
     * Retourne un objet Date valide ou lève une exception.
     */
    static validateDate(value: any, paramName: string): Date {
        const date = new Date(value);

        if (isNaN(date.getTime())) {
            throw new BadRequestException(
                `Le paramètre "${paramName}" doit être une date valide (reçu: ${value})`
            );
        }

        // Validation de plage raisonnable (1970 - 2100)
        const year = date.getFullYear();
        if (year < 1970 || year > 2100) {
            throw new BadRequestException(
                `Le paramètre "${paramName}" doit être entre 1970 et 2100 (reçu: ${year})`
            );
        }

        return date;
    }

    /**
     * Valide qu'une période est cohérente (startDate < endDate).
     */
    static validateDateRange(start: Date, end: Date): void {
        if (start > end) {
            throw new BadRequestException(
                'La date de début doit être antérieure ou égale à la date de fin'
            );
        }

        // Protection contre les requêtes trop larges (max 5 ans)
        const diffYears = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
        if (diffYears > 5) {
            throw new BadRequestException(
                'La période de rapport ne peut pas dépasser 5 ans'
            );
        }
    }
}
