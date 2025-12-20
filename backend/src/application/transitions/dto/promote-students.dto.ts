import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum TransitionAction {
  PROMOTE = 'PROMOTE',
  REPEAT = 'REPEAT',
  ARCHIVE = 'ARCHIVE', // Fin de scolarité / Départ
  TRANSFER = 'TRANSFER', // Changement d'établissement
  GRADUATE = 'GRADUATE', // Diplômé (Bac, Brevet) -> Alumni
}

class StudentTransitionDto {
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @IsNotEmpty()
  @IsEnum(TransitionAction)
  action: TransitionAction;

  @IsOptional()
  @IsString()
  targetClassId?: string; // Required for PROMOTE/REPEAT unless logic handles defaults
}

export class PromoteStudentsDto {
  @IsNotEmpty()
  @IsString()
  academicYear: string; // The year currently closing or the new year? Usually "Closing 2023-2024"

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentTransitionDto)
  transitions: StudentTransitionDto[];
}
