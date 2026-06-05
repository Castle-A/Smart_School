import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bull';
import { redisStore } from 'cache-manager-ioredis-yet';

@Global()
@Module({
    imports: [
        // Configuration du Cache (Redis)
        CacheModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                store: redisStore,
                host: configService.get('REDIS_HOST', 'smartschool-redis'),
                port: configService.get('REDIS_PORT', 6379),
                ttl: 60 * 60, // 1 heure par défaut
            }),
            inject: [ConfigService],
            isGlobal: true,
        }),

        // Configuration des Queues (Bull)
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                redis: {
                    host: configService.get('REDIS_HOST', 'smartschool-redis'),
                    port: configService.get('REDIS_PORT', 6379),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [CacheModule, BullModule],
})
export class RedisModule { }
