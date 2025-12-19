import { Logger } from '@nestjs/common';
import { ISmsProvider, ISendSmsOptions } from '../interfaces/sms-provider.interface';

export class MockSmsProvider implements ISmsProvider {
    private readonly logger = new Logger(MockSmsProvider.name);

    async sendSms(options: ISendSmsOptions): Promise<void> {
        this.logger.log(`[MockSMS] Simulation d'envoi à ${options.to}`);
        this.logger.log(`[MockSMS] Contenu : "${options.message}"`);
        // Simule une latence réseau
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}
