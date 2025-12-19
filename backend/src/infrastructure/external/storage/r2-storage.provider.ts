import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageAdapter } from '../../storage/interfaces/storage.adapter.interface';
// import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class R2StorageProvider implements StorageAdapter {
    private readonly logger = new Logger(R2StorageProvider.name);
    // private s3Client: S3Client;
    private bucket: string; // Default bucket if needed, but methods pass it in likely
    private publicUrl: string;

    constructor(private configService: ConfigService) {
        this.bucket = this.configService.get<string>('R2_BUCKET_NAME', 'shining-universe-storage');
        this.publicUrl = this.configService.get<string>('R2_PUBLIC_URL', 'https://pub-xxx.r2.dev');

        const accountId = this.configService.get<string>('R2_ACCOUNT_ID');
        const accessKeyId = this.configService.get<string>('R2_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get<string>('R2_SECRET_ACCESS_KEY');

        if (accountId && accessKeyId && secretAccessKey) {
            // this.s3Client = new S3Client({
            //     region: 'auto',
            //     endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            //     credentials: { accessKeyId, secretAccessKey },
            // });
            this.logger.log('R2 Storage initialized');
        } else {
            this.logger.warn('R2 credentials missing. Storage will fall back to mock/log mode.');
        }
    }

    async upload(
        file: Buffer,
        key: string,
        mimeType: string,
        bucket: string,
    ): Promise<{ url?: string; key: string; size: number; checksum?: string }> {
        this.logger.log(`[R2 Upload Mock] Uploading ${key} (${file.length} bytes) to ${bucket}`);

        // Real implementation:
        // await this.s3Client.send(new PutObjectCommand({
        //     Bucket: bucket || this.bucket,
        //     Key: key,
        //     Body: file,
        //     ContentType: mimeType,
        // }));

        return {
            url: `${this.publicUrl}/${key}`,
            key: key,
            size: file.length,
            // checksum: ...
        };
    }

    async getSignedDownloadUrl(
        key: string,
        bucket: string,
        expiresIn?: number,
    ): Promise<string> {
        this.logger.log(`[R2 SignedURL Mock] URL for ${key}`);
        // Real implementation:
        // const command = new GetObjectCommand({ Bucket: bucket || this.bucket, Key: key });
        // return getSignedUrl(this.s3Client, command, { expiresIn: expiresIn || 3600 });

        return `${this.publicUrl}/${key}?token=mock-token`;
    }

    async delete(key: string, bucket: string): Promise<void> {
        this.logger.log(`[R2 Delete Mock] Deleting ${key} from ${bucket}`);

        // Real implementation:
        // await this.s3Client.send(new DeleteObjectCommand({
        //     Bucket: bucket || this.bucket,
        //     Key: key,
        // }));
    }
}
