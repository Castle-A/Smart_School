
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from '../application/auth/auth.service';
import { PrismaService } from '../infrastructure/prisma/prisma.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const authService = app.get(AuthService);
    const prisma = app.get(PrismaService);

    const identifier = 'molly@rog.com';
    // We don't know the password, but we can check what validateUser finds BEFORE password check 
    // or checking `authRepository.findByIdentifier` directly.

    // Actually, let's just inspect what `authService.validateUser` would see
    // We'll use the repository directly as we can't login without password being known (assuming hashed)
    // Or we can mock the repository. 

    // Let's use the repo directly via module ref
    // But wait, the repository is properly injected.

    // Let's modify the plan: Just assume we can look up the user using the same repository method used in AuthService.
    // We need to find the instance of IAuthRepository.

    // Actually, easier:
    // authService uses this.authRepository.findByIdentifier(identifier)
    // Let's try to access it if public or via reflection, OR just query via PrismaService which we know effectively matches.
    // But we want to test the REPO logic.

    // Let's verify via PrismaService manually mirroring the repo logic to be 100% sure.

    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email: identifier },
                { phone: identifier }
            ]
        },
        include: {
            schoolUsers: {
                include: {
                    school: {
                        select: { name: true }
                    },
                    rolePermissions: {
                        include: {
                            permissionDefinition: true
                        }
                    }
                }
            }
        }
    });

    if (!user) {
        console.log('User not found via Repo logic query');
        return;
    }

    // Mimic toDomain logic
    const schoolUser = user.schoolUsers?.[0];
    const schoolRole = schoolUser?.role;

    console.log('--- REPO SIMULATION ---');
    console.log('Identifier:', identifier);
    console.log('Found ID:', user.id);
    console.log('Raw schoolUsers:', JSON.stringify(user.schoolUsers, null, 2));
    console.log('Derived Role (toDomain):', schoolRole);

    if (schoolRole !== 'CENSOR') {
        console.error('CRITICAL: Role mismatch! Expected CENSOR, got:', schoolRole);
    } else {
        console.log('SUCCESS: Backend logic resolves to CENSOR');
    }

    await app.close();
}

bootstrap();
