
import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
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
                if (!context.paymentId || !context.year) // Required year for receipts too
                    throw new Error('Missing context (paymentId or year) for receipt key generation');
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
}
