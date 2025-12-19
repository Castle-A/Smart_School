import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { AdminRequestService } from '../admin-requests/admin-requests.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class StudentsService {
    constructor(
        private prisma: PrismaService,
        private adminRequestService: AdminRequestService
    ) { }

    async create(schoolId: string, createStudentDto: CreateStudentDto, userId: string, userRole: string) {
        // ... (rest of method unchanged)
        // Check if matricule exists globally or within school? Usually globally unique or school unique.
        const existing = await this.prisma.student.findUnique({
            where: { matricule: createStudentDto.matricule },
        });

        if (existing) {
            throw new ConflictException('Un élève avec ce matricule existe déjà.');
        }

        const isDirectorOrFounder = ['DIRECTOR', 'FOUNDER', 'ADMIN'].includes(userRole);
        const status = isDirectorOrFounder ? 'ACTIVE' : 'PENDING';

        // Use transaction to ensure student and payments are created together
        const result = await this.prisma.$transaction(async (prisma) => {
            // 1. Create Student
            const student = await prisma.student.create({
                data: {
                    matricule: createStudentDto.matricule,
                    firstName: createStudentDto.firstName,
                    lastName: createStudentDto.lastName,
                    dob: new Date(createStudentDto.dob),
                    gender: createStudentDto.gender,
                    address: createStudentDto.address,
                    classId: createStudentDto.classId,
                    parentName: createStudentDto.parentName,
                    parentPhone: createStudentDto.parentPhone,
                    previousSchool: createStudentDto.previousSchool,
                    schoolId,
                    status,
                },
            });

            // 2. Create Payments if provided
            if (createStudentDto.payment) {
                const { registrationAmount, tuitionAmount, method } = createStudentDto.payment;

                // Record Registration Fee
                if (registrationAmount > 0) {
                    await prisma.payment.create({
                        data: {
                            amount: registrationAmount,
                            reason: "Frais d'inscription",
                            method: method,
                            studentId: student.id,
                            schoolId: schoolId,
                            date: new Date(),
                        }
                    });
                }

                // Record Tuition Fee
                if (tuitionAmount > 0) {
                    await prisma.payment.create({
                        data: {
                            amount: tuitionAmount,
                            reason: "Scolarité (Versement)",
                            method: method,
                            studentId: student.id,
                            schoolId: schoolId,
                            date: new Date(),
                        }
                    });
                }
            }

            return student;
        });

        if (!isDirectorOrFounder) {
            // If Secretary (or other), create validation request
            await this.adminRequestService.create(schoolId, userId, 'VALIDATE_STUDENT_REGISTRATION', {
                studentId: result.id
            });

            return {
                ...result,
                message: 'Inscription soumise pour validation par le Directeur.'
            };
        }

        return result;
    }

    /**
     * Récupère la liste des élèves avec filtrage et pagination par curseur (Expert Performance).
     * Le curseur évite le problème de lenteur du 'skip/offset' sur les gros volumes de données.
     */
    async findAll(schoolId: string, query?: { classId?: string; search?: string; status?: string; take?: number; cursor?: string }) {
        const { classId, search, status, take = 50, cursor } = query || {};

        return this.prisma.student.findMany({
            take: take,
            skip: cursor ? 1 : 0, // On saute l'élément du curseur lui-même si présent
            cursor: cursor ? { id: cursor } : undefined,
            where: {
                schoolId,
                ...(classId ? { classId } : {}),
                ...(status ? { status: status as any } : {}),
                ...(search ? {
                    OR: [
                        { firstName: { contains: search } },
                        { lastName: { contains: search } },
                        { matricule: { contains: search } },
                    ]
                } : {}),
            },
            include: {
                class: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string, schoolId: string) {
        const student = await this.prisma.student.findFirst({
            where: { id, schoolId },
            include: {
                class: true,
                school: { select: { activeYearId: true } } // Include activeYearId for internal use
            }
        });
        if (!student) throw new NotFoundException('Élève non trouvé');
        return student;
    }

    async addComment(studentId: string, authorId: string, content: string, category: string, schoolId: string) {
        // Vérifier que l'élève appartient bien à l'école
        await this.findOne(studentId, schoolId);

        return this.prisma.studentComment.create({
            data: {
                studentId,
                authorId,
                content,
                category, // Ajout de la catégorie (ex: MEDICAL, DISCIPLINE)
            },
            include: {
                author: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });
    }

    /**
     * Met à jour les informations d'un élève
     */
    async update(id: string, schoolId: string, updateDto: any) {
        await this.findOne(id, schoolId);

        return this.prisma.student.update({
            where: { id },
            data: {
                ...updateDto,
                dob: updateDto.dob ? new Date(updateDto.dob) : undefined,
            },
        });
    }

    /**
     * Supprime (soft delete) un élève de l'école
     */
    async remove(id: string, schoolId: string) {
        await this.findOne(id, schoolId);

        return this.prisma.student.update({
            where: { id },
            data: {
                status: 'ARCHIVED',
                deletedAt: new Date(),
            },
        });
    }

    async getComments(studentId: string, schoolId: string) {
        // Verify student belongs to school
        return this.prisma.studentComment.findMany({
            where: { studentId, student: { schoolId } },
            include: { author: { select: { firstName: true, lastName: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }

    async importMany(schoolId: string, studentsData: any[]) {
        // studentsData is array of { firstName, lastName, matricule, dob, gender, parentName, parentPhone, previousSchool, classId? }

        let successCount = 0;
        let errors: string[] = [];

        // For now, allow partial success or transaction?
        // Usually import is all or nothing or "best effort".
        // Let's do transaction for safety ensuring data integrity, or process one by one if we want to report specific errors.
        // Given the requirement "validation", maybe process sequentially and collect errors.

        // However, efficient bulk insert is better.
        // But we need to check matricule uniqueness.

        // Strategy: Filter duplicates first.
        const matricules = studentsData.map(s => s.matricule);
        const existing = await this.prisma.student.findMany({
            where: {
                schoolId,
                matricule: { in: matricules }
            },
            select: { matricule: true }
        });
        const existingMatricules = new Set(existing.map(e => e.matricule));

        const toCreate: Prisma.StudentCreateManyInput[] = [];

        for (const s of studentsData) {
            if (existingMatricules.has(s.matricule)) {
                errors.push(`Matricule ${s.matricule} existe déjà.`);
                continue;
            }

            // Basic validation passed
            toCreate.push({
                firstName: s.firstName,
                lastName: s.lastName,
                matricule: s.matricule,
                dob: new Date(s.dob),
                gender: s.gender,
                schoolId: schoolId,
                classId: s.classId || undefined,
                parentName: s.parentName,
                parentPhone: s.parentPhone,
                previousSchool: s.previousSchool, // Might be undefined (Internal)
                address: s.address,
                status: 'ACTIVE', // Imported students are usually considered accepted/active
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        if (toCreate.length > 0) {
            await this.prisma.student.createMany({
                data: toCreate
            });
            successCount = toCreate.length;
        }

        return {
            imported: successCount,
            total: studentsData.length,
            errors
        };
    }

    /**
     * Transfère un élève (Archivage et retrait de classe) avec traçabilité.
     */
    async transfer(schoolId: string, studentId: string, dto: any, authorId: string) {
        const student = await this.findOne(studentId, schoolId);

        return this.prisma.$transaction(async (tx) => {
            // 1. Mise à jour du statut de l'élève
            const updated = await tx.student.update({
                where: { id: studentId },
                data: {
                    status: 'ARCHIVED',
                    classId: null, // Retrait de la classe actuelle
                    deletedAt: new Date()
                }
            });

            // 2. Création d'un commentaire système pour l'historique du transfert
            await tx.studentComment.create({
                data: {
                    studentId,
                    content: `TRANSFERT SORTANT : ${dto.reason} vers ${dto.destinationSchool || 'Inconnu'}. Date : ${dto.date}`,
                    authorId: authorId // Correction : Utilisation de l'ID de l'utilisateur (Directeur/Fondateur)
                }
            });

            return updated;
        });
    }
}
