
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateTicketMessageDto {
    @IsString()
    @IsNotEmpty({ message: 'Le message ne peut pas être vide' })
    content: string;

    @IsUUID('4', { message: 'L\'ID du ticket est invalide' })
    ticketId: string;
}
