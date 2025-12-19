import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { BulkDecisionsDto } from './dto/bulk-decisions.dto';
import { PromoteStudentsDto } from './dto/promote-students.dto';

@Injectable()
export class TransitionsService {
    constructor(private prisma: PrismaService) { }

    // Save decisions (Draft or Final) - This creates/updates History records but doesn't move students yet?
    // Or we consider "Closing the year" as the move.
    // Usually: 
    // 1. Council meets, inputs averages and decisions -> Saved in History (as 'PREVIEW' or just History).
    // 2. "Apply Transition" -> Updates Student.classId based on History decision.

    async saveDecisions(schoolId: string, dto: BulkDecisionsDto) {
        // Verify class belongs to school
        const classExists = await this.prisma.class.findFirst({
            where: { id: dto.classId, schoolId }
        });
        if (!classExists) throw new NotFoundException('Classe non trouvée');

        // Process decisions using transaction


        // Refined implementation below using transaction
        return this.prisma.$transaction(async (tx) => {
            const processed: any[] = [];
            // Cast to any to bypass persistent IDE type error despite valid schema
            const prismaTx = tx as any;

            for (const d of dto.decisions) {
                // Check existing history for this academic year
                const existing = await prismaTx.studentAcademicHistory.findFirst({
                    where: {
                        studentId: d.studentId,
                        academicYear: dto.academicYear
                    }
                });

                if (existing) {
                    const updated = await prismaTx.studentAcademicHistory.update({
                        where: { id: existing.id },
                        data: {
                            finalAverage: d.average,
                            outcome: d.decision,
                            decision: d.decision === 'PASS' ? 'Admis' : 'Redouble',
                            // Update class info if it was wrong? Unlikely.
                        }
                    });
                    processed.push(updated);
                } else {
                    const created = await prismaTx.studentAcademicHistory.create({
                        data: {
                            studentId: d.studentId,
                            classId: dto.classId,
                            className: classExists.name,
                            academicYear: dto.academicYear,
                            finalAverage: d.average,
                            outcome: d.decision,
                            decision: d.decision === 'PASS' ? 'Admis' : 'Redouble'
                        }
                    });
                    processed.push(created);
                }
            }
            return processed;
        });
    }

    async getClosureStatus(schoolId: string) {
        const school = await this.prisma.school.findUnique({
            where: { id: schoolId },
            include: { activeYear: true }
        });

        if (!school || !school.activeYear) {
            return {
                hasActiveYear: false,
                financeCertified: false,
                academicCertified: false,
                debtsCount: 0,
                pendingDecisionsCount: 0,
                activeStudentsCount: 0
            };
        }

        const activeYear = school.activeYear;

        // Pending Decisions
        // Students in the school who are ACTIVE but have no History record for this year with a Decision
        const activeStudents = await this.prisma.student.findMany({
            where: { schoolId, status: 'ACTIVE' },
            select: { id: true }
        });
        const studentIds = activeStudents.map(s => s.id);

        const decisions = await this.prisma.studentAcademicHistory.findMany({
            where: {
                studentId: { in: studentIds },
                academicYear: activeYear.name
            },
            select: { studentId: true }
        });

        const studentsWithDecision = new Set(decisions.map(d => d.studentId));
        const pendingDecisionsCount = studentIds.filter(id => !studentsWithDecision.has(id)).length;

        // Debts (Mock logic or check Payment status if feasible, for now simplified)
        // In real app, check sum of payments vs Tuition.
        // Let's assume 0 for now or implement basic check later.
        const debtsCount = 0;

        return {
            hasActiveYear: true,
            yearName: activeYear.name,
            financeCertified: activeYear.financeCertified,
            maternellePrimaireCertified: activeYear.maternellePrimaireCertified,
            collegeLyceeCertified: activeYear.collegeLyceeCertified,
            debtsCount,
            pendingDecisionsCount,
            activeStudentsCount: activeStudents.length
        };
    }


    async closeYear(schoolId: string) {
        // 1. Verify certifications
        const school = await this.prisma.school.findUnique({
            where: { id: schoolId },
            include: { activeYear: true }
        });

        if (!school || !school.activeYear) {
            throw new NotFoundException("Pas d'année active");
        }

        if (!school.activeYear.financeCertified ||
            !school.activeYear.maternellePrimaireCertified ||
            !school.activeYear.collegeLyceeCertified) {
            throw new Error("Impossible de clôturer : toutes les certifications (Finance, Maternelle/Primaire, Collège/Lycée) ne sont pas validées.");
        }

        // 2. Transaction: Archive Year, Unset ActiveYear
        return this.prisma.$transaction(async (tx) => {
            // Archive the year object
            await tx.academicYear.update({
                where: { id: school.activeYear!.id },
                data: { isArchived: true }
            });

            // Unlink from school
            await tx.school.update({
                where: { id: schoolId },
                data: { activeYearId: null }
            });

            // Note: Students remain in their classes? 
            // Usually we might want to clear classes or rely on "Promotion" step having moved them.
            // For safety, we leave them as is. The "New Year" setup wizard will likely handle class resets.
        });
    }

    async promoteStudents(schoolId: string, dto: PromoteStudentsDto) {
        // Process per-student transitions
        const processing = dto.transitions.map(async (t) => {
            if (t.action === 'PROMOTE' || t.action === 'REPEAT') {
                if (!t.targetClassId) return; // Skip if no target

                await this.prisma.student.update({
                    where: { id: t.studentId, schoolId },
                    data: { classId: t.targetClassId }
                });
            } else if (t.action === 'ARCHIVE' || t.action === 'GRADUATE') {
                await this.prisma.student.update({
                    where: { id: t.studentId, schoolId },
                    data: { status: 'ARCHIVED', classId: null }
                });
            }
        });

        await Promise.all(processing);
        return { message: "Promotions appliquées", count: dto.transitions.length };
    }
}
