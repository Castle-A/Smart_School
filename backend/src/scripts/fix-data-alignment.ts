
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("🔧 Starting data alignment fix...");

    // 1. Get the primary school (prefer 'Lycée d'Excellence' or first one)
    const school = await prisma.school.findFirst({
        orderBy: { createdAt: 'desc' }
    });

    if (!school) {
        console.error("❌ No school found!");
        return;
    }

    console.log(`🏫 Targets School: ${school.name} (${school.id})`);

    // 2. Align ALL Teachers to this school
    const teachersUpdate = await prisma.teacher.updateMany({
        data: { schoolId: school.id }
    });
    console.log(`✅ Updated ${teachersUpdate.count} teachers to school ${school.id}`);

    // 3. Align ALL SchoolUsers (Directors, Censors, etc.) to this school
    const schoolUsersUpdate = await prisma.schoolUser.updateMany({
        data: { schoolId: school.id }
    });
    console.log(`✅ Updated ${schoolUsersUpdate.count} schoolUsers to school ${school.id}`);

    console.log("🏁 Fix complete. All data should be visible now.");
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
