"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const permissions_constants_1 = require("../src/shared/constants/permissions.constants");
const prisma = new client_1.PrismaClient();
async function fixAllPermissions() {
    console.log('🔧 Starting permission fix for all users...\n');
    console.log('📋 Step 1: Ensuring all permission definitions exist...');
    const allPermissions = [
        ...permissions_constants_1.DIRECTOR_PERMISSIONS,
        ...permissions_constants_1.SECRETARY_PERMISSIONS,
        ...permissions_constants_1.SUPERVISOR_PERMISSIONS,
        ...permissions_constants_1.CENSOR_PERMISSIONS,
        ...permissions_constants_1.ACCOUNTANT_PERMISSIONS
    ];
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
                role: 'ALL',
                isDefault: perm.isDefault,
                directorType: perm.directorType
            }
        });
    }
    console.log(`   ✅ ${uniquePermissions.length} permission definitions ready\n`);
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
        let expectedPermissionCodes = [];
        if (role === 'FOUNDER') {
            expectedPermissionCodes = uniquePermissions.map(p => p.code);
        }
        else if (['DIRECTOR', 'SECRETARY', 'SUPERVISOR', 'CENSOR', 'ACCOUNTANT'].includes(role)) {
            const defaults = (0, permissions_constants_1.getDefaultPermissionsForRole)(role);
            expectedPermissionCodes = defaults.map(p => p.code);
        }
        else if (role === 'TEACHER') {
            console.log(`   ⏭️  Skipping ${schoolUser.user.email} (TEACHER - no auto permissions)`);
            continue;
        }
        else {
            console.log(`   ⚠️  Unknown role: ${role} for ${schoolUser.user.email}`);
            continue;
        }
        const permissionDefs = await prisma.permissionDefinition.findMany({
            where: { code: { in: expectedPermissionCodes } },
            select: { id: true }
        });
        const existingPermissionIds = new Set(schoolUser.rolePermissions.map(rp => rp.permissionDefinitionId));
        const permissionsToAdd = permissionDefs.filter(p => !existingPermissionIds.has(p.id));
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
        }
        else {
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
//# sourceMappingURL=fix-all-permissions.js.map