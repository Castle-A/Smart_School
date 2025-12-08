
import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @IsString()
    @IsOptional()
    currentPassword?: string;

    @IsString()
    @MinLength(8, { message: 'Le nouveau mot de passe doit contenir au moins 8 caractères' })
    @IsNotEmpty({ message: 'Le nouveau mot de passe est requis' })
    newPassword: string;
}
