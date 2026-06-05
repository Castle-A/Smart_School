import { IsString, IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateClassDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(
    [
      'MATERNELLE_I',
      'MATERNELLE_II',
      'PRIMAIRE',
      'PREMIER_CYCLE',
      'SECOND_CYCLE',
    ],
    {
      message: 'Cycle invalide',
    },
  )
  @IsOptional()
  cycle?: string;

  @IsString()
  @IsOptional()
  level?: string;

  @IsString()
  @IsOptional()
  series?: string;

  @IsString()
  @IsOptional()
  room?: string; // Salle optionnelle

  @IsInt()
  @Min(0, { message: 'La capacité doit être positive' })
  @IsOptional()
  capacity?: number;

  @IsString()
  @IsOptional()
  mainTeacherId?: string;
}
