import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function check(email: string, pass: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        console.log(`User ${email} not found.`);
        return;
    }
    const match = await bcrypt.compare(pass, user.password!);
    console.log(`User ${email} matches '${pass}': ${match}`);
}

async function main() {
    await check('jane@doe.com', 'password123');
    await check('john@doe.com', 'password123');
    await check('jane@doe.com', '123456');
    await check('john@doe.com', '123456');
    await check('admin@admin.com', 'admin');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
