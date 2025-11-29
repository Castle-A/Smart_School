import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export interface CreateMemberDto {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    gender: string;
    role: string;
    loginMethod: 'email' | 'phone';
    schoolId: string;
}

@Injectable()
export class MembersService {
    constructor(private prisma: PrismaService) { }

    async createMember(dto: CreateMemberDto, tempPassword: string) {
        // Hash the temporary password
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // Use transaction to create User and SchoolUser
        const result = await this.prisma.$transaction(async (prisma) => {
            // Create User
            const user = await prisma.user.create({
                data: {
                    email: dto.email,
                    phone: dto.phone,
                    password: hashedPassword,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    gender: dto.gender,
                    mustChangePassword: true,
                },
            });

            // Create SchoolUser
            const schoolUser = await prisma.schoolUser.create({
                data: {
                    userId: user.id,
                    schoolId: dto.schoolId,
                    role: dto.role.toUpperCase(),
                },
            });

            return { user, schoolUser };
        });

        return {
            id: result.user.id,
            email: result.user.email,
            phone: result.user.phone,
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            role: result.schoolUser.role,
            loginMethod: dto.loginMethod,
        };
    }

    async getMembersBySchool(schoolId: string) {
        const schoolUsers = await this.prisma.schoolUser.findMany({
            where: {
                schoolId,
                role: {
                    in: ['DIRECTEUR', 'SECRETAIRE', 'SURVEILLANT', 'CENSEUR', 'COMPTABLE'],
                },
            },
            include: {
                user: true,
            },
        });

        return schoolUsers.map(su => ({
            id: su.user.id,
            email: su.user.email,
            phone: su.user.phone,
            firstName: su.user.firstName,
            lastName: su.user.lastName,
            gender: su.user.gender,
            role: su.role,
            createdAt: su.user.createdAt,
            mustChangePassword: su.user.mustChangePassword,
        }));
    }

    async resetMemberPassword(userId: string, tempPassword: string, schoolId: string) {
        // Verify user belongs to the school
        const schoolUser = await this.prisma.schoolUser.findFirst({
            where: { userId, schoolId },
        });

        if (!schoolUser) {
            throw new NotFoundException('Member not found in this school');
        }

        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
                mustChangePassword: true,
            },
        });
    }

    async updateMemberStatus(userId: string, status: string, schoolId: string) {
        // Verify user belongs to the school
        const schoolUser = await this.prisma.schoolUser.findFirst({
            where: { userId, schoolId },
        });

        if (!schoolUser) {
            throw new NotFoundException('Member not found in this school');
        }

        // TODO: Add isActive field to User model
        // For now, we'll just acknowledge the request
        console.log(`Status update requested for user ${userId}: ${status}`);
    }

    async deleteMember(userId: string, schoolId: string) {
        // Verify user belongs to the school
        const schoolUser = await this.prisma.schoolUser.findFirst({
            where: { userId, schoolId },
        });

        if (!schoolUser) {
            throw new NotFoundException('Member not found in this school');
        }

        // Delete in transaction
        await this.prisma.$transaction(async (prisma) => {
            // Delete SchoolUser relationship
            await prisma.schoolUser.delete({
                where: { id: schoolUser.id },
            });

            // Check if user has other school relationships
            const otherSchools = await prisma.schoolUser.count({
                where: { userId },
            });

            // If no other schools, delete the user
            if (otherSchools === 0) {
                await prisma.user.delete({
                    where: { id: userId },
                });
            }
        });
    }
}
