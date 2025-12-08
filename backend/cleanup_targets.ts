
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const targets = ['marc', 'gil', 'josh', 'dom'];
    console.log(`Searching for users matching: ${targets.join(', ')}...`);

    // Build OR condition
    const orConditions: any[] = [];
    for (const t of targets) {
        orConditions.push({ firstName: { contains: t } });
        orConditions.push({ lastName: { contains: t } });
        orConditions.push({ email: { contains: t } });
    }

    const users = await prisma.user.findMany({
        where: { OR: orConditions },
        include: {
            _count: {
                select: { schoolUsers: true }
            }
        }
    });

    console.log(`Found ${users.length} users to clean up.`);

    for (const user of users) {
        console.log(`Deleting user: ${user.firstName} ${user.lastName} (${user.email}) - ID: ${user.id}`);

        // 1. Delete Notifications
        await prisma.notification.deleteMany({ where: { userId: user.id } });

        // 2. Delete Messages
        await prisma.message.deleteMany({ where: { senderId: user.id } });
        await prisma.message.deleteMany({ where: { receiverId: user.id } });

        // 3. Delete Analytics
        await prisma.analyticsEvent.deleteMany({ where: { userId: user.id } });

        // 4. Delete RolePermissions (via SchoolUser)
        const schoolUsers = await prisma.schoolUser.findMany({ where: { userId: user.id } });
        const schoolUserIds = schoolUsers.map(su => su.id);

        if (schoolUserIds.length > 0) {
            await prisma.rolePermission.deleteMany({ where: { schoolUserId: { in: schoolUserIds } } });
            await prisma.payroll.deleteMany({ where: { staffId: { in: schoolUserIds } } });
            // Delete SchoolUser records
            await prisma.schoolUser.deleteMany({ where: { userId: user.id } });
        }

        // 5. Delete Teacher Profile
        await prisma.teacher.deleteMany({ where: { userId: user.id } });

        // 6. Delete User
        await prisma.user.delete({ where: { id: user.id } });

        console.log(`✓ Deleted ${user.email}`);
    }

    console.log('Cleanup complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
