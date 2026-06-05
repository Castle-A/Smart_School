import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { CreateIncidentDto } from './dto/create-incident.dto';

@Injectable()
export class IncidentsService {
  constructor(private prisma: PrismaService) {}

  async create(schoolId: string, reporterId: string, dto: CreateIncidentDto) {
    return this.prisma.incident.create({
      data: {
        ...dto,
        date: dto.date ? new Date(dto.date) : new Date(),
        schoolId,
        reporterId,
      },
    });
  }

  async findAll(schoolId: string) {
    return this.prisma.incident.findMany({
      where: { schoolId },
      orderBy: { date: 'desc' },
    });
  }

  async delete(id: string) {
    return this.prisma.incident.delete({ where: { id } });
  }
}
