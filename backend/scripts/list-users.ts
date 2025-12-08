import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        select: { email: true, firstName: true, lastName: true, isActive: true, schoolUsers: { select: { role: true, school: { select: { name: true } } } } }
    });
    const formatted = users.map(u => ({
        ...u,
        roles: u.schoolUsers.map(su => `${su.role} @ ${su.school.name}`).join(', ')
    }));
    console.table(formatted);
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
