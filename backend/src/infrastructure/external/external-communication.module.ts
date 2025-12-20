import { Module, Global } from '@nestjs/common';
import {
  ConsoleEmailProvider,
  ConsoleSmsProvider,
} from '../../infrastructure/external/communication/console-providers';

@Global()
@Module({
  providers: [
    {
      provide: 'IEmailProvider',
      useClass: ConsoleEmailProvider,
    },
    {
      provide: 'ISmsProvider',
      useClass: ConsoleSmsProvider,
    },
  ],
  exports: ['IEmailProvider', 'ISmsProvider'],
})
export class ExternalCommunicationModule {}
