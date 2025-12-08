import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SupportService {
    constructor(private prisma: PrismaService) { }

    async getSchools() {
        const schools = await this.prisma.school.findMany({
            include: {
                _count: {
                    select: { users: true, students: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return schools.map(school => ({
            id: school.id,
            name: school.name,
            plan: school.plan,
            subscriptionStatus: school.subscriptionStatus,
            isActive: school.isActive,
            createdAt: school.createdAt,
            userCount: school._count.users,
            studentCount: school._count.students
        }));
    }

    async getSchoolMeta(id: string) {
        const school = await this.prisma.school.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { users: true, students: true, classes: true }
                },
                users: {
                    where: { role: 'FOUNDER' },
                    select: { userId: true }
                }
            }
        });

        if (!school) {
            throw new NotFoundException('School not found');
        }

        return {
            ...school,
            stats: school._count,
            founderId: school.users[0]?.userId
        };
    }

    async resetUserPassword(userId: string, adminId: string) {
        // Generate a temporary password
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        await this.prisma.$transaction(async (prisma) => {
            // Update user password
            await prisma.user.update({
                where: { id: userId },
                data: {
                    password: hashedPassword,
                    mustChangePassword: true
                }
            });

            // Log the action
            await prisma.supportLog.create({
                data: {
                    supportId: adminId,
                    action: 'RESET_PASSWORD',
                    details: JSON.stringify({ targetUserId: userId }),
                }
            });
        });

        return { tempPassword };
    }
}
