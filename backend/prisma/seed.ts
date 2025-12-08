import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // 1. Create School
    const school = await prisma.school.create({
        data: {
            name: 'Lycée d\'Excellence d\'Abidjan',
            cycles: 'PRIMAIRE,COLLEGE',
            email: 'contact@lycee-excellence.ci',
            plan: 'PREMIUM',
            isActive: true,
        },
    });
    console.log('🏫 School created:', school.name);

    // 2. Create Founder User
    const passwordHash = await bcrypt.hash('password123', 10);
    const founder = await prisma.user.create({
        data: {
            email: 'admin@smartschool.ci',
            password: passwordHash,
            firstName: 'Jean',
            lastName: 'Kouassi',
            gender: 'HOMME',
            phone: '0102030405',
            profilePicture: null,
            mustChangePassword: false, // Bypass change password for dev
            isActive: true,
            loginMethod: 'email',
        },
    });
    console.log('👤 Founder created:', founder.email);

    // 3. Link User to School as Founder
    await prisma.schoolUser.create({
        data: {
            userId: founder.id,
            schoolId: school.id,
            role: 'FOUNDER',
            directorType: 'BOTH',
        },
    });
    console.log('🔗 Founder linked to School');

    // 4. Create some basic classes
    await prisma.class.createMany({
        data: [
            { name: '6ème A', cycle: 'COLLEGE', level: '6eme', schoolId: school.id },
            { name: '3ème B', cycle: 'COLLEGE', level: '3eme', schoolId: school.id },
            { name: 'CP A', cycle: 'PRIMAIRE', level: 'CP', schoolId: school.id },
        ],
    });
    console.log('📚 Basic classes created');

    console.log('✅ Seed completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
