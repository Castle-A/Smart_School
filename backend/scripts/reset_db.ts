
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🗑️  Starting database reset...');

    try {
        // Delete in order to respect foreign key constraints

        // 1. Child tables (no dependencies on other tables to be deleted later)
        await prisma.rolePermission.deleteMany({});
        console.log('✓ Cleared RolePermissions');

        await prisma.classSubject.deleteMany({});
        console.log('✓ Cleared ClassSubjects');

        await prisma.grade.deleteMany({});
        console.log('✓ Cleared Grades');

        await prisma.attendance.deleteMany({});
        console.log('✓ Cleared Attendance');

        await prisma.payment.deleteMany({});
        console.log('✓ Cleared Payments');

        await prisma.payroll.deleteMany({});
        console.log('✓ Cleared Payrolls');

        await prisma.message.deleteMany({});
        console.log('✓ Cleared Messages');

        await prisma.notification.deleteMany({});
        console.log('✓ Cleared Notifications');

        await prisma.analyticsEvent.deleteMany({});
        console.log('✓ Cleared AnalyticsEvents');

        // 2. Intermediate tables
        await prisma.student.deleteMany({});
        console.log('✓ Cleared Students');

        await prisma.teacher.deleteMany({});
        console.log('✓ Cleared Teachers');

        await prisma.calendarEvent.deleteMany({});
        console.log('✓ Cleared CalendarEvents');

        await prisma.class.deleteMany({});
        console.log('✓ Cleared Classes');

        await prisma.subject.deleteMany({});
        console.log('✓ Cleared Subjects');

        // 3. Core tables
        await prisma.schoolUser.deleteMany({});
        console.log('✓ Cleared SchoolUsers');

        await prisma.school.deleteMany({});
        console.log('✓ Cleared Schools');

        await prisma.user.deleteMany({});
        console.log('✓ Cleared Users');

        // Optional: Clear PermissionDefinitions if you want a FULL wipe (usually not needed if static)
        // await prisma.permissionDefinition.deleteMany({});
        // console.log('✓ Cleared PermissionDefinitions');

        console.log('✨ Database successfully reset!');
    } catch (error) {
        console.error('❌ Error resetting database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
