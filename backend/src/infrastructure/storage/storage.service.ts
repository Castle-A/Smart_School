import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import type { StorageAdapter } from './interfaces/storage.adapter.interface';
import { R2StorageAdapter } from './adapters/r2.storage.adapter';
import { randomUUID } from 'crypto';
import * as path from 'path';

// Injection token for the adapter
export const STORAGE_ADAPTER = 'STORAGE_ADAPTER';

@Injectable()
export class StorageService {
  private readonly defaultBucket: string;

  constructor(
    @Inject(STORAGE_ADAPTER) private readonly adapter: StorageAdapter,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.defaultBucket = this.configService.get<string>('STORAGE_BUCKET') || '';
  }

  /**
   * Generates a key based on conventions:
   * - bulletins: schools/<schoolId>/students/<studentId>/bulletins/<year>/<term>.pdf
   * - receipts: schools/<schoolId>/finance/receipts/<paymentId>.pdf
   * - payroll: schools/<schoolId>/payroll/teachers/<teacherId>/<yyyy-mm>.pdf
   * - generic: schools/<schoolId>/uploads/<uuid>.<ext>
   */
  generateKey(
    schoolId: string,
    type: 'bulletin' | 'receipt' | 'payroll' | 'generic',
    context: {
      studentId?: string;
      teacherId?: string;
      paymentId?: string;
      year?: string;
      term?: string;
      month?: string;
      originalName?: string;
    },
  ): string {
    const ext = context.originalName ? path.extname(context.originalName) : '';

    switch (type) {
      case 'bulletin':
        if (!context.studentId || !context.year || !context.term)
          throw new Error('Missing context for bulletin key generation');
        return `schools/${schoolId}/students/${context.studentId}/bulletins/${context.year}/${context.term}${ext}`;

      case 'receipt':
        if (!context.paymentId || !context.year)
          // Required year for receipts too
          throw new Error(
            'Missing context (paymentId or year) for receipt key generation',
          );
        return `schools/${schoolId}/finance/${context.year}/receipts/${context.paymentId}${ext}`;

      case 'payroll':
        if (!context.teacherId || !context.month)
          throw new Error('Missing context for payroll key generation');
        return `schools/${schoolId}/payroll/teachers/${context.teacherId}/${context.month}${ext}`;

      default:
        const year = context.year || new Date().getFullYear().toString();
        const uuid = randomUUID();
        return `schools/${schoolId}/uploads/${year}/${uuid}${ext}`;
    }
  }

  async uploadFile(
    schoolId: string,
    file: Buffer,
    mimeType: string,
    keyContext: {
      type: 'bulletin' | 'receipt' | 'payroll' | 'generic';
      studentId?: string;
      teacherId?: string;
      paymentId?: string;
      year?: string;
      term?: string;
      month?: string;
      originalName?: string;
    },
  ) {
    const bucket = this.defaultBucket;
    if (!bucket) throw new Error('STORAGE_BUCKET not configured');

    const key = this.generateKey(schoolId, keyContext.type, keyContext);

    // 1. Upload to Provider
    const uploadResult = await this.adapter.upload(file, key, mimeType, bucket);

    // 2. Save Metadata to DB
    const storedFile = await this.prisma.storedFile.create({
      data: {
        provider: 'R2', // or dynamic if we support multiple active providers
        bucket,
        objectKey: uploadResult.key,
        mimeType,
        size: uploadResult.size,
        checksum: uploadResult.checksum,
        schoolId,
        studentId: keyContext.studentId,
        teacherId: keyContext.teacherId,
        paymentId: keyContext.paymentId,
      },
    });

    return storedFile;
  }

  async getDownloadUrl(fileId: string, schoolId: string): Promise<string> {
    const file = await this.prisma.storedFile.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Multi-tenant check
    if (file.schoolId && file.schoolId !== schoolId) {
      throw new ForbiddenException('Access denied to this file');
    }

    return this.adapter.getSignedDownloadUrl(file.objectKey, file.bucket);
  }

  async deleteFile(fileId: string, schoolId: string): Promise<void> {
    const file = await this.prisma.storedFile.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    if (file.schoolId && file.schoolId !== schoolId) {
      throw new ForbiddenException('Access denied to this file');
    }

    // 1. Delete from Provider
    await this.adapter.delete(file.objectKey, file.bucket);

    // 2. Delete from DB
    await this.prisma.storedFile.delete({
      where: { id: fileId },
    });
  }

  /**
   * Upload spécifique pour le logo de l'école
   * Supprime automatiquement l'ancien logo si existant
   */
  async uploadSchoolLogo(
    schoolId: string,
    file: Buffer,
    mimeType: string,
    ext: string,
  ) {
    const bucket = this.defaultBucket;
    if (!bucket) throw new Error('STORAGE_BUCKET not configured');

    // Clé fixe pour le logo (écrase l'ancien)
    const key = `schools/${schoolId}/logo.${ext}`;

    // 1. Upload vers R2
    const uploadResult = await this.adapter.upload(file, key, mimeType, bucket);

    // 2. Mettre à jour SchoolConfig avec l'URL du logo
    const r2PublicUrl = this.configService.get('R2_PUBLIC_URL');
    if (!r2PublicUrl) {
      throw new Error(
        'R2_PUBLIC_URL not configured. Please set it in your environment variables.',
      );
    }

    const logoUrl = `https://${r2PublicUrl}/${key}`;

    await (this.prisma as any).schoolConfig.upsert({
      where: { schoolId },
      update: {
        logo: logoUrl,
        logoKey: key,
      },
      create: {
        schoolId,
        logo: logoUrl,
        logoKey: key,
      },
    });

    return {
      logoUrl,
      key: uploadResult.key,
    };
  }

  /**
   * Récupère le stream du logo de l'école
   */
  async getSchoolLogoStream(schoolId: string) {
    // Récupérer la config pour avoir la clé du logo
    const config = await (this.prisma as any).schoolConfig.findUnique({
      where: { schoolId },
      select: { logoKey: true },
    });

    const key = config?.logoKey || `schools/${schoolId}/logo.png`;
    const bucket = this.defaultBucket;

    return this.adapter.getFileStream(key, bucket);
  }

  /**
   * Génère une URL signée pour le logo de l'école
   * Permet l'affichage sécurisé sans rendre le bucket public
   */
  async getSignedSchoolLogoUrl(schoolId: string): Promise<string | null> {
    const config = await (this.prisma as any).schoolConfig.findUnique({
      where: { schoolId },
      select: { logoKey: true, logo: true },
    });

    if (!config?.logoKey) {
      // Si pas de clé mais une URL (vieux format), on essaie de l'utiliser ou null
      return config?.logo || null;
    }

    const bucket = this.defaultBucket;
    // URL valide 24h pour limiter les rafraîchissements
    return this.adapter.getSignedDownloadUrl(config.logoKey, bucket, 86400);
  }
}
