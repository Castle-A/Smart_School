import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { ISchoolRepository } from '../../domain/school/school.entity';
import { School } from '../../domain/school/school.entity';

@Injectable()
export class PrismaSchoolRepository implements ISchoolRepository {
  constructor(private prisma: PrismaService) {}

  private mapToSchool(data: any): School {
    return new School({
      ...data,
      plan: data.plan as 'BASIC' | 'STANDARD' | 'PREMIUM',
    });
  }

  async create(school: School): Promise<School> {
    const created = await this.prisma.school.create({
      data: {
        name: school.name,
        address: school.address,
        phone: school.phone,
        email: school.email,
        plan: school.plan,
        isActive: school.isActive,
      },
    });
    return this.mapToSchool(created);
  }

  async findById(id: string): Promise<School | null> {
    const school = await this.prisma.school.findUnique({ where: { id } });
    if (!school) return null;
    return this.mapToSchool(school);
  }

  async findAll(): Promise<School[]> {
    const schools = await this.prisma.school.findMany();
    return schools.map((s) => this.mapToSchool(s));
  }

  async update(id: string, data: Partial<School>): Promise<School> {
    const updated = await this.prisma.school.update({
      where: { id },
      data,
    });
    return this.mapToSchool(updated);
  }
}
