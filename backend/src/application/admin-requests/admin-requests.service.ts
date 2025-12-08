import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class AdminRequestService {
    constructor(private prisma: PrismaService) { }

    async create(schoolId: string, userId: string, type: string, data: any) {
        return this.prisma.adminRequest.create({
            data: {
                schoolId,
                requesterId: userId,
                type,
                data: JSON.stringify(data),
                status: 'PENDING'
            },
            include: {
                requester: {
                    select: {
                        firstName: true,
                        lastName: true,
                        profilePicture: true
                    }
                }
            }
        });
    }

    async findAll(schoolId: string, status?: string) {
        return this.prisma.adminRequest.findMany({
            where: {
                schoolId,
                status: status || undefined
            },
            include: {
                requester: {
                    select: {
                        firstName: true,
                        lastName: true,
                        profilePicture: true
                    }
                },
                resolver: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async resolve(requestId: string, schoolId: string, resolverId: string, status: 'APPROVED' | 'REJECTED', adminComment?: string) {
        const request = await this.prisma.adminRequest.findUnique({
            where: { id: requestId }
        });

        if (!request || request.schoolId !== schoolId) {
            throw new NotFoundException('Requête introuvable');
        }

        if (request.status !== 'PENDING') {
            throw new BadRequestException('Cette requête a déjà été traitée');
        }

        const updatedRequest = await this.prisma.adminRequest.update({
            where: { id: requestId },
            data: {
                status,
                resolverId,
                adminComment,
                updatedAt: new Date()
            }
        });

        if (status === 'APPROVED') {
            await this.executeRequestAction(request);
        }

        return updatedRequest;
    }

    private async executeRequestAction(request: any) {
        const payload = JSON.parse(request.data);
        const { type } = request;

        switch (type) {
            case 'DELETE_TEACHER':
                // payload: { teacherId: number }
                await this.prisma.teacher.update({
                    where: { id: payload.teacherId },
                    data: { deletedAt: new Date() }
                });
                // Also update User/SchoolUser if needed, but Teacher soft delete might be enough broadly
                break;

            case 'UPDATE_TEACHER':
                // payload: { teacherId: number, data: ... }
                // Implementation pending complexity, assuming direct edit allowed for Director?
                // If Censor requested it, apply changes.
                await this.prisma.teacher.update({
                    where: { id: payload.teacherId },
                    data: payload.data
                });
                break;

            case 'CLASS_ASSEMBLY':
                // payload: { classId: string, assignments: Array<{ type: 'TEACHER' | 'MAIN_TEACHER', subjectId?: string, teacherUserId: string }> }
                const { classId, assignments } = payload;

                // 1. Transactional update
                await this.prisma.$transaction(async (tx) => {
                    // Reset class teachers? Or just apply changes?
                    // "Assembly" usually implies setting the full state.

                    // Clear existing (optional - depends on requirement logic. Assuming full rewrite based on "Assembly")
                    // Note: This logic depends on providing FULL list of assignments.

                    for (const assign of assignments) {
                        const schoolUser = await tx.schoolUser.findFirst({
                            where: { userId: assign.teacherUserId, schoolId: request.schoolId }
                        });

                        if (!schoolUser) continue;

                        if (assign.type === 'MAIN_TEACHER') {
                            await tx.class.update({
                                where: { id: classId },
                                data: { mainTeacherId: schoolUser.id }
                            });
                        } else if (assign.type === 'TEACHER') {
                            // Assign subject to teacher in class
                            if (assign.subjectId) {
                                // Add to ClassSubject relations if we track teacher per subject there?
                                // Schema check: Subject has `teachers SchoolUser[]`, Class has `teachers SchoolUser[]`.
                                // Linking subject to teacher usually happens in `ClassSubject` or implicit?
                                // Schema has `teachers SchoolUser[] @relation("SubjectTeacher")` on Subject.
                                // It seems we just connect Teacher to Class generally?

                                // Actually, standard logic:
                                // 1. Connect Teacher to Class (general teaching staff)
                                await tx.class.update({
                                    where: { id: classId },
                                    data: {
                                        teachers: { connect: { id: schoolUser.id } }
                                    }
                                });

                                // 2. If we want to link Teacher to Subject specifically for that class?
                                // Schema doesn't explicitly link ClassSubject -> Teacher.
                                // Use `teachers` on Class for now.
                            }
                        }
                    }
                });
                break;
        }
    }
}
