import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { CreateRewardDto } from './dto/create-reward.dto';

@Injectable()
export class RewardsService {
  constructor(private prisma: PrismaService) {}

  async create(schoolId: string, dto: CreateRewardDto) {
    return this.prisma.reward.create({
      data: {
        ...dto,
        date: dto.date ? new Date(dto.date) : new Date(),
        schoolId,
      },
      include: { student: true },
    });
  }

  async findAll(schoolId: string) {
    return this.prisma.reward.findMany({
      where: { schoolId },
      include: { student: true },
      orderBy: { date: 'desc' },
    });
  }

  async delete(id: string) {
    return this.prisma.reward.delete({ where: { id } });
  }
}
