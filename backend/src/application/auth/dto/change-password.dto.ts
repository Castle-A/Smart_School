
import { IsString, IsNotEmpty, IsOptional, MinLength, Matches } from 'class-validator';

export class ChangePasswordDto {
    @IsString()
    @IsOptional()
    currentPassword?: string;

    @IsString()
    @MinLength(8, { message: 'Le nouveau mot de passe doit contenir au moins 8 caractères' })
    @Matches(/((?=.*\d)(?=.*[A-Z]).*)/, { message: 'Le mot de passe doit contenir au moins une majuscule et un chiffre' })
    @IsNotEmpty({ message: 'Le nouveau mot de passe est requis' })
    newPassword: string;
}
