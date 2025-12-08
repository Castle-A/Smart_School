import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
    constructor(private readonly studentsService: StudentsService) { }

    @Post()
    @Roles('SECRETARY', 'DIRECTOR', 'FOUNDER') // Managers can create
    create(@Request() req, @Body() createStudentDto: CreateStudentDto) {
        const schoolId = req.user.schoolId;
        return this.studentsService.create(schoolId, createStudentDto);
    }

    @Get()
    @Roles('SECRETARY', 'DIRECTOR', 'FOUNDER', 'CENSEUR', 'CENSOR', 'SURVEILLANT', 'TEACHER') // Broad read access
    findAll(@Request() req, @Query('classId') classId?: string, @Query('search') search?: string) {
        const schoolId = req.user.schoolId;
        return this.studentsService.findAll(schoolId, { classId, search });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.studentsService.findOne(id);
    }
    @Post(':id/comments')
    @Roles('SECRETARY', 'DIRECTOR', 'FOUNDER', 'CENSEUR', 'CENSOR', 'SURVEILLANT')
    async addComment(@Param('id') id: string, @Body() body: { content: string }, @Request() req) {
        return this.studentsService.addComment(id, req.user.userId, body.content);
    }

    @Get(':id/comments')
    @Roles('SECRETARY', 'DIRECTOR', 'FOUNDER', 'CENSEUR', 'CENSOR', 'SURVEILLANT', 'TEACHER')
    async getComments(@Param('id') id: string) {
        return this.studentsService.getComments(id);
    }
}
