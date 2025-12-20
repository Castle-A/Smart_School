import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('SCRIPT STARTED');
  console.log('--- Schools ---');
  const schools = await prisma.school.findMany();
  console.table(schools.map((s) => ({ id: s.id, name: s.name })));

  console.log('\n--- Users (Directors & Censors) ---');
  const users = await prisma.user.findMany({
    where: {
      schoolUsers: {
        some: {
          role: { in: ['DIRECTOR', 'CENSEUR', 'DIRECTEUR', 'SECRETAIRE'] }, // Check various roles
        },
      },
    },
    include: {
      schoolUsers: true,
    },
  });

  // Also specifically look for 'Rog' and 'Molly' if they exist by name
  const specificUsers = await prisma.user.findMany({
    where: {
      OR: [
        { firstName: { contains: 'Rog' } },
        { lastName: { contains: 'Rog' } },
        { firstName: { contains: 'Molly' } },
        { lastName: { contains: 'Molly' } },
      ],
    },
    include: { schoolUsers: true },
  });

  const allRelevantUsers = [...users, ...specificUsers].filter(
    (v, i, a) => a.findIndex((t) => t.id === v.id) === i,
  );

  console.table(
    allRelevantUsers.map((u) => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`,
      schoolUsers: u.schoolUsers
        .map((su) => `${su.schoolId} (${su.role})`)
        .join(', '),
    })),
  );

  console.log('\n--- Teachers ---');
  const teachers = await prisma.teacher.findMany({
    include: { school: true },
  });
  console.table(
    teachers.map((t) => ({
      id: t.id,
      name: `${t.firstName} ${t.lastName}`,
      schoolId: t.schoolId,
      schoolName: t.school.name,
    })),
  );
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
