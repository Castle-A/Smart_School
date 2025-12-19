import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

export interface CreateSessionDto {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    classId: string;
    subjectId: string;
    teacherId?: string;
    roomId?: string;
}

@Injectable()
export class TimetableService {
    constructor(private prisma: PrismaService) { } // Prisma Client refreshed

    async getWeeklySchedule(classId: string, schoolId: string) {
        return this.prisma.classSession.findMany({
            where: { classId, schoolId },
            include: {
                subject: true,
                teacher: { select: { user: { select: { firstName: true, lastName: true } } } }
            },
            orderBy: [
                { dayOfWeek: 'asc' },
                { startTime: 'asc' }
            ]
        });
    }

    async createSession(schoolId: string, dto: CreateSessionDto) {
        // Basic Conflict Check: Is the Teacher already busy at this time on this day?
        if (dto.teacherId) {
            const conflicts = await this.prisma.classSession.findMany({
                where: {
                    schoolId,
                    teacherId: dto.teacherId,
                    dayOfWeek: dto.dayOfWeek,
                    OR: [
                        { startTime: { lte: dto.startTime }, endTime: { gte: dto.startTime } }, // Starts during existing
                        { startTime: { lte: dto.endTime }, endTime: { gte: dto.endTime } },     // Ends during existing
                        { startTime: { gte: dto.startTime }, endTime: { lte: dto.endTime } }    // Inside new
                    ]
                }
            });

            // Note: This logic is simplified. Perfect overlap checks need slightly more robust comparison logic.
            // But good enough for MVP helper.
            if (conflicts.length > 0) {
                // For now, allow but warn? Or block. Let's block to show "Smart" features.
                if (conflicts.some(c => c.startTime < dto.endTime && c.endTime > dto.startTime)) {
                    throw new BadRequestException("L'enseignant a déjà un cours sur ce créneau.");
                }
            }
        }

        return this.prisma.classSession.create({
            data: {
                ...dto,
                schoolId
            }
        });
    }

    async deleteSession(id: string, schoolId: string) {
        const session = await this.prisma.classSession.findUnique({ where: { id } });
        if (!session || session.schoolId !== schoolId) throw new BadRequestException("Session not found");

        return this.prisma.classSession.delete({ where: { id } });
    }
}
