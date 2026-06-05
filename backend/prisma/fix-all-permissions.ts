import { PrismaClient } from '@prisma/client';
import {
    DIRECTOR_PERMISSIONS,
    SECRETARY_PERMISSIONS,
    SUPERVISOR_PERMISSIONS,
    CENSOR_PERMISSIONS,
    ACCOUNTANT_PERMISSIONS,
    getDefaultPermissionsForRole,
    type RoleType
} from '../src/shared/constants/permissions.constants';

const prisma = new PrismaClient();

async function fixAllPermissions() {
    console.log('🔧 Starting permission fix for all users...\n');

    // Step 1: Ensure all PermissionDefinitions exist
    console.log('📋 Step 1: Ensuring all permission definitions exist...');
    const allPermissions = [
        ...DIRECTOR_PERMISSIONS,
        ...SECRETARY_PERMISSIONS,
        ...SUPERVISOR_PERMISSIONS,
        ...CENSOR_PERMISSIONS,
        ...ACCOUNTANT_PERMISSIONS
    ];

    const uniquePermissions = Array.from(
        new Map(allPermissions.map(item => [item.code, item])).values()
    );

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
                role: 'ALL',
                isDefault: perm.isDefault,
                directorType: perm.directorType
            }
        });
    }
    console.log(`   ✅ ${uniquePermissions.length} permission definitions ready\n`);

    // Step 2: Fix permissions for each user
    console.log('👥 Step 2: Fixing user permissions...\n');

    const schoolUsers = await prisma.schoolUser.findMany({
        include: {
            user: {
                select: {
                    email: true,
                    firstName: true,
                    lastName: true
                }
            },
            rolePermissions: {
                select: {
                    permissionDefinitionId: true
                }
            }
        }
    });

    let fixedCount = 0;

    for (const schoolUser of schoolUsers) {
        const role = schoolUser.role;

        // Determine which permissions this user should have
        let expectedPermissionCodes: string[] = [];

        if (role === 'FOUNDER') {
            // Founders get ALL permissions
            expectedPermissionCodes = uniquePermissions.map(p => p.code);
        } else if (['DIRECTOR', 'SECRETARY', 'SUPERVISOR', 'CENSOR', 'ACCOUNTANT'].includes(role)) {
            // Get default permissions for the role
            const defaults = getDefaultPermissionsForRole(role as RoleType);
            expectedPermissionCodes = defaults.map(p => p.code);
        } else if (role === 'TEACHER') {
            // Teachers don't get automatic permissions (handled separately)
            console.log(`   ⏭️  Skipping ${schoolUser.user.email} (TEACHER - no auto permissions)`);
            continue;
        } else {
            console.log(`   ⚠️  Unknown role: ${role} for ${schoolUser.user.email}`);
            continue;
        }

        // Get permission definition IDs
        const permissionDefs = await prisma.permissionDefinition.findMany({
            where: { code: { in: expectedPermissionCodes } },
            select: { id: true }
        });

        // Get existing permission IDs
        const existingPermissionIds = new Set(
            schoolUser.rolePermissions.map(rp => rp.permissionDefinitionId)
        );

        // Find missing permissions
        const permissionsToAdd = permissionDefs.filter(
            p => !existingPermissionIds.has(p.id)
        );

        if (permissionsToAdd.length > 0) {
            await prisma.rolePermission.createMany({
                data: permissionsToAdd.map(def => ({
                    schoolUserId: schoolUser.id,
                    permissionDefinitionId: def.id,
                })),
                skipDuplicates: true
            });

            fixedCount++;
            console.log(`   ✅ Fixed ${schoolUser.user.firstName} ${schoolUser.user.lastName} (${role}): +${permissionsToAdd.length} permissions`);
        } else {
            console.log(`   ℹ️  ${schoolUser.user.firstName} ${schoolUser.user.lastName} (${role}): Already complete`);
        }
    }

    console.log();
    console.log('━'.repeat(60));
    console.log(`✅ Fix completed! ${fixedCount} user(s) updated`);
    console.log('━'.repeat(60));
}

fixAllPermissions()
    .catch((e) => {
        console.error('❌ Error fixing permissions:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
