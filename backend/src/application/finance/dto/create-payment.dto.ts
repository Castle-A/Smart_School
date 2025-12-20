import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
} from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty({ message: "L'ID de l'élève est obligatoire" })
  studentId: string;

  @IsNumber()
  @Min(0, { message: 'Le montant ne peut pas être négatif' })
  amount: number;

  @IsEnum(['CASH', 'MOBILE_MONEY', 'CHEQUE', 'VIREMENT'], {
    message: 'Mode de paiement invalide',
  })
  method: string;

  @IsString()
  @IsNotEmpty({ message: 'Le motif du paiement est obligatoire' })
  reason: string;

  @IsString()
  @IsOptional()
  reference?: string;
}
