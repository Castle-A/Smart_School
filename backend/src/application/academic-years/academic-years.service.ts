import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { CreateNextYearDto, StudentStrategy } from './dto/create-next-year.dto';
import { ClosureValidation, TransitionPreview, TransitionReport } from './dto/year-responses.interface';
import { YearStatus } from '@prisma/client';

@Injectable()
export class AcademicYearsService {
    private readonly logger = new Logger(AcademicYearsService.name);

    constructor(private prisma: PrismaService) { }

    /**
     * Créer une nouvelle année scolaire
     * Règle critique : Impossible si une année ACTIVE existe déjà
     * Exception : La toute première année (count = 0) est auto-activée
     */
    async create(schoolId: string, dto: CreateAcademicYearDto) {
        this.logger.log(`Creating academic year ${dto.name} for school ${schoolId}`);

        // 1. Vérifier qu'aucune année ACTIVE n'existe (sauf première fois)
        const activeYear = await this.prisma.academicYear.findFirst({
            where: { schoolId, status: YearStatus.ACTIVE }
        });

        if (activeYear) {
            throw new BadRequestException(
                `Impossible de créer une nouvelle année. ` +
                `L'année "${activeYear.name}" est actuellement active. ` +
                `Veuillez d'abord la clôturer dans Programme Scolaire > Clôturer l'Année.`
            );
        }

        // 2. Compter les années existantes pour détecter la première
        const existingYears = await this.prisma.academicYear.count({
            where: { schoolId }
        });

        const isFirstYear = existingYears === 0;

        // 3. Créer l'année (ACTIVE si première, sinon DRAFT)
        const newYear = await this.prisma.academicYear.create({
            data: {
                schoolId,
                name: dto.name,
                startDate: new Date(dto.startDate),
                endDate: new Date(dto.endDate),
                status: isFirstYear ? YearStatus.ACTIVE : YearStatus.DRAFT,
                isArchived: false,
            }
        });

        // 4. Si première année, mettre à jour le lien activeYear de l'école
        if (isFirstYear) {
            await this.prisma.school.update({
                where: { id: schoolId },
                data: { activeYearId: newYear.id }
            });

            this.logger.log(`First year created and auto-activated: ${newYear.name}`);
        } else {
            this.logger.log(`Year created in DRAFT status: ${newYear.name}`);
        }

        return newYear;
    }

    /**
     * Lister toutes les années d'une école
     * Retourne les années avec un flag isActive calculé
     */
    async findAll(schoolId: string) {
        const years = await this.prisma.academicYear.findMany({
            where: { schoolId },
            orderBy: { startDate: 'desc' }, // Plus récente en premier
            include: {
                _count: {
                    select: {
                        transitionsTo: true,   // Nombre de logs reçus
                        transitionsFrom: true, // Nombre de logs envoyés
                    }
                }
            }
        });

        const school = await this.prisma.school.findUnique({
            where: { id: schoolId },
            select: { activeYearId: true }
        });

        return years.map(year => ({
            ...year,
            isActive: year.id === school?.activeYearId,
        }));
    }

    /**
     * Obtenir une année avec statistiques détaillées
     */
    async getYearWithStats(schoolId: string, yearId: string) {
        const year = await this.prisma.academicYear.findFirst({
            where: { id: yearId, schoolId }
        });

        if (!year) {
            throw new NotFoundException("Année scolaire introuvable");
        }

        // Récupérer les statistiques
        const [classesCount, studentsCount] = await Promise.all([
            this.prisma.class.count({ where: { schoolId } }),
            this.prisma.student.count({ where: { schoolId, status: 'ACTIVE' } }),
        ]);

        return {
            ...year,
            stats: {
                classesCount,
                studentsCount,
            }
        };
    }

    /**
     * Activer une année scolaire
     * Désactive automatiquement l'année active actuelle
     */
    async activate(schoolId: string, yearId: string) {
        // Vérifier que l'année appartient bien à l'école
        const year = await this.prisma.academicYear.findFirst({
            where: { id: yearId, schoolId }
        });

        if (!year) {
            throw new NotFoundException("Année introuvable");
        }

        if (year.status === YearStatus.ACTIVE) {
            throw new BadRequestException("Cette année est déjà active");
        }

        this.logger.log(`Activating year ${year.name} for school ${schoolId}`);

        // Transaction : désactiver l'ancienne + activer la nouvelle
        return this.prisma.$transaction(async (tx) => {
            // 1. Désactiver toutes les années actives (normalement il n'y en a qu'une)
            await tx.academicYear.updateMany({
                where: { schoolId, status: YearStatus.ACTIVE },
                data: { status: YearStatus.CLOSED }
            });

            // 2. Activer la nouvelle année
            const activated = await tx.academicYear.update({
                where: { id: yearId },
                data: { status: YearStatus.ACTIVE }
            });

            // 3. Mettre à jour le lien dans School
            await tx.school.update({
                where: { id: schoolId },
                data: { activeYearId: yearId }
            });

            this.logger.log(`Year ${activated.name} successfully activated`);
            return activated;
        });
    }

    /**
     * Valider si l'année active peut être clôturée
     * Retourne une checklist complète des validations
     */
    async validateClosure(schoolId: string): Promise<ClosureValidation> {
        const school = await this.prisma.school.findUnique({
            where: { id: schoolId },
            include: { activeYear: true }
        });

        if (!school || !school.activeYear) {
            throw new NotFoundException("Aucune année active trouvée");
        }

        const activeYear = school.activeYear;
        const blockers: string[] = [];

        // 1. Vérifier les 3 certifications indépendantes
        const financeCertified = activeYear.financeCertified;
        const maternellePrimaireCertified = activeYear.maternellePrimaireCertified;
        const collegeLyceeCertified = activeYear.collegeLyceeCertified;

        if (!financeCertified) {
            blockers.push("Les finances n'ont pas été certifiées par le comptable");
        }
        if (!maternellePrimaireCertified) {
            blockers.push("Le cycle Maternelle/Primaire n'a pas été certifié par le directeur");
        }
        if (!collegeLyceeCertified) {
            blockers.push("Le cycle Collège/Lycée n'a pas été certifié par le directeur");
        }

        // 2. Vérifier décisions de conseil pour tous les élèves actifs
        const activeStudents = await this.prisma.student.findMany({
            where: { schoolId, status: 'ACTIVE' },
            select: { id: true }
        });

        const studentsWithDecision = await this.prisma.studentAcademicHistory.findMany({
            where: {
                studentId: { in: activeStudents.map(s => s.id) },
                academicYear: activeYear.name
            },
            select: { studentId: true }
        });

        const studentsWithoutDecision = activeStudents.length - studentsWithDecision.length;
        const allStudentsDecided = studentsWithoutDecision === 0;

        if (!allStudentsDecided) {
            blockers.push(`${studentsWithoutDecision} élève(s) sans décision de conseil de classe`);
        }

        // 3. Vérifications additionnelles (simplifiées pour l'instant)
        const noOutstandingGrades = true; // TODO: implémenter si nécessaire
        const yearEndReportsGenerated = true; // TODO: implémenter avec module bulletins

        const canClose = financeCertified && maternellePrimaireCertified && collegeLyceeCertified && allStudentsDecided;

        return {
            financeCertified,
            maternellePrimaireCertified,
            collegeLyceeCertified,
            allStudentsDecided,
            noOutstandingGrades,
            yearEndReportsGenerated,
            canClose,
            blockers,
            stats: {
                totalStudents: activeStudents.length,
                studentsWithDecision: studentsWithDecision.length,
                pendingGradesCount: 0, // TODO
                pendingReportsCount: 0 // TODO
            }
        };
    }

    /**
     * Clôturer l'année active
     * Vérifie les certifications avant de fermer
     */
    async closeActiveYear(schoolId: string) {
        const school = await this.prisma.school.findUnique({
            where: { id: schoolId },
            include: { activeYear: true }
        });

        if (!school || !school.activeYear) {
            throw new NotFoundException("Aucune année active à clôturer");
        }

        const activeYear = school.activeYear;

        // Valider que TOUTES les certifications sont OK (3 certifications)
        if (!activeYear.financeCertified || !activeYear.maternellePrimaireCertified || !activeYear.collegeLyceeCertified) {
            const missing: string[] = [];
            if (!activeYear.financeCertified) missing.push('Finances');
            if (!activeYear.maternellePrimaireCertified) missing.push('Maternelle/Primaire');
            if (!activeYear.collegeLyceeCertified) missing.push('Collège/Lycée');

            throw new BadRequestException(
                `Impossible de clôturer : certifications manquantes → ${missing.join(', ')}`
            );
        }

        this.logger.log(`Closing active year ${activeYear.name} for school ${schoolId}`);

        // Transaction : fermer l'année + désactiver le lien
        return this.prisma.$transaction(async (tx) => {
            // 1. Mettre à jour le statut
            const closed = await tx.academicYear.update({
                where: { id: activeYear.id },
                data: {
                    status: YearStatus.CLOSED,
                    closedAt: new Date()
                }
            });

            // 2. Retirer le lien activeYear de l'école
            await tx.school.update({
                where: { id: schoolId },
                data: { activeYearId: null }
            });

            this.logger.log(`Year ${closed.name} successfully closed`);
            return closed;
        });
    }

    /**
     * Archiver une année fermée
     */
    async archiveYear(schoolId: string, yearId: string) {
        const year = await this.prisma.academicYear.findFirst({
            where: { id: yearId, schoolId }
        });

        if (!year) {
            throw new NotFoundException("Année introuvable");
        }

        if (year.status !== YearStatus.CLOSED) {
            throw new BadRequestException("Seules les années clôturées peuvent être archivées");
        }

        this.logger.log(`Archiving year ${year.name}`);

        return this.prisma.academicYear.update({
            where: { id: yearId },
            data: {
                status: YearStatus.ARCHIVED,
                isArchived: true,
                archivedAt: new Date()
            }
        });
    }

    /**
     * Certifier le cycle Maternelle/Primaire
     * Réservé au Directeur Maternelle/Primaire
     */
    async certifyMaternellePrimaire(schoolId: string, yearId: string) {
        const year = await this.prisma.academicYear.findFirst({
            where: { id: yearId, schoolId }
        });

        if (!year) {
            throw new NotFoundException("Année introuvable");
        }

        this.logger.log(`Certifying Maternelle/Primaire for year ${year.name}`);

        return this.prisma.academicYear.update({
            where: { id: yearId },
            data: { maternellePrimaireCertified: true }
        });
    }

    /**
     * Certifier le cycle Collège/Lycée
     * Réservé au Directeur Collège/Lycée
     */
    async certifyCollegeLycee(schoolId: string, yearId: string) {
        const year = await this.prisma.academicYear.findFirst({
            where: { id: yearId, schoolId }
        });

        if (!year) {
            throw new NotFoundException("Année introuvable");
        }

        this.logger.log(`Certifying Collège/Lycée for year ${year.name}`);

        return this.prisma.academicYear.update({
            where: { id: yearId },
            data: { collegeLyceeCertified: true }
        });
    }

    /**
     * Certifier les finances (global pour toute l'école)
     * Réservé au Comptable
     */
    async certifyFinances(schoolId: string, yearId: string) {
        const year = await this.prisma.academicYear.findFirst({
            where: { id: yearId, schoolId }
        });

        if (!year) {
            throw new NotFoundException("Année introuvable");
        }

        this.logger.log(`Certifying finances for year ${year.name}`);

        return this.prisma.academicYear.update({
            where: { id: yearId },
            data: { financeCertified: true }
        });
    }
}
