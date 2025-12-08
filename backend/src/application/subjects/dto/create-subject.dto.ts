import { IsString, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateSubjectDto {
    @IsString()
    name: string;

    @IsNumber()
    @Min(0.25)
    @IsOptional()
    coefficient?: number;

    @IsString()
    @IsOptional()
    cycle?: string;
}
