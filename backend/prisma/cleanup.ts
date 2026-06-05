import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🧹 Starting selective cleanup...');

    // 1. Delete all user-related data in correct order (due to foreign keys)
    console.log('... Cleaning user-related tables');

    // Order matters to avoid foreign key violations if not using cascade
    await prisma.rolePermission.deleteMany({});
    await prisma.appointmentParticipant.deleteMany({});
    await prisma.appointment.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.message.deleteMany({});
    await prisma.analyticsEvent.deleteMany({});
    await prisma.adminRequest.deleteMany({});
    await prisma.studentComment.deleteMany({});
    await prisma.sanction.deleteMany({});
    await prisma.reward.deleteMany({});
    await prisma.incident.deleteMany({});
    await prisma.payment.deleteMany({});
    await prisma.expense.deleteMany({});
    await prisma.payroll.deleteMany({});
    await prisma.attendance.deleteMany({});
    await prisma.grade.deleteMany({});
    await prisma.storedFile.deleteMany({});

    // Profiles
    await prisma.teacher.deleteMany({});
    await prisma.parent.deleteMany({});
    await prisma.student.deleteMany({});

    // School structure EXCEPT School and Subject
    await prisma.classSession.deleteMany({});
    await prisma.classSubject.deleteMany({});
    await prisma.class.deleteMany({});
    await prisma.academicEvent.deleteMany({});
    await prisma.academicYear.deleteMany({});
    await prisma.schoolConfig.deleteMany({});

    // The links and the users themselves
    await prisma.schoolUser.deleteMany({});
    await prisma.user.deleteMany({});

    // Note: We keep School and Subject as requested
    // Note: We keep PermissionDefinition as requested

    console.log('✨ Cleanup completed! Users removed, Permissions and Subjects preserved.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
