import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { TicketType, TicketPriority } from '@prisma/client';

export class CreateTicketDto {
    @IsString()
    @IsNotEmpty({ message: 'Le sujet est obligatoire' })
    subject: string;

    @IsString()
    @IsNotEmpty({ message: 'La description est obligatoire' })
    description: string;

    @IsEnum(TicketType, { message: 'Type de ticket invalide' })
    type: TicketType;

    @IsEnum(TicketPriority, { message: 'Priorité invalide' })
    @IsOptional()
    priority?: TicketPriority;

    @IsUUID('4', { message: 'L\'ID de l\'école est invalide' })
    @IsOptional()
    schoolId?: string;
}
