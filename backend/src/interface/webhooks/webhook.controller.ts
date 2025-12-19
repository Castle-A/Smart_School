import { Controller, Post, Body, Headers, UnauthorizedException, Logger } from '@nestjs/common';
import { NotificationsGateway } from '../../infrastructure/websocket/notifications.gateway';

@Controller('webhooks')
export class WebhookController {
    private logger = new Logger('WebhookController');

    constructor(private notificationsGateway: NotificationsGateway) { }

    /**
     * Reçoit les mises à jour de paiement (ex: Mobile Money).
     * @param signature Signature de sécurité (HMAC)
     * @param body Payload du paiement
     */
    @Post('payment')
    async handlePaymentWebhook(@Headers('x-signature') signature: string, @Body() body: any) {
        // 1. Vérifier la signature (Sécurité)
        // const isValid = verifySignature(signature, body, process.env.PAYMENT_SECRET);
        // if (!isValid) throw new UnauthorizedException('Signature invalide');

        this.logger.log(`Webhook Paiement reçu pour transaction: ${body.transactionId}`);

        // 2. Traiter le paiement (Mise à jour DB via un Service)
        // await this.paymentService.confirm(body.transactionId);

        // 3. Notifier l'utilisateur en temps réel
        if (body.userId) {
            this.notificationsGateway.notifyUser(body.userId, {
                type: 'PAYMENT_SUCCESS',
                message: `Votre paiement de ${body.amount} FCFA a été confirmé.`,
                data: body
            });
        }

        return { status: 'received' };
    }

    /**
     * Reçoit les statuts de livraison SMS.
     */
    @Post('sms')
    async handleSmsWebhook(@Body() body: any) {
        this.logger.log(`Webhook SMS reçu: ${body.status}`);
        // Logique de mise à jour du statut SMS
        return { status: 'ok' };
    }
}
