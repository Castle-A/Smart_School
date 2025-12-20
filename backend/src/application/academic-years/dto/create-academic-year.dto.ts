import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Validateur personnalisé pour s'assurer que la date de fin est postérieure à la date de début
 */
@ValidatorConstraint({ name: 'isAfterStartDate', async: false })
export class IsAfterStartDateConstraint implements ValidatorConstraintInterface {
  validate(endDate: string, args: ValidationArguments) {
    const dto = args.object as CreateAcademicYearDto;
    if (!dto.startDate || !endDate) return true; // Laisser les autres validateurs gérer les champs manquants

    return new Date(endDate) > new Date(dto.startDate);
  }

  defaultMessage(args: ValidationArguments) {
    return "La date de fin doit être postérieure à la date de début de l'année scolaire";
  }
}

/**
 * DTO pour la création d'une nouvelle année scolaire
 *
 * @example
 * {
 *   "name": "2024-2025",
 *   "startDate": "2024-09-01T00:00:00.000Z",
 *   "endDate": "2025-06-30T23:59:59.999Z"
 * }
 */
export class CreateAcademicYearDto {
  /**
   * Nom de l'année scolaire (ex: "2024-2025")
   * Doit être unique pour l'école
   */
  @IsNotEmpty({ message: "Le nom de l'année scolaire est requis" })
  name: string;

  /**
   * Date de début de l'année scolaire
   * Format ISO 8601 (ex: "2024-09-01T00:00:00.000Z")
   */
  @IsDateString(
    {},
    {
      message: 'La date de début doit être une date valide au format ISO 8601',
    },
  )
  @IsNotEmpty({ message: 'La date de début est requise' })
  startDate: string;

  /**
   * Date de fin de l'année scolaire
   * Format ISO 8601 (ex: "2025-06-30T23:59:59.999Z")
   * Doit être postérieure à startDate
   */
  @IsDateString(
    {},
    { message: 'La date de fin doit être une date valide au format ISO 8601' },
  )
  @IsNotEmpty({ message: 'La date de fin est requise' })
  @Validate(IsAfterStartDateConstraint)
  endDate: string;

  @IsOptional()
  @IsBoolean()
  autoClosureEnabled?: boolean;

  @IsOptional()
  @IsOptional()
  @IsDateString()
  autoClosureDate?: string;

  @IsOptional()
  @IsNotEmpty()
  sourceYearId?: string;

  @IsOptional()
  @IsBoolean()
  keepTeachers?: boolean;
}
