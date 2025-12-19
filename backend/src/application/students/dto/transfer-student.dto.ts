import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class TransferStudentDto {
    @IsString()
    @IsNotEmpty()
    reason: string; // "Déménagement", "Exclusion", "Choix", "Autre"

    @IsString()
    @IsOptional()
    destinationSchool?: string;

    @IsDateString()
    date: string; // Date of departure

    @IsString()
    @IsOptional()
    comments?: string;
}
