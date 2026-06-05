import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import type { IEmailProvider } from '../interfaces/email-provider.interface';
import type { ISmsProvider } from '../../infrastructure/sms/interfaces/sms-provider.interface';

@Injectable()
export class CommunicationService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    @Inject('IEmailProvider') private emailProvider: IEmailProvider,
    @Inject('ISmsProvider') private smsProvider: ISmsProvider,
  ) {}

  // --- Internal Communication (Announcements) ---

  async createAnnouncement(
    schoolId: string,
    authorId: string,
    data: { title: string; content: string; scope: string },
  ) {
    return this.prisma.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        audience: data.scope, // Map scope to audience
        schoolId,
        authorId,
      },
      include: { author: { select: { firstName: true, lastName: true } } },
    });
  }

  async getAnnouncements(schoolId: string) {
    return this.prisma.announcement.findMany({
      where: { schoolId },
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { firstName: true, lastName: true } } },
    });
  }

  // --- External Communication (Payment Reminders) ---

  async sendPaymentReminder(
    schoolId: string,
    studentId: string,
    method: 'EMAIL' | 'SMS' = 'EMAIL',
  ) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) throw new Error('Student not found');

    const message = `Bonjour ${student.parentName}, ceci est un rappel pour le paiement de scolarité de ${student.firstName} ${student.lastName}.`;

    if (method === 'EMAIL') {
      // In a real app, parentEmail would be on the student/parent record.
      const email = 'parent@example.com';
      await this.emailProvider.sendMail({
        to: email,
        subject: 'Rappel de Paiement - SmartSchool',
        html: `<p>${message}</p><p>Veuillez régulariser votre situation dès que possible.</p>`,
      });
    } else {
      // Using parentPhone from student record
      await this.smsProvider.sendSms({
        to: student.parentPhone || '+000000000',
        message: message,
      });
    }

    return {
      success: true,
      message: `Relance ${method} envoyée à ${student.parentName}`,
      timestamp: new Date(),
    };
  }

  /**
   * Envoie une alerte SMS au parent en cas de sanction grave.
   */
  async sendSanctionAlert(
    schoolId: string,
    studentId: string,
    sanctionType: string,
  ) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student || !student.parentPhone) return;

    const message = `ALERTE ECOLE: Votre enfant ${student.firstName} a reçu une sanction: ${sanctionType}. Merci de contacter l'administration.`;

    await this.smsProvider.sendSms({
      to: student.parentPhone,
      message,
    });
  }

  /**
   * Notifie le parent d'une absence non justifiée.
   */
  async notifyParentOfAbsence(schoolId: string, studentId: string, date: Date) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student || !student.parentPhone) return;

    const dateStr = date.toLocaleDateString('fr-FR');
    const message = `ALERTE ABSENCE: Votre enfant ${student.firstName} a été marqué absent le ${dateStr}. Merci de justifier cette absence.`;

    await this.smsProvider.sendSms({
      to: student.parentPhone,
      message,
    });
  }

  /**
   * Envoie une alerte système multi-canal (Dashboard, Email, SMS) à un utilisateur.
   */
  async sendSystemAlert(
    schoolId: string,
    userId: string,
    data: { title: string; message: string; email?: string; phone?: string },
  ) {
    // 1. Dashboard (Notification Interne)
    await this.notificationsService
      .create({
        userId,
        type: 'SYSTEM',
        title: data.title,
        message: data.message,
      })
      .catch((e) => console.error(`[Dashboard Alert Error] ${e.message}`));

    // 2. Email
    if (data.email) {
      await this.emailProvider
        .sendMail({
          to: data.email,
          subject: data.title,
          html: `<p>${data.message}</p>`,
        })
        .catch((e) => console.error(`[Email Alert Error] ${e.message}`));
    }

    // 3. SMS
    if (data.phone) {
      await this.smsProvider
        .sendSms({
          to: data.phone,
          message: `${data.title}: ${data.message.substring(0, 100)}...`,
        })
        .catch((e) => console.error(`[SMS Alert Error] ${e.message}`));
    }
  }

  async getOverdueStudents(schoolId: string) {
    // Logic to find students who have NOT paid enough vs AcademicCalendar deadlines.
    // For MVP, we mock this logic or just return all with basic status.
    // Let's assume we fetch all students via Prisma and the client filters,
    // OR we do a complex query.
    // Simplified: Return students with mock balance > 0

    // This is better handled by StudentService or FinanceService, but Communication uses it to KNOW who to ping.
    // We'll trust the Frontend to pass the ID for now.
    return [];
  }
}
