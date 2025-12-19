import { Module, Global } from '@nestjs/common';
import { TenantContextService } from './tenant-context.service';
import { TenantInterceptor } from './tenant.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Global()
@Module({
    providers: [
        TenantContextService,
        {
            provide: APP_INTERCEPTOR,
            useClass: TenantInterceptor,
        },
    ],
    exports: [TenantContextService],
})
export class TenantModule { }
