
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Fetching founders...');
    try {
        const founders = await prisma.schoolUser.findMany({
            where: {
                role: 'FOUNDER'
            },
            include: {
                user: true,
                school: true
            }
        });

        if (founders.length === 0) {
            console.log('No founders found.');
        } else {
            console.log(`Found ${founders.length} founders:`);
            founders.forEach((f, index) => {
                console.log(`${index + 1}. ${f.user.firstName} ${f.user.lastName} (${f.user.email}) - School: ${f.school.name}`);
            });
        }
    } catch (error) {
        console.error('Error fetching founders:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
