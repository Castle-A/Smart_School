import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import type { ITeachersRepository } from '../../domain/teachers/teachers.repository.interface';
import { AuditService } from '../../shared/services/audit.service';
import { MembersService } from '../members/members.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { AdminRequestService } from '../admin-requests/admin-requests.service';
import { PasswordUtil } from '../../shared/utils/password.util';

@Injectable()
export class TeachersService {
  constructor(
    @Inject('ITeachersRepository')
    private teachersRepository: ITeachersRepository,
    private auditService: AuditService,
    private membersService: MembersService,
    private adminRequestService: AdminRequestService,
  ) {}

  async createTeacher(
    schoolId: string,
    data: CreateTeacherDto,
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    // Générer un mot de passe temporaire
    const tempPassword = PasswordUtil.generateTemporary();

    // Créer le compte utilisateur (User + SchoolUser) avec le rôle approprié
    const role = 'TEACHER'; // Rôle système générique pour les permissions

    let member;
    try {
      member = await this.membersService.createMember(
        {
          email: data.email,
          phone: data.phone,
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          role: role,
          loginMethod: 'email',
          schoolId: schoolId,
        },
        tempPassword,
      );
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
      console.error(
        'Teacher creation failed. Rolling back user creation...',
        error,
      );
      await this.membersService
        .deleteMember(member.id, schoolId)
        .catch((cleanupErr) =>
          console.error(
            'CRITICAL: Failed to rollback user creation',
            cleanupErr,
          ),
        );
      throw error;
    }
  }

  async getTeachers(schoolId: string, isSimple: boolean = false) {
    return this.teachersRepository.findAllBySchoolId(schoolId, isSimple);
  }

  async getTeacher(id: string, schoolId: string) {
    const teacher = await this.teachersRepository.findById(id);

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    if (teacher.schoolId !== schoolId) {
      throw new ForbiddenException('Access denied');
    }

    return teacher;
  }

  async updateSalary(id: string, schoolId: string, hourlyRate: number) {
    const teacher = await this.teachersRepository.findById(id);
    if (!teacher || teacher.schoolId !== schoolId) {
      throw new NotFoundException('Teacher not found');
    }
    // Cast to any if Repository type is strict and I can't see it
    return this.teachersRepository.update(id, { hourlyRate } as any);
  }

  async updateTeacher(
    id: string,
    schoolId: string,
    data: UpdateTeacherDto,
    userId: string,
    ipAddress?: string,
    userAgent?: string,
    userRole?: string, // Add userRole
  ) {
    const oldTeacher = await this.getTeacher(id, schoolId);

    // Validation Workflow for Censors
    if (userRole === 'CENSOR') {
      try {
        await this.adminRequestService.create(
          schoolId,
          userId,
          'UPDATE_TEACHER',
          {
            teacherId: id,
            data: data,
          },
        );
      } catch (error) {
        console.error('FAILED_TO_CREATE_ADMIN_REQUEST', error);
        throw new InternalServerErrorException(
          'Echec création requête: ' + error.message,
        );
      }

      return {
        status: 'PENDING_APPROVAL',
        message: 'Modification soumise pour validation.',
        originalData: oldTeacher,
      };
    }

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
