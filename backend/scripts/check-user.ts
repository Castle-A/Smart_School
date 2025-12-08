import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'jane@doe.com';
    console.log(`Checking for user: ${email} in database...`);

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                schoolUsers: {
                    include: {
                        school: true
                    }
                }
            }
        });

        if (user) {
            console.log('------------------------------------------------');
            console.log('USER FOUND:');
            console.log(`ID: ${user.id}`);
            console.log(`Email: ${user.email}`);
            console.log(`Name: ${user.firstName} ${user.lastName}`);
            console.log(`Roles: ${JSON.stringify(user.schoolUsers.map(su => ({ school: su.school.name, role: su.role, directorType: su.directorType })), null, 2)}`);
            console.log('------------------------------------------------');
        } else {
            console.log('------------------------------------------------');
            console.log(`USER NOT FOUND: ${email}`);
            console.log('------------------------------------------------');
        }
    } catch (error) {
        console.error('Error querying database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
