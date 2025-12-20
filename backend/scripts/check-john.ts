import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'john@doe.com';
  console.log(`Checking user with email: ${email}`);

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      schoolUsers: {
        include: {
          school: true
        }
      }
    }
  });

  if (user) {
    console.log('User found:', {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      schoolUsers: user.schoolUsers
    });
    // Check if password matches a known hash (e.g. 'password123') if we could, 
    // but bcrypt is one-way. We can just say user exists.
  } else {
    console.log('User NOT found.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
