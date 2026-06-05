import { Injectable, CanActivate, ExecutionContext, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

/**
 * Garde d'Idempotence (Idempotency Guard)
 * Empêche le traitement multiple d'une même requête de paiement (Double Spending).
 * Vérifie l'en-tête 'x-idempotency-key'.
 */
@Injectable()
export class IdempotencyGuard implements CanActivate {
    constructor(private readonly prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const idempotencyKey = request.headers['x-idempotency-key'];

        if (!idempotencyKey) {
            throw new BadRequestException('En-tête x-idempotency-key manquant');
        }

        // Vérifier si une transaction existe déjà avec cette clé
        const existingTransaction = await (this.prisma as any).financialTransaction.findUnique({
            where: { idempotencyKey: idempotencyKey as string },
        });

        if (existingTransaction) {
            // Si la transaction existe déjà, on bloque la nouvelle tentative
            // Dans une implémentation plus avancée, on pourrait renvoyer le résultat de la transaction précédente (Pattern Cache)
            throw new ConflictException(`Cette transaction a déjà été traitée (Statut: ${existingTransaction.status})`);
        }

        return true;
    }
}
