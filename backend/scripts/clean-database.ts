import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDatabase() {
    console.log('🧹 Nettoyage de la base de données...\n');

    try {
        // Delete in correct order to respect foreign key constraints

        console.log('Suppression des RolePermissions...');
        await prisma.rolePermission.deleteMany({});

        console.log('Suppression des Notifications...');
        await prisma.notification.deleteMany({});

        console.log('Suppression des Messages...');
        await prisma.message.deleteMany({});

        console.log('Suppression des Grades...');
        await prisma.grade.deleteMany({});

        console.log('Suppression des Attendances...');
        await prisma.attendance.deleteMany({});

        console.log('Suppression des Students...');
        await prisma.student.deleteMany({});

        console.log('Suppression des Subjects...');
        await prisma.subject.deleteMany({});

        console.log('Suppression des Classes...');
        await prisma.class.deleteMany({});

        console.log('Suppression des Teachers...');
        await prisma.teacher.deleteMany({});

        console.log('Suppression des Payments...');
        await prisma.payment.deleteMany({});

        console.log('Suppression des Payrolls...');
        await prisma.payroll.deleteMany({});

        console.log('Suppression des AuditLogs...');
        await prisma.auditLog.deleteMany({});

        console.log('Suppression des SupportLogs...');
        await prisma.supportLog.deleteMany({});

        console.log('Suppression des CalendarEvents...');
        await prisma.calendarEvent.deleteMany({});

        console.log('Suppression des SchoolUsers...');
        await prisma.schoolUser.deleteMany({});

        console.log('Suppression des Users...');
        await prisma.user.deleteMany({});

        console.log('Suppression des Schools...');
        await prisma.school.deleteMany({});

        console.log('\n✅ Base de données nettoyée avec succès !');
        console.log('Vous pouvez maintenant créer de nouveaux comptes de test.\n');

    } catch (error) {
        console.error('❌ Erreur lors du nettoyage:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

cleanDatabase()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
