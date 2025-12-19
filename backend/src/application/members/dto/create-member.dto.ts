import { IsEmail, IsString, IsNotEmpty, IsEnum, IsOptional, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMemberDto {
    @IsString()
    @IsNotEmpty({ message: 'Le prénom est requis' })
    firstName: string;

    @IsString()
    @IsNotEmpty({ message: 'Le nom est requis' })
    lastName: string;

    @IsEmail({}, { message: 'Email invalide' })
    @IsOptional()
    email?: string;

    @IsString()
    @IsNotEmpty({ message: 'Le téléphone est requis' })
    phone: string;

    @Transform(({ value }) => value?.toUpperCase())
    @IsEnum(['HOMME', 'FEMME', 'DIVERS'], {
        message: 'Le genre doit être HOMME, FEMME ou DIVERS'
    })
    @IsNotEmpty({ message: 'Le genre est requis' })
    gender: string;

    @IsEnum(['DIRECTOR', 'SECRETARY', 'SUPERVISOR', 'CENSOR', 'ACCOUNTANT'], {
        message: 'Rôle invalide'
    })
    @IsNotEmpty({ message: 'Le rôle est requis' })
    role: string;

    @IsEnum(['PRIMARY_PRESCHOOL', 'COLLEGE', 'BOTH'], {
        message: 'Type de direction invalide'
    })
    @IsOptional()
    directorType?: string;

    @IsArray()
    @IsOptional()
    permissions?: string[];

    @IsArray()
    @IsOptional()
    permissionIds?: string[]; // Pour la compatibilité avec le frontend

    @IsEnum(['email', 'phone'], {
        message: 'La méthode de connexion doit être email ou phone'
    })
    @IsOptional()
    loginMethod?: 'email' | 'phone';
}
