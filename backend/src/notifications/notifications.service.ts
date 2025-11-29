import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructure/prisma/prisma.service';

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) { }

    async findAll(userId: string) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
    }

    async getUnreadCount(userId: string) {
        return this.prisma.notification.count({
            where: {
                userId,
                isRead: false,
            },
        });
    }

    async markAsRead(id: string, userId: string) {
        return this.prisma.notification.updateMany({
            where: {
                id,
                userId,
            },
            data: {
                isRead: true,
            },
        });
    }

    async markAllAsRead(userId: string) {
        return this.prisma.notification.updateMany({
            where: {
                userId,
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });
    }

    async create(data: {
        userId: string;
        type: 'PAYMENT' | 'ABSENCE' | 'VALIDATION' | 'SECURITY' | 'SYSTEM';
        title: string;
        message: string;
        link?: string;
    }) {
        return this.prisma.notification.create({
            data: {
                ...data,
                isRead: false,
            },
        });
    }
}
