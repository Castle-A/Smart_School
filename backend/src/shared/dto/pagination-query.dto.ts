import { IsOptional, IsInt, Min, Max, IsUUID, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO pour la validation des paramètres de pagination par curseur (Master Quality).
 * Assure la sécurité des types et la validation des inputs avec class-validator.
 */
export class PaginationQueryDto {
    /**
     * Nombre d'éléments à récupérer par page.
     * Valeur par défaut : 50, min: 1, max: 100
     */
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'Le paramètre "take" doit être un entier' })
    @Min(1, { message: 'Le paramètre "take" doit être au minimum 1' })
    @Max(100, { message: 'Le paramètre "take" ne peut pas dépasser 100' })
    take?: number = 50;

    /**
     * ID de l'élément pivot pour la pagination.
     * Doit être un UUID valide.
     */
    @IsOptional()
    @IsUUID('4', { message: 'Le curseur doit être un UUID valide' })
    cursor?: string;

    /**
     * Terme de recherche textuelle (optionnel).
     * Limité à 100 caractères pour éviter les abus.
     */
    @IsOptional()
    @IsString({ message: 'Le paramètre "search" doit être une chaîne de caractères' })
    @MaxLength(100, { message: 'Le paramètre "search" ne peut pas dépasser 100 caractères' })
    search?: string;
}
