
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IAuthRepository } from '../../domain/auth/user.entity';
import type { ITeachersRepository } from '../../domain/teachers/teachers.repository.interface';

@Injectable()
export class ProfileService {
    constructor(
        @Inject('IAuthRepository')
        private authRepository: IAuthRepository,
        @Inject('ITeachersRepository')
        private teachersRepository: ITeachersRepository,
    ) { }

    async getProfile(userId: string) {
        const user = await this.authRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Si c'est un enseignant, on peut vouloir récupérer des infos supplémentaires
        // comme les matières, etc.
        let teacherProfile = null;
        if (user.role === 'TEACHER' || user.role === 'MAITRE') {
            // Implémentation future si nécessaire
        }

        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: `${user.firstName} ${user.lastName}`,
            gender: user.gender,
            phone: user.phone,
            role: user.role, // "FOUNDER", "DIRECTOR", etc.
            photoUrl: null, // À implémenter avec l'upload
            school: user.schoolId ? {
                id: user.schoolId,
                name: user.schoolName,
                // address: user.school.address, // TODO: Add to User entity or fetch separately
                // phone: user.school.phone,
                // email: user.school.email,
                // cycles: user.school.cycles,
            } : null
        };
    }

    async updateProfile(userId: string, data: any) {
        return this.authRepository.update(userId, data);
    }
}
