import { Process, Processor, OnQueueActive, OnQueueFailed } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

/**
 * Processeur de File d'Attente pour les Paiements.
 * Gère le traitement asynchrone des webhooks et la validation des transactions.
 */
@Processor('payment-queue')
export class PaymentProcessor {
    private readonly logger = new Logger(PaymentProcessor.name);

    constructor(private readonly prisma: PrismaService) { }

    /**
     * Traite un événement de Webhook entrant (Stripe, Orange Money, etc.)
     */
    @Process('handle-webhook')
    async handleWebhook(job: Job<{ provider: string; payload: any; signature: string }>) {
        const { provider, payload } = job.data;
        this.logger.log(`Traitement du webhook ${provider} - Job ${job.id}`);

        try {
            // 1. Identification de la transaction via la référence Gateway
            // Note: Dans une vraie implémentation, on parserait le payload selon le provider
            const gatewayRef = payload.id || payload.transaction_id;

            if (!gatewayRef) {
                throw new Error('Référence de transaction introuvable dans le payload');
            }

            // 2. Recherche de la transaction locale
            const transaction = await (this.prisma as any).financialTransaction.findFirst({
                where: { gatewayRef },
            });

            if (!transaction) {
                this.logger.warn(`Transaction introuvable pour la ref: ${gatewayRef}`);
                // On pourrait créer une transaction "Orpheline" ici si besoin
                return;
            }

            // 3. Mise à jour atomique : Transaction + Création Paiement (Si Succès)
            // Exemple simplifié : Si le payload dit "success", on valide
            const status = payload.status === 'succeeded' ? 'SUCCESS' : 'FAILED';

            await this.prisma.$transaction(async (prisma) => {
                // A. Mise à jour de la transaction technique
                await (prisma as any).financialTransaction.update({
                    where: { id: transaction.id },
                    data: {
                        status,
                        updatedAt: new Date(),
                        errorLog: status === 'FAILED' ? JSON.stringify(payload) : null,
                    },
                });

                // B. Si SUCCÈS, création du paiement officiel (Visible Dashboard)
                if (status === 'SUCCESS') {
                    const metadata = JSON.parse(transaction.metadata || '{}');

                    await prisma.payment.create({
                        data: {
                            amount: transaction.amount,
                            method: transaction.provider, // STRIPE, OM, etc.
                            reason: metadata.reason || 'Paiement en ligne',
                            reference: transaction.gatewayRef || transaction.idempotencyKey,
                            date: new Date(),
                            school: { connect: { id: transaction.schoolId } },
                            student: { connect: { id: transaction.studentId } },
                        },
                    });

                    this.logger.log(`Paiement officiel créé pour la transaction ${transaction.id}`);
                }
            });

            this.logger.log(`Transaction ${transaction.id} traitée : ${status}`);

        } catch (error) {
            this.logger.error(`Erreur lors du traitement du webhook : ${error.message}`);
            throw error; // Bull réessaiera automatiquement selon la config
        }
    }

    @OnQueueActive()
    onActive(job: Job) {
        this.logger.log(`Job ${job.id} démarré...`);
    }

    @OnQueueFailed()
    onFailed(job: Job, err: Error) {
        this.logger.error(`Job ${job.id} a échoué : ${err.message}`);
    }
}
