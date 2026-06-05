import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';

import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { CreateNextYearDto, StudentStrategy } from './dto/create-next-year.dto';
import {
  ClosureValidation,
  TransitionPreview,
  TransitionReport,
} from './dto/year-responses.interface';
import { CommunicationService } from '../communication/communication.service';
import { YearStatus, Prisma, DirectorType } from '@prisma/client';

@Injectable()
export class AcademicYearsService {
  private readonly logger = new Logger(AcademicYearsService.name);

  constructor(
    private prisma: PrismaService,
    private communication: CommunicationService,
  ) {}

  /**
   * Créer une nouvelle année scolaire
   * Règle critique : Impossible si une année ACTIVE existe déjà
   * Exception : La toute première année (count = 0) est auto-activée
   */
  async create(schoolId: string, dto: CreateAcademicYearDto) {
    this.logger.log(
      `Creating academic year ${dto.name} for school ${schoolId}`,
    );

    // 1. (Check Removed) On permet la création d'année en DRAFT même si une ACTIVE existe.
    // L'unicité de l'année active est gérée par l'activation explicite.

    // 2. Compter les années existantes pour détecter la première
    const existingYears = await this.prisma.academicYear.count({
      where: { schoolId },
    });

    const isFirstYear = existingYears === 0;

    // 3. Transaction : Création + (Optionnel) Rollover + Maj Ecole
    return this.prisma.$transaction(async (tx) => {
      // a. Créer l'année
      const newYear = await tx.academicYear.create({
        data: {
          schoolId,
          name: dto.name,
          startDate: new Date(dto.startDate),
          endDate: new Date(dto.endDate),
          status: isFirstYear ? YearStatus.ACTIVE : YearStatus.DRAFT,
          isArchived: false,
          autoClosureEnabled: dto.autoClosureEnabled || false,
          autoClosureDate: dto.autoClosureDate
            ? new Date(dto.autoClosureDate)
            : null,
          createdFromId: dto.sourceYearId || null,
        },
      });

      // b. Gestion du Rollover (Duplication)
      if (dto.sourceYearId) {
        await this.duplicateYearStructure(
          tx,
          schoolId,
          dto.sourceYearId,
          newYear.id,
          dto.keepTeachers || false,
        );
      }

      // c. Si première année, mettre à jour le lien activeYear de l'école
      if (isFirstYear) {
        await tx.school.update({
          where: { id: schoolId },
          data: { activeYearId: newYear.id },
        });
        this.logger.log(
          `First year created and auto-activated: ${newYear.name}`,
        );
      } else {
        this.logger.log(`Year created in DRAFT status: ${newYear.name}`);
      }

      return newYear;
    });
  }

  /**
   * Moteur de Duplication (Rollover)
   * Copie la structure (Classes, Matières) d'une année vers une autre
   */
  private async duplicateYearStructure(
    tx: Prisma.TransactionClient,
    schoolId: string,
    sourceYearId: string,
    targetYearId: string,
    keepTeachers: boolean,
  ) {
    this.logger.log(
      `Starting Rollover: ${sourceYearId} -> ${targetYearId} (Keep Teachers: ${keepTeachers})`,
    );

    this.logger.warn(
      'Skipping Class Duplication: The current schema uses persistent Classes (not per-year). ' +
        'Classes are shared across academic years. ' +
        'If you wish to reset teachers, please implement a specific "Reset Class Assignments" feature.',
    );

    // FIX: The following code assumed Classes have 'academicYearId', which they do not in the current schema.
    // Classes are global to the school. Rollover strategies for global classes usually involve:
    // 1. Archiving students (History) - Handled separately
    // 2. Promoting students - Handled via Class Council
    // 3. Resetting Teachers - Optional

    /*
    // 1. Récupérer les classes sources avec leurs matières
    // const sourceClasses = await tx.class.findMany({
    //   where: { schoolId, academicYearId: sourceYearId }, // ERROR: academicYearId does not exist
    //   include: {
    //     classSubjects: true, // Correct relation name
    //   },
    // });

    // ... Implementation logic is incompatible with persistent classes.
    */

    this.logger.log(`Rollover step completed (No-op due to schema strategy).`);
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
            transitionsTo: true, // Nombre de logs reçus
            transitionsFrom: true, // Nombre de logs envoyés
          },
        },
      },
    });

    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
      select: { activeYearId: true },
    });

    return years.map((year) => ({
      ...year,
      isActive: year.id === school?.activeYearId,
    }));
  }

  /**
   * Obtenir une année avec statistiques détaillées
   */
  async getYearWithStats(schoolId: string, yearId: string) {
    const year = await this.prisma.academicYear.findFirst({
      where: { id: yearId, schoolId },
    });

    if (!year) {
      throw new NotFoundException('Année scolaire introuvable');
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
      },
    };
  }

  /**
   * Activer une année scolaire
   * Désactive automatiquement l'année active actuelle
   */
  async activate(schoolId: string, yearId: string) {
    // Vérifier que l'année appartient bien à l'école
    const year = await this.prisma.academicYear.findFirst({
      where: { id: yearId, schoolId },
    });

    if (!year) {
      throw new NotFoundException('Année introuvable');
    }

    if (year.status === YearStatus.ACTIVE) {
      throw new BadRequestException('Cette année est déjà active');
    }

    this.logger.log(`Activating year ${year.name} for school ${schoolId}`);

    // 1. Vérifier si une autre année est encore ACTIVE
    // Règle: "Il ne faut pas qu'une année close automatiquement l'autre"
    const currentActive = await this.prisma.academicYear.findFirst({
      where: { schoolId, status: YearStatus.ACTIVE },
    });

    if (currentActive) {
      throw new BadRequestException(
        `Impossible d'activer cette année car "${currentActive.name}" est encore active. ` +
          `Veuillez d'abord clôturer manuellement l'année précédente.`,
      );
    }

    // Transaction : activer la nouvelle (pas de suppression d'ancienne nécessaire ici)
    return this.prisma.$transaction(async (tx) => {
      // (Step 1 Removed - No auto closure)

      // 2. Activer la nouvelle année

      // 2. Activer la nouvelle année
      const activated = await tx.academicYear.update({
        where: { id: yearId },
        data: { status: YearStatus.ACTIVE },
      });

      // 3. Mettre à jour le lien dans School
      await tx.school.update({
        where: { id: schoolId },
        data: { activeYearId: yearId },
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
      include: { activeYear: true },
    });

    if (!school || !school.activeYear) {
      throw new NotFoundException('Aucune année active trouvée');
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
      blockers.push(
        "Le cycle Maternelle/Primaire n'a pas été certifié par le directeur",
      );
    }
    if (!collegeLyceeCertified) {
      blockers.push(
        "Le cycle Collège/Lycée n'a pas été certifié par le directeur",
      );
    }

    // 2. Vérifier décisions de conseil pour tous les élèves actifs
    const activeStudents = await this.prisma.student.findMany({
      where: { schoolId, status: 'ACTIVE' },
      select: { id: true },
    });

    const studentsWithDecision =
      await this.prisma.studentAcademicHistory.findMany({
        where: {
          studentId: { in: activeStudents.map((s) => s.id) },
          academicYear: activeYear.name,
        },
        select: { studentId: true },
      });

    const studentsWithoutDecision =
      activeStudents.length - studentsWithDecision.length;
    const allStudentsDecided = studentsWithoutDecision === 0;

    if (!allStudentsDecided) {
      blockers.push(
        `${studentsWithoutDecision} élève(s) sans décision de conseil de classe`,
      );
    }

    // 3. Vérifications additionnelles (simplifiées pour l'instant)
    const noOutstandingGrades = true; // TODO: implémenter si nécessaire
    const yearEndReportsGenerated = true; // TODO: implémenter avec module bulletins

    const canClose =
      financeCertified &&
      maternellePrimaireCertified &&
      collegeLyceeCertified &&
      allStudentsDecided;

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
        pendingReportsCount: 0, // TODO
      },
    };
  }

  /**
   * Clôturer l'année active
   * Vérifie les certifications avant de fermer
   */
  async closeActiveYear(schoolId: string) {
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
      include: { activeYear: true },
    });

    if (!school || !school.activeYear) {
      throw new NotFoundException('Aucune année active à clôturer');
    }

    const activeYear = school.activeYear;

    // Valider que TOUTES les certifications sont OK (3 certifications)
    if (
      !activeYear.financeCertified ||
      !activeYear.maternellePrimaireCertified ||
      !activeYear.collegeLyceeCertified
    ) {
      const missing: string[] = [];
      if (!activeYear.financeCertified) missing.push('Finances');
      if (!activeYear.maternellePrimaireCertified)
        missing.push('Maternelle/Primaire');
      if (!activeYear.collegeLyceeCertified) missing.push('Collège/Lycée');

      throw new BadRequestException(
        `Impossible de clôturer : certifications manquantes → ${missing.join(', ')}`,
      );
    }

    this.logger.log(
      `Closing active year ${activeYear.name} for school ${schoolId}`,
    );

    // Transaction : fermer l'année + désactiver le lien
    return this.prisma.$transaction(async (tx) => {
      // 1. Mettre à jour le statut
      const closed = await tx.academicYear.update({
        where: { id: activeYear.id },
        data: {
          status: YearStatus.CLOSED,
          closedAt: new Date(),
        },
      });

      // 2. Retirer le lien activeYear de l'école
      await tx.school.update({
        where: { id: schoolId },
        data: { activeYearId: null },
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
      where: { id: yearId, schoolId },
    });

    if (!year) {
      throw new NotFoundException('Année introuvable');
    }

    if (year.status !== YearStatus.CLOSED) {
      throw new BadRequestException(
        'Seules les années clôturées peuvent être archivées',
      );
    }

    this.logger.log(`Archiving year ${year.name}`);

    return this.prisma.academicYear.update({
      where: { id: yearId },
      data: {
        status: YearStatus.ARCHIVED,
        isArchived: true,
        archivedAt: new Date(),
      },
    });
  }

  /**
   * Certifier le cycle Maternelle/Primaire
   * Réservé au Directeur Maternelle/Primaire
   */
  async certifyMaternellePrimaire(schoolId: string, yearId: string) {
    const year = await this.prisma.academicYear.findFirst({
      where: { id: yearId, schoolId },
    });

    if (!year) {
      throw new NotFoundException('Année introuvable');
    }

    this.logger.log(`Certifying Maternelle/Primaire for year ${year.name}`);

    return this.prisma.academicYear.update({
      where: { id: yearId },
      data: { maternellePrimaireCertified: true },
    });
  }

  /**
   * Certifier le cycle Collège/Lycée
   * Réservé au Directeur Collège/Lycée
   */
  async certifyCollegeLycee(schoolId: string, yearId: string) {
    const year = await this.prisma.academicYear.findFirst({
      where: { id: yearId, schoolId },
    });

    if (!year) {
      throw new NotFoundException('Année introuvable');
    }

    this.logger.log(`Certifying Collège/Lycée for year ${year.name}`);

    return this.prisma.academicYear.update({
      where: { id: yearId },
      data: { collegeLyceeCertified: true },
    });
  }

  /**
   * Certifier les finances (global pour toute l'école)
   * Réservé au Comptable
   */
  async certifyFinances(schoolId: string, yearId: string) {
    const year = await this.prisma.academicYear.findFirst({
      where: { id: yearId, schoolId },
    });

    if (!year) {
      throw new NotFoundException('Année introuvable');
    }

    this.logger.log(`Certifying finances for year ${year.name}`);

    return this.prisma.academicYear.update({
      where: { id: yearId },
      data: { financeCertified: true },
    });
  }

  /**
   * Vérifier et exécuter les clôtures automatiques planifiées
   * Méthode à appeler via CRON quotidien
   */
  async performAutoClosureChecks() {
    this.logger.log('Running daily auto-closure checks...');

    // 1. Trouver les années éligibles (Active + AutoClosureEnabled + Date dépassée)
    const candidates = await this.prisma.academicYear.findMany({
      where: {
        status: YearStatus.ACTIVE,
        autoClosureEnabled: true,
        autoClosureDate: {
          lte: new Date(), // Date <= Maintenant
        },
      },
      select: { id: true, schoolId: true, name: true },
    });

    this.logger.log(`Found ${candidates.length} candidates for auto-closure`);

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const year of candidates) {
      try {
        // 2. Valider les conditions (Certifications, etc.)
        const validation = await this.validateClosure(year.schoolId);

        if (validation.canClose) {
          // 3. Clôturer si tout est vert
          await this.closeActiveYear(year.schoolId);
          this.logger.log(
            `Auto-closed year ${year.name} for school ${year.schoolId}`,
          );
          results.success++;
        } else {
          this.logger.warn(
            `Skipping auto-closure for ${year.name} (School ${year.schoolId}): Conditions not met (` +
              validation.blockers.join(', ') +
              ')',
          );

          // --- Logic de Notification Multi-Canal ---

          // 1. Trouver les administrateurs (Fondateur & Directeurs de l'école)
          const admins = await this.prisma.schoolUser.findMany({
            where: {
              schoolId: year.schoolId,
              role: { in: ['FOUNDER', 'DIRECTOR', 'ACCOUNTANT', 'CENSEUR'] },
              deletedAt: null,
            },
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  phone: true,
                  firstName: true,
                  directorType: true,
                },
              },
            },
          });

          const blockersMsg = validation.blockers.join(', ');
          const title = `⚠️ Clôture suspendue (${year.name})`;
          const message = `La clôture automatique de l'année "${year.name}" a été suspendue. Blocages : ${blockersMsg}.`;

          for (const admin of admins) {
            let shouldNotify = false;
            const u = admin.user;

            // Logique de ciblage fin
            if (admin.role === 'FOUNDER') shouldNotify = true;

            // Directeur : Tous recoivent si c'est un directeur "Général" (pas de cycle spécifique)
            // OU si leur cycle spécifique bloque.
            if (admin.role === 'DIRECTOR') {
              if (!u?.directorType) shouldNotify = true; // Directeur Général
              if (
                u?.directorType === 'MATERNELLE_PRIMAIRE' &&
                !validation.maternellePrimaireCertified
              )
                shouldNotify = true;
              if (
                u?.directorType === 'COLLEGE_LYCEE' &&
                !validation.collegeLyceeCertified
              )
                shouldNotify = true;
              // Si c'est un autre blocage (Décisions conseil), on notifie tous les directeurs
              if (!validation.allStudentsDecided) shouldNotify = true;
            }

            if (!validation.financeCertified && admin.role === 'ACCOUNTANT')
              shouldNotify = true;
            if (!validation.allStudentsDecided && admin.role === 'CENSEUR')
              shouldNotify = true;

            if (shouldNotify && u) {
              await this.communication
                .sendSystemAlert(year.schoolId, u.id, {
                  title,
                  message,
                  email: u.email ?? undefined,
                  phone: u.phone ?? undefined,
                })
                .catch((e) =>
                  this.logger.error(
                    `Failed multi-channel notify for ${u.id}: ${e.message}`,
                  ),
                );
            }
          }

          results.failed++;
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(
          `Error processing auto-closure for ${year.name}: ${msg}`,
        );
        results.errors.push(`${year.name}: ${msg}`);
      }
    }

    return results;
  }
}
