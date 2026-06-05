export interface ISendSmsOptions {
  to: string; // Numéro format international (ex: +229...)
  message: string;
}

export interface ISmsProvider {
  /**
   * Envoie un SMS à un destinataire unique.
   */
  sendSms(options: ISendSmsOptions): Promise<void>;
}
