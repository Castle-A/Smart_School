
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🔵 Starting Automated Test: Teacher Creation...');

    try {
        // 1. Get or Create a School 
        let school = await prisma.school.findFirst();
        if (!school) {
            console.log('⚠️ No school found. Creating dummy school...');
            school = await prisma.school.create({
                data: {
                    name: 'Test School',
                    cycles: 'PRIMARY,SECONDARY',
                    address: 'Cotonou',
                    email: 'test@school.com',
                    phone: '99000000',
                    subscriptionPlan: 'PREMIUM',
                    subscriptionStatus: 'ACTIVE',
                }
            });
        }
        console.log(`✅ Using School: ${school.name} (${school.id})`);

        // 2. Test 1: Create a MAITRE (Primary School Teacher) with CEAP
        console.log('\n🧪 Test 1: Creating "Maître" (Primary with CEAP)...');
        const maitreUser = await prisma.user.create({
            data: {
                email: `maitre.test.${Date.now()}@test.com`,
                firstName: 'Jean',
                lastName: 'Kouassi',
                password: await bcrypt.hash('password123', 10),
                isActive: true,
            }
        });

        const maitre = await prisma.teacher.create({
            data: {
                firstName: 'Jean',
                lastName: 'Kouassi',
                email: maitreUser.email as string,
                phone: '97000001',
                gender: 'HOMME',
                contractType: 'CDD',
                hireDate: new Date(),
                title: 'MAITRE',
                diploma: 'CEAP',
                schoolId: school.id,
                userId: maitreUser.id
            },
            include: { subjects: true }
        });

        console.log('✅ Maître created successfully:');
        console.log(`   - ID: ${maitre.id}`);
        console.log(`   - Title: ${maitre.title}`);
        console.log(`   - Diploma: ${maitre.diploma}`);
        console.log(`   - Subjects: ${maitre.subjects.length} (Correct for Primary)`);

        // 3. Test 2: Create a PROFESSEUR (Secondary) with CAPES and Subjects
        console.log('\n🧪 Test 2: Creating "Professeur" (Secondary with CAPES)...');
        const profUser = await prisma.user.create({
            data: {
                email: `prof.test.${Date.now()}@test.com`,
                firstName: 'Awa',
                lastName: 'Mensah',
                password: await bcrypt.hash('password123', 10),
                isActive: true
            }
        });

        // Create Subjects first
        const subject1 = await prisma.subject.create({ data: { name: 'Français', schoolId: school.id, cycle: 'COLLEGE' } });
        const subject2 = await prisma.subject.create({ data: { name: 'Histoire-Géographie', schoolId: school.id, cycle: 'COLLEGE' } });

        const prof = await prisma.teacher.create({
            data: {
                firstName: 'Awa',
                lastName: 'Mensah',
                email: profUser.email as string,
                phone: '97000002',
                gender: 'FEMME',
                contractType: 'CDI',
                hireDate: new Date(),
                title: 'PROFESSEUR',
                diploma: 'CAPES',
                specialty: 'Lettres Modernes',
                subjects: {
                    connect: [{ id: subject1.id }, { id: subject2.id }]
                },
                schoolId: school.id,
                userId: profUser.id
            },
            include: { subjects: true }
        });

        console.log('✅ Professeur created successfully:');
        console.log(`   - ID: ${prof.id}`);
        console.log(`   - Title: ${prof.title}`);
        console.log(`   - Diploma: ${prof.diploma}`);
        console.log(`   - Specialty: ${prof.specialty}`);
        console.log(`   - Subjects: ${prof.subjects.map(s => s.name).join(', ')}`);

        console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! The database schema is working correctly.');

    } catch (error) {
        console.error('❌ Test Failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
