import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private prisma: PrismaService) {}

  // S'exécute tous les jours à minuit (0 minutes, 0 heures)
  @Cron('0 0 * * *')
  async handleCron() {
    this.logger.log('Exécution de la tâche de vérification des abonnements...');
    
    // On appellera la logique de mise en pause ici
    await this.pauseExpiredSubscriptions();
  }

  private async pauseExpiredSubscriptions() {
    const now = new Date();

    // On cherche les abonnements ACTIFS dont la période de grâce est terminée
    const expiredSubscriptions = await this.prisma.subscription.findMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        gracePeriodEndsAt: {
          lt: now, // lt = "less than" (avant maintenant)
        },
      },
    });

    if (expiredSubscriptions.length > 0) {
      this.logger.log(`Mise en pause de ${expiredSubscriptions.length} abonnement(s) expiré(s).`);
      
      await this.prisma.subscription.updateMany({
        where: {
          id: { in: expiredSubscriptions.map(sub => sub.id) },
        },
        data: {
          status: SubscriptionStatus.PAUSED,
        },
      });

      this.logger.log(`${expiredSubscriptions.length} abonnement(s) mis en pause avec succès.`);
    } else {
      this.logger.log('Aucun abonnement à mettre en pause aujourd\'hui.');
    }
  }
}