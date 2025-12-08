import { IsString, IsNumber, Min, IsOptional } from 'class-validator';

export class UpdateSubjectDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsNumber()
    @Min(0.25)
    @IsOptional()
    coefficient?: number;

    @IsString()
    @IsOptional()
    cycle?: string;
}
