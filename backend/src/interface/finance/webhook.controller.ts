import { Controller, Post, Body, Headers, Param, Inject, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@ApiTags('Finance')
@Controller('finance/webhook')
export class WebhookController {
    private readonly logger = new Logger(WebhookController.name);

    constructor(@InjectQueue('payment-queue') private paymentQueue: Queue) { }

    @Post(':provider')
    @ApiOperation({
        summary: 'Réception des webhooks de paiement',
        description: 'Endpoint public pour recevoir les notifications de Stripe, Orange Money, etc.'
    })
    @ApiBody({ schema: { type: 'object', example: { id: 'evt_123', type: 'payment_intent.succeeded' } } })
    async handleWebhook(
        @Param('provider') provider: string,
        @Body() payload: any,
        @Headers('x-signature') signature: string,
    ) {
        this.logger.log(`Webhook reçu de ${provider}`);

        //TODO: Vérification de la signature (HMAC) ici pour sécuriser l'endpoint
        // if (!verifySignature(payload, signature)) throw new UnauthorizedException();

        // 1. On pousse l'événement dans la file d'attente Redis pour traitement asynchrone
        // Cela permet de répondre "200 OK" immédiatement au Gateway et d'éviter les timeouts
        await this.paymentQueue.add(
            'handle-webhook',
            {
                provider,
                payload,
                signature,
            },
            {
                attempts: 5, // Réessayer 5 fois en cas d'erreur (ex: DB verrouillée)
                backoff: 5000, // Attendre 5s entre chaque essai
                removeOnComplete: true,
            },
        );

        return { received: true };
    }
}
