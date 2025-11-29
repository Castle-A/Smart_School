import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'SECRET_KEY_TO_CHANGE', // TODO: Env var
        });
    }

    async validate(payload: any) {
        return {
            userId: payload.sub,
            email: payload.email,
            role: payload.role,
            schoolRole: payload.schoolRole,
            schoolId: payload.schoolId,
            platformRole: payload.platformRole,
            firstName: payload.firstName,
            lastName: payload.lastName,
            mustChangePassword: payload.mustChangePassword,
        };
    }
}
