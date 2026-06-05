import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
} from 'class-validator';

import { PaymentMethod, SUPPORTED_PAYMENT_METHODS } from '../constants/payment.constants';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty({ message: "L'ID de l'élève est obligatoire" })
  studentId: string;

  @IsNumber()
  @Min(0, { message: 'Le montant ne peut pas être négatif' })
  amount: number;

  @IsEnum(PaymentMethod, {
    message: `Mode de paiement invalide. Options: ${SUPPORTED_PAYMENT_METHODS.join(', ')}`,
  })
  method: string;

  @IsString()
  @IsNotEmpty({ message: 'Le motif du paiement est obligatoire' })
  reason: string;

  @IsString()
  @IsOptional()
  reference?: string;
}
