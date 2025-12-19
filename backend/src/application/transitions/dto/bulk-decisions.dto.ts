import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class StudentDecisionDto {
    @IsNotEmpty()
    @IsString()
    studentId: string;

    @IsNotEmpty()
    @IsNumber()
    average: number;

    @IsNotEmpty()
    @IsString()
    decision: string; // "PASS", "FAIL", "RETAKE"

    @IsOptional()
    @IsString()
    nextClassId?: string; // If known/decided
}

export class BulkDecisionsDto {
    @IsNotEmpty()
    @IsString()
    classId: string;

    @IsNotEmpty()
    @IsString()
    academicYear: string; // "2023-2024"

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => StudentDecisionDto)
    decisions: StudentDecisionDto[];
}
