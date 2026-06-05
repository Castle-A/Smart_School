import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// Stratégie de gestion des élèves lors du rollover
export enum StudentStrategy {
  KEEP = 'keep', // Garder dans classes actuelles
  REMOVE = 'remove', // Retirer de toutes les classes
  PROMOTE = 'promote', // Promouvoir selon décisions conseil
}

// Options d'héritage configurables
export class InheritOptionsDto {
  @IsBoolean()
  classes: boolean; // Dupliquer structure des classes

  @IsBoolean()
  subjects: boolean; // Dupliquer les matières

  @IsBoolean()
  classSubjects: boolean; // Garder affectations matière-classe

  @IsBoolean()
  fees: boolean; // Copier les frais scolaires

  @IsEnum(StudentStrategy)
  students: StudentStrategy; // Stratégie pour les élèves
}

// DTO pour créer l'année suivante avec rollover
export class CreateNextYearDto {
  @IsString()
  @IsNotEmpty()
  name: string; // ex: "2024-2025"

  @IsDateString()
  startDate: string; // Date de début de l'année

  @IsDateString()
  endDate: string; // Date de fin de l'année

  @ValidateNested()
  @Type(() => InheritOptionsDto)
  @IsOptional()
  inheritOptions?: InheritOptionsDto; // Options d'héritage (optionnel, valeurs par défaut si omis)

  @IsBoolean()
  @IsOptional()
  startAsDraft?: boolean;
}
