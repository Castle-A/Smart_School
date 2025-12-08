
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Updating phones...');

    // Force update 'rog@ally.com'
    try {
        const u1 = await prisma.user.update({
            where: { email: 'rog@ally.com' },
            data: { phone: '+229 97 00 00 01', loginMethod: 'email' }
        });
        console.log('Updated rog@ally.com:', u1.phone);
    } catch (e) {
        console.log('Error updating rog@ally.com:', e.message);
    }

    // Force update 'molly@rog.com' or similar
    try {
        // Find molly by name if email is wrong
        const molly = await prisma.user.findFirst({
            where: { firstName: { contains: 'molly' } }
        });

        if (molly) {
            const u2 = await prisma.user.update({
                where: { id: molly.id },
                data: { phone: '+229 97 00 00 02', loginMethod: 'phone' }
            });
            console.log('Updated molly:', u2.email, u2.phone);
        } else {
            console.log('Molly not found');
        }
    } catch (e) {
        console.log('Error updating molly:', e.message);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
