import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AcademicYearsService } from './academic-years.service';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { YearStatus } from '@prisma/client';

describe('AcademicYearsService', () => {
    let service: AcademicYearsService;
    let prisma: PrismaService;

    const mockPrismaService = {
        academicYear: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
            count: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            updateMany: jest.fn(),
        },
        school: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
        student: {
            findMany: jest.fn(),
        },
        studentAcademicHistory: {
            findMany: jest.fn(),
        },
        $transaction: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AcademicYearsService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<AcademicYearsService>(AcademicYearsService);
        prisma = module.get<PrismaService>(PrismaService);

        // Reset tous les mocks avant chaque test
        jest.clearAllMocks();
    });

    describe('create', () => {
        const schoolId = 'school-123';
        const dto = {
            name: '2024-2025',
            startDate: '2024-09-01',
            endDate: '2025-06-30',
        };

        it('should create first year as ACTIVE', async () => {
            // Arrange
            mockPrismaService.academicYear.findFirst.mockResolvedValue(null);
            mockPrismaService.academicYear.count.mockResolvedValue(0);
            mockPrismaService.academicYear.create.mockResolvedValue({
                id: 'year-1',
                ...dto,
                status: YearStatus.ACTIVE,
                schoolId,
            });
            mockPrismaService.school.update.mockResolvedValue({});

            // Act
            const result = await service.create(schoolId, dto);

            // Assert
            expect(result.status).toBe(YearStatus.ACTIVE);
            expect(mockPrismaService.school.update).toHaveBeenCalledWith({
                where: { id: schoolId },
                data: { activeYearId: 'year-1' },
            });
        });

        it('should block creation if ACTIVE year exists', async () => {
            // Arrange
            mockPrismaService.academicYear.findFirst.mockResolvedValue({
                id: 'active-year',
                name: '2023-2024',
                status: YearStatus.ACTIVE,
            });

            // Act & Assert
            await expect(service.create(schoolId, dto)).rejects.toThrow(
                BadRequestException,
            );
            await expect(service.create(schoolId, dto)).rejects.toThrow(
                /actuellement active/,
            );
        });

        it('should create subsequent years as DRAFT', async () => {
            // Arrange
            mockPrismaService.academicYear.findFirst.mockResolvedValue(null);
            mockPrismaService.academicYear.count.mockResolvedValue(2); // Already 2 years
            mockPrismaService.academicYear.create.mockResolvedValue({
                id: 'year-3',
                ...dto,
                status: YearStatus.DRAFT,
                schoolId,
            });

            // Act
            const result = await service.create(schoolId, dto);

            // Assert
            expect(result.status).toBe(YearStatus.DRAFT);
            expect(mockPrismaService.school.update).not.toHaveBeenCalled();
        });
    });

    describe('validateClosure', () => {
        const schoolId = 'school-123';
        const activeYear = {
            id: 'year-1',
            name: '2023-2024',
            financeCertified: false,
            maternellePrimaireCertified: false,
            collegeLyceeCertified: false,
        };

        it('should return blockers when certifications are missing', async () => {
            // Arrange
            mockPrismaService.school.findUnique.mockResolvedValue({
                id: schoolId,
                activeYear,
            });
            mockPrismaService.student.findMany.mockResolvedValue([]);
            mockPrismaService.studentAcademicHistory.findMany.mockResolvedValue([]);

            // Act
            const result = await service.validateClosure(schoolId);

            // Assert
            expect(result.canClose).toBe(false);
            expect(result.blockers).toHaveLength(3);
            expect(result.blockers).toContain(
                expect.stringContaining('Finances'),
            );
            expect(result.blockers).toContain(
                expect.stringContaining('Maternelle/Primaire'),
            );
            expect(result.blockers).toContain(
                expect.stringContaining('Collège/Lycée'),
            );
        });

        it('should allow closure when all certifications are OK', async () => {
            // Arrange
            const certifiedYear = {
                ...activeYear,
                financeCertified: true,
                maternellePrimaireCertified: true,
                collegeLyceeCertified: true,
            };
            mockPrismaService.school.findUnique.mockResolvedValue({
                id: schoolId,
                activeYear: certifiedYear,
            });
            mockPrismaService.student.findMany.mockResolvedValue([
                { id: 'student-1' },
            ]);
            mockPrismaService.studentAcademicHistory.findMany.mockResolvedValue([
                { studentId: 'student-1' },
            ]);

            // Act
            const result = await service.validateClosure(schoolId);

            // Assert
            expect(result.canClose).toBe(true);
            expect(result.blockers).toHaveLength(0);
            expect(result.financeCertified).toBe(true);
            expect(result.maternellePrimaireCertified).toBe(true);
            expect(result.collegeLyceeCertified).toBe(true);
        });

        it('should throw if no active year', async () => {
            // Arrange
            mockPrismaService.school.findUnique.mockResolvedValue({
                id: schoolId,
                activeYear: null,
            });

            // Act & Assert
            await expect(service.validateClosure(schoolId)).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('closeActiveYear', () => {
        const schoolId = 'school-123';

        it('should close year when all certifications are validated', async () => {
            // Arrange
            const activeYear = {
                id: 'year-1',
                name: '2023-2024',
                financeCertified: true,
                maternellePrimaireCertified: true,
                collegeLyceeCertified: true,
            };
            mockPrismaService.school.findUnique.mockResolvedValue({
                id: schoolId,
                activeYear,
            });
            mockPrismaService.$transaction.mockImplementation(async (callback) => {
                return callback(mockPrismaService);
            });
            mockPrismaService.academicYear.update.mockResolvedValue({
                ...activeYear,
                status: YearStatus.CLOSED,
                closedAt: new Date(),
            });

            // Act
            const result = await service.closeActiveYear(schoolId);

            // Assert
            expect(result.status).toBe(YearStatus.CLOSED);
            expect(mockPrismaService.school.update).toHaveBeenCalledWith({
                where: { id: schoolId },
                data: { activeYearId: null },
            });
        });

        it('should throw when certifications are missing', async () => {
            // Arrange
            const activeYear = {
                id: 'year-1',
                name: '2023-2024',
                financeCertified: true,
                maternellePrimaireCertified: false, // Missing
                collegeLyceeCertified: true,
            };
            mockPrismaService.school.findUnique.mockResolvedValue({
                id: schoolId,
                activeYear,
            });

            // Act & Assert
            await expect(service.closeActiveYear(schoolId)).rejects.toThrow(
                BadRequestException,
            );
            await expect(service.closeActiveYear(schoolId)).rejects.toThrow(
                /Maternelle\/Primaire/,
            );
        });
    });

    describe('certifyMaternellePrimaire', () => {
        it('should certify Maternelle/Primaire cycle', async () => {
            // Arrange
            const schoolId = 'school-123';
            const yearId = 'year-1';
            mockPrismaService.academicYear.findFirst.mockResolvedValue({
                id: yearId,
                name: '2023-2024',
            });
            mockPrismaService.academicYear.update.mockResolvedValue({
                id: yearId,
                maternellePrimaireCertified: true,
            });

            // Act
            const result = await service.certifyMaternellePrimaire(schoolId, yearId);

            // Assert
            expect(result.maternellePrimaireCertified).toBe(true);
            expect(mockPrismaService.academicYear.update).toHaveBeenCalledWith({
                where: { id: yearId },
                data: { maternellePrimaireCertified: true },
            });
        });
    });

    describe('certifyCollegeLycee', () => {
        it('should certify Collège/Lycée cycle', async () => {
            // Arrange
            const schoolId = 'school-123';
            const yearId = 'year-1';
            mockPrismaService.academicYear.findFirst.mockResolvedValue({
                id: yearId,
                name: '2023-2024',
            });
            mockPrismaService.academicYear.update.mockResolvedValue({
                id: yearId,
                collegeLyceeCertified: true,
            });

            // Act
            const result = await service.certifyCollegeLycee(schoolId, yearId);

            // Assert
            expect(result.collegeLyceeCertified).toBe(true);
        });
    });

    describe('certifyFinances', () => {
        it('should certify finances', async () => {
            // Arrange
            const schoolId = 'school-123';
            const yearId = 'year-1';
            mockPrismaService.academicYear.findFirst.mockResolvedValue({
                id: yearId,
                name: '2023-2024',
            });
            mockPrismaService.academicYear.update.mockResolvedValue({
                id: yearId,
                financeCertified: true,
            });

            // Act
            const result = await service.certifyFinances(schoolId, yearId);

            // Assert
            expect(result.financeCertified).toBe(true);
        });
    });
});
