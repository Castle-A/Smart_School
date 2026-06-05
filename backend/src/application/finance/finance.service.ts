import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ValidationUtils } from '../../shared/utils/validation.utils';
import { PdfService } from './pdf.service';
import { getReceiptHtml } from './templates/receipt.template';

@Injectable()
export class FinanceService {
  constructor(
    private prisma: PrismaService,
    private pdfService: PdfService,
  ) { }

  async getStudentFinanceSummary(schoolId: string, search?: string) {
    // Récupérer les étudiants filtrés par recherche
    const students = await this.prisma.student.findMany({
      where: {
        schoolId,
        OR: search
          ? [
            { firstName: { contains: search } },
            { lastName: { contains: search } },
            { matricule: { contains: search } },
          ]
          : undefined,
      },
      include: {
        class: true,
        payments: true,
      },
      take: 10,
    });

    return students.map((student) => {
      const tuitionFee = student.class?.tuitionFee || 0;
      const registrationFee = student.class?.registrationFee || 0;
      const totalDue = tuitionFee + registrationFee;

      const totalPaid = student.payments.reduce((sum, p) => sum + p.amount, 0);
      const balance = totalDue - totalPaid;

      const lastPayment =
        student.payments.length > 0
          ? student.payments.sort(
            (a, b) => b.date.getTime() - a.date.getTime(),
          )[0]
          : null;

      return {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        matricule: student.matricule,
        class: { name: student.class?.name || 'N/A' },
        totalDue,
        totalPaid,
        balance,
        lastPaymentDate: lastPayment
          ? lastPayment.date.toISOString().split('T')[0]
          : null,
      };
    });
  }

  /**
   * Enregistre un nouveau paiement pour un élève (MÉTHODE LEGACY - À DÉPRÉCIER).
   */
  async createPayment(schoolId: string, data: CreatePaymentDto) {
    const student = await this.prisma.student.findFirst({
      where: { id: data.studentId, schoolId },
    });

    if (!student) {
      throw new Error(
        "L'élève n'existe pas ou n'appartient pas à votre établissement.",
      );
    }

    return this.prisma.payment.create({
      data: {
        amount: data.amount,
        method: data.method,
        reason: data.reason,
        reference: data.reference,
        student: { connect: { id: data.studentId } },
        school: { connect: { id: schoolId } },
        date: new Date(),
      },
    });
  }

  /**
   * Phase 2: Initier une transaction sécurisée.
   * Crée un enregistrement Transaction en attente de confirmation.
   */
  async initiateTransaction(schoolId: string, data: CreatePaymentDto, idempotencyKey: string) {
    // 1. Validation de l'élève
    const student = await this.prisma.student.findFirst({
      where: { id: data.studentId, schoolId },
    });

    if (!student) {
      throw new BadRequestException("L'élève n'existe pas ou n'appartient pas à votre établissement.");
    }

    // 2. Création de la transaction PENDING
    return (this.prisma as any).financialTransaction.create({
      data: {
        idempotencyKey,
        amount: data.amount,
        currency: 'XOF', // Pourrait venir du DTO
        provider: data.method === 'CASH' ? 'CASH' : 'EXTERNAL',
        status: 'PENDING',
        schoolId,
        studentId: data.studentId,
        metadata: JSON.stringify({ reason: data.reason, reference: data.reference }),
      },
    });
  }

  /**
   * Confirme un paiement en espèces (immédiat).
   * Transforme la Transaction en Payment réel.
   */
  async confirmCashPayment(transactionId: string) {
    const transaction = await (this.prisma as any).financialTransaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction || transaction.status !== 'PENDING') {
      throw new BadRequestException('Transaction invalide ou déjà traitée');
    }

    // Transaction atomique : Mise à jour Transaction + Création Payment
    return this.prisma.$transaction(async (prisma) => {
      // 1. Marquer la transaction comme SUCCÈS
      const updatedTransaction = await (prisma as any).financialTransaction.update({
        where: { id: transactionId },
        data: { status: 'SUCCESS' },
      });

      // 2. Créer le paiement officiel (votre modèle existant)
      const metadata = JSON.parse(transaction.metadata || '{}');
      const payment = await prisma.payment.create({
        data: {
          amount: transaction.amount,
          method: 'CASH',
          reason: metadata.reason || 'Paiement Espèces',
          reference: metadata.reference || transaction.idempotencyKey,
          date: new Date(),
          school: { connect: { id: transaction.schoolId } },
          student: { connect: { id: transaction.studentId } },
        },
      });

      return { transaction: updatedTransaction, payment };
    });
  }

  async generateReceiptPdf(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        school: true,
        student: { include: { class: true } },
      },
    });

    if (!payment) throw new Error('Payment not found');

    const summary = await this.prisma.student.findUnique({
      where: { id: payment.studentId },
      include: { class: true, payments: true },
    });
    const totalDue =
      (summary?.class?.tuitionFee || 0) +
      (summary?.class?.registrationFee || 0);
    const totalPaid =
      summary?.payments.reduce((sum, p) => sum + p.amount, 0) || 0;
    const balance = totalDue - totalPaid;

    const html = getReceiptHtml({
      schoolName: payment.school.name,
      schoolAddress: payment.school.address,
      schoolPhone: payment.school.phone,
      schoolEmail: payment.school.email,
      receiptRef: payment.id.substring(0, 8).toUpperCase(),
      date: payment.date.toLocaleString('fr-FR'),
      method: payment.method,
      transactionRef: payment.reference,
      studentName: `${payment.student.firstName} ${payment.student.lastName}`,
      className: payment.student.class?.name || 'N/A',
      matricule: payment.student.matricule,
      amount: payment.amount.toLocaleString('fr-FR'),
      reason: payment.reason,
      balance: balance.toLocaleString('fr-FR'),
    });

    return this.pdfService.generatePdf(html);
  }

  /**
   * Génère un rapport financier (Bilan) pour une période donnée.
   * Optimisé Expert : Groupement effectué directement en base de données (PostgreSQL).
   * Sécurisé Expert : Validation stricte des paramètres avant requête SQL brute.
   */
  async getFinancialReport(schoolId: string, startDate: Date, endDate: Date) {
    // Master Security : Validation stricte AVANT $queryRaw pour prévenir injection SQL
    ValidationUtils.validateUUID(schoolId, 'schoolId');
    const start = ValidationUtils.validateDate(startDate, 'startDate');
    const end = ValidationUtils.validateDate(endDate, 'endDate');
    ValidationUtils.validateDateRange(start, end);

    // 1. Récupération des revenus groupés par mois via SQL Raw (Performance O(1) mémoire)
    // Note : Les paramètres sont validés ci-dessus, Prisma échappe automatiquement les valeurs
    const incomeRaw: any[] = await this.prisma.$queryRaw`
            SELECT to_char(date, 'YYYY-MM') as month, SUM(amount) as total
            FROM "Payment"
            WHERE "schoolId" = ${schoolId}::uuid AND date >= ${start}::date AND date <= ${end}::date
            GROUP BY 1
            ORDER BY 1 ASC
        `;

    // 2. Récupération des dépenses groupées par mois
    const expenseRaw: any[] = await this.prisma.$queryRaw`
            SELECT to_char(date, 'YYYY-MM') as month, SUM(amount) as total
            FROM "Expense"
            WHERE "schoolId" = ${schoolId}::uuid AND date >= ${start}::date AND date <= ${end}::date
            GROUP BY 1
            ORDER BY 1 ASC
        `;

    // 3. Fusion des résultats
    const reportMap = new Map<string, { income: number; expense: number }>();

    incomeRaw.forEach((r) => {
      reportMap.set(r.month, { income: Number(r.total) || 0, expense: 0 });
    });

    expenseRaw.forEach((r) => {
      const current = reportMap.get(r.month) || { income: 0, expense: 0 };
      current.expense = Number(r.total) || 0;
      reportMap.set(r.month, current);
    });

    // 4. Préparation des données pour le frontend
    const sortedMonths = Array.from(reportMap.keys()).sort();
    const labels: string[] = [];
    const incomeData: number[] = [];
    const expenseData: number[] = [];
    const balanceData: number[] = [];

    sortedMonths.forEach((month) => {
      const data = reportMap.get(month)!;
      labels.push(month);
      incomeData.push(data.income);
      expenseData.push(data.expense);
      balanceData.push(data.income - data.expense);
    });

    return {
      labels,
      income: incomeData,
      expense: expenseData,
      balance: balanceData,
    };
  }

  /**
   * Récupère les statistiques globales (KPI) pour l'année en cours.
   */
  async getGlobalStats(schoolId: string) {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31);

    // Revenu Total (Année)
    const totalIncomeAgg = await this.prisma.payment.aggregate({
      where: {
        schoolId,
        date: { gte: startOfYear, lte: endOfYear },
      },
      _sum: { amount: true },
    });
    const totalIncome = totalIncomeAgg._sum.amount || 0;

    // Dépenses Totales (Année)
    const totalExpenseAgg = await this.prisma.expense.aggregate({
      where: {
        schoolId,
        date: { gte: startOfYear, lte: endOfYear },
      },
      _sum: { amount: true },
    });
    const totalExpense = totalExpenseAgg._sum.amount || 0;

    // Solde
    const balance = totalIncome - totalExpense;

    return {
      year: now.getFullYear(),
      totalIncome,
      totalExpense,
      balance,
    };
  }
}
