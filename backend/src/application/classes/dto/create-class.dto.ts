import { IsString, IsNotEmpty, IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export class CreateClassDto {
    @IsString()
    @IsNotEmpty({ message: 'Le nom de la classe est requis' })
    name: string;

    @IsEnum(['MATERNELLE', 'MATERNELLE_I', 'MATERNELLE_II', 'PRIMAIRE', 'PREMIER_CYCLE', 'SECOND_CYCLE'], {
        message: 'Cycle invalide'
    })
    @IsNotEmpty({ message: 'Le cycle est requis' })
    cycle: string;

    @IsString()
    @IsNotEmpty({ message: 'Le niveau est requis' })
    level: string;

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
