import { Injectable } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  create(createPlanDto: CreatePlanDto) {
    return this.prisma.plan.create({
      data: createPlanDto,
    });
  }

  findAll() {
    return this.prisma.plan.findMany({
      where: { isArchived: false }, // Par défaut, on ne montre pas les plans archivés
    });
  }

  findOne(id: string) {
    return this.prisma.plan.findUnique({
      where: { id },
    });
  }

  update(id: string, updatePlanDto: UpdatePlanDto) {
    return this.prisma.plan.update({
      where: { id },
      data: updatePlanDto,
    });
  }

  remove(id: string) {
    // On ne supprime jamais vraiment un plan, on l'archive
    return this.prisma.plan.update({
      where: { id },
      data: { isArchived: true },
    });
  }
}