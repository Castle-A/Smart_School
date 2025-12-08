
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Force updating phones...');

    // Directly set phone for rog@ally.com
    await prisma.user.update({
        where: { email: 'rog@ally.com' },
        data: {
            phone: '+229 97 00 00 01',
            loginMethod: 'email'
        }
    });
    console.log('Reset rog@ally.com phone');

    // Find "Molly"
    const molly = await prisma.user.findFirst({
        where: {
            OR: [
                { firstName: { contains: 'molly' } },
                { lastName: { contains: 'molly' } }
            ]
        }
    });

    if (molly) {
        await prisma.user.update({
            where: { id: molly.id },
            data: {
                phone: '+229 97 00 00 02',
                loginMethod: 'phone'
            }
        });
        console.log('Reset molly phone');
    } else {
        console.log('Molly not found');
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
