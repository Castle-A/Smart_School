import { Injectable } from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SchoolsService {
  // On injecte PrismaService pour pouvoir l'utiliser
  constructor(private prisma: PrismaService) {}

  // Logique pour créer une école
  create(createSchoolDto: CreateSchoolDto) {
    return this.prisma.school.create({
      data: createSchoolDto,
    });
  }

  // Logique pour lister toutes les écoles
  findAll() {
    return this.prisma.school.findMany();
  }

  // Logique pour trouver une seule école par son ID
  findOne(id: string) {
    return this.prisma.school.findUnique({
      where: { id },
    });
  }

  // Logique pour mettre à jour une école
  update(id: string, updateSchoolDto: UpdateSchoolDto) {
    return this.prisma.school.update({
      where: { id },
      data: updateSchoolDto,
    });
  }

  // Logique pour supprimer une école
  remove(id: string) {
    return this.prisma.school.delete({
      where: { id },
    });
  }
}