import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export class CreateExpenseDto {
    @IsString()
    @IsNotEmpty({ message: "La catégorie est obligatoire" })
    category: string;

    @IsNumber()
    @Min(0, { message: "Le montant ne peut pas être négatif" })
    amount: number;

    @IsString()
    @IsNotEmpty({ message: "Le motif de la dépense est obligatoire" })
    reason: string;

    @IsString()
    @IsOptional()
    beneficiary?: string;

    @IsDateString({}, { message: "Date invalide" })
    @IsOptional()
    date?: string; // ISO Date
}
