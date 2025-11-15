import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  // Ajoutons schoolId pour le test
  @IsNotEmpty()
  @IsString()
  schoolId: string;
}