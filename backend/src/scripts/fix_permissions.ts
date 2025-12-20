import { PrismaClient } from '@prisma/client';
import {
  getDefaultPermissionsForRole,
  RoleType,
} from '../shared/constants/permissions.constants';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting permission fix script...');

  // Fetch all school users
  const schoolUsers = await prisma.schoolUser.findMany({
    include: {
      rolePermissions: true,
      user: true,
    },
  });

  console.log(`Found ${schoolUsers.length} school users.`);

  for (const user of schoolUsers) {
    // Skip if user already has permissions
    if (user.rolePermissions.length > 0) {
      console.log(
        `[SKIP] User ${user.user.email} (${user.role}) already has ${user.rolePermissions.length} permissions.`,
      );
      continue;
    }

    // Skip if role is not one of the administrative roles we track permissions for
    if (
      ![
        'DIRECTOR',
        'SECRETARY',
        'SURVEILLANT',
        'CENSEUR',
        'ACCOUNTANT',
        'TEACHER',
        'FOUNDER',
      ].includes(user.role)
    ) {
      console.log(
        `[SKIP] User ${user.user.email} has role ${user.role} which is not targeted.`,
      );
      continue;
    }

    console.log(
      `[FIX] User ${user.user.email} (${user.role}) has NO permissions. Assigning defaults...`,
    );

    const defaultPermissions = getDefaultPermissionsForRole(
      user.role as RoleType,
    );
    const defaultCodes = defaultPermissions.map((p) => p.code);

    if (defaultCodes.length === 0) {
      console.log(`[WARN] No default permissions found for role ${user.role}.`);
      continue;
    }

    // Find IDs for these codes
    const definitions = await prisma.permissionDefinition.findMany({
      where: {
        code: { in: defaultCodes },
      },
      select: { id: true, code: true },
    });

    // Create role permissions
    if (definitions.length > 0) {
      await prisma.rolePermission.createMany({
        data: definitions.map((def) => ({
          schoolUserId: user.id,
          permissionDefinitionId: def.id,
        })),
      });
      console.log(
        `✅ Assigned ${definitions.length} permissions to ${user.user.email}.`,
      );
    } else {
      console.log(
        `[ERROR] Could not find definitions for codes: ${defaultCodes.join(', ')}`,
      );
    }
  }

  console.log('🎉 Permission fix script completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
