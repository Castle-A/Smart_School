import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { CreateSanctionDto } from './dto/create-sanction.dto';
import { CommunicationService } from '../../communication/communication.service';

@Injectable()
export class SanctionsService {
  constructor(
    private prisma: PrismaService,
    private communicationService: CommunicationService,
  ) {}

  /**
   * Crée une sanction et notifie les parents si nécessaire.
   */
  async create(schoolId: string, reporterId: string, dto: CreateSanctionDto) {
    const sanction = await this.prisma.sanction.create({
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        schoolId,
        reporterId,
      },
      include: {
        student: true,
        reporter: {
          include: { user: true },
        },
      },
    });

    // Alerte SMS pour les sanctions graves
    const seriousSanctions = ['BLAME', 'EXCLUSION_TEMP', 'EXCLUSION_DEF'];
    if (seriousSanctions.includes(dto.type)) {
      await this.communicationService.sendSanctionAlert(
        schoolId,
        dto.studentId,
        dto.type,
      );
    }

    return sanction;
  }

  async findAll(schoolId: string) {
    return this.prisma.sanction.findMany({
      where: { schoolId },
      include: {
        student: true,
        reporter: {
          include: { user: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByStudent(studentId: string) {
    return this.prisma.sanction.findMany({
      where: { studentId },
      include: { reporter: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(id: string) {
    return this.prisma.sanction.delete({ where: { id } });
  }
}
