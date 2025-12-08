import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService {
    constructor(private prisma: PrismaService) { }

    async create(schoolId: string, createStudentDto: CreateStudentDto) {
        // Check if matricule exists globally or within school? Usually globally unique or school unique.
        // Schema says @unique globally.

        const existing = await this.prisma.student.findUnique({
            where: { matricule: createStudentDto.matricule },
        });

        if (existing) {
            throw new ConflictException('Un élève avec ce matricule existe déjà.');
        }

        return this.prisma.student.create({
            data: {
                ...createStudentDto,
                dob: new Date(createStudentDto.dob),
                schoolId,
                status: 'PENDING', // Default to PENDING for validation
            },
        });
    }

    async findAll(schoolId: string, query?: { classId?: string; search?: string }) {
        const { classId, search } = query || {};

        return this.prisma.student.findMany({
            where: {
                schoolId,
                ...(classId ? { classId } : {}),
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

    async findOne(id: string) {
        const student = await this.prisma.student.findUnique({
            where: { id },
            include: { class: true },
        });
        if (!student) throw new NotFoundException('Élève non trouvé');
        return student;
    }
    async addComment(studentId: string, authorId: string, content: string) {
        return this.prisma.studentComment.create({
            data: {
                studentId,
                authorId,
                content
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

    async getComments(studentId: string) {
        return this.prisma.studentComment.findMany({
            where: { studentId },
            include: {
                author: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
}
