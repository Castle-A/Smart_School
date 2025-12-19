import { IsNumber, IsString } from 'class-validator';

export class GeneratePayrollDto {
    @IsString()
    month: string; // "2023-10"

    @IsNumber()
    year: number;
}
