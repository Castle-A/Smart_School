import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

export interface UpsertSessionDto {
  id?: string;
  classId: string;
  subjectId: string;
  teacherId: string; // The teacher for THIS session
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string;
}

@Injectable()
export class TimetableService {
  constructor(private prisma: PrismaService) {}

  async getWeeklySchedule(classId: string) {
    return this.prisma.classSession.findMany({
      where: { classId },
      include: {
        subject: true,
        teacher: true,
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  /**
   * Crée ou met à jour une session de cours avec détection automatique de conflits.
   * Algorithme Master : Vérifie les intersections temporelles pour l'enseignant et la salle.
   */
  async upsertSession(data: UpsertSessionDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Détection de conflits (Intersection temporelle)
      // Un conflit existe si (StartA < EndB) ET (EndA > StartB)
      const conflict = await tx.classSession.findFirst({
        where: {
          dayOfWeek: data.dayOfWeek,
          id: { not: data.id || 'new-session' },
          OR: [
            {
              teacherId: data.teacherId,
              startTime: { lt: data.endTime },
              endTime: { gt: data.startTime },
            },
            {
              room: data.room,
              startTime: { lt: data.endTime },
              endTime: { gt: data.startTime },
            },
          ],
        },
        include: { class: true, subject: true },
      });

      if (conflict) {
        const entity =
          conflict.teacherId === data.teacherId ? "L'enseignant" : 'La salle';
        throw new Error(
          `${entity} est déjà occupé(e) par la classe ${conflict.class.name} ` +
            `(${conflict.subject?.name}) de ${conflict.startTime} à ${conflict.endTime}.`,
        );
      }

      // 2. Upsert de la Session
      const session = await tx.classSession.upsert({
        where: { id: data.id || 'new-session' },
        create: {
          dayOfWeek: data.dayOfWeek,
          startTime: data.startTime,
          endTime: data.endTime,
          room: data.room,
          class: { connect: { id: data.classId } },
          subject: { connect: { id: data.subjectId } },
          teacher: data.teacherId
            ? { connect: { id: data.teacherId } }
            : undefined,
        },
        update: {
          dayOfWeek: data.dayOfWeek,
          startTime: data.startTime,
          endTime: data.endTime,
          room: data.room,
          teacher: data.teacherId
            ? { connect: { id: data.teacherId } }
            : { disconnect: true },
        },
      });

      // 3. Synchronisation intelligente de l'enseignant titulaire
      if (data.teacherId) {
        const classSubject = await tx.classSubject.findUnique({
          where: {
            classId_subjectId: {
              classId: data.classId,
              subjectId: data.subjectId,
            },
          },
        });

        if (classSubject && classSubject.teacherId !== data.teacherId) {
          await tx.classSubject.update({
            where: { id: classSubject.id },
            data: { teacherId: data.teacherId },
          });
        }
      }

      return session;
    });
  }

  async deleteSession(id: string) {
    return this.prisma.classSession.delete({
      where: { id },
    });
  }
}
