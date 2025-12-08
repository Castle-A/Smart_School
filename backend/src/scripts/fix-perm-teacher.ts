
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Fixing permissions...");

    // 1. Ensure 'teachers.view' exists and is default for CENSEUR
    const teacherView = await prisma.permissionDefinition.upsert({
        where: { code: 'teachers.view' },
        update: {
            role: 'CENSEUR',
            isDefault: true,
            description: 'Voir la liste des enseignants',
            name: 'Voir les enseignants',
            category: 'teachers'
        },
        create: {
            code: 'teachers.view',
            name: 'Voir les enseignants',
            description: 'Voir la liste des enseignants',
            category: 'teachers',
            role: 'CENSEUR',
            isDefault: true
        }
    });
    console.log("Upserted teachers.view:", teacherView);

    // 2. Assign to all existing CENSEUR users if not present
    const censeurs = await prisma.schoolUser.findMany({
        where: { role: 'CENSEUR' },
        include: { rolePermissions: { include: { permissionDefinition: true } } }
    });

    for (const user of censeurs) {
        const hasPerm = user.rolePermissions.some(rp => rp.permissionDefinition.code === 'teachers.view');
        if (!hasPerm) {
            await prisma.rolePermission.create({
                data: {
                    schoolUserId: user.id,
                    permissionDefinitionId: teacherView.id
                }
            });
            console.log(`Assigned teachers.view to user ${user.userId} (SchoolUser ${user.id})`);
        } else {
            console.log(`User ${user.userId} already has teachers.view`);
        }
    }

    // 3. Ensure 'teachers.manage' exists (for Directors/Secretaries)
    const teacherManage = await prisma.permissionDefinition.upsert({
        where: { code: 'teachers.manage' },
        update: {
            role: 'DIRECTOR', // Default role owner
            category: 'teachers'
        },
        create: {
            code: 'teachers.manage',
            name: 'Gérer les enseignants',
            description: 'Créer, modifier et supprimer des enseignants',
            category: 'teachers',
            role: 'DIRECTOR',
            isDefault: true
        }
    });
    console.log("Upserted teachers.manage:", teacherManage);

    // 4. Also Ensure Censors have 'teachers.view' even if their generic role definition didn't catch it (covered by step 2)

    console.log("Permissions fix complete.");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
