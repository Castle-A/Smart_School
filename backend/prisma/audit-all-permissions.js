"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const permissions_constants_1 = require("../src/shared/constants/permissions.constants");
const prisma = new client_1.PrismaClient();
async function auditAllPermissions() {
    console.log('🔍 Starting comprehensive permission audit...\n');
    const results = [];
    let totalUsers = 0;
    let usersWithIssues = 0;
    const schoolUsers = await prisma.schoolUser.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true
                }
            },
            school: {
                select: { name: true }
            },
            rolePermissions: {
                include: {
                    permissionDefinition: {
                        select: { code: true }
                    }
                }
            }
        }
    });
    console.log(`Found ${schoolUsers.length} users across all schools\n`);
    for (const schoolUser of schoolUsers) {
        totalUsers++;
        const role = schoolUser.role;
        const actualPermissionCodes = schoolUser.rolePermissions.map(rp => rp.permissionDefinition.code);
        let expectedPermissions = [];
        if (role === 'FOUNDER') {
            const allPermissions = [
                ...permissions_constants_1.DIRECTOR_PERMISSIONS,
                ...permissions_constants_1.SECRETARY_PERMISSIONS,
                ...permissions_constants_1.SUPERVISOR_PERMISSIONS,
                ...permissions_constants_1.CENSOR_PERMISSIONS,
                ...permissions_constants_1.ACCOUNTANT_PERMISSIONS
            ];
            expectedPermissions = Array.from(new Set(allPermissions.map(p => p.code)));
        }
        else if (['DIRECTOR', 'SECRETARY', 'SUPERVISOR', 'CENSOR', 'ACCOUNTANT'].includes(role)) {
            const defaults = (0, permissions_constants_1.getDefaultPermissionsForRole)(role);
            expectedPermissions = defaults.map(p => p.code);
        }
        else if (role === 'TEACHER') {
            expectedPermissions = [];
        }
        const missingPermissions = expectedPermissions.filter(perm => !actualPermissionCodes.includes(perm));
        const status = missingPermissions.length > 0 ? 'MISSING' : 'OK';
        if (status === 'MISSING') {
            usersWithIssues++;
        }
        const result = {
            userId: schoolUser.userId,
            email: schoolUser.user.email || '',
            fullName: `${schoolUser.user.firstName || ''} ${schoolUser.user.lastName || ''}`,
            role: role,
            schoolName: schoolUser.school.name || '',
            expectedPermissions: expectedPermissions.length,
            actualPermissions: actualPermissionCodes.length,
            missingPermissions,
            status
        };
        results.push(result);
        const icon = status === 'OK' ? '✅' : '⚠️';
        console.log(`${icon} ${result.fullName} (${result.email})`);
        console.log(`   Role: ${result.role} | School: ${result.schoolName}`);
        console.log(`   Permissions: ${result.actualPermissions}/${result.expectedPermissions}`);
        if (status === 'MISSING') {
            console.log(`   Missing (${missingPermissions.length}): ${missingPermissions.slice(0, 5).join(', ')}${missingPermissions.length > 5 ? '...' : ''}`);
        }
        console.log();
    }
    console.log('━'.repeat(60));
    console.log('📊 AUDIT SUMMARY');
    console.log('━'.repeat(60));
    console.log(`Total users audited: ${totalUsers}`);
    console.log(`✅ Users with correct permissions: ${totalUsers - usersWithIssues}`);
    console.log(`⚠️  Users with missing permissions: ${usersWithIssues}`);
    console.log();
    const byRole = results.reduce((acc, r) => {
        if (!acc[r.role])
            acc[r.role] = [];
        acc[r.role].push(r);
        return acc;
    }, {});
    console.log('By Role:');
    Object.entries(byRole).forEach(([role, users]) => {
        const withIssues = users.filter(u => u.status === 'MISSING').length;
        const icon = withIssues === 0 ? '✅' : '⚠️';
        console.log(`  ${icon} ${role}: ${users.length} users (${withIssues} with issues)`);
    });
    console.log();
    if (usersWithIssues > 0) {
        console.log('⚠️  Issues detected! You can fix them by running:');
        console.log('   npx tsx prisma/fix-all-permissions.ts');
    }
    else {
        console.log('✨ All users have correct permissions!');
    }
    return results;
}
auditAllPermissions()
    .catch((e) => {
    console.error('❌ Error during audit:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=audit-all-permissions.js.map