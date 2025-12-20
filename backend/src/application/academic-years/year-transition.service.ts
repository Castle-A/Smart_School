import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateNextYearDto, StudentStrategy } from './dto/create-next-year.dto';
import {
  TransitionPreview,
  TransitionReport,
} from './dto/year-responses.interface';
import { YearStatus } from '@prisma/client';

@Injectable()
export class YearTransitionService {
  private readonly logger = new Logger(YearTransitionService.name);

  constructor(private prisma: PrismaService) { }

  /**
   * Prévisualiser la transition vers l'année suivante
   * Retourne un aperçu de ce qui sera créé/hérité
   */
  async previewTransition(
    schoolId: string,
    fromYearId: string,
  ): Promise<TransitionPreview> {
    const fromYear = await this.prisma.academicYear.findFirst({
      where: { id: fromYearId, schoolId },
    });

    if (!fromYear) {
      throw new NotFoundException('Année source introuvable');
    }

    // (Check Relaxed) On permet le preview sur une année ACTIVE pour la préparation anticipée
    /*if (fromYear.status !== YearStatus.CLOSED) {
      throw new BadRequestException(
        'Seules les années clôturées peuvent servir de base pour une nouvelle année',
      );
    }*/

    this.logger.log(`Previewing transition from year ${fromYear.name}`);

    // Compter les éléments à dupliquer
    const [classesCount, subjectsCount, classSubjectsCount] = await Promise.all(
      [
        this.prisma.class.count({ where: { schoolId } }),
        this.prisma.subject.count({ where: { schoolId } }),
        this.prisma.classSubject.count({
          where: { class: { schoolId } },
        }),
      ],
    );

    // Analyser les élèves selon leurs décisions
    const students = await this.prisma.student.findMany({
      where: { schoolId, status: 'ACTIVE' },
      include: {
        history: {
          where: { academicYear: fromYear.name },
        },
      },
    });

    const toPromote = students.filter((s) =>
      s.history.some((h) => h.outcome === 'PASS'),
    ).length;

    const toRepeat = students.filter((s) =>
      s.history.some((h) => h.outcome === 'FAIL'),
    ).length;

    const toGraduate = students.filter((s) =>
      s.history.some((h) => h.outcome === 'GRADUATED'),
    ).length;

    const toTransfer = students.filter((s) =>
      s.history.some((h) => h.outcome === 'TRANSFERRED'),
    ).length;

    const withoutDecision = students.filter(
      (s) => s.history.length === 0,
    ).length;

    const warnings: string[] = [];
    if (withoutDecision > 0) {
      warnings.push(
        `⚠️ ${withoutDecision} élève(s) sans décision de conseil. Ils ne seront pas traités automatiquement.`,
      );
    }

    // Générer nom suggéré pour nouvelle année
    const yearParts = fromYear.name.split('-');
    const nextYearName =
      yearParts.length === 2
        ? `${parseInt(yearParts[0]) + 1}-${parseInt(yearParts[1]) + 1}`
        : `${fromYear.name}-NEXT`;

    return {
      fromYear: {
        id: fromYear.id,
        name: fromYear.name,
      },
      toCreate: {
        yearName: nextYearName,
        classesCount,
        subjectsCount,
        classSubjectsCount,
      },
      students: {
        toPromote,
        toRepeat,
        toGraduate,
        toTransfer,
        withoutDecision,
      },
      warnings,
    };
  }

  /**
   * Créer l'année suivante avec héritage intelligent des données
   * Processus complet en transaction atomique
   */
  async createNextYear(
    schoolId: string,
    fromYearId: string,
    dto: CreateNextYearDto,
  ): Promise<TransitionReport> {
    const startTime = Date.now();

    const fromYear = await this.prisma.academicYear.findFirst({
      where: { id: fromYearId, schoolId },
    });

    if (!fromYear) {
      throw new NotFoundException('Année source introuvable');
    }

    // (Check Modified) En mode brouillon, on peut partir d'une année ACTIVE.
    // Si activation immédiate, on s'assura de la clôture dans la transaction.
    // (Check Modified)
    if (fromYear.status === YearStatus.ARCHIVED) {
      throw new BadRequestException('Impossible de faire un rollover depuis une année archivée');
    }

    this.logger.log(
      `Starting year transition from ${fromYear.name} to ${dto.name}`,
    );

    // Options par défaut si non fournies
    const options = dto.inheritOptions || {
      classes: true,
      subjects: true,
      classSubjects: true,
      fees: true,
      students: StudentStrategy.PROMOTE,
    };

    /**
     * Transaction atomique complète avec timeout configuré
     *
     * @remarks
     * - Timeout: 60 secondes (au lieu de 5s par défaut)
     * - Permet de gérer les grandes écoles (>1000 élèves)
     * - Peut être augmenté via variable d'environnement ROLLOVER_TIMEOUT_MS
     */
    const transactionTimeout = parseInt(
      process.env.ROLLOVER_TIMEOUT_MS || '60000',
    );

    // Transaction atomique complète
    const result = await this.prisma.$transaction(
      async (tx) => {
        const counters = {
          classes: 0,
          subjects: 0,
          classSubjects: 0,
          promoted: 0,
          repeated: 0,
          graduated: 0,
          transferred: 0,
          logs: 0,
        };

        // Map pour suivre la correspondance Ancienne Classe -> Nouvelle Classe
        const classMap = new Map<string, string>();
        // Liste des nouvelles classes pour la recherche "Smart Promotion"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const createdClasses: any[] = [];

        // 1. Créer la nouvelle année
        const newYear = await tx.academicYear.create({
          data: {
            schoolId,
            name: dto.name,
            startDate: new Date(dto.startDate),
            endDate: new Date(dto.endDate),
            // LOGIC CHANGE: If fromYear is ACTIVE, we MUST create as DRAFT.
            // Even if user asked for !startAsDraft, we override for safety.
            status: (dto.startAsDraft || fromYear.status === YearStatus.ACTIVE) ? YearStatus.DRAFT : YearStatus.ACTIVE,
            createdFromId: fromYear.id,
          },
        });

        // REMOVED: Auto-closure logic. User explicitly requested NO auto-close of unfinished years.
        // The previous year must be closed manually.

        // Log de création
        await tx.yearTransitionLog.create({
          data: {
            fromYearId: fromYear.id,
            toYearId: newYear.id,
            entityType: 'YEAR',
            action: 'INHERITED',
            metadata: JSON.stringify({ name: dto.name }),
          },
        });
        counters.logs++;

        // 2. Hériter les classes (structure vide)
        if (options.classes) {
          const classes = await tx.class.findMany({ where: { schoolId } });

          for (const cls of classes) {
            const newClass = await tx.class.create({
              data: {
                schoolId,
                name: cls.name,
                level: cls.level,
                cycle: cls.cycle,
                series: cls.series,
                tuitionFee: options.fees ? cls.tuitionFee : undefined,
                registrationFee: options.fees ? cls.registrationFee : undefined,
                // Note: On ne copie pas le mainTeacherId automatiquement car les affectations changent
              },
            });

            // Enregistrer le mapping
            classMap.set(cls.id, newClass.id);
            createdClasses.push(newClass);

            await tx.yearTransitionLog.create({
              data: {
                fromYearId: fromYear.id,
                toYearId: newYear.id,
                entityType: 'CLASS',
                action: 'INHERITED',
                sourceId: cls.id,
                targetId: newClass.id,
                metadata: JSON.stringify({ name: cls.name }),
              },
            });
            counters.classes++;
            counters.logs++;
          }
        }

        // 3. Hériter les matières (Globales)
        // Les matières sont globales à l'école, on log juste l'héritage logique
        if (options.subjects) {
          const subjects = await tx.subject.findMany({ where: { schoolId } });

          for (const subject of subjects) {
            await tx.yearTransitionLog.create({
              data: {
                fromYearId: fromYear.id,
                toYearId: newYear.id,
                entityType: 'SUBJECT',
                action: 'INHERITED',
                sourceId: subject.id,
                metadata: JSON.stringify({ name: subject.name }),
              },
            });
            counters.subjects++;
            counters.logs++;
          }
        }

        // 4. Hériter les affectations matière-classe
        if (options.classSubjects && options.classes) {
          const classSubjects = await tx.classSubject.findMany({
            where: { class: { schoolId } }, // Récupère TOUTES les liaisons de l'école (bazard si multi-années actives, mais ici on assume rollover propre)
            // TODO: Affiner la query si on garde un lien class -> year explicitement, mais Class est souvent lié à School globalement dans ce schéma simple
            // Pour l'instant on suppose que les classes "IDs" traitées au point 2 correspondent à celles d'ici.
            include: { class: true, subject: true },
          });

          for (const cs of classSubjects) {
            // Retrouver la NOUVELLE classe correspondante
            const newClassId = classMap.get(cs.classId);

            if (newClassId) {
              await tx.classSubject.create({
                data: {
                  classId: newClassId,
                  subjectId: cs.subjectId,
                  coefficient: cs.coefficient,
                  // On ne copie pas teacherId (professeurs réaffectés chaque année)
                },
              });

              await tx.yearTransitionLog.create({
                data: {
                  fromYearId: fromYear.id,
                  toYearId: newYear.id,
                  entityType: 'CLASSSUBJECT',
                  action: 'INHERITED',
                  sourceId: cs.id,
                  metadata: JSON.stringify({
                    class: cs.class.name,
                    subject: cs.subject.name,
                  }),
                },
              });
              counters.classSubjects++;
              counters.logs++;
            }
          }
        }

        // 5. Gérer les élèves selon la stratégie choisie
        if (options.students === StudentStrategy.PROMOTE) {
          const students = await tx.student.findMany({
            where: { schoolId, status: 'ACTIVE' },
            include: {
              history: {
                where: { academicYear: fromYear.name },
              },
              class: true,
            },
          });

          for (const student of students) {
            const decision = student.history[0];

            if (!decision) {
              this.logger.warn(
                `Student ${student.id} has no decision, skipping`,
              );
              continue;
            }

            let action = '';
            let newStatus = student.status;
            let newClassId = student.classId; // Défaut: reste (sera mappé vers nouvelle classe id)

            // Trouver l'ID de la nouvelle classe correspondante (Redoublement dans la même "structure")
            const targetSameClassId = student.classId ? classMap.get(student.classId) : null;

            switch (decision.outcome) {
              case 'PASS':
                // Promotion:
                // CAS COMPLEXE: "6ème A" -> "5ème A". 
                // Pour l'instant, on les met dans la NOUVELLE version de leur classe actuelle (comme les redoublants)
                // MAIS on les marque pour que l'admin les déplace.
                // Idéalement, on les mettrait dans une "Salle d'attente" (classId = null)
                // CHOIX MVP: On les laisse dans la même classe mappée, l'admin fera le "Move" en masse.
                action = 'PROMOTED';

                // Smart Promotion Logic
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const dec = decision as any;

                if (dec.nextLevel) {
                  const target = createdClasses.find((c: any) =>
                    c.level === dec.nextLevel &&
                    (!dec.nextSeries || c.series === dec.nextSeries)
                  );
                  // Si pas trouvé, on met null (Salle d'attente)
                  newClassId = target ? target.id : null;
                  if (!target) {
                    this.logger.warn(`Smart Promotion: Target class not found for ${student.id} (${dec.nextLevel} ${dec.nextSeries})`);
                  }
                } else {
                  // Fallback: PLUS de mappage automatique "Même classe".
                  // Sécurité : On met en "Salle d'Attente" (null) pour forcer l'affectation manuelle correcte.
                  newClassId = null;
                }

                // CHOIX MVP: On les laisse dans la même classe mappée, l'admin fera le "Move" en masse.
                counters.promoted++;
                break;

              case 'FAIL':
                // Redouble : reste dans la NOUVELLE version de la MEME classe
                action = 'REPEATED';
                newClassId = targetSameClassId || null;
                counters.repeated++;
                break;

              case 'GRADUATED':
                // Diplômé : archiver
                newStatus = 'ARCHIVED';
                newClassId = null;
                action = 'GRADUATED';
                counters.graduated++;
                break;

              case 'TRANSFERRED':
                // Transféré : marquer
                newStatus = 'TRANSFERRED';
                newClassId = null;
                action = 'TRANSFERRED';
                counters.transferred++;
                break;
            }

            if (action) {
              // Mise à jour de l'élève
              await tx.student.update({
                where: { id: student.id },
                data: {
                  status: newStatus,
                  classId: newClassId // Pointe vers la NOUVELLE classe (ou null)
                },
              });

              await tx.yearTransitionLog.create({
                data: {
                  fromYearId: fromYear.id,
                  toYearId: newYear.id,
                  entityType: 'STUDENT',
                  action,
                  sourceId: student.id,
                  metadata: JSON.stringify({
                    name: `${student.firstName} ${student.lastName}`,
                    decision: decision.outcome,
                    fromClass: student.class?.name,
                    targetClassId: newClassId
                  }),
                },
              });
              counters.logs++;
            }
          }
        }

        // 6. Activer la nouvelle année dans l'école (SI le statut calculé est ACTIVE)
        if (newYear.status === YearStatus.ACTIVE) {
          await tx.school.update({
            where: { id: schoolId },
            data: { activeYearId: newYear.id },
          });
        }

        this.logger.log(
          `Transition completed successfully. Created year: ${newYear.name}`,
        );

        return {
          newYearId: newYear.id,
          newYearName: newYear.name,
          ...counters,
        };
      },
      {
        timeout: transactionTimeout, // Configurable timeout pour grandes écoles
        maxWait: transactionTimeout + 5000, // Attente max légèrement supérieure
      },
    );

    const duration = Date.now() - startTime;

    return {
      success: true,
      newYearId: result.newYearId,
      newYearName: result.newYearName,
      created: {
        classes: result.classes,
        subjects: result.subjects,
        classSubjects: result.classSubjects,
      },
      students: {
        promoted: result.promoted,
        repeated: result.repeated,
        graduated: result.graduated,
        transferred: result.transferred,
      },
      logsCreated: result.logs,
      duration,
    };
  }
}
