import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString({ message: "L'identifiant doit être une chaîne de caractères" })
  @IsNotEmpty({ message: "L'identifiant est requis" })
  identifier: string;

  @IsString()
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  password: string;
}
