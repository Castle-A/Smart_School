import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class CustomLogger implements LoggerService {
  private formatMessage(
    level: string,
    message: string,
    context?: string,
  ): string {
    const timestamp = new Date().toISOString();
    const ctx = context ? `[${context}]` : '';
    return `${timestamp} ${level.toUpperCase()} ${ctx} ${message}`;
  }

  log(message: string, context?: string) {
    console.log(this.formatMessage('info', message, context));
  }

  error(message: string, trace?: string, context?: string) {
    console.error(this.formatMessage('error', message, context));
    if (trace) {
      console.error(trace);
    }
  }

  warn(message: string, context?: string) {
    console.warn(this.formatMessage('warn', message, context));
  }

  debug(message: string, context?: string) {
    if (process.env.LOG_LEVEL === 'debug') {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  verbose(message: string, context?: string) {
    if (
      process.env.LOG_LEVEL === 'debug' ||
      process.env.LOG_LEVEL === 'verbose'
    ) {
      console.log(this.formatMessage('verbose', message, context));
    }
  }
}
