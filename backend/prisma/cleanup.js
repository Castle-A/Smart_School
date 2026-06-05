"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🧹 Starting selective cleanup...');
    console.log('... Cleaning user-related tables');
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
    await prisma.teacher.deleteMany({});
    await prisma.parent.deleteMany({});
    await prisma.student.deleteMany({});
    await prisma.classSession.deleteMany({});
    await prisma.classSubject.deleteMany({});
    await prisma.class.deleteMany({});
    await prisma.academicEvent.deleteMany({});
    await prisma.academicYear.deleteMany({});
    await prisma.schoolConfig.deleteMany({});
    await prisma.schoolUser.deleteMany({});
    await prisma.user.deleteMany({});
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
//# sourceMappingURL=cleanup.js.map