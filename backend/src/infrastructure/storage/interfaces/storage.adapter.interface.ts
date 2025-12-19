
export interface StorageAdapter {
    upload(
        file: Buffer,
        key: string,
        mimeType: string,
        bucket: string,
    ): Promise<{ url?: string; key: string; size: number; checksum?: string }>;

    getSignedDownloadUrl(
        key: string,
        bucket: string,
        expiresIn?: number,
    ): Promise<string>;

    delete(key: string, bucket: string): Promise<void>;
}
