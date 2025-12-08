
import { PrismaClient } from '@prisma/client';
import {
    PERMISSION_CATEGORIES,
    DIRECTOR_PERMISSIONS,
    SECRETARY_PERMISSIONS,
    SURVEILLANT_PERMISSIONS,
    CENSEUR_PERMISSIONS,
    ACCOUNTANT_PERMISSIONS
} from '../src/shared/constants/permissions.constants';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Permissions...');

    // 1. Create Permission Definitions
    const allPermissions = [
        ...DIRECTOR_PERMISSIONS,
        ...SECRETARY_PERMISSIONS,
        ...SURVEILLANT_PERMISSIONS,
        ...CENSEUR_PERMISSIONS,
        ...ACCOUNTANT_PERMISSIONS
    ];

    // Remove duplicates based on code
    const uniquePermissions = Array.from(new Map(allPermissions.map(item => [item.code, item])).values());

    for (const perm of uniquePermissions) {
        await prisma.permissionDefinition.upsert({
            where: { code: perm.code },
            update: {
                name: perm.name,
                description: perm.description,
                category: perm.category,
                isDefault: perm.isDefault,
                directorType: perm.directorType
            },
            create: {
                code: perm.code,
                name: perm.name,
                description: perm.description,
                category: perm.category,
                role: 'ALL', // Role in DB is less important now as Service uses Constants
                isDefault: perm.isDefault,
                directorType: perm.directorType
            }
        });
    }

    // 2. Assign Permissions to Existing Users

    // Find FOUNDER users (Assumption: users with role FOUNDER in SchoolUser)
    const founders = await prisma.schoolUser.findMany({
        where: { role: 'FOUNDER' },
        include: { rolePermissions: true }
    });

    console.log(`Found ${founders.length} founders to update.`);

    for (const founder of founders) {
        // Assign all permissions to founder
        for (const perm of uniquePermissions) {
            const hasPermission = founder.rolePermissions.some(rp => rp.permissionDefinitionId === perm.code); // This check is tricky with ID vs Code. Let's resolve ID.

            const permDef = await prisma.permissionDefinition.findUnique({ where: { code: perm.code } });
            if (!permDef) continue;

            const exists = await prisma.rolePermission.findFirst({
                where: {
                    schoolUserId: founder.id,
                    permissionDefinitionId: permDef.id
                }
            });

            if (!exists) {
                await prisma.rolePermission.create({
                    data: {
                        schoolUserId: founder.id,
                        permissionDefinitionId: permDef.id
                    }
                });
            }
        }
    }

    console.log('Permissions seeded and assigned to founders.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
