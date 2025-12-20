import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting Admin Request System Audit...');

  // 1. Identify Actors
  const school = await prisma.school.findFirst();
  if (!school) throw new Error('No school found');
  const schoolId = school.id;
  console.log(`Using School: ${school.name} (${schoolId})`);

  const director = await prisma.schoolUser.findFirst({
    where: { schoolId, role: 'DIRECTOR' },
    include: { user: true },
  });
  const censor = await prisma.schoolUser.findFirst({
    where: { schoolId, role: 'CENSEUR' },
    include: { user: true },
  });

  if (!director || !censor) throw new Error('Missing Director or Censor');
  console.log(`Director: ${director.user.firstName}`);
  console.log(`Censor: ${censor.user.firstName}`);

  // 2. Simulate Creation (Censor requests DELETE_TEACHER)
  // Find a teacher to 'delete'
  const teacher = await prisma.teacher.findFirst({
    where: { schoolId, deletedAt: null },
  });
  if (!teacher) {
    console.log('No teacher found to delete. Skipping delete test.');
  } else {
    console.log(
      `Requesting deletion for teacher: ${teacher.firstName} ${teacher.lastName} (${teacher.id})`,
    );

    const request = await prisma.adminRequest.create({
      data: {
        schoolId,
        requesterId: censor.userId,
        type: 'DELETE_TEACHER',
        status: 'PENDING',
        data: JSON.stringify({ teacherId: teacher.id, reason: 'Audit Test' }),
      },
    });
    console.log(`Created Request: ${request.id}`);

    // 3. Simulate Resolution (Director APPROVES)
    // Check finding it first
    const found = await prisma.adminRequest.findUnique({
      where: { id: request.id },
    });
    console.log(`Found Request: ${found?.id} - Status: ${found?.status}`);

    // Update to Approved
    await prisma.adminRequest.update({
      where: { id: request.id },
      data: {
        status: 'APPROVED',
        resolverId: director.userId,
        adminComment: 'Audit Auto-Approval',
      },
    });
    console.log('Request Approved.');

    // 4. Verify Side Effect
    const updatedTeacher = await prisma.teacher.findUnique({
      where: { id: teacher.id },
    });
    console.log(
      `Teacher Status: ${updatedTeacher?.deletedAt ? 'DELETED' : 'ACTIVE'}`,
    );

    if (updatedTeacher?.deletedAt) {
      console.log('SUCCESS: Teacher was deleted.');
      // Restore for cleanup
      await prisma.teacher.update({
        where: { id: teacher.id },
        data: { deletedAt: null },
      });
      console.log('Restored teacher.');
    } else {
      console.error('FAILURE: Teacher was NOT deleted.');
    }
  }

  console.log('Audit Complete.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
