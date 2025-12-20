import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

class SubjectAssignmentDto {
  @IsString()
  @IsNotEmpty()
  subjectId: string;

  @IsNumber()
  coefficient: number;

  @IsNumber()
  hours: number;

  @IsString()
  @IsOptional()
  teacherId?: string; // This expects a userId (sent from frontend)
}

export class CreateClassBuilderDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum([
    'MATERNELLE',
    'MATERNELLE_I',
    'MATERNELLE_II',
    'PRIMAIRE',
    'PREMIER_CYCLE',
    'SECOND_CYCLE',
  ])
  @IsNotEmpty()
  cycle: string;

  @IsString()
  @IsNotEmpty()
  level: string;

  @IsString()
  @IsOptional()
  series?: string;

  @IsString()
  @IsOptional()
  room?: string;

  @IsString()
  @IsOptional()
  mainTeacherId?: string; // This expects a userId

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubjectAssignmentDto)
  subjects: SubjectAssignmentDto[];
}
