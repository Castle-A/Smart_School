import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ClassesService } from '../../application/classes/classes.service';
import { CreateClassDto } from '../../application/classes/dto/create-class.dto';
import { UpdateClassDto } from '../../application/classes/dto/update-class.dto';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { SchoolAccessGuard } from '../../shared/guards/school-access.guard';
import { CustomLogger } from '../../shared/logger/custom-logger.service';

@Controller('classes')
@UseGuards(JwtAuthGuard, SchoolAccessGuard)
export class ClassesController {
    private readonly logger = new CustomLogger();

    constructor(private readonly classesService: ClassesService) { }

    @Post()
    async create(@Request() req, @Body() createClassDto: CreateClassDto) {
        this.logger.log(`Creating class: ${createClassDto.name}`, 'ClassesController');
        return this.classesService.create(req.user.schoolId, createClassDto, req.user.userId);
    }

    @Get()
    findAll(@Request() req) {
        return this.classesService.findAll(req.user.schoolId);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.classesService.findOne(id, req.user.schoolId);
    }

    @Patch(':id')
    async update(@Request() req, @Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
        this.logger.log(`Updating class: ${id}`, 'ClassesController');
        return this.classesService.update(id, req.user.schoolId, updateClassDto);
    }

    @Delete(':id')
    async remove(@Request() req, @Param('id') id: string) {
        this.logger.log(`Deleting class: ${id}`, 'ClassesController');
        return this.classesService.remove(id, req.user.schoolId);
    }

    @Post(':id/students/:studentId')
    async addStudent(@Request() req, @Param('id') id: string, @Param('studentId') studentId: string) {
        this.logger.log(`Adding student ${studentId} to class ${id}`, 'ClassesController');
        return this.classesService.addStudent(id, studentId, req.user.schoolId);
    }

    @Delete(':id/students/:studentId')
    async removeStudent(@Request() req, @Param('id') id: string, @Param('studentId') studentId: string) {
        this.logger.log(`Removing student ${studentId} from class ${id}`, 'ClassesController');
        return this.classesService.removeStudent(id, studentId, req.user.schoolId);
    }

    @Post(':id/teachers/:teacherId')
    async addTeacher(@Request() req, @Param('id') id: string, @Param('teacherId') teacherId: string) {
        this.logger.log(`Adding teacher ${teacherId} to class ${id}`, 'ClassesController');
        return this.classesService.addTeacher(id, teacherId, req.user.schoolId);
    }

    @Delete(':id/teachers/:teacherId')
    async removeTeacher(@Request() req, @Param('id') id: string, @Param('teacherId') teacherId: string) {
        this.logger.log(`Removing teacher ${teacherId} from class ${id}`, 'ClassesController');
        return this.classesService.removeTeacher(id, teacherId, req.user.schoolId);
    }

    @Post(':id/subjects/:subjectId')
    async addSubject(@Request() req, @Param('id') id: string, @Param('subjectId') subjectId: string, @Body('coefficient') coefficient?: number) {
        this.logger.log(`Adding subject ${subjectId} to class ${id} with coef ${coefficient}`, 'ClassesController');
        return this.classesService.addSubject(id, subjectId, req.user.schoolId, coefficient);
    }

    @Delete(':id/subjects/:subjectId')
    async removeSubject(@Request() req, @Param('id') id: string, @Param('subjectId') subjectId: string) {
        this.logger.log(`Removing subject ${subjectId} from class ${id}`, 'ClassesController');
        return this.classesService.removeSubject(id, subjectId, req.user.schoolId);
    }
}
