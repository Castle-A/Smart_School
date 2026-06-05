import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
    DIRECTOR_PERMISSIONS,
    SECRETARY_PERMISSIONS,
    SUPERVISOR_PERMISSIONS,
    CENSOR_PERMISSIONS,
    ACCOUNTANT_PERMISSIONS
} from '../src/shared/constants/permissions.constants';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // 0. Seed Permission Definitions
    console.log('... Seeding Permissions Definitions');
    const allPermissions = [
        ...DIRECTOR_PERMISSIONS,
        ...SECRETARY_PERMISSIONS,
        ...SUPERVISOR_PERMISSIONS,
        ...CENSOR_PERMISSIONS,
        ...ACCOUNTANT_PERMISSIONS
    ];
    const uniquePermissions = Array.from(new Map(allPermissions.map(item => [item.code, item])).values());

    for (const perm of uniquePermissions) {
        await prisma.permissionDefinition.upsert({
            where: { code: perm.code },
            update: {
                name: perm.name,
                description: perm.description,
                category: perm.category,
                isDefault: perm.isDefault,
                directorType: perm.directorType
            },
            create: {
                code: perm.code,
                name: perm.name,
                description: perm.description,
                category: perm.category,
                role: 'ALL',
                isDefault: perm.isDefault,
                directorType: perm.directorType
            }
        });
    }

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
    const schoolUser = await prisma.schoolUser.create({
        data: {
            userId: founder.id,
            schoolId: school.id,
            role: 'FOUNDER',
            directorType: 'BOTH',
        },
    });
    console.log('🔗 Founder linked to School');

    // 3b. Assign ALL permissions to Founder
    console.log('... Assigning Permissions to Founder');
    for (const perm of uniquePermissions) {
        const permDef = await prisma.permissionDefinition.findUnique({ where: { code: perm.code } });
        if (permDef) {
            await prisma.rolePermission.create({
                data: {
                    schoolUserId: schoolUser.id,
                    permissionDefinitionId: permDef.id
                }
            });
        }
    }


    // 4. Create some basic classes
    await prisma.class.createMany({
        data: [
            { name: '6ème A', cycle: 'COLLEGE', level: '6eme', schoolId: school.id },
            { name: '3ème B', cycle: 'COLLEGE', level: '3eme', schoolId: school.id },
            { name: 'CP A', cycle: 'PRIMAIRE', level: 'CP', schoolId: school.id },
        ],
    });
    console.log('📚 Basic classes created');

    const classes = await prisma.class.findMany({ where: { schoolId: school.id } });

    // 5. Create Test Users (Jane Doe & others)
    console.log('... Creating Test Users (Jane Doe, etc.)');
    const testUsers = [
        { email: 'jane.doe@smartschool.ci', first: 'Jane', last: 'Doe', role: 'TEACHER' as const },
        { email: 'secretary@smartschool.ci', first: 'Alice', last: 'Secretary', role: 'SECRETARY' as const },
    ];

    for (const u of testUsers) {
        const user = await prisma.user.create({
            data: {
                email: u.email,
                password: passwordHash,
                firstName: u.first,
                lastName: u.last,
                gender: 'FEMME',
                phone: u.email === 'jane.doe@smartschool.ci' ? '0607080910' : '0708091011',
                mustChangePassword: false,
                isActive: true,
                loginMethod: 'email',
            }
        });

        await prisma.schoolUser.create({
            data: {
                userId: user.id,
                schoolId: school.id,
                role: u.role,
            }
        });
        console.log(`👤 User created: ${u.email} (${u.role})`);
    }

    // 6. Populate Subjects from Template
    console.log('... Populating Subjects from Benin Template');
    // Import dynamically or copied logic because import paths might be tricky in ts-node if not configured? 
    // Ideally we import. Let's try importing constants.
    // NOTE: importing from ../src might fail if tsconfig is strict about rootDir. 
    // I will use a local definition for safety in this seed script to avoid build issues.

    const SUBJECTS_TEMPLATE = [
        // PRIMAIRE
        { name: 'Lecture', cycle: 'PRIMAIRE', coef: 1 },
        { name: 'Mathématiques', cycle: 'PRIMAIRE', coef: 1 },
        { name: 'Expression Écrite', cycle: 'PRIMAIRE', coef: 1 },
        // COLLEGE / LYCEE
        { name: 'Français', cycle: 'COLLEGE', coef: 3 },
        { name: 'Mathématiques', cycle: 'COLLEGE', coef: 3 },
        { name: 'Anglais', cycle: 'COLLEGE', coef: 2 },
        { name: 'Physique-Chimie-Technologie', cycle: 'COLLEGE', coef: 2 },
        { name: 'SVT', cycle: 'COLLEGE', coef: 2 },
        { name: 'Histoire-Géographie', cycle: 'COLLEGE', coef: 2 },
        { name: 'Philosophie', cycle: 'LYCEE', coef: 2 },
    ];

    for (const subj of SUBJECTS_TEMPLATE) {
        await prisma.subject.create({
            data: {
                name: subj.name,
                coefficient: subj.coef,
                cycle: subj.cycle, // Assuming simplified mapping for this seed
                schoolId: school.id
            }
        })
    }
    console.log(`📚 ${SUBJECTS_TEMPLATE.length} Subjects created for the school.`);

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
