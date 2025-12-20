export interface ISendSmsOptions {
  to: string; // Phone number e.g. +229...
  message: string;
}

export interface ISmsProvider {
  sendSms(options: ISendSmsOptions): Promise<void>;
}
