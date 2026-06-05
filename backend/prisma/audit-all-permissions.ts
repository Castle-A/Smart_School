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

interface AuditResult {
    userId: string;
    email: string;
    fullName: string;
    role: string;
    schoolName: string;
    expectedPermissions: number;
    actualPermissions: number;
    missingPermissions: string[];
    status: 'OK' | 'MISSING' | 'ERROR';
}

async function auditAllPermissions() {
    console.log('🔍 Starting comprehensive permission audit...\n');

    const results: AuditResult[] = [];
    let totalUsers = 0;
    let usersWithIssues = 0;

    // Get all school users with their permissions
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
        const actualPermissionCodes = schoolUser.rolePermissions.map(
            rp => rp.permissionDefinition.code
        );

        // Get expected default permissions for this role
        let expectedPermissions: string[] = [];

        if (role === 'FOUNDER') {
            // Founders should have ALL permissions
            const allPermissions = [
                ...DIRECTOR_PERMISSIONS,
                ...SECRETARY_PERMISSIONS,
                ...SUPERVISOR_PERMISSIONS,
                ...CENSOR_PERMISSIONS,
                ...ACCOUNTANT_PERMISSIONS
            ];
            expectedPermissions = Array.from(
                new Set(allPermissions.map(p => p.code))
            );
        } else if (['DIRECTOR', 'SECRETARY', 'SUPERVISOR', 'CENSOR', 'ACCOUNTANT'].includes(role)) {
            // Get default permissions for the role
            const defaults = getDefaultPermissionsForRole(role as RoleType);
            expectedPermissions = defaults.map(p => p.code);
        } else if (role === 'TEACHER') {
            // Teachers may not have explicit permissions defined in constants
            expectedPermissions = [];
        }

        // Find missing permissions
        const missingPermissions = expectedPermissions.filter(
            perm => !actualPermissionCodes.includes(perm)
        );

        const status = missingPermissions.length > 0 ? 'MISSING' : 'OK';
        if (status === 'MISSING') {
            usersWithIssues++;
        }

        const result: AuditResult = {
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

        // Print result
        const icon = status === 'OK' ? '✅' : '⚠️';
        console.log(`${icon} ${result.fullName} (${result.email})`);
        console.log(`   Role: ${result.role} | School: ${result.schoolName}`);
        console.log(`   Permissions: ${result.actualPermissions}/${result.expectedPermissions}`);

        if (status === 'MISSING') {
            console.log(`   Missing (${missingPermissions.length}): ${missingPermissions.slice(0, 5).join(', ')}${missingPermissions.length > 5 ? '...' : ''}`);
        }
        console.log();
    }

    // Summary
    console.log('━'.repeat(60));
    console.log('📊 AUDIT SUMMARY');
    console.log('━'.repeat(60));
    console.log(`Total users audited: ${totalUsers}`);
    console.log(`✅ Users with correct permissions: ${totalUsers - usersWithIssues}`);
    console.log(`⚠️  Users with missing permissions: ${usersWithIssues}`);
    console.log();

    // Group by role
    const byRole = results.reduce((acc, r) => {
        if (!acc[r.role]) acc[r.role] = [];
        acc[r.role].push(r);
        return acc;
    }, {} as Record<string, AuditResult[]>);

    console.log('By Role:');
    Object.entries(byRole).forEach(([role, users]) => {
        const withIssues = users.filter(u => u.status === 'MISSING').length;
        const icon = withIssues === 0 ? '✅' : '⚠️';
        console.log(`  ${icon} ${role}: ${users.length} users (${withIssues} with issues)`);
    });
    console.log();

    // Offer to fix
    if (usersWithIssues > 0) {
        console.log('⚠️  Issues detected! You can fix them by running:');
        console.log('   npx tsx prisma/fix-all-permissions.ts');
    } else {
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
