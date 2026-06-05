import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StorageController } from './storage.controller';
import { StorageService, STORAGE_ADAPTER } from './storage.service';
import { R2StorageAdapter } from './adapters/r2.storage.adapter';
import { LocalStorageAdapter } from './adapters/local.storage.adapter';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [ConfigModule],
  controllers: [StorageController],
  providers: [
    StorageService,
    {
      provide: STORAGE_ADAPTER,
      useFactory: (configService: ConfigService) => {
        const r2Endpoint = configService.get<string>('STORAGE_ENDPOINT');
        const r2AccessKey = configService.get<string>('STORAGE_ACCESS_KEY_ID');
        const r2SecretKey = configService.get<string>(
          'STORAGE_SECRET_ACCESS_KEY',
        );

        // Si R2 est configuré, l'utiliser. Sinon, fallback sur LocalStorage
        if (r2Endpoint && r2AccessKey && r2SecretKey) {
          console.log('✅ R2 Storage configured - Using R2StorageAdapter');
          return new R2StorageAdapter(configService);
        } else {
          console.log(
            '⚠️  R2 not configured - Using LocalStorageAdapter for development',
          );
          return new LocalStorageAdapter(configService);
        }
      },
      inject: [ConfigService],
    },
    PrismaService,
  ],
  exports: [StorageService],
})
export class StorageModule {}
