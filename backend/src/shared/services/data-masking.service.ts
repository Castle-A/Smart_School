import { Injectable } from '@nestjs/common';

@Injectable()
export class DataMaskingService {
    /**
     * Masks sensitive data for SUPPORT_TECH and SUPER_ADMIN_PLATFORM users
     * They can see metadata but not personal/sensitive information
     */
    maskSchoolData(school: any, userRole: string) {
        if (userRole !== 'SUPPORT_TECH' && userRole !== 'SUPER_ADMIN_PLATFORM') {
            return school; // No masking for regular users
        }

        return {
            id: school.id,
            name: school.name,
            plan: school.plan,
            subscriptionStatus: school.subscriptionStatus,
            isActive: school.isActive,
            createdAt: school.createdAt,
            updatedAt: school.updatedAt,
            // Metadata counts only
            _count: school._count,
            // Mask sensitive fields
            address: '[MASKED]',
            phone: '[MASKED]',
            email: '[MASKED]',
        };
    }

    maskUserData(user: any, userRole: string) {
        if (userRole !== 'SUPPORT_TECH' && userRole !== 'SUPER_ADMIN_PLATFORM') {
            return user;
        }

        return {
            id: user.id,
            email: user.email, // Email visible for support
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            platformRole: user.platformRole,
            mustChangePassword: user.mustChangePassword,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            // Mask sensitive fields
            password: '[MASKED]',
            phone: '[MASKED]',
            profilePicture: '[MASKED]',
        };
    }

    maskStudentData(student: any, userRole: string) {
        if (userRole !== 'SUPPORT_TECH' && userRole !== 'SUPER_ADMIN_PLATFORM') {
            return student;
        }

        // Support CANNOT see student details
        return {
            id: '[ANONYMIZED]',
            matricule: '[ANONYMIZED]',
            firstName: '[ANONYMIZED]',
            lastName: '[ANONYMIZED]',
            // Only metadata
            classId: student.classId,
            schoolId: student.schoolId,
        };
    }

    maskTeacherData(teacher: any, userRole: string) {
        if (userRole !== 'SUPPORT_TECH' && userRole !== 'SUPER_ADMIN_PLATFORM') {
            return teacher;
        }

        return {
            id: teacher.id,
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            email: teacher.email,
            contractType: teacher.contractType,
            hireDate: teacher.hireDate,
            matricule: teacher.matricule,
            subjects: teacher.subjects,
            schoolId: teacher.schoolId,
            createdAt: teacher.createdAt,
            updatedAt: teacher.updatedAt,
            // Mask sensitive fields
            phone: '[MASKED]',
            photoUrl: '[MASKED]',
        };
    }

    maskPaymentData(payment: any, userRole: string) {
        if (userRole !== 'SUPPORT_TECH' && userRole !== 'SUPER_ADMIN_PLATFORM') {
            return payment;
        }

        // Support CANNOT see payment details
        return {
            id: '[HIDDEN]',
            amount: '[HIDDEN]',
            date: '[HIDDEN]',
            reason: '[HIDDEN]',
            method: '[HIDDEN]',
            studentId: '[HIDDEN]',
            schoolId: payment.schoolId,
        };
    }

    maskGradeData(grade: any, userRole: string) {
        if (userRole !== 'SUPPORT_TECH' && userRole !== 'SUPER_ADMIN_PLATFORM') {
            return grade;
        }

        // Support CANNOT see grades
        return {
            id: '[HIDDEN]',
            value: '[HIDDEN]',
            type: '[HIDDEN]',
            studentId: '[HIDDEN]',
            subjectId: '[HIDDEN]',
        };
    }

    maskParentData(parent: any, userRole: string) {
        if (userRole !== 'SUPPORT_TECH' && userRole !== 'SUPER_ADMIN_PLATFORM') {
            return parent;
        }

        // Support CANNOT see parent details
        return {
            id: '[ANONYMIZED]',
            firstName: '[ANONYMIZED]',
            lastName: '[ANONYMIZED]',
            email: '[MASKED]',
            phone: '[MASKED]',
        };
    }

    /**
     * Masks an array of entities
     */
    maskArray<T>(entities: T[], maskFn: (entity: T, role: string) => any, userRole: string): any[] {
        return entities.map(entity => maskFn.call(this, entity, userRole));
    }

    /**
     * Checks if user is platform role
     */
    isPlatformRole(userRole: string): boolean {
        return userRole === 'SUPPORT_TECH' || userRole === 'SUPER_ADMIN_PLATFORM';
    }

    /**
     * Checks if user can access sensitive data
     */
    canAccessSensitiveData(userRole: string, dataType: string): boolean {
        if (userRole === 'SUPER_ADMIN_PLATFORM') {
            // SuperAdmin can access most metadata but not personal data
            const allowedTypes = ['school', 'user', 'teacher', 'class', 'subject'];
            return allowedTypes.includes(dataType);
        }

        if (userRole === 'SUPPORT_TECH') {
            // Support has very limited access
            const allowedTypes = ['school', 'user'];
            return allowedTypes.includes(dataType);
        }

        return true; // Regular users have full access to their school data
    }
}
