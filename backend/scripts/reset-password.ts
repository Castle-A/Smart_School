import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function resetPassword(email: string, newPassword = 'password123') {
    console.log(`Resetting password for: ${email}...`);

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            console.log(`USER NOT FOUND: ${email}`);
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });

        console.log(`Password reset successfully for ${email}. New password: ${newPassword}`);

    } catch (error) {
        console.error('Error resetting password:', error);
    }
}

async function main() {
    await resetPassword('jane@doe.com', 'password123');
    await resetPassword('info@ecole-excellence.com', 'password123'); // Assuming john@doe might be this or just check john

    // Also check john@doe.com if it exists
    await resetPassword('john@doe.com', 'password123');

    await prisma.$disconnect();
}

main();
