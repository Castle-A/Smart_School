import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

export interface Transaction {
  id: string;
  date: Date;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  description: string;
  status: string; // Validated, Paid, Pending
  source: 'PAYMENT' | 'EXPENSE' | 'PAYROLL';
  reference?: string;
}

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async getHistory(
    schoolId: string,
    filters?: { startDate?: Date; endDate?: Date },
  ) {
    const whereDate = filters?.startDate
      ? {
          date: {
            gte: filters.startDate,
            lte: filters.endDate || new Date(),
          },
        }
      : {};

    // 1. Fetch Income (Payments)
    const payments = await this.prisma.payment.findMany({
      where: { schoolId, ...whereDate },
      include: { student: true },
    });

    // 2. Fetch Expenses
    const expenses = await this.prisma.expense.findMany({
      where: { schoolId, ...whereDate },
    });

    // 3. Fetch Payrolls (Only PAID)
    const payrolls = await this.prisma.payroll.findMany({
      where: {
        schoolId,
        status: 'PAID',
        ...({ updatedAt: whereDate.date } as any),
      }, // Using updatedAt as payment date proxy if paymentDate null
      include: { teacher: true },
    });

    // Consolidate
    const transactions: Transaction[] = [];

    payments.forEach((p) => {
      transactions.push({
        id: p.id,
        date: p.date,
        type: 'INCOME',
        category: 'Scolarité', // Or more specific if Tuition
        amount: p.amount,
        description: `Paiement - ${p.student.firstName} ${p.student.lastName}`,
        status: 'VALIDATED', // Payments are usually validated implies money received
        source: 'PAYMENT',
        reference: p.reference || undefined,
      });
    });

    expenses.forEach((e) => {
      transactions.push({
        id: e.id,
        date: e.date,
        type: 'EXPENSE',
        category: e.category,
        amount: e.amount,
        description: e.reason,
        status: 'VALIDATED',
        source: 'EXPENSE',
      });
    });

    payrolls.forEach((p) => {
      transactions.push({
        id: p.id,
        date: p.paymentDate || p.updatedAt,
        type: 'EXPENSE',
        category: 'Salaires',
        amount: p.netSalary,
        description: `Salaire - ${p.teacher.firstName} ${p.teacher.lastName} (${p.month})`,
        status: 'PAID',
        source: 'PAYROLL',
      });
    });

    // Sort by date DESC
    return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}
