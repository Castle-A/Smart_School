
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function normalize(value: string): string {
    if (!value) return 'DIVERS';
    const g = value.toUpperCase();

    if (['HOMME', 'MALE', 'M', 'H'].includes(g)) return 'HOMME';
    if (['FEMME', 'FEMALE', 'F'].includes(g)) return 'FEMME';
    if (['DIVERS', 'OTHER', 'D', 'AUTRE'].includes(g)) return 'DIVERS';

    return 'DIVERS'; // Default fallback
}

async function main() {
    console.log('Starting GLOBAL gender normalization...');

    // 1. Normalize Users
    console.log('--- Processing Users ---');
    const users = await prisma.user.findMany({ select: { id: true, gender: true } });
    let userCount = 0;
    for (const r of users) {
        if (!r.gender) continue;
        const newGender = normalize(r.gender);
        if (newGender !== r.gender) {
            await prisma.user.update({ where: { id: r.id }, data: { gender: newGender } });
            userCount++;
        }
    }
    console.log(`Updated ${userCount} Users.`);

    // 2. Normalize Teachers
    console.log('--- Processing Teachers ---');
    const teachers = await prisma.teacher.findMany({ select: { id: true, gender: true } });
    let teacherCount = 0;
    for (const r of teachers) {
        const newGender = normalize(r.gender);
        if (newGender !== r.gender) {
            await prisma.teacher.update({ where: { id: r.id }, data: { gender: newGender } });
            teacherCount++;
        }
    }
    console.log(`Updated ${teacherCount} Teachers.`);

    // 3. Normalize Students
    console.log('--- Processing Students ---');
    const students = await prisma.student.findMany({ select: { id: true, gender: true } });
    let studentCount = 0;
    for (const r of students) {
        const newGender = normalize(r.gender);
        if (newGender !== r.gender) {
            await prisma.student.update({ where: { id: r.id }, data: { gender: newGender } });
            studentCount++;
        }
    }
    console.log(`Updated ${studentCount} Students.`);

    console.log('\n--- Normalization Summary ---');
    console.log(`Users updated: ${userCount}`);
    console.log(`Teachers updated: ${teacherCount}`);
    console.log(`Students updated: ${studentCount}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
