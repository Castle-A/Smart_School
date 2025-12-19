import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

export interface CreateEventDto {
    title: string;
    start: Date;
    end: Date;
    type: string;
    description?: string;
    isSystem?: boolean;
    audience?: 'ADMIN_ONLY' | 'PUBLIC' | 'STUDENTS' | 'PARENTS' | 'TEACHERS';
    targetClassId?: string;
}

@Injectable()
export class AcademicCalendarService {
    constructor(private prisma: PrismaService) { }

    async create(schoolId: string, userId: string, userRole: string, dto: CreateEventDto) {
        // Business Logic: Only Founder/Director can create System Events (Holidays, Periods)
        const isSystemType = ['ACADEMIC_PERIOD', 'HOLIDAY', 'EXAM'].includes(dto.type);

        if (isSystemType && !['DIRECTOR', 'FOUNDER'].includes(userRole)) {
            throw new ForbiddenException('Seuls le Directeur et le Fondateur peuvent définir la structure de l\'année scolaire (Vacances, Examens).');
        }

        // Accountant can only create FINANCIAL
        if (userRole === 'ACCOUNTANT' && dto.type !== 'FINANCIAL') {
            throw new ForbiddenException('Le comptable ne peut ajouter que des événements financiers.');
        }

        return this.prisma.academicEvent.create({
            data: {
                ...dto,
                schoolId,
                createdById: userId,
                isSystem: isSystemType || (dto.isSystem ?? false),
                audience: dto.audience || 'ADMIN_ONLY',
                targetClassId: dto.targetClassId
            }
        });
    }

    async findAll(schoolId: string, userRole: string = 'ADMIN') {
        const where: any = { schoolId };

        // Basic Security Filtering (Can be enhanced)
        if (!['DIRECTOR', 'FOUNDER', 'CENSOR', 'ACCOUNTANT', 'SECRETARY'].includes(userRole)) {
            // Non-Admin (Parents, Students) see PUBLIC + Specific Audience
            where.OR = [
                { audience: 'PUBLIC' },
                { audience: userRole } // e.g. 'PARENTS'
            ];
        }
        // Admins see EVERYTHING for now (or we can hide 'PUBLIC' clutter? No, they see all).

        return this.prisma.academicEvent.findMany({
            where,
            orderBy: { start: 'asc' },
            include: {
                createdBy: { select: { firstName: true, lastName: true } },
                targetClass: { select: { name: true } }
            }
        });
    }

    async update(id: string, schoolId: string, userRole: string, dto: Partial<CreateEventDto>) {
        const event = await this.prisma.academicEvent.findUnique({ where: { id } });
        if (!event || event.schoolId !== schoolId) throw new NotFoundException('Event not found');

        // Protections
        if (event.isSystem && !['DIRECTOR', 'FOUNDER'].includes(userRole)) {
            throw new ForbiddenException('Seul le Fondateur/Directeur peut modifier cet événement système.');
        }

        return this.prisma.academicEvent.update({
            where: { id },
            data: dto
        });
    }

    async delete(id: string, schoolId: string, userRole: string) {
        const event = await this.prisma.academicEvent.findUnique({ where: { id } });
        if (!event || event.schoolId !== schoolId) throw new NotFoundException('Event not found');

        if (event.isSystem && !['DIRECTOR', 'FOUNDER'].includes(userRole)) {
            throw new ForbiddenException('Impossible de supprimer un événement système.');
        }

        return this.prisma.academicEvent.delete({ where: { id } });
    }
}
