
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Searching for users to delete...');

    const users = await prisma.user.findMany({
        where: {
            OR: [
                { email: { contains: 'jane' } },
                { email: { contains: 'doe' } },
                { lastName: { contains: 'Doe' } },
                { lastName: { contains: 'doe' } },
                { firstName: { contains: 'Doe' } },
                { firstName: { contains: 'doe' } },
                { firstName: { contains: 'Jane' } },
                { firstName: { contains: 'jane' } }
            ]
        },
        include: {
            schoolUsers: true
        }
    });

    // Filter validation mostly for "Jane Doe" types
    const targets = users.filter(u =>
        (u.email?.toLowerCase().includes('jane') && u.email?.toLowerCase().includes('doe')) ||
        u.lastName.toLowerCase().includes('doe') ||
        u.firstName.toLowerCase().includes('doe')
    );

    console.log(`Found ${targets.length} users to delete.`);

    for (const user of targets) {
        console.log(`Deleting user: ${user.firstName} ${user.lastName} (${user.email}) - ID: ${user.id}`);

        // 1. Delete SchoolUsers (and their cascades if any)
        // We know SchoolLink does not cascade on User delete based on schema review (usually)
        // but let's be safe and delete SchoolUsers first.
        try {
            const schoolUsers = await prisma.schoolUser.findMany({ where: { userId: user.id } });
            for (const su of schoolUsers) {
                // Delete dependants of SchoolUser if needed
                // Permissions
                await prisma.rolePermission.deleteMany({ where: { schoolUserId: su.id } });

                // Finally delete SchoolUser
                await prisma.schoolUser.delete({ where: { id: su.id } });
            }

            // 2. Delete Analytics events
            await prisma.analyticsEvent.deleteMany({ where: { userId: user.id } });

            // 3. Delete Notifications
            await prisma.notification.deleteMany({ where: { userId: user.id } });

            // 4. Delete User
            await prisma.user.delete({ where: { id: user.id } });
            console.log(`  -> Deleted successfully.`);
        } catch (error) {
            console.error(`  -> Failed to delete user ${user.id}:`, error.message);
        }
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
