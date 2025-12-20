import { IsString, IsNumber, IsArray, ValidateNested, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class InstallmentDto {
    @IsString()
    name: string;

    @IsNumber()
    amount: number;

    @IsDateString()
    dueDate: string;
}

export class ClassFeeDto {
    @IsString()
    level: string;

    @IsOptional()
    @IsString()
    series?: string;

    @IsUUID()
    categoryId: string;

    @IsNumber()
    tuitionAmount: number;

    @IsNumber()
    registrationAmount: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InstallmentDto)
    installments: InstallmentDto[];
}

export class FeeCategoryDto {
    @IsOptional()
    @IsUUID()
    id?: string;

    @IsString()
    name: string;
}

export class SchoolProductDto {
    @IsOptional()
    @IsUUID()
    id?: string;

    @IsString()
    name: string;

    @IsNumber()
    price: number;

    @IsString()
    category: string;
}

export class SaveFinanceGridDto {
    @IsOptional()
    @IsString()
    currency?: string;

    @IsOptional()
    @IsNumber()
    penaltyRate?: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FeeCategoryDto)
    categories: FeeCategoryDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ClassFeeDto)
    fees: ClassFeeDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SchoolProductDto)
    products: SchoolProductDto[];
}
