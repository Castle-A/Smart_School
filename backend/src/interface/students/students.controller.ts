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
import { StudentsService } from '../../application/students/students.service';
import { CreateStudentDto } from '../../application/students/dto/create-student.dto';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { SchoolAccessGuard } from '../../shared/guards/school-access.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';
import { AuthenticatedRequest } from '../../shared/interfaces/authenticated-request.interface';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard, SchoolAccessGuard) // Protection vitale des données élèves
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) { }

  @Post()
  @Roles('DIRECTOR', 'SECRETARY', 'FOUNDER')
  create(
    @Request() req: AuthenticatedRequest,
    @Body() createStudentDto: CreateStudentDto,
  ) {
    // Injection du contexte utilisateur pour la validation (Phase 1 Protection)
    return this.studentsService.create(
      req.user.schoolId,
      createStudentDto,
      req.user.userId,
      req.user.role,
    );
  }

  @Get()
  @Roles('DIRECTOR', 'SECRETARY', 'FOUNDER', 'CENSOR', 'ACCOUNTANT')
  async findAll(
    @Request() req: AuthenticatedRequest,
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: PaginationQueryDto,
  ) {
    // Master Quality: Validation automatique des paramètres avec PaginationQueryDto
    return this.studentsService.findAll(req.user.schoolId, query);
  }

  @Get('search')
  @Roles('DIRECTOR', 'SECRETARY', 'FOUNDER', 'CENSOR', 'ACCOUNTANT')
  async search(
    @Request() req: AuthenticatedRequest,
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: PaginationQueryDto,
  ) {
    // Master Quality: Même validation pour la recherche
    return this.studentsService.findAll(req.user.schoolId, query);
  }

  @Get(':id')
  @Roles('DIRECTOR', 'SECRETARY', 'FOUNDER', 'CENSOR', 'ACCOUNTANT')
  findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.studentsService.findOne(id, req.user.schoolId);
  }

  @Patch(':id')
  @Roles('DIRECTOR', 'SECRETARY', 'FOUNDER')
  update(
    @Param('id') id: string,
    @Body() updateStudentDto: any,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.studentsService.update(id, req.user.schoolId, updateStudentDto);
  }

  @Delete(':id')
  @Roles('DIRECTOR', 'FOUNDER')
  remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.studentsService.remove(id, req.user.schoolId);
  }

  @Post(':id/comments')
  @Roles('DIRECTOR', 'CENSOR', 'TEACHER', 'FOUNDER')
  addComment(
    @Param('id') id: string,
    @Body() body: { content: string; category: string },
    @Request() req: AuthenticatedRequest,
  ) {
    // Ordre des arguments : studentId, authorId, content, category, schoolId
    return this.studentsService.addComment(
      id,
      req.user.userId,
      body.content,
      body.category,
      req.user.schoolId,
    );
  }

  @Get(':id/comments')
  getComments(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.studentsService.getComments(id, req.user.schoolId);
  }

  @Post(':id/transfer')
  @Roles('DIRECTOR', 'FOUNDER')
  transfer(
    @Param('id') id: string,
    @Body() body: any,
    @Request() req: AuthenticatedRequest,
  ) {
    // Ajout de req.user.id pour identifier l'auteur du transfert (Phase 2 Correction)
    return this.studentsService.transfer(
      req.user.schoolId,
      id,
      body,
      req.user.userId,
    );
  }
  @Post(':id/re-enroll')
  @Roles('DIRECTOR', 'SECRETARY', 'FOUNDER')
  reEnroll(
    @Param('id') id: string,
    @Body() dto: any, // ReEnrollStudentDto (should import it properly if possible, but any works for rapid dev then refine)
    @Request() req: AuthenticatedRequest,
  ) {
    return this.studentsService.reEnroll(
      id,
      req.user.schoolId,
      dto,
    );
  }
}
