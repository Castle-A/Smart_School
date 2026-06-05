import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Récupère l'abonnement actuel de l'école
   * Crée un abonnement par défaut (FREE) si aucun n'existe
   */
  async getCurrentSubscription(schoolId: string) {
    let subscription = await this.prisma.subscription.findUnique({
      where: { schoolId },
    });

    if (!subscription) {
      // Créer un abonnement FREE par défaut
      subscription = await this.prisma.subscription.create({
        data: {
          schoolId,
          plan: 'FREE',
          status: 'ACTIVE',
          maxStudents: 50,
          maxTeachers: 5,
          maxStorage: 1.0,
          features: ['bulletins-basiques', 'support-email'],
        },
      });
    }

    return subscription;
  }

  /**
   * Récupère l'utilisation actuelle par rapport aux limites
   */
  async getUsage(schoolId: string) {
    const [studentCount, teacherCount] = await Promise.all([
      this.prisma.student.count({ where: { schoolId } }),
      this.prisma.teacher.count({ where: { schoolId } }),
    ]);

    return {
      students: studentCount,
      teachers: teacherCount,
      storage: 0, // Placeholder pour le moment
    };
  }
}
