import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassesService {
    constructor(private prisma: PrismaService) { }

    async create(schoolId: string, createClassDto: CreateClassDto, userId: string) {
        // Check director type permissions
        const schoolUser = await this.prisma.schoolUser.findFirst({
            where: { userId, schoolId }
        });

        if (schoolUser?.role === 'DIRECTOR') {
            // Check for explicit permission
            const hasPermission = await this.prisma.rolePermission.findFirst({
                where: {
                    schoolUserId: schoolUser.id,
                    permissionDefinition: {
                        code: 'classes.manage'
                    }
                }
            });

            if (!hasPermission) {
                throw new ForbiddenException('Vous n\'avez pas la permission de gérer les classes (classes.manage requis)');
            }

            const primaryLevels = [
                'MATERNELLE_I', 'MATERNELLE_II', // Legacy
                'Maternelle I', 'Maternelle II', // Frontend display
                'CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'
            ];
            const collegeLevels = [
                'SIXIEME', 'CINQUIEME', 'QUATRIEME', 'TROISIEME', 'SECONDE', 'PREMIERE', 'TERMINALE', // Legacy
                '6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale' // Frontend display
            ];

            if (schoolUser.directorType === 'PRIMARY_PRESCHOOL' && !primaryLevels.includes(createClassDto.level)) {
                throw new ForbiddenException('Vous ne pouvez créer que des classes de primaire/maternelle');
            }

            if (schoolUser.directorType === 'COLLEGE' && !collegeLevels.includes(createClassDto.level)) {
                throw new ForbiddenException('Vous ne pouvez créer que des classes de collège');
            }

            // BOTH type can create any level, no restriction needed
        }

        const data: any = { ...createClassDto, schoolId };

        // Handle mainTeacherId logic (convert userId to SchoolUser.id if present)
        if (data.mainTeacherId) {
            const schoolUser = await this.prisma.schoolUser.findFirst({
                where: {
                    userId: data.mainTeacherId,
                    schoolId
                }
            });

            if (schoolUser) {
                data.mainTeacherId = schoolUser.id;
            } else {
                // Should allow clearing or ignore if not found? 
                // If provided but not found, it might be safer to throw or ignore. 
                // Following update logic: if not found, we keep it as is (might be direct ID) or throw.
                // But since we know frontend sends userId, let's strictly rely on finding SchoolUser.
                // If not found, it will likely fail FK constraint, which is acceptable.
            }
        } else {
            delete data.mainTeacherId;
        }

        return this.prisma.class.create({
            data,
            include: {
                mainTeacher: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                gender: true,
                                phone: true,
                            }
                        }
                    }
                },
                _count: {
                    select: { students: true }
                }
            }
        });
    }

    async findAll(schoolId: string) {
        const classes = await this.prisma.class.findMany({
            where: {
                schoolId,
                deletedAt: null,
            },
            include: {
                mainTeacher: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                gender: true,
                                phone: true,
                            }
                        }
                    }
                },
                _count: {
                    select: { students: true, teachers: true }
                }
            },
            orderBy: {
                name: 'asc',
            }
        } as any);

        return classes.map(cls => ({
            ...cls,
            studentCount: (cls as any)._count.students,
            teacherCount: (cls as any)._count.teachers,
        }));
    }

    async findOne(id: string, schoolId: string) {
        const cls = await this.prisma.class.findFirst({
            where: {
                id,
                schoolId,
                deletedAt: null,
            },
            include: {
                mainTeacher: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                gender: true,
                                phone: true,
                            }
                        }
                    }
                },
                students: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        matricule: true,
                        gender: true,
                    }
                },
                _count: {
                    select: { students: true, teachers: true }
                },
                teachers: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                phone: true,
                                profilePicture: true
                            }
                        }
                    }
                },
                classSubjects: {
                    include: {
                        subject: true
                    }
                }
            }
        } as any);

        if (!cls) {
            throw new NotFoundException(`Class with ID ${id} not found`);
        }

        // Map classSubjects to a flat subjects array with the specific coefficient
        const subjects = (cls as any).classSubjects.map(cs => ({
            ...cs.subject,
            coefficient: cs.coefficient, // Override with specific coefficient
            originalCoefficient: cs.subject.coefficient // Keep original for reference
        }));

        return {
            ...cls,
            subjects, // Backward compatibility
            studentCount: (cls as any)._count.students,
            teacherCount: (cls as any)._count.teachers,
        };
    }

    async update(id: string, schoolId: string, updateClassDto: UpdateClassDto) {
        // Verify existence
        await this.findOne(id, schoolId);

        const data: any = { ...updateClassDto };
        if (data.mainTeacherId === '') {
            data.mainTeacherId = null;
        } else if (data.mainTeacherId) {
            // mainTeacherId from DTO is likely userId (from frontend), but we need SchoolUser.id
            // Try to find SchoolUser for this user and school
            const schoolUser = await this.prisma.schoolUser.findFirst({
                where: {
                    userId: data.mainTeacherId,
                    schoolId
                }
            });

            if (schoolUser) {
                data.mainTeacherId = schoolUser.id;
            } else {
                // Check if it's a direct SchoolUser ID (Edge case, but possible)
                const schoolUserDirect = await this.prisma.schoolUser.findFirst({
                    where: { id: data.mainTeacherId, schoolId }
                });

                if (schoolUserDirect) {
                    // It was already a SchoolUserId
                } else {
                    throw new NotFoundException('Impossible d\'assigner ce professeur : Compte établissement introuvable.');
                }
            }
        }

        return this.prisma.class.update({
            where: { id },
            data,
            include: {
                mainTeacher: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                gender: true,
                                phone: true,
                            }
                        }
                    }
                }
            }
        } as any);
    }

    async remove(id: string, schoolId: string) {
        // Verify existence
        await this.findOne(id, schoolId);

        // Soft delete
        return this.prisma.class.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    async addStudent(classId: string, studentId: string, schoolId: string) {
        await this.findOne(classId, schoolId);

        return this.prisma.student.update({
            where: { id: studentId },
            data: { classId }
        });
    }

    async removeStudent(classId: string, studentId: string, schoolId: string) {
        await this.findOne(classId, schoolId);

        // Verify student is in this class
        const student = await this.prisma.student.findFirst({
            where: { id: studentId, classId, schoolId }
        });

        if (!student) {
            throw new NotFoundException('Student not found in this class');
        }

        return this.prisma.student.update({
            where: { id: studentId },
            data: { classId: null }
        });
    }

    async addTeacher(classId: string, userId: string, schoolId: string) {
        await this.findOne(classId, schoolId);

        // Resolve SchoolUser from UserId
        const schoolUser = await this.prisma.schoolUser.findFirst({
            where: { userId, schoolId }
        });

        if (!schoolUser) {
            throw new NotFoundException('Impossible d\'ajouter ce professeur : Compte établissement introuvable.');
        }

        return this.prisma.class.update({
            where: { id: classId },
            data: {
                teachers: {
                    connect: { id: schoolUser.id }
                }
            }
        });
    }

    async removeTeacher(classId: string, userId: string, schoolId: string) {
        await this.findOne(classId, schoolId);

        // Resolve SchoolUser from UserId
        const schoolUser = await this.prisma.schoolUser.findFirst({
            where: { userId, schoolId }
        });

        if (!schoolUser) {
            throw new NotFoundException('Impossible de retirer ce professeur : Compte établissement introuvable.');
        }

        return this.prisma.class.update({
            where: { id: classId },
            data: {
                teachers: {
                    disconnect: { id: schoolUser.id }
                }
            }
        });
    }

    async addSubject(classId: string, subjectId: string, schoolId: string, coefficient?: number) {
        await this.findOne(classId, schoolId);

        // Get default coefficient if not provided
        let coef = coefficient;
        if (!coef) {
            const subject = await this.prisma.subject.findUnique({ where: { id: subjectId } });
            coef = subject?.coefficient || 1;
        }

        // Upsert ClassSubject (update coef if exists)
        return (this.prisma as any).classSubject.upsert({
            where: {
                classId_subjectId: {
                    classId,
                    subjectId
                }
            },
            update: {
                coefficient: coef
            },
            create: {
                classId,
                subjectId,
                coefficient: coef
            }
        });
    }

    async removeSubject(classId: string, subjectId: string, schoolId: string) {
        await this.findOne(classId, schoolId);

        return (this.prisma as any).classSubject.delete({
            where: {
                classId_subjectId: {
                    classId,
                    subjectId
                }
            }
        });
    }
}
