import {
  IsString,
  IsInt,
  IsOptional,
  IsDateString,
  IsEnum,
  Min,
  Max,
} from 'class-validator';

export class CreateSanctionDto {
  @IsString()
  type: string; // AVERTISSEMENT, BLAME, etc.

  @IsString()
  reason: string;

  @IsInt()
  @Min(1)
  @Max(5)
  severity: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsString()
  studentId: string;
}
