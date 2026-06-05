import {
  IsEmail,
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class UpdateMemberDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail({}, { message: 'Email invalide' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(['homme', 'femme', 'divers'], {
    message: 'Le genre doit être homme, femme ou divers',
  })
  @IsOptional()
  gender?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsEnum(['PRIMARY_PRESCHOOL', 'COLLEGE', 'BOTH'], {
    message: 'Type de direction invalide',
  })
  @IsOptional()
  directorType?: string;

  @IsArray()
  @IsOptional()
  permissions?: string[];
}
