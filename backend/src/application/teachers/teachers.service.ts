import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import type { ITeachersRepository } from '../../domain/teachers/teachers.repository.interface';
import { AuditService } from '../../shared/services/audit.service';
import { MembersService } from '../members/members.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TeachersService {
    constructor(
        @Inject('ITeachersRepository')
        private teachersRepository: ITeachersRepository,
        private auditService: AuditService,
        private membersService: MembersService,
    ) { }

    async createTeacher(
        schoolId: string,
        data: CreateTeacherDto,
        userId: string,
        ipAddress?: string,
        userAgent?: string,
    ) {
        // Générer un mot de passe temporaire
        const tempPassword = Math.random().toString(36).slice(-8);

        // Créer le compte utilisateur (User + SchoolUser) avec le rôle approprié
        const role = 'TEACHER'; // Rôle système générique pour les permissions

        let member;
        try {
            member = await this.membersService.createMember({
                email: data.email,
                phone: data.phone,
                firstName: data.firstName,
                lastName: data.lastName,
                gender: data.gender,
                role: role,
                loginMethod: 'email',
                schoolId: schoolId,
            }, tempPassword);
        } catch (error) {
            // Propagate error (e.g., email already exists)
            throw error;
        }

        // Créer le profil Teacher lié au User
        try {
            const teacherData = data;
            const teacher = await this.teachersRepository.create({
                ...teacherData,
                schoolId,
                userId: member.id, // Lier au User créé
            });

            // Log the action
            await this.auditService.log({
                userId,
                schoolId,
                action: 'CREATE',
                entity: 'Teacher',
                entityId: teacher.id.toString(),
                newValue: teacher,
                ipAddress,
                userAgent,
            });

            return {
                ...teacher,
                tempPassword, // Retourner le mot de passe temporaire pour l'afficher
            };
        } catch (error) {
            // ROLLBACK: If teacher creation fails, delete the created user
            console.error('Teacher creation failed. Rolling back user creation...', error);
            await this.membersService.deleteMember(member.id, schoolId).catch(cleanupErr =>
                console.error('CRITICAL: Failed to rollback user creation', cleanupErr)
            );
            throw error;
        }
    }

    async getTeachers(schoolId: string) {
        return this.teachersRepository.findAllBySchoolId(schoolId);
    }

    async getTeacher(id: string, schoolId: string) {
        const teacher = await this.teachersRepository.findById(id);

        if (!teacher) {
            throw new NotFoundException('Teacher not found');
        }

        // Verify teacher belongs to the user's school
        if (teacher.schoolId !== schoolId) {
            throw new ForbiddenException('Access denied');
        }

        return teacher;
    }

    async updateTeacher(
        id: string,
        schoolId: string,
        data: UpdateTeacherDto,
        userId: string,
        ipAddress?: string,
        userAgent?: string,
    ) {
        const oldTeacher = await this.getTeacher(id, schoolId);

        const updatedTeacher = await this.teachersRepository.update(id, data);

        // Log the action
        await this.auditService.log({
            userId,
            schoolId,
            action: 'UPDATE',
            entity: 'Teacher',
            entityId: id,
            oldValue: oldTeacher,
            newValue: updatedTeacher,
            ipAddress,
            userAgent,
        });

        return updatedTeacher;
    }

    async removeTeacher(
        id: string,
        schoolId: string,
        userId: string,
        ipAddress?: string,
        userAgent?: string,
    ) {
        const teacher = await this.getTeacher(id, schoolId);

        // Soft delete
        await this.teachersRepository.softDelete(id);

        // Log the action
        await this.auditService.log({
            userId,
            schoolId,
            action: 'DELETE',
            entity: 'Teacher',
            entityId: id,
            oldValue: teacher,
            ipAddress,
            userAgent,
        });

        return { success: true, message: 'Teacher deleted successfully' };
    }
}
