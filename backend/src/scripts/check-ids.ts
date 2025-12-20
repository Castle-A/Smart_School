import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  console.log('STARTING ID CHECK');
  const schools = await prisma.school.findMany({
    select: { id: true, name: true },
  });
  console.log('--- SCHOOLS ---');
  schools.forEach((s) => console.log(`${s.id} - ${s.name}`));

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { email: { in: ['molly@ally.com', 'rog@rog.com'] } },
        { id: '32309bfb-4509-44fe-8107-61c52a1b81c7' }, // Azol koffi
      ],
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      schoolUsers: { select: { schoolId: true, role: true } },
    },
  });
  console.log('--- USERS (Rog & Molly) ---');
  users.forEach((u) =>
    console.log(
      `${u.firstName} ${u.lastName} (${u.email}) - SchoolUsers: ${JSON.stringify(u.schoolUsers)}`,
    ),
  );

  const teachers = await prisma.teacher.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      schoolId: true,
      deletedAt: true,
      userId: true,
    },
  });
  console.log('--- TEACHERS ---');
  teachers.forEach((t) =>
    console.log(
      `${t.firstName} ${t.lastName} - SchoolId: ${t.schoolId} - DeletedAt: ${t.deletedAt} - UserId: ${t.userId}`,
    ),
  );

  const permissions = await prisma.permissionDefinition.findMany({
    where: { rolePermissions: { some: { schoolUser: { role: 'CENSEUR' } } } },
    select: { code: true },
  });
  // Actually, permissions are linked to SchoolUser via RolePermission, or defined as defaults?
  // Let's check PermissionDefinition defaults for CENSEUR.
  const defaultPermissions = await prisma.permissionDefinition.findMany({
    where: { role: 'CENSEUR' },
    select: { code: true, isDefault: true },
  });
  console.log('--- CENSEUR PERMISSIONS (Definitions) ---');
  console.table(defaultPermissions);

  // Check Molly's specific permissions
  const mollyPermissions = await prisma.schoolUser.findFirst({
    where: { user: { email: 'molly@ally.com' } },
    include: { rolePermissions: { include: { permissionDefinition: true } } },
  });
  console.log('--- MOLLY ACTUAL PERMISSIONS ---');
  if (mollyPermissions) {
    mollyPermissions.rolePermissions.forEach((rp) =>
      console.log(rp.permissionDefinition.code),
    );
  } else {
    console.log('Molly school user not found');
  }

  console.log('FINISHED');
}
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
