import { IsString, IsNotEmpty, IsUUID, IsArray, IsOptional } from 'class-validator';

/**
 * DTO pour la création d'une nouvelle école
 */
export class CreateSchoolDto {
    @IsString()
    @IsNotEmpty({ message: "Le nom de l'école est obligatoire" })
    name: string;

    @IsUUID('4', { message: "L'ID du fondateur doit être un UUID valide" })
    @IsNotEmpty()
    founderId: string;
}

/**
 * DTO pour l'ajout d'un membre du personnel à une école
 */
export class CreateStaffMemberDto {
    @IsUUID('4', { message: "L'ID de l'utilisateur doit être un UUID valide" })
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty({ message: "Le rôle est obligatoire" })
    role: string;

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    permissions?: string[];
}

/**
 * DTO pour la mise à jour des permissions d'un membre
 */
export class UpdatePermissionsDto {
    @IsArray()
    @IsNotEmpty()
    @IsString({ each: true })
    permissions: string[];
}
