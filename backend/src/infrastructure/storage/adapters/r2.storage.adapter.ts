import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageAdapter } from '../interfaces/storage.adapter.interface';

@Injectable()
export class R2StorageAdapter implements StorageAdapter {
  private readonly client: S3Client;
  private readonly logger = new Logger(R2StorageAdapter.name);

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.get<string>('STORAGE_ENDPOINT');
    const region = this.configService.get<string>('STORAGE_REGION') || 'auto';
    const accessKeyId = this.configService.get<string>('STORAGE_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'STORAGE_SECRET_ACCESS_KEY',
    );

    if (!endpoint || !accessKeyId || !secretAccessKey) {
      this.logger.warn(
        'Storage configuration missing. R2StorageAdapter may not work correctly.',
      );
    }

    this.client = new S3Client({
      region,
      endpoint,
      credentials: {
        accessKeyId: accessKeyId || '',
        secretAccessKey: secretAccessKey || '',
      },
      // Cloudflare R2 works best with path-style access for some clients, but standard S3 SDK usually handles it.
      // If using a custom domain, forcePathStyle might need adjustment.
      forcePathStyle: true,
    });
  }

  async upload(
    file: Buffer,
    key: string,
    mimeType: string,
    bucket: string,
  ): Promise<{ url?: string; key: string; size: number; checksum?: string }> {
    try {
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file,
        ContentType: mimeType,
      });

      const response = await this.client.send(command);

      return {
        key,
        size: file.length,
        checksum: response.ETag?.replace(/"/g, ''), // ETag is usually quoted
      };
    } catch (error) {
      this.logger.error(`Error uploading file to ${bucket}/${key}:`, error);
      throw error;
    }
  }

  async getSignedDownloadUrl(
    key: string,
    bucket: string,
    expiresIn = 3600,
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      const url = await getSignedUrl(this.client, command, { expiresIn });
      return url;
    } catch (error) {
      this.logger.error(
        `Error generating signed URL for ${bucket}/${key}:`,
        error,
      );
      throw error;
    }
  }

  async delete(key: string, bucket: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      await this.client.send(command);
      this.logger.log(`File deleted from R2: ${key}`);
    } catch (error) {
      this.logger.error(`Error deleting file from R2: ${key}`, error);
      throw error;
    }
  }

  async getFileStream(key: string, bucket: string): Promise<any> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    try {
      const response = await this.client.send(command);
      return response.Body;
    } catch (error) {
      this.logger.error(`Error getting file stream from R2: ${key}`, error);
      throw error;
    }
  }
}
