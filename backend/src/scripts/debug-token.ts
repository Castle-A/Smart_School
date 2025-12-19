
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from '../application/auth/auth.service';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const authService = app.get(AuthService);
    const prisma = app.get(PrismaService);
    const jwtService = app.get(JwtService);

    const identifier = 'molly@rog.com';

    // 1. Get User via AuthRepository logic (simulated or direct)
    // We'll trust the repository finds it the same way check-user-role did.
    const repo = app.get('IAuthRepository');
    const user = await repo.findByIdentifier(identifier);

    if (!user) {
        console.log('User not found!');
        await app.close();
        return;
    }

    console.log('User from Repository:', {
        id: user.id,
        role: user.role,
        schoolRole: user.schoolRole,
        directorType: user.directorType
    });

    // 2. Generate Token
    const loginResult = await authService.login(user); // This calls jwtService.sign
    const token = loginResult.access_token;

    // 3. Decode Token
    const decoded = jwtService.decode(token);

    console.log('--- GENERATED TOKEN PAYLOAD ---');
    console.log(JSON.stringify(decoded, null, 2));

    if (decoded['role'] !== 'CENSOR') {
        console.error('CRITICAL: Token role mismatch! Expected CENSOR, got:', decoded['role']);
    } else {
        console.log('SUCCESS: Token contains the correct role.');
    }

    await app.close();
}

bootstrap();
