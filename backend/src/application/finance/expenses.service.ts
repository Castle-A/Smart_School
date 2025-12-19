import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpensesService {
    constructor(private prisma: PrismaService) { }

    /**
     * Crée une nouvelle dépense.
     */
    async create(schoolId: string, userId: string, data: CreateExpenseDto) {
        // Validation basique des catégories
        const validCategories = ['SALAIRE', 'LOYER', 'ELECTRICITE', 'EAU', 'ENTRETIEN', 'FOURNITURES', 'AUTRE'];
        if (!validCategories.includes(data.category)) {
            // Par défaut, on accepte, mais on pourrait lever une erreur.
            // Pour l'instant, on log ou on normalise.
        }

        return this.prisma.expense.create({
            data: {
                category: data.category,
                amount: data.amount,
                reason: data.reason,
                beneficiary: data.beneficiary,
                date: data.date ? new Date(data.date) : new Date(),
                school: { connect: { id: schoolId } },
                createdBy: { connect: { id: userId } }
            }
        });
    }

    /**
     * Récupère la liste des dépenses avec filtres optionnels.
     */
    async findAll(schoolId: string, filters?: { startDate?: string; endDate?: string; category?: string }) {
        const where: any = { schoolId };

        if (filters?.startDate && filters?.endDate) {
            where.date = {
                gte: new Date(filters.startDate),
                lte: new Date(filters.endDate)
            };
        }

        if (filters?.category) {
            where.category = filters.category;
        }

        return this.prisma.expense.findMany({
            where,
            orderBy: { date: 'desc' },
            include: { createdBy: { select: { email: true } } } // Infos utilisateur simples
        });
    }

    /**
     * Récupère les statistiques des dépenses par catégorie.
     */
    async getStats(schoolId: string) {
        const expenses = await this.prisma.expense.groupBy({
            by: ['category'],
            where: { schoolId },
            _sum: { amount: true },
        });

        return expenses.map(e => ({
            category: e.category,
            total: e._sum.amount || 0
        }));
    }
}
