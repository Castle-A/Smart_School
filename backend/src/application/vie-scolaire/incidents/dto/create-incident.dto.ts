import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';

export class CreateIncidentDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsOptional()
    @IsDateString()
    date?: string;

    @IsString()
    severity: string; // CRITICAL, MAJOR, MINOR

    @IsString()
    @IsOptional()
    location?: string;
}
