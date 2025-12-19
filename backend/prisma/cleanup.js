const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('🧹 Starting selective cleanup (JS)...');

    try {
        // Order matters to avoid foreign key violations
        console.log('... Cleaning user-related tables');

        const tables = [
            'rolePermission',
            'appointmentParticipant',
            'appointment',
            'notification',
            'message',
            'analyticsEvent',
            'adminRequest',
            'studentComment',
            'sanction',
            'reward',
            'incident',
            'payment',
            'expense',
            'payroll',
            'attendance',
            'grade',
            'storedFile',
            'teacher',
            'parent',
            'student',
            'classSession',
            'classSubject',
            'class',
            'academicEvent',
            'academicYear',
            'schoolConfig',
            'schoolUser',
            'user'
        ];

        for (const table of tables) {
            console.log(`  Deleting from ${table}...`);
            await prisma[table].deleteMany({});
        }

        console.log('✨ Cleanup completed! Users removed, Permissions and Subjects preserved.');
    } catch (error) {
        console.error('❌ Error during cleanup:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
