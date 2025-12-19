import { Logger } from '@nestjs/common';
import { ISmsProvider, ISendSmsOptions } from '../interfaces/sms-provider.interface';

export class TwilioSmsProvider implements ISmsProvider {
    private readonly logger = new Logger(TwilioSmsProvider.name);

    constructor(
        private readonly accountSid: string,
        private readonly authToken: string,
        private readonly fromNumber: string
    ) { }

    async sendSms(options: ISendSmsOptions): Promise<void> {
        // TODO: Intégrer le SDK Twilio ici
        // const client = require('twilio')(this.accountSid, this.authToken);

        this.logger.log(`[TwilioSMS] Envoi réel à ${options.to} (Stub)`);
        // await client.messages.create({ ... });
    }
}
