import { Module, Global, Provider } from '@nestjs/common';
import { MockSmsProvider } from './providers/mock-sms.provider';
import { TwilioSmsProvider } from './providers/twilio-sms.provider';

const SmsProviderFactory: Provider = {
    provide: 'ISmsProvider',
    useFactory: () => {
        const providerType = process.env.SMS_PROVIDER || 'MOCK';

        if (providerType === 'TWILIO') {
            return new TwilioSmsProvider(
                process.env.TWILIO_ACCOUNT_SID || '',
                process.env.TWILIO_AUTH_TOKEN || '',
                process.env.TWILIO_FROM_NUMBER || ''
            );
        }

        return new MockSmsProvider();
    },
};

@Global()
@Module({
    providers: [SmsProviderFactory],
    exports: [SmsProviderFactory],
})
export class SmsModule { }
