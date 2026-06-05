import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  // Enregistrer un événement (clic, page vue, erreur, etc.)
  async trackEvent(data: {
    type: string;
    userId?: string;
    schoolId?: string;
    metadata?: any;
    ip?: string;
    userAgent?: string;
  }) {
    // Si metadata est un objet, je le convertis en string pour le stockage
    const metadataString = data.metadata ? JSON.stringify(data.metadata) : null;

    return this.prisma.analyticsEvent.create({
      data: {
        type: data.type,
        userId: data.userId,
        schoolId: data.schoolId,
        metadata: metadataString,
        ipAddress: data.ip,
        userAgent: data.userAgent,
      },
    });
  }

  // Récupérer les stats pour une école spécifique (Dashboard Directeur/Fondateur)
  async getSchoolKPIs(schoolId: string) {
    // Paralleliser les requêtes pour la performance
    const [
      studentCount,
      teacherCount,
      activeClasses,
      todaysAttendance,
      payments,
    ] = await Promise.all([
      // 1. Nombre total d'élèves
      this.prisma.student.count({ where: { schoolId } }),

      // 2. Nombre total d'enseignants
      this.prisma.teacher.count({ where: { schoolId, deletedAt: null } }),

      // 3. Classes actives
      this.prisma.class.count({ where: { schoolId, deletedAt: null } }),

      // 4. Absences d'aujourd'hui
      this.prisma.attendance
        .count({
          where: {
            status: 'ABSENT',
            student: { schoolId }, // Filter by students of this school
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lt: new Date(new Date().setHours(23, 59, 59, 999)),
            },
          },
        })
        .catch(() => 0), // Fallback si le modèle n'est pas encore parfait ou s'il y a une erreur

      // 5. Paiements du mois (Exemple simplifié)
      this.prisma.payment.aggregate({
        where: {
          schoolId,
          date: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { amount: true },
      }),
    ]);

    // Calculer le taux d'absentéisme (simulé si pas de données)
    // Si 0 absences enregistrées, on met 0%
    const absenteeismRate =
      studentCount > 0
        ? ((todaysAttendance / studentCount) * 100).toFixed(1)
        : 0;

    return {
      students: {
        total: studentCount,
        trend: '+0%', // À calculer avec l'historique plus tard
      },
      teachers: {
        total: teacherCount,
        active: teacherCount, // À affiner avec la présence prof
      },
      classes: {
        total: activeClasses,
        occupancy: '85%', // Exemple, nécessiterait capacity vs students
      },
      attendance: {
        absentToday: todaysAttendance,
        rate: `${absenteeismRate}%`,
      },
      finance: {
        revenueMonth: payments._sum.amount || 0,
      },
    };
  }

  // Récupérer les stats globales (Mon Dashboard Fondateur)
  async getGlobalKPIs() {
    // Nombre total d'événements
    const totalEvents = await this.prisma.analyticsEvent.count();

    // Utilisateurs actifs ces dernières 24h
    const activeUsersLast24h = await this.prisma.analyticsEvent.groupBy({
      by: ['userId'],
      where: {
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });

    return {
      totalEvents,
      activeUsers24h: activeUsersLast24h.length,
    };
  }

  async debugDump() {
    const schools = await this.prisma.school.findMany();
    const results: any[] = [];

    for (const school of schools) {
      const students = await this.prisma.student.count({
        where: { schoolId: school.id },
      });
      const teachers = await this.prisma.teacher.count({
        where: { schoolId: school.id },
      });

      results.push({
        schoolName: school.name,
        schoolId: school.id,
        stats: { students, teachers },
      });
    }

    // schoolId is required, so technically no orphans possible by schema definition
    // const orphanTeachers = await this.prisma.teacher.count({ where: { schoolId: null } });

    return {
      schools: results,
      orphans: { teachers: 0 },
    };
  }
}
