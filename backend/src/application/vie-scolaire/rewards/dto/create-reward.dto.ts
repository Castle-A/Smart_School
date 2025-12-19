import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateRewardDto {
    @IsString()
    type: string; // TABLEAU_HONNEUR, etc.

    @IsString()
    @IsOptional()
    reason?: string;

    @IsOptional()
    @IsDateString()
    date?: string;

    @IsString()
    studentId: string;
}
