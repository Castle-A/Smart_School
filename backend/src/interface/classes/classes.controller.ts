import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ClassesService } from '../../application/classes/classes.service';
import { CreateClassDto } from '../../application/classes/dto/create-class.dto';
import { UpdateClassDto } from '../../application/classes/dto/update-class.dto';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { SchoolAccessGuard } from '../../shared/guards/school-access.guard';
import { CustomLogger } from '../../shared/logger/custom-logger.service';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';
import { AuthenticatedRequest } from '../../shared/interfaces/authenticated-request.interface';

@Controller('classes')
@UseGuards(JwtAuthGuard, SchoolAccessGuard)
export class ClassesController {
  private readonly logger = new CustomLogger();

  constructor(private readonly classesService: ClassesService) {}

  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createClassDto: CreateClassDto,
  ) {
    this.logger.log(
      `Creating class: ${createClassDto.name}`,
      'ClassesController',
    );
    return this.classesService.create(
      req.user.schoolId,
      createClassDto,
      req.user.userId,
    );
  }

  @Post('builder')
  async createBuilder(@Request() req: AuthenticatedRequest, @Body() dto: any) {
    // Type as CreateClassBuilderDto ideally, but `any` avoids import cycle for now or simple mapping
    this.logger.log(`Building class: ${dto.name}`, 'ClassesController');
    // Basic permission check same as create
    // Assuming user has permission if they hit this (Guards apply)
    return this.classesService.createBuilder(
      req.user.schoolId,
      dto,
      req.user.userId,
    );
  }

  @Post('init-defaults')
  async initDefaults(@Request() req: AuthenticatedRequest) {
    this.logger.log('Initializing default classes', 'ClassesController');
    return this.classesService.initializeDefaults(
      req.user.schoolId,
      req.user.userId,
    );
  }

  @Get()
  findAll(
    @Request() req: AuthenticatedRequest,
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: PaginationQueryDto,
  ) {
    // Master Quality: Validation automatique avec PaginationQueryDto
    return this.classesService.findAll(req.user.schoolId, query);
  }

  @Get(':id')
  findOne(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.classesService.findOne(id, req.user.schoolId);
  }

  @Patch(':id')
  async update(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    this.logger.log(`Updating class: ${id}`, 'ClassesController');
    return this.classesService.update(
      id,
      req.user.schoolId,
      updateClassDto,
      req.user.userId,
    );
  }

  @Delete(':id')
  async remove(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    this.logger.log(`Deleting class: ${id}`, 'ClassesController');
    return this.classesService.remove(id, req.user.schoolId);
  }

  @Post(':id/students/:studentId')
  async addStudent(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('studentId') studentId: string,
  ) {
    this.logger.log(
      `Adding student ${studentId} to class ${id}`,
      'ClassesController',
    );
    return this.classesService.addStudent(id, studentId, req.user.schoolId);
  }

  @Delete(':id/students/:studentId')
  async removeStudent(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('studentId') studentId: string,
  ) {
    this.logger.log(
      `Removing student ${studentId} from class ${id}`,
      'ClassesController',
    );
    return this.classesService.removeStudent(id, studentId, req.user.schoolId);
  }

  @Post(':id/teachers/:teacherId')
  async addTeacher(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('teacherId') teacherId: string,
  ) {
    this.logger.log(
      `Adding teacher ${teacherId} to class ${id}`,
      'ClassesController',
    );
    return this.classesService.addTeacher(id, teacherId, req.user.schoolId);
  }

  @Delete(':id/teachers/:teacherId')
  async removeTeacher(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('teacherId') teacherId: string,
  ) {
    this.logger.log(
      `Removing teacher ${teacherId} from class ${id}`,
      'ClassesController',
    );
    return this.classesService.removeTeacher(id, teacherId, req.user.schoolId);
  }

  @Post(':id/subjects/:subjectId')
  async addSubject(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('subjectId') subjectId: string,
    @Body('coefficient') coefficient?: number,
  ) {
    this.logger.log(
      `Adding subject ${subjectId} to class ${id} with coef ${coefficient}`,
      'ClassesController',
    );
    return this.classesService.addSubject(
      id,
      subjectId,
      req.user.schoolId,
      coefficient,
    );
  }

  @Delete(':id/subjects/:subjectId')
  async removeSubject(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('subjectId') subjectId: string,
  ) {
    this.logger.log(
      `Removing subject ${subjectId} from class ${id}`,
      'ClassesController',
    );
    return this.classesService.removeSubject(id, subjectId, req.user.schoolId);
  }
}
