import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ITeachersRepository } from '../../domain/teachers/teachers.repository.interface';

@Injectable()
export class PrismaTeachersRepository implements ITeachersRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        // Extract relations to use 'connect' explicitly
        const { schoolId, userId, subjects: subjectNames, ...otherData } = data;

        // Find subjects by names to get their IDs
        // Find or create subjects
        let subjectConnect: { id: string }[] = [];
        if (Array.isArray(subjectNames) && subjectNames.length > 0) {
            for (const name of subjectNames) {
                const subject = await this.prisma.subject.findFirst({
                    where: { schoolId, name }
                });

                if (subject) {
                    subjectConnect.push({ id: subject.id });
                } else {
                    // Create if not exists
                    const newSubject = await this.prisma.subject.create({
                        data: {
                            name,
                            schoolId,
                            cycle: otherData.title === 'PROFESSEUR' ? 'COLLEGE' : 'PRIMAIRE' // Simple default
                        }
                    });
                    subjectConnect.push({ id: newSubject.id });
                }
            }
        }

        const teacher = await this.prisma.teacher.create({
            data: {
                ...otherData,
                hireDate: new Date(data.hireDate),
                matricule: data.matricule || null,
                subjects: {
                    connect: subjectConnect
                },
                school: {
                    connect: { id: schoolId } // Mandatory relation
                },
                user: userId ? {
                    connect: { id: userId } // Optional relation
                } : undefined
            },
            include: {
                subjects: true
            }
        });

        return {
            ...teacher,
            subjects: teacher.subjects.map(s => s.name),
        };
    }

    async findAllBySchoolId(schoolId: string) {
        const teachers = await this.prisma.teacher.findMany({
            where: {
                schoolId,
                deletedAt: null, // Only non-deleted teachers
            },
            include: {
                subjects: true,
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        gender: true,
                        email: true,
                        phone: true,
                        profilePicture: true,
                        schoolUsers: {
                            where: { schoolId },
                            select: {
                                role: true,
                                directorType: true,
                                _count: {
                                    select: {
                                        teachingClasses: true,
                                        teacherClasses: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return teachers.map((teacher: any) => {
            const schoolUsers = teacher.user?.schoolUsers || [];
            const teachingCount = schoolUsers.reduce((acc, su) => acc + (su._count?.teachingClasses || 0), 0);
            const mainCount = schoolUsers.reduce((acc, su) => acc + (su._count?.teacherClasses || 0), 0);

            return {
                ...teacher,
                subjects: teacher.subjects.map((s: any) => s.name),
                userId: teacher.userId,
                gender: teacher.user?.gender,
                role: teacher.user?.schoolUsers[0]?.role,
                directorType: teacher.user?.schoolUsers[0]?.directorType,
                teachingClassCount: teachingCount,
                mainTeacherClassCount: mainCount,
                classes: teachingCount + mainCount,
                firstName: teacher.user?.firstName ?? teacher.firstName,
                lastName: teacher.user?.lastName ?? teacher.lastName,
                email: teacher.user?.email ?? teacher.email,
                phone: teacher.user?.phone ?? teacher.phone,
                profilePicture: teacher.user?.profilePicture ?? teacher.photoUrl
            };
        });
    }

    async findById(id: string) {
        const teacher = await this.prisma.teacher.findUnique({
            where: { id },
            include: {
                subjects: true,
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        phone: true,
                        profilePicture: true,
                        isActive: true,
                        schoolUsers: {
                            include: {
                                teachingClasses: {
                                    include: {
                                        _count: { select: { students: true } }
                                    }
                                }, // Classes assigned
                                teacherClasses: {
                                    include: {
                                        _count: { select: { students: true } }
                                    }
                                },  // Classes where main teacher
                            }
                        }
                    }
                }
            }
        });

        if (!teacher || teacher.deletedAt) {
            return null;
        }

        // Find the specific SchoolUser for the teacher's school (assuming context matching finding by ID usually implies we want their data)
        // But here we rely on the service to filter by schoolId later.
        // We just attach the data.

        return {
            ...teacher,
            subjects: teacher.subjects.map((s: any) => s.name),
            user: teacher.user
        };
    }

    async update(id: string, data: any) {
        const { subjects: subjectNames, ...updateData } = data;

        // If subjects are being updated
        if (Array.isArray(subjectNames)) {
            // We need the schoolId to find subjects. 
            // We first fetch the teacher to get schoolId if it's not in data
            // Or we assume the subjects provided are valid names for the school.
            // A safer bet is to fetch valid subjects first.
            // But 'update' doesn't receive schoolId in arguments here purely. 
            // However, the Service passes 'data' which comes from DTO.

            // To properly find subjects, we need the schoolId. 
            const existingTeacher = await this.prisma.teacher.findUnique({
                where: { id },
                select: { schoolId: true }
            });

            if (existingTeacher) {
                const subjects = await this.prisma.subject.findMany({
                    where: {
                        schoolId: existingTeacher.schoolId,
                        name: { in: subjectNames }
                    },
                    select: { id: true }
                });

                updateData.subjects = {
                    set: subjects.map(s => ({ id: s.id }))
                };
            }
        }

        const teacher = await this.prisma.teacher.update({
            where: { id },
            data: updateData,
            include: { subjects: true }
        });

        return {
            ...teacher,
            subjects: teacher.subjects.map(s => s.name),
        };
    }

    async softDelete(id: string) {
        await this.prisma.teacher.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    async delete(id: string) {
        await this.prisma.teacher.delete({
            where: { id },
        });
    }
}
