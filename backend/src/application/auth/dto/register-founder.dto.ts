import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional, IsArray, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterFounderDto {
    @IsEmail({}, { message: 'Email invalide' })
    @IsNotEmpty({ message: 'L\'email est requis' })
    email: string;

    @IsString()
    @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
    @IsNotEmpty({ message: 'Le mot de passe est requis' })
    password: string;

    @IsString()
    @IsNotEmpty({ message: 'Le prénom est requis' })
    firstName: string;

    @IsString()
    @IsNotEmpty({ message: 'Le nom est requis' })
    lastName: string;

    @Transform(({ value }) => value?.toUpperCase())
    @IsEnum(['HOMME', 'FEMME', 'DIVERS'], {
        message: 'Le genre doit être HOMME, FEMME ou DIVERS'
    })
    @IsOptional()
    gender?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsNotEmpty({ message: 'Le nom de l\'école est requis' })
    schoolName: string;

    @IsString()
    @IsOptional()
    schoolAddress?: string;

    @IsString()
    @IsOptional()
    schoolPhone?: string;

    @IsEmail({}, { message: 'Email de l\'école invalide' })
    @IsOptional()
    schoolEmail?: string;

    @IsArray()
    @IsOptional()
    schoolCycles?: string[];
}
