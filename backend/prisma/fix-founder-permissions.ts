import { PrismaClient } from '@prisma/client';
import {
    DIRECTOR_PERMISSIONS,
    SECRETARY_PERMISSIONS,
    SUPERVISOR_PERMISSIONS,
    CENSOR_PERMISSIONS,
    ACCOUNTANT_PERMISSIONS
} from '../src/shared/constants/permissions.constants';

const prisma = new PrismaClient();

async function fixFounderPermissions() {
    console.log('🔧 Starting permission fix script...\n');

    // Step 1: Ensure all PermissionDefinitions exist in database
    console.log('📋 Step 1: Populating Permission Definitions...');
    const allPermissions = [
        ...DIRECTOR_PERMISSIONS,
        ...SECRETARY_PERMISSIONS,
        ...SUPERVISOR_PERMISSIONS,
        ...CENSOR_PERMISSIONS,
        ...ACCOUNTANT_PERMISSIONS
    ];

    // Remove duplicates based on code
    const uniquePermissions = Array.from(
        new Map(allPermissions.map(item => [item.code, item])).values()
    );

    let createdCount = 0;
    let updatedCount = 0;

    for (const perm of uniquePermissions) {
        const result = await prisma.permissionDefinition.upsert({
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
                role: 'ALL',
                isDefault: perm.isDefault,
                directorType: perm.directorType
            }
        });

        if (result.createdAt.getTime() === result.updatedAt.getTime()) {
            createdCount++;
        } else {
            updatedCount++;
        }
    }

    console.log(`   ✅ ${createdCount} permissions created`);
    console.log(`   ✅ ${updatedCount} permissions updated`);
    console.log(`   Total: ${uniquePermissions.length} permission definitions in system\n`);

    // Step 2: Find all FOUNDER users
    console.log('👤 Step 2: Finding all FOUNDER users...');
    const founders = await prisma.schoolUser.findMany({
        where: { role: 'FOUNDER' },
        include: {
            user: {
                select: { email: true, firstName: true, lastName: true }
            },
            school: {
                select: { name: true }
            }
        }
    });

    console.log(`   Found ${founders.length} founder(s)\n`);

    // Step 3: Assign all permissions to each founder
    console.log('🔐 Step 3: Assigning all permissions to founders...');

    for (const founder of founders) {
        console.log(`   Processing: ${founder.user.firstName} ${founder.user.lastName} (${founder.user.email}) at ${founder.school.name}`);

        // Get all permission definition IDs
        const permissionDefs = await prisma.permissionDefinition.findMany({
            select: { id: true, code: true }
        });

        // Get already assigned permissions for this founder
        const existingPermissions = await prisma.rolePermission.findMany({
            where: { schoolUserId: founder.id },
            select: { permissionDefinitionId: true }
        });

        const existingPermissionIds = new Set(
            existingPermissions.map(p => p.permissionDefinitionId)
        );

        // Find permissions that need to be assigned
        const permissionsToAssign = permissionDefs.filter(
            p => !existingPermissionIds.has(p.id)
        );

        if (permissionsToAssign.length > 0) {
            // Assign missing permissions
            await prisma.rolePermission.createMany({
                data: permissionsToAssign.map(def => ({
                    schoolUserId: founder.id,
                    permissionDefinitionId: def.id,
                })),
                skipDuplicates: true
            });

            console.log(`      ✅ Assigned ${permissionsToAssign.length} new permission(s)`);
        } else {
            console.log(`      ℹ️  Already has all permissions`);
        }

        // Verify final count
        const finalCount = await prisma.rolePermission.count({
            where: { schoolUserId: founder.id }
        });
        console.log(`      Total permissions: ${finalCount}/${permissionDefs.length}\n`);
    }

    console.log('✅ Permission fix completed successfully!');
}

fixFounderPermissions()
    .catch((e) => {
        console.error('❌ Error fixing permissions:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
