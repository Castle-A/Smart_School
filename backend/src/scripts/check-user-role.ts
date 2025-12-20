import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'molly@rog.com'; // From screenshot
  console.log(`Checking user: ${email}`);

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      schoolUsers: true,
    },
  });

  if (!user) {
    console.log('User not found!');

    // Try fuzzy search
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { firstName: { contains: 'Molly' } },
          { lastName: { contains: 'Molly' } },
          { firstName: { contains: 'Ally' } },
        ],
      },
      include: { schoolUsers: true },
    });

    console.log('Fuzzy search results:', JSON.stringify(users, null, 2));
    return;
  }

  console.log('User found:', {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    loginMethod: user.loginMethod,
    platformRole: user.platformRole,
  });

  console.log(
    'School Users (Roles):',
    JSON.stringify(user.schoolUsers, null, 2),
  );
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
