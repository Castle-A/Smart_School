import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Teachers ---');
  const teachers = await prisma.teacher.findMany({
    where: { deletedAt: null },
    include: { school: true, user: true },
  });
  console.table(
    teachers.map((t) => ({
      id: t.id,
      name: `${t.user?.firstName} ${t.user?.lastName}`,
      schoolId: t.schoolId,
      schoolName: t.school?.name,
    })),
  );

  console.log('\n--- Censors ---');
  const censors = await prisma.schoolUser.findMany({
    where: { role: 'CENSEUR' },
    include: { user: true, school: true },
  });
  console.table(
    censors.map((c) => ({
      userId: c.userId,
      name: `${c.user.firstName} ${c.user.lastName}`,
      schoolId: c.schoolId,
      schoolName: c.school.name,
    })),
  );

  console.log('\n--- Directors ---');
  const allDirectors = await prisma.schoolUser.findMany({
    where: { role: { in: ['DIRECTOR', 'DIRECTEUR', 'FOUNDER'] } },
    include: { user: true, school: true },
  });

  console.table(
    allDirectors.map((d) => ({
      userId: d.userId,
      role: d.role,
      name: `${d.user.firstName} ${d.user.lastName}`,
      schoolId: d.schoolId,
    })),
  );
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
