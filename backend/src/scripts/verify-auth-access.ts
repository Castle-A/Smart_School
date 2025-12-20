import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../application/auth/auth.service';
import { User } from '../domain/auth/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AnalyticsService } from '../application/analytics/analytics.service';

// Mock dependencies
class MockAuthRepository {
  private users: any[] = [];
  constructor(private prisma: PrismaClient) {}
  async findByIdentifier(email: string) {
    return this.prisma.user
      .findUnique({
        where: { email },
        include: { schoolUsers: true }, // Need to map to domain User if complex, but simple for now
      })
      .then((u) => {
        if (!u) return null;
        // Simple mapping to match what AuthService Expects (flat structure usually from repository)
        // But actually AuthService expects a Domain User.
        // Let's assume the real repository does the join.
        // We will mock the repository behavior by just returning the Prisma user extended.
        return { ...u, role: 'TEACHER', schoolId: 'school-1' };
      });
  }
}

const prisma = new PrismaClient();
const jwtService = new JwtService({ secret: 'test' });
const analyticsService = { trackEvent: jest.fn() } as any;

async function main() {
  console.log('Starting Auth Verification...');

  // 1. Setup Test User
  const email = `test.auth.${Date.now()}@test.com`;
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'Auth',
      isActive: true,
    },
  });

  // Mock Repository that delegates to Prisma but matches interface
  const authRepo = {
    findByIdentifier: async (id: string) => {
      const u = await prisma.user.findUnique({ where: { email: id } });
      return u; // Returns Prisma User which has password, isActive, etc. Match interface loosely.
    },
  } as any;

  // Wrap PrismaClient to match PrismaService interface
  const prismaService = {
    ...prisma,
    onModuleInit: async () => {},
    onModuleDestroy: async () => {},
    tenantContext: {},
  } as any;

  const authService = new AuthService(
    authRepo,
    prismaService,
    jwtService,
    analyticsService,
  );

  try {
    // 2. Test Success
    console.log('\n--- Test 1: Active User Login ---');
    const res1 = await authService.validateUser(email, password);
    if (res1 && res1.email === email) console.log('SUCCESS: Logged in');
    else console.error('FAILURE: Could not log in active user');

    // 3. Test Deactivated
    console.log('\n--- Test 2: Deactivated User Login ---');
    await prisma.user.update({
      where: { id: user.id },
      data: { isActive: false },
    });
    try {
      await authService.validateUser(email, password);
      console.error('FAILURE: Deactivated user logged in!');
    } catch (e: any) {
      if (e.message.includes('désactivé'))
        console.log('SUCCESS: Caught expected error: ' + e.message);
      else console.error('FAILURE: Caught wrong error: ' + e.message);
    }

    // 4. Test Deleted
    console.log('\n--- Test 3: Deleted User Login ---');
    // Reactivate first to isolate delete check
    await prisma.user.update({
      where: { id: user.id },
      data: { isActive: true, deletedAt: new Date() },
    });
    try {
      await authService.validateUser(email, password);
      console.error('FAILURE: Deleted user logged in!');
    } catch (e: any) {
      if (e.message.includes('supprimé'))
        console.log('SUCCESS: Caught expected error: ' + e.message);
      else console.error('FAILURE: Caught wrong error: ' + e.message);
    }
  } finally {
    await prisma.user.delete({ where: { id: user.id } }).catch(() => {});
    await prisma.$disconnect();
  }
}

// Minimal mock for jest.fn if needed or just ignore analytics
// We are running via ts-node, so we need real objects or simple mocks.
// The mock above `analyticsService` is sufficient if type checked loosely or cast.

main().catch(console.error);
