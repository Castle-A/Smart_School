import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

export interface CreateAppointmentDto {
  title: string;
  description?: string;
  start: Date;
  end: Date;
  mode: 'PRESENTIAL' | 'PHONE' | 'ONLINE';
  location?: string;
  participantIds: string[];
}

@Injectable()
export class AppointmentService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async requestAppointment(
    schoolId: string,
    organizerId: string,
    dto: CreateAppointmentDto,
  ) {
    // 1. Create Appointment (Status PENDING)
    const appointment = await this.prisma.appointment.create({
      data: {
        title: dto.title,
        description: dto.description,
        start: new Date(dto.start),
        end: new Date(dto.end),
        mode: dto.mode,
        location: dto.location,
        status: 'PENDING',
        schoolId,
        organizerId,
        participants: {
          create: dto.participantIds.map((uid) => ({
            userId: uid,
            status: 'PENDING',
          })),
        },
      },
      include: { organizer: { select: { firstName: true, lastName: true } } },
    });

    // 2. Notify Participants
    for (const pid of dto.participantIds) {
      await this.notificationsService.create({
        userId: pid,
        type: 'VALIDATION',
        title: 'Demande de Rendez-vous',
        message: `${appointment.organizer.firstName} vous invite à : ${dto.title}. Validez votre présence.`,
        link: '/communication/appointments', // Frontend route
      });
    }

    return appointment;
  }

  async validateParticipation(
    userId: string,
    appointmentId: string,
    status: 'ACCEPTED' | 'DECLINED',
  ) {
    const participation = await this.prisma.appointmentParticipant.findUnique({
      where: { appointmentId_userId: { appointmentId, userId } },
    });

    if (!participation) throw new NotFoundException('Invitation introuvable');

    // Update status
    await this.prisma.appointmentParticipant.update({
      where: { appointmentId_userId: { appointmentId, userId } },
      data: { status },
    });

    // Check if all Accepted
    if (status === 'ACCEPTED') {
      const allParticipants = await this.prisma.appointmentParticipant.findMany(
        {
          where: { appointmentId },
        },
      );

      const allAccepted = allParticipants.every((p) => p.status === 'ACCEPTED');

      if (allAccepted) {
        // Confirm Appointment
        const confirmed = await this.prisma.appointment.update({
          where: { id: appointmentId },
          data: { status: 'CONFIRMED' },
          include: { organizer: true },
        });

        // Notify Organizer
        await this.notificationsService.create({
          userId: confirmed.organizerId,
          type: 'SYSTEM',
          title: 'Rendez-vous Confirmé',
          message: `Tous les participants ont accepté le RDV : ${confirmed.title}`,
          link: '/communication/appointments',
        });
      }
    } else {
      // If one declined, maybe cancel the whole thing or just notify organizer?
      // For now, let's keep it simple: Status remains PENDING (or PARTIAL_REJECTED?)
      // Let's notify organizer someone declined
      const appt = await this.prisma.appointment.findUnique({
        where: { id: appointmentId },
      });
      if (appt) {
        await this.notificationsService.create({
          userId: appt.organizerId,
          type: 'SYSTEM',
          title: 'Refus de Rendez-vous',
          message: `Un participant a refusé le RDV : ${appt.title}`,
          link: '/communication/appointments',
        });
      }
    }

    return { success: true };
  }

  async getMyAppointments(userId: string, schoolId: string) {
    // Confirmed appointments where I am Organizer OR Participant(Accepted)
    // AND Organizer's own appointments

    return this.prisma.appointment.findMany({
      where: {
        schoolId,
        status: 'CONFIRMED',
        OR: [
          { organizerId: userId },
          { participants: { some: { userId, status: 'ACCEPTED' } } },
        ],
      },
      include: {
        organizer: { select: { firstName: true, lastName: true } },
        participants: {
          include: { user: { select: { firstName: true, lastName: true } } },
        },
      },
      orderBy: { start: 'asc' },
    });
  }

  async getPendingInvitations(userId: string) {
    return this.prisma.appointmentParticipant.findMany({
      where: { userId, status: 'PENDING' },
      include: {
        appointment: {
          include: {
            organizer: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });
  }
}
