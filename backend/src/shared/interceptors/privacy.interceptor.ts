
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PrivacyInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Only apply masking for Support Technician role
        // SuperAdmins see full data for audit/fixing purposes if needed, 
        // but masking for Support is mandatory.
        const shouldMask = user?.platformRole === 'SUPPORT_TECH';

        return next.handle().pipe(
            map((data) => {
                if (!shouldMask || !data) return data;
                return this.maskSensitiveData(data);
            }),
        );
    }

    private maskSensitiveData(data: any): any {
        if (Array.isArray(data)) {
            return data.map((item) => this.maskSensitiveData(item));
        }

        if (typeof data === 'object' && data !== null) {
            const maskedObj = { ...data };

            for (const key in maskedObj) {
                if (Object.prototype.hasOwnProperty.call(maskedObj, key)) {
                    // Mask Phone Numbers
                    if (key.toLowerCase().includes('phone')) {
                        maskedObj[key] = this.maskString(maskedObj[key]);
                    }
                    // Partial Mask Email
                    else if (key.toLowerCase() === 'email') {
                        maskedObj[key] = this.maskEmail(maskedObj[key]);
                    }
                    // Mask Financial Amounts / Card details
                    else if (['amount', 'price', 'total', 'balance', 'salary'].includes(key.toLowerCase())) {
                        // We might want to see the total but mask specific sensitive transactions
                        // For now, let's just mask if it's strictly sensitive
                    }
                    // Recursively mask nested objects
                    else if (typeof maskedObj[key] === 'object') {
                        maskedObj[key] = this.maskSensitiveData(maskedObj[key]);
                    }
                }
            }
            return maskedObj;
        }

        return data;
    }

    private maskString(str: any): string {
        if (typeof str !== 'string' || str.length <= 4) return '••••';
        return `${str.slice(0, 3)} •••• ${str.slice(-2)}`;
    }

    private maskEmail(email: any): string {
        if (typeof email !== 'string') return '••••@••••';
        const [name, domain] = email.split('@');
        if (!domain) return '••••';
        return `${name[0]}••••@${domain}`;
    }
}
