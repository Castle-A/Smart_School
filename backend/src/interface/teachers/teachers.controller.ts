import { Controller, Get, Post, Patch, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { TeachersService } from '../../application/teachers/teachers.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { SchoolAccessGuard } from '../../shared/guards/school-access.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { RequirePermissions } from '../../shared/decorators/permissions.decorator';
import { CreateTeacherDto } from '../../application/teachers/dto/create-teacher.dto';
import { UpdateTeacherDto } from '../../application/teachers/dto/update-teacher.dto';

@Controller('teachers')
@UseGuards(JwtAuthGuard, SchoolAccessGuard, RolesGuard, PermissionsGuard)
export class TeachersController {
    constructor(private readonly teachersService: TeachersService) { }

    /**
     * Create a new teacher
     * Only FOUNDER, DIRECTOR, and SECRETARY can create teachers
     */
    @Post()
    @Roles('FOUNDER', 'DIRECTOR', 'SECRETARY')
    @RequirePermissions('teachers.manage')
    async create(@Request() req: any, @Body() createTeacherDto: CreateTeacherDto) {
        const schoolId = req.user.schoolId;
        const userId = req.user.userId;

        return this.teachersService.createTeacher(schoolId, createTeacherDto, userId, req.ip, req.headers['user-agent']);
    }

    /**
     * Get all teachers for the user's school
     */
    @Get()
    @RequirePermissions('teachers.view')
    async findAll(@Request() req: any) {
        const schoolId = req.user.schoolId;
        return this.teachersService.getTeachers(schoolId);
    }

    /**
     * Get a specific teacher by ID
     */
    @Get(':id')
    @RequirePermissions('teachers.view')
    async findOne(@Param('id') id: string, @Request() req: any) {
        const schoolId = req.user.schoolId;
        return this.teachersService.getTeacher(id, schoolId);
    }

    /**
     * Update a teacher
     * Only FOUNDER, DIRECTOR, and SECRETARY can update teachers
     */
    @Patch(':id')
    @Roles('FOUNDER', 'DIRECTOR', 'SECRETARY', 'CENSOR', 'CENSEUR')
    @RequirePermissions('teachers.manage')
    async update(
        @Param('id') id: string,
        @Request() req: any,
        @Body() updateTeacherDto: UpdateTeacherDto,
    ) {
        const schoolId = req.user.schoolId;
        const userId = req.user.userId;

        return this.teachersService.updateTeacher(id, schoolId, updateTeacherDto, userId, req.ip, req.headers['user-agent']);
    }

    /**
     * Soft delete a teacher
     * Only FOUNDER and DIRECTOR can delete teachers
     */
    @Delete(':id')
    @Roles('FOUNDER', 'DIRECTOR')
    @RequirePermissions('teachers.manage')
    async remove(@Param('id') id: string, @Request() req: any) {
        const schoolId = req.user.schoolId;
        const userId = req.user.userId;

        return this.teachersService.removeTeacher(id, schoolId, userId, req.ip, req.headers['user-agent']);
    }
}
