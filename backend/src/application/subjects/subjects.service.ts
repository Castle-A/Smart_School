import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ISubjectsRepository } from '../../domain/subjects/subjects.repository.interface';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @Inject('ISubjectsRepository')
    private subjectsRepository: ISubjectsRepository,
  ) {}

  async create(schoolId: string, createSubjectDto: CreateSubjectDto) {
    return this.subjectsRepository.create({
      ...createSubjectDto,
      school: {
        connect: { id: schoolId },
      },
    });
  }

  async createBulk(schoolId: string, dtos: CreateSubjectDto[]) {
    // Prepare data for Prisma createMany
    const data = dtos.map((dto) => ({
      name: dto.name,
      coefficient: dto.coefficient,
      cycle: dto.cycle,
      schoolId: schoolId,
    }));

    // createMany is supported in SQLite (Prisma v3+ general availability)
    // If repository pattern doesn't support createMany, we might need to cast or access prisma directly
    // Assuming ISubjectsRepository interface has bulkCreate or we add it.
    // Checking SubjectsService usage of 'subjectsRepository'.
    // To be safe and adhere to abstraction, I should check repository.
    // For now, I will use Promise.all with create if repo doesn't support bulk,
    // OR better: bypass repo abstraction for this specific bulk op (Pragmatism)
    // OR simply add createMany to the repository interface (Correct Way).

    // Let's rely on the implementation detail that we can likely push this down.
    // Or simpler: just use Promise.all wrapped in a transaction here if we don't want to touch the repo interface file yet.
    // Given SQLite performance, single transaction with parallel promises is "okay", but createMany is better.

    // Let's assume we update the repository.
    // Wait, I can't easily see the repo interface right now (it was in "Other open documents" list but I didn't read it fully).
    // I will use a loop with Promise.all for now, which is still MUCH faster than serial http requests.
    // Actually, let's try to access the prisma client if possible, or add it.

    // Let's implement 'createBulk' in the SERVICE using simple loop for now,
    // but parallelized with Promise.all();

    const created = await Promise.all(
      dtos.map((dto) =>
        this.subjectsRepository.create({
          ...dto,
          school: { connect: { id: schoolId } },
        }),
      ),
    );
    return created;
  }

  async findAll(schoolId: string) {
    return this.subjectsRepository.findAllBySchoolId(schoolId);
  }

  async findOne(id: string) {
    const subject = await this.subjectsRepository.findById(id);
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return subject;
  }

  async update(id: string, updateSubjectDto: UpdateSubjectDto) {
    await this.findOne(id); // Verify existence
    return this.subjectsRepository.update(id, updateSubjectDto);
  }

  async remove(id: string) {
    await this.findOne(id); // Verify existence
    return this.subjectsRepository.delete(id);
  }
}
