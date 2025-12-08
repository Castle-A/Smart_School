import { IsEmail, IsString, IsNotEmpty, IsEnum, IsDateString, IsOptional, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTeacherDto {
    @IsString()
    @IsNotEmpty({ message: 'Le prénom est requis' })
    firstName: string;

    @IsString()
    @IsNotEmpty({ message: 'Le nom est requis' })
    lastName: string;

    @IsEmail({}, { message: 'Email invalide' })
    @IsOptional()
    @Transform(({ value }) => value === "" ? null : value)
    email?: string;

    @IsString()
    @IsNotEmpty({ message: 'Le téléphone est requis' })
    phone: string;

    @Transform(({ value }) => value?.toUpperCase())
    @IsEnum(['HOMME', 'FEMME', 'DIVERS'], {
        message: 'Le genre doit être HOMME, FEMME ou DIVERS'
    })
    @IsNotEmpty({ message: 'Le genre est requis' })
    gender: string;

    @IsEnum(['CDI', 'CDD', 'TEMPS_PARTIEL', 'VACATAIRE', 'STAGIAIRE'], {
        message: 'Type de contrat invalide'
    })
    @IsNotEmpty({ message: 'Le type de contrat est requis' })
    contractType: string;

    @IsDateString({}, { message: 'Date d\'embauche invalide' })
    @IsNotEmpty({ message: 'La date d\'embauche est requise' })
    hireDate: string;

    @IsString()
    @IsOptional()
    matricule?: string;

    @IsArray()
    @IsOptional()
    subjects?: string[];

    @IsString()
    @IsOptional()
    photoUrl?: string;

    @IsEnum(['MAITRE', 'MAITRESSE', 'PROFESSEUR', 'EDUCATEUR'], {
        message: 'Le titre doit être MAITRE, MAITRESSE, PROFESSEUR ou EDUCATEUR'
    })
    @IsNotEmpty({ message: 'Le titre est requis' })
    title: string;

    @IsEnum(['CEAP', 'CAP', 'BAPES', 'CAPES', 'LICENCE', 'MASTER', 'DOCTORAT', 'AUTRE'], {
        message: 'Diplôme invalide'
    })
    @IsOptional()
    diploma?: string;

    @IsString()
    @IsOptional()
    specialty?: string;
}
