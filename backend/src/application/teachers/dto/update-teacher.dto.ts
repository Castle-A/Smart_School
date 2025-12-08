import { IsEmail, IsString, IsEnum, IsDateString, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class UpdateTeacherDto {
    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsEmail({}, { message: 'Email invalide' })
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsEnum(['homme', 'femme', 'divers'], {
        message: 'Le genre doit être homme, femme ou divers'
    })
    @IsOptional()
    gender?: string;

    @IsEnum(['PERMANENT', 'CONTRACTUAL', 'TEMPORARY'], {
        message: 'Type de contrat invalide'
    })
    @IsOptional()
    contractType?: string;

    @IsDateString({}, { message: 'Date d\'embauche invalide' })
    @IsOptional()
    hireDate?: string;

    @IsArray()
    @IsOptional()
    subjects?: string[];

    @IsString()
    @IsOptional()
    photoUrl?: string;

    @IsEnum(['MAITRE', 'MAITRESSE', 'PROFESSEUR', 'EDUCATEUR'], {
        message: 'Le titre doit être MAITRE, MAITRESSE, PROFESSEUR ou EDUCATEUR'
    })
    @IsOptional()
    title?: string;

    @IsEnum(['CEAP', 'CAP', 'BAPES', 'CAPES', 'LICENCE', 'MASTER', 'DOCTORAT', 'AUTRE'], {
        message: 'Diplôme invalide'
    })
    @IsOptional()
    diploma?: string;

    @IsString()
    @IsOptional()
    specialty?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
