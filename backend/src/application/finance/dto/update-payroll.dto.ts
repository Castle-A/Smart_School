import { IsNumber, IsOptional, IsString, IsEnum, Min } from 'class-validator';

/**
 * DTO pour mettre à jour une fiche de paie existante
 */
export class UpdatePayrollDto {
    @IsNumber()
    @IsOptional()
    @Min(0, { message: "Le salaire de base ne peut pas être négatif" })
    baseSalary?: number;

    @IsNumber()
    @IsOptional()
    @Min(0, { message: "Les primes ne peuvent pas être négatves" })
    bonuses?: number;

    @IsNumber()
    @IsOptional()
    @Min(0, { message: "Les retenues ne peuvent pas être négatives" })
    deductions?: number;

    @IsEnum(['PENDING', 'PAID'], { message: "Statut de paiement invalide" })
    @IsOptional()
    paymentStatus?: 'PENDING' | 'PAID';

    @IsString()
    @IsOptional()
    paymentMethod?: string;
}
