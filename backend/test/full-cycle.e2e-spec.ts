import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/infrastructure/prisma/prisma.service';

describe('SmartSchool Full Cycle Simulation (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let authToken: string;
    let schoolId: string;
    let studentId: string;
    let activeYearId: string;
    let nextClassId: string;

    // Mock Data
    const mockSchool = {
        name: "Simulation School",
        email: "sim@school.com",
        phone: "12345678",
        cycles: "PRIMAIRE",
        plan: "PREMIUM"
    };

    const mockAdmin = {
        email: "admin@sim.com",
        password: "Password123!",
        firstName: "Sim",
        lastName: "Director",
        role: "DIRECTOR"
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
        prisma = app.get<PrismaService>(PrismaService);

        // Clean DB
        // await prisma.cleanDb(); // Assuming we have a clean method or just ignore conflicts
    });

    it('/auth/register (Register Founder & School)', async () => {
        // 1. Register
        const res = await request(app.getHttpServer())
            .post('/auth/register')
            .send({ ...mockAdmin, schoolName: mockSchool.name, schoolPhone: mockSchool.phone, schoolCycles: mockSchool.cycles })
            .expect(201);

        // Login to get token
        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ identifier: mockAdmin.email, password: mockAdmin.password })
            .expect(201);

        authToken = loginRes.body.access_token;
        schoolId = loginRes.body.user.schoolId;
        expect(authToken).toBeDefined();
        expect(schoolId).toBeDefined();
    });

    it('Setup: Create Active Year & Class', async () => {
        // Create Year
        const yearRes = await request(app.getHttpServer())
            .post('/academic-years')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ name: '2023-2024', startDate: '2023-09-01', endDate: '2024-06-30' })
            .expect(201);

        activeYearId = yearRes.body.id;

        // Activate Year
        await request(app.getHttpServer())
            .post(`/academic-years/${activeYearId}/activate`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(201);

        // Create Class (6eme)
        const classRes = await request(app.getHttpServer())
            .post('/classes')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ name: '6eme A', cycle: 'PRIMAIRE', level: '6eme', capacity: 30, tuitionFee: 50000, registrationFee: 10000 })
            .expect(201);

        // Create Next Class (5eme) - for promotion test
        const nextClassRes = await request(app.getHttpServer())
            .post('/classes')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ name: '5eme A', cycle: 'PRIMAIRE', level: '5eme', capacity: 30, tuitionFee: 50000, registrationFee: 10000 })
            .expect(201);

        nextClassId = nextClassRes.body.id;
    });

    it('Module 1: Enroll Student', async () => {
        const res = await request(app.getHttpServer())
            .post('/students')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                firstName: "Jean",
                lastName: "Dupont",
                matricule: "SIM-001",
                dob: "2010-01-01",
                gender: "HOMME",
                paymentAmount: 60000, // Full payment
                classId: null // Pending assignment
            })
            .expect(201);

        studentId = res.body.id;

        // Assign to Class 6eme
        // (Assuming update endpoint or enrollment flow assigns it. Let's update)
        // Actually enrollment DTO often takes classId.
    });

    it('Module 2: Transitions (Decisions)', async () => {
        // 1. Submit Decision: PASS
        await request(app.getHttpServer()) // Using transitions endpoint
            .post('/transitions/decisions')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                academicYear: '2023-2024',
                decisions: [
                    { studentId, decision: 'PASS', average: 15 }
                ]
            })
            .expect(201);
    });

    it('Module 4: Closure Process', async () => {
        // 1. Check Status
        const statusRes = await request(app.getHttpServer())
            .get('/transitions/closure-status')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        expect(statusRes.body.pendingDecisionsCount).toBe(0); // We just decided for the only student

        // 2. Certify Finance
        await request(app.getHttpServer())
            .post('/transitions/certify-finance')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(201);

        // 3. Certify Academic
        await request(app.getHttpServer())
            .post('/transitions/certify-academic')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(201);

        // 4. Close Year
        await request(app.getHttpServer())
            .post('/transitions/close-year')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(201);

        // Verify School has no active year
        // (Optional fetch verify)
    });

    afterAll(async () => {
        // Cleanup
        if (schoolId) {
            // Delete school & users (cascade)
            // prisma.school.delete...
        }
        await app.close();
    });
});
