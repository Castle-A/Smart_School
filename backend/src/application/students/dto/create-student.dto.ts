import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  matricule: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsDateString()
  @IsNotEmpty()
  dob: string;

  @IsString()
  @IsEnum(['HOMME', 'FEMME', 'DIVERS'])
  @Transform(({ value }) => value?.toUpperCase())
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional() // Made optional for flexibility, but frontend enforces it
  classId?: string;

  @IsString()
  @IsNotEmpty()
  parentName: string;

  @IsString()
  @IsNotEmpty()
  parentPhone: string;

  @IsString()
  @IsOptional()
  previousSchool?: string;

  @IsString()
  @IsOptional()
  categoryId?: string; // Link to FeeCategory (Ex: Nouveau vs Ancien)

  @IsOptional()
  payment?: {
    registrationAmount: number;
    tuitionAmount: number;
    method: string; // CASH, MOMO, ORANGE, CARD
  };
}
