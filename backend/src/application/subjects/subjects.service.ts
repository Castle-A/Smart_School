import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ISubjectsRepository } from '../../domain/subjects/subjects.repository.interface';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {
    constructor(
        @Inject('ISubjectsRepository')
        private subjectsRepository: ISubjectsRepository
    ) { }

    async create(schoolId: string, createSubjectDto: CreateSubjectDto) {
        return this.subjectsRepository.create({
            ...createSubjectDto,
            school: {
                connect: { id: schoolId }
            }
        });
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
