import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { PrismaService } from '../prisma.service';
import { SubscriptionStatus } from '@prisma/client'; // On importe l'enum pour plus de clarté

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    const { schoolId, planId, startDate } = createSubscriptionDto;

    // 1. Récupérer le plan pour connaître sa durée
    const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) {
      throw new Error('Plan not found');
    }

    // 2. Calculer les dates importantes
    const startDateObj = new Date(startDate);
    
    const endDate = new Date(startDateObj);
    endDate.setMonth(endDate.getMonth() + plan.durationInMonths);

    // --- NOUVELLE LOGIQUE ---
    // Période d'essai de 1 mois à partir de la date de début
    const trialEndDate = new Date(startDateObj);
    trialEndDate.setMonth(trialEndDate.getMonth() + 1);

    // Période de grâce de 1 mois après la date de fin normale
    const gracePeriodEndsAt = new Date(endDate);
    gracePeriodEndsAt.setMonth(gracePeriodEndsAt.getMonth() + 1);

    // 3. Créer l'abonnement avec toutes les dates calculées
    return this.prisma.subscription.create({
      data: {
        schoolId,
        planId,
        startDate: startDateObj,
        endDate,
        trialEndDate,
        gracePeriodEndsAt,
        status: SubscriptionStatus.ACTIVE, // Utilisation de l'enum pour la robustesse
      },
    });
  }

  findAll() {
    return this.prisma.subscription.findMany({
      include: {
        school: { select: { name: true } },
        plan: { select: { name: true, price: true } },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.subscription.findUnique({
      where: { id },
      include: {
        school: true,
        plan: true,
      },
    });
  }

  // La mise à jour et la suppression sont plus complexes et peuvent être ajoutées plus tard
  // Par exemple, on pourrait vouloir "renouveler" un abonnement
}