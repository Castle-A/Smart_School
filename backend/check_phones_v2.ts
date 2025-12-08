
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Searching for users...');

    const emailsToCheck = ['rog@ally.com', 'molly@rog.com', 'molly@ally.com'];

    const users = await prisma.user.findMany({
        where: {
            OR: [
                { email: { in: emailsToCheck } },
                { firstName: { contains: 'rog' } },
                { lastName: { contains: 'rog' } },
                { firstName: { contains: 'molly' } },
                { lastName: { contains: 'molly' } }
            ]
        },
        select: {
            id: true,
            email: true,
            phone: true,
            firstName: true,
            lastName: true,
            loginMethod: true,
            schoolUsers: {
                select: {
                    role: true,
                    schoolId: true
                }
            }
        }
    });

    console.log('Found users:', JSON.stringify(users, null, 2));

    // Also check if there are ANY users with phone numbers
    const countWithPhone = await prisma.user.count({
        where: { phone: { not: null } }
    });
    console.log('Total users with phone numbers:', countWithPhone);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
