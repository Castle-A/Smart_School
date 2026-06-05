import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AdminRequestService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(schoolId: string, userId: string, type: string, data: any) {
    return this.prisma.adminRequest.create({
      data: {
        schoolId,
        requesterId: userId,
        type,
        data: JSON.stringify(data),
        status: 'PENDING',
      },
      include: {
        requester: {
          select: {
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
      },
    });
  }

  async findAll(schoolId: string, status?: string, includeArchived = false) {
    // Trigger auto-archiving of old processed requests (lazy cleanup)
    // This ensures that whenever we list requests, we first clean up any that should be archived.
    await this.autoArchiveOldRequests();

    return this.prisma.adminRequest.findMany({
      where: {
        schoolId,
        // If includeArchived is true, we ONLY show archived.
        // If false (active view), we show non-archived.
        isArchived: includeArchived,
        status: status || undefined,
      },
      include: {
        requester: {
          select: {
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
        resolver: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findMyRequests(
    schoolId: string,
    userId: string,
    includeArchived = false,
  ) {
    return this.prisma.adminRequest.findMany({
      where: {
        schoolId,
        requesterId: userId,
        // Status filter isn't applied here usually, but maybe we want to see only processed ones in archive?
        // For now, let's keep it simple: Archive view shows everything in archive.
        isArchived: includeArchived,
      },
      include: {
        resolver: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async archive(id: string) {
    return this.prisma.adminRequest.update({
      where: { id },
      data: { isArchived: true },
    });
  }

  async archiveAllProcessed(schoolId: string, userId: string) {
    // Archive all APPROVED or REJECTED requests for this user/school
    return this.prisma.adminRequest.updateMany({
      where: {
        schoolId,
        OR: [
          { requesterId: userId }, // For Censor cleaning their own output
          { resolverId: userId }, // For Director cleaning their own log
        ],
        status: {
          in: ['APPROVED', 'REJECTED'],
        },
        isArchived: false,
      },
      data: { isArchived: true },
    });
  }

  async autoArchiveOldRequests() {
    // Example logic: archive requests processed > 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return this.prisma.adminRequest.updateMany({
      where: {
        updatedAt: { lt: thirtyDaysAgo },
        status: { in: ['APPROVED', 'REJECTED'] },
        isArchived: false,
      },
      data: { isArchived: true },
    });
  }

  async resolve(
    requestId: string,
    schoolId: string,
    resolverId: string,
    status: 'APPROVED' | 'REJECTED',
    adminComment?: string,
  ) {
    const result = await this.prisma.$transaction(async (tx) => {
      const request = await tx.adminRequest.findUnique({
        where: { id: requestId },
      });

      if (!request || request.schoolId !== schoolId) {
        throw new NotFoundException('Requête introuvable');
      }

      if (request.status !== 'PENDING') {
        throw new BadRequestException('Cette requête a déjà été traitée');
      }

      const updatedRequest = await tx.adminRequest.update({
        where: { id: requestId },
        data: {
          status,
          resolverId,
          adminComment,
          updatedAt: new Date(),
        },
      });

      if (status === 'APPROVED') {
        await this.executeRequestAction(request, tx);
      }

      return updatedRequest;
    });

    // Notify Requester (outside transaction to avoid circular logic or complexity, although technically safe inside if service is simple)
    // We need the original request to get requesterId
    const request = await this.prisma.adminRequest.findUnique({
      where: { id: requestId },
    });
    if (request) {
      const title =
        status === 'APPROVED' ? 'Requête Approuvée' : 'Requête Refusée';
      const message = `Votre requête de type ${request.type} a été ${status === 'APPROVED' ? 'validée' : 'refusée'} par l'administration. ${adminComment ? `Note: ${adminComment}` : ''}`;

      await this.notificationsService.create({
        userId: request.requesterId,
        title,
        message,
        type: 'VALIDATION',
      });
    }

    return result;
  }

  private async executeRequestAction(request: any, tx: any) {
    const payload = JSON.parse(request.data);
    const { type } = request;

    switch (type) {
      case 'DELETE_TEACHER':
        // payload: { teacherId: string }
        await tx.teacher.update({
          where: { id: payload.teacherId },
          data: { deletedAt: new Date() },
        });
        break;

      case 'UPDATE_TEACHER':
        // payload: { teacherId: string, data: ... }
        const { subjects: newSubjects, ...scalarData } = payload.data;
        const teacherId = payload.teacherId;

        // 1. Fetch current teacher state within transaction
        const currentTeacher = await tx.teacher.findUnique({
          where: { id: teacherId },
          include: { subjects: true },
        });

        if (!currentTeacher) {
          // Fallback if teacher deleted in meantime? skip
          break;
        }

        const finalUpdateData: any = {};
        let hasChanges = false;

        // 2. Diff Scalar Fields
        Object.keys(scalarData).forEach((key) => {
          let newValue = scalarData[key];
          let oldValue = currentTeacher[key];

          // Handle Date comparison
          if (key === 'hireDate') {
            if (newValue)
              newValue = new Date(newValue).toISOString().split('T')[0];
            if (oldValue)
              oldValue = new Date(oldValue).toISOString().split('T')[0];
          }

          // Handle undefined/null equivalence
          if (newValue === undefined) return; // Ignore missing keys
          if (newValue === '' && oldValue === null) return;
          if (newValue == oldValue) return; // Soft eq for string vs number nuances, though strict is better usually

          // If different, add to update
          // Special case: Restore Date object for hireDate
          if (key === 'hireDate') {
            finalUpdateData[key] = new Date(scalarData[key]);
          } else {
            finalUpdateData[key] = newValue;
          }
          hasChanges = true;
        });

        // 3. Diff Subjects
        if (newSubjects && Array.isArray(newSubjects)) {
          const currentSubjectNames = currentTeacher.subjects
            .map((s: any) => s.name)
            .sort();
          const newSubjectNames = [...newSubjects].sort();

          const isSubjectsDifferent =
            JSON.stringify(currentSubjectNames) !==
            JSON.stringify(newSubjectNames);

          if (isSubjectsDifferent) {
            // Find IDs for these subject names in the school
            const foundSubjects = await tx.subject.findMany({
              where: {
                schoolId: request.schoolId,
                name: { in: newSubjects },
              },
              select: { id: true, name: true },
            });

            const uniqueSubjectIds = new Set<string>();
            newSubjects.forEach((name: string) => {
              const match = foundSubjects.find((s: any) => s.name === name);
              if (match) uniqueSubjectIds.add(match.id);
            });

            finalUpdateData.subjects = {
              set: Array.from(uniqueSubjectIds).map((id) => ({ id })),
            };
            hasChanges = true;
          }
        }

        // 4. Apply Update if changes exist
        if (hasChanges) {
          await tx.teacher.update({
            where: { id: teacherId },
            data: finalUpdateData,
          });
        }
        break;

      case 'CLASS_ASSEMBLY':
        // payload: { classId: string, assignments: Array<{ type: 'TEACHER' | 'MAIN_TEACHER', subjectId?: string, teacherUserId: string }> }
        const { classId, assignments } = payload;
        if (!assignments) break;

        // 1. Resolve all UserIDs to SchoolUserIDs in batch
        const requestUserIds = assignments.map((a: any) => a.teacherUserId);
        const schoolUsers = await tx.schoolUser.findMany({
          where: {
            userId: { in: requestUserIds },
            schoolId: request.schoolId,
          },
          select: { id: true, userId: true },
        });

        let newMainTeacherId: string | null = null;
        const newTeacherIds: string[] = [];

        for (const assign of assignments) {
          const su = schoolUsers.find(
            (u: any) => u.userId === assign.teacherUserId,
          );
          if (!su) continue;

          if (assign.type === 'MAIN_TEACHER') {
            newMainTeacherId = su.id;
          } else if (assign.type === 'TEACHER') {
            newTeacherIds.push(su.id);
          }
        }

        // 2. Update Class with Full Sync (Set)
        await tx.class.update({
          where: { id: classId },
          data: {
            mainTeacherId: newMainTeacherId, // Sets to null if not in assignments (removal)
            teachers: {
              set: newTeacherIds.map((id) => ({ id })), // Replaces entire list (handling removals)
            },
          },
        });
        break;

      case 'SCHOOL_LIFE_COMMENT':
        // payload: { studentId: string, content: string, authorId: string }
        await tx.studentComment.create({
          data: {
            studentId: payload.studentId,
            content: payload.content,
            authorId: request.requesterId,
          },
        });
        break;

      case 'VALIDATE_STUDENT_REGISTRATION':
        // payload: { studentId: string }
        await tx.student.update({
          where: { id: payload.studentId },
          data: { status: 'ACTIVE' },
        });
        break;

      case 'DELETE_CLASS':
        // payload: { classId: string }
        await tx.class.update({
          where: { id: payload.classId },
          data: { deletedAt: new Date() },
        });
        break;
    }
  }
}
