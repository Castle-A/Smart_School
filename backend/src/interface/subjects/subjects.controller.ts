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
  ForbiddenException,
} from '@nestjs/common';
import { SubjectsService } from '../../application/subjects/subjects.service';
import { CreateSubjectDto } from '../../application/subjects/dto/create-subject.dto';
import { UpdateSubjectDto } from '../../application/subjects/dto/update-subject.dto';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { SchoolAccessGuard } from '../../shared/guards/school-access.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { AuthenticatedRequest } from '../../shared/interfaces/authenticated-request.interface';

@Controller('subjects')
@UseGuards(JwtAuthGuard, RolesGuard, SchoolAccessGuard) // Protection et isolation des matières par école
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @Roles('DIRECTOR', 'ADMIN', 'FOUNDER', 'CENSOR')
  create(
    @Request() req: AuthenticatedRequest,
    @Body() createSubjectDto: CreateSubjectDto,
  ) {
    // Restriction: Secondary Directors cannot create subjects (tasked to Censor)
    if (
      req.user.role === 'DIRECTOR' &&
      ['COLLEGE', 'LYCEE'].includes(req.user.directorType || '')
    ) {
      throw new ForbiddenException(
        'Les directeurs du secondaire ne peuvent pas créer de matières. Veuillez contacter le Censeur.',
      );
    }
    return this.subjectsService.create(req.user.schoolId, createSubjectDto);
  }

  @Post('bulk')
  @Roles('DIRECTOR', 'ADMIN', 'FOUNDER', 'CENSOR')
  createBulk(
    @Request() req: AuthenticatedRequest,
    @Body() dtos: { subjects: CreateSubjectDto[] },
  ) {
    if (!dtos.subjects || !Array.isArray(dtos.subjects)) {
      throw new ForbiddenException('Invalid payload');
    }
    return this.subjectsService.createBulk(req.user.schoolId, dtos.subjects);
  }

  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    return this.subjectsService.findAll(req.user.schoolId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjectsService.findOne(id);
  }

  @Patch(':id')
  @Roles('DIRECTOR', 'ADMIN', 'FOUNDER', 'CENSOR')
  update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
    // Secondary Directors CAN update (Edit allowed)
    return this.subjectsService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  @Roles('DIRECTOR', 'ADMIN', 'FOUNDER', 'CENSOR')
  remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    // Restriction: Secondary Directors cannot delete subjects
    if (
      req.user.role === 'DIRECTOR' &&
      ['COLLEGE', 'LYCEE'].includes(req.user.directorType || '')
    ) {
      throw new ForbiddenException(
        'Les directeurs du secondaire ne peuvent pas supprimer de matières.',
      );
    }
    return this.subjectsService.remove(id);
  }
}
