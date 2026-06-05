import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
  Max,
  IsJSON,
} from 'class-validator';

/**
 * DTO pour mettre à jour la configuration d'une école
 * Tous les champs sont optionnels car il s'agit d'une mise à jour partielle (PATCH)
 */
export class UpdateSchoolConfigDto {
  @IsString()
  @IsOptional()
  motto?: string;

  @IsString()
  @IsOptional()
  officialColors?: string; // JSON string

  @IsString()
  @IsOptional()
  reportTemplate?: string;

  @IsString()
  @IsOptional()
  receiptTemplate?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  gradingScale?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  passingGrade?: number;

  @IsNumber()
  @IsOptional()
  @Min(0.1)
  defaultCoefficient?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  penaltyRate?: number;

  @IsBoolean()
  @IsOptional()
  smsAlertsEnabled?: boolean;

  @IsBoolean()
  @IsOptional()
  emailAlertsEnabled?: boolean;
}
