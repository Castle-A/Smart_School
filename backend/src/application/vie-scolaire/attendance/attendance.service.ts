import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { CommunicationService } from '../../communication/communication.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    private prisma: PrismaService,
    private communicationService: CommunicationService,
  ) {}

  /**
   * Enregistre une présence/absence et notifie si nécessaire.
   */
  async create(schoolId: string, dto: CreateAttendanceDto) {
    const date = new Date(dto.date);

    // Sécurité : Vérifier que l'élève appartient bien au tenant (école) actuel
    // Cela empêche un utilisateur malveillant de manipuler les présences d'une autre école via son ID.
    const student = await this.prisma.student.findFirst({
      where: { id: dto.studentId, schoolId },
    });

    if (!student) {
      throw new Error(
        "L'élève n'existe pas ou n'appartient pas à votre établissement.",
      );
    }

    const attendance = await this.prisma.attendance.create({
      data: {
        student: { connect: { id: dto.studentId } },
        date: date,
        status: dto.status,
        reason: dto.reason,
        isJustified: dto.isJustified || false,
        justification: dto.justification,
        type: dto.status, // Pour compatibilité schema
      },
    });

    // Trigger SMS si Absence non justifiée
    if (dto.status === 'ABSENCE' && !dto.isJustified) {
      await this.communicationService.notifyParentOfAbsence(
        schoolId,
        dto.studentId,
        date,
      );
    }

    return attendance;
  }

  async findAll(schoolId: string, studentId?: string) {
    const where: any = {};
    if (studentId) where.studentId = studentId;

    // Note: Attendance model definition implies implicit school link via student,
    // but schema shows explicit relation is missing in Attendance model?
    // Checking schema in step 220: Attendance model only has studentId.
    // So we must filter by student.schoolId matching.
    // Creating complex query or relying on studentId being correct.

    return this.prisma.attendance.findMany({
      where: {
        ...where,
        student: { schoolId },
      },
      include: { student: true },
      orderBy: { date: 'desc' },
    });
  }
}
