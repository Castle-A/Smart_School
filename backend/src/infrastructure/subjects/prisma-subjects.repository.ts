import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ISubjectsRepository } from '../../domain/subjects/subjects.repository.interface';

@Injectable()
export class PrismaSubjectsRepository implements ISubjectsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.subject.create({
      data,
    });
  }

  async findAllBySchoolId(schoolId: string) {
    return this.prisma.subject.findMany({
      where: {
        schoolId,
        deletedAt: null,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findById(id: string) {
    return this.prisma.subject.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.subject.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    await this.prisma.subject.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
