import { Module, Global } from '@nestjs/common';
import { R2StorageProvider } from '../../infrastructure/external/storage/r2-storage.provider';
import { ConfigModule } from '@nestjs/config';

@Global() // Make it global so text/pdf services can use it easily
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'IStorageProvider',
      useClass: R2StorageProvider,
    },
  ],
  exports: ['IStorageProvider'],
})
export class StorageModule {}
