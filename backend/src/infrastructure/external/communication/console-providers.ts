import { Injectable, Logger } from '@nestjs/common';
import {
  IEmailProvider,
  ISendMailOptions,
} from '../../../application/interfaces/email-provider.interface';
import {
  ISmsProvider,
  ISendSmsOptions,
} from '../../../application/interfaces/sms-provider.interface';

@Injectable()
export class ConsoleEmailProvider implements IEmailProvider {
  private readonly logger = new Logger(ConsoleEmailProvider.name);

  async sendMail(options: ISendMailOptions): Promise<void> {
    this.logger.log(`[Email MOCK] To: ${options.to}`);
    this.logger.log(`[Email MOCK] Subject: ${options.subject}`);
    // this.logger.verbose(`[Email MOCK] Body: ${options.html}`);
  }
}

@Injectable()
export class ConsoleSmsProvider implements ISmsProvider {
  private readonly logger = new Logger(ConsoleSmsProvider.name);

  async sendSms(options: ISendSmsOptions): Promise<void> {
    this.logger.log(
      `[SMS MOCK] To: ${options.to} | Message: ${options.message}`,
    );
  }
}
