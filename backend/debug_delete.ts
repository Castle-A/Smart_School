
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Setup: Creating dummy user and relation...');

    // 1. Create User
    const user = await prisma.user.create({
        data: {
            email: 'todelete@test.com',
            password: 'hashedpassword',
            firstName: 'To',
            lastName: 'Delete',
            gender: 'HOMME',
            phone: '+00000000'
        }
    });
    console.log('User created:', user.id);

    // 2. Find a school
    const school = await prisma.school.findFirst();
    if (!school) {
        console.log('No school found, cannot test relation constraint properly.');
        // Just try deleting user then
    } else {
        // 3. Create SchoolUser
        await prisma.schoolUser.create({
            data: {
                userId: user.id,
                schoolId: school.id,
                role: 'TEST_ROLE'
            }
        });
        console.log('SchoolUser relation created.');
    }

    // 4. Try to DELETE User
    console.log('Attempting to DELETE User...');
    try {
        await prisma.user.delete({
            where: { id: user.id }
        });
        console.log('User deleted successfully (Unexpected if cascading is missing).');
    } catch (e) {
        console.log('DELETE FAILED with error:');
        console.log(e.message);
        // Clean up manually if needed?
        // If delete failed, the user and schooluser still exist.
        // We can leave them for now or try to clean up the relation then the user.

        console.log('Cleaning up (manual cascade)...');
        await prisma.schoolUser.deleteMany({ where: { userId: user.id } });
        await prisma.user.delete({ where: { id: user.id } });
        console.log('Cleanup complete.');
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
