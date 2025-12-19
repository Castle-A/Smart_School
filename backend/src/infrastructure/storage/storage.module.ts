
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StorageController } from './storage.controller';
import { StorageService, STORAGE_ADAPTER } from './storage.service';
import { R2StorageAdapter } from './adapters/r2.storage.adapter';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    imports: [ConfigModule],
    controllers: [StorageController],
    providers: [
        StorageService,
        {
            provide: STORAGE_ADAPTER,
            useClass: R2StorageAdapter,
        },
        PrismaService, // Provide PrismaService here or import a shared PrismaModule
    ],
    exports: [StorageService],
})
export class StorageModule { }
