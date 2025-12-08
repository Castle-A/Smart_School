import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'john@doe.com';
    console.log(`Checking detailed status for: ${email}`);

    try {
        const user = await prisma.user.findFirst({
            where: { email },
            include: {
                schoolUsers: {
                    include: { school: true }
                }
            }
        });

        if (!user) {
            console.log('User not found.');
            return;
        }

        console.log('ID:', user.id);
        console.log('Is Active:', user.isActive);
        console.log('Deleted At:', user.deletedAt);
        console.log('Password exists:', !!user.password);
        console.log('Password length:', user.password?.length);
        console.log('Password snippet (first 10 chars):', user.password?.substring(0, 10)); // Safe to show first few chars of hash to verify it looks like bcrypt
        console.log('SchoolUsers count:', user.schoolUsers.length);
        console.log('Roles:', user.schoolUsers.map(su => su.role));

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
