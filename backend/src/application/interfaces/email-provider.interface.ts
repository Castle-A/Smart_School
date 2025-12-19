export interface ISendMailOptions {
    to: string | string[];
    subject: string;
    html: string;
    from?: string; // Optional override
}

export interface IEmailProvider {
    sendMail(options: ISendMailOptions): Promise<void>;
}
