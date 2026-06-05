import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
} from '@nestjs/common';
import { TransitionsService } from '../../application/transitions/transitions.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { SchoolAccessGuard } from '../../shared/guards/school-access.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { BulkDecisionsDto } from '../../application/transitions/dto/bulk-decisions.dto';
import { PromoteStudentsDto } from '../../application/transitions/dto/promote-students.dto';
import { AuthenticatedRequest } from '../../shared/interfaces/authenticated-request.interface';

@Controller('transitions')
@UseGuards(JwtAuthGuard, RolesGuard, SchoolAccessGuard) // Sécurisation critique pour la clôture d'année
export class TransitionsController {
  constructor(private readonly transitionsService: TransitionsService) {}

  @Post('decisions')
  @Roles('DIRECTOR', 'CENSOR', 'TEACHER') // Les enseignants peuvent saisir, le reste valide
  saveDecisions(
    @Request() req: AuthenticatedRequest,
    @Body() dto: BulkDecisionsDto,
  ) {
    return this.transitionsService.saveDecisions(req.user.schoolId, dto);
  }

  @Get('decisions/:classId/:year')
  @Roles('DIRECTOR', 'CENSOR', 'TEACHER')
  getDecisions(
    @Request() req: AuthenticatedRequest,
    @Param('classId') classId: string,
    @Param('year') year: string,
  ) {
    return this.transitionsService.getDecisions(
      req.user.schoolId,
      classId,
      year,
    );
  }

  @Get('closure-status')
  @Roles('DIRECTOR', 'CENSOR', 'ACCOUNTANT', 'FOUNDER')
  getClosureStatus(@Request() req: AuthenticatedRequest) {
    return this.transitionsService.getClosureStatus(req.user.schoolId);
  }

  // NOTE: Endpoints de certification déplacés vers academic-years.controller
  // Utiliser maintenant:
  // - POST /academic-years/:id/certify-maternelle-primaire (DIRECTOR)
  // - POST /academic-years/:id/certify-college-lycee (DIRECTOR)
  // - POST /academic-years/:id/certify-finances (ACCOUNTANT)

  @Post('close-year')
  @Roles('DIRECTOR', 'FOUNDER') // Action irréversible : réservée aux dirigeants
  closeYear(@Request() req: AuthenticatedRequest) {
    return this.transitionsService.closeYear(req.user.schoolId);
  }

  @Post('promote')
  @Roles('DIRECTOR', 'CENSOR') // Processus technique de promotion
  async promoteStudents(
    @Request() req: AuthenticatedRequest,
    @Body() dto: PromoteStudentsDto,
  ) {
    return this.transitionsService.promoteStudents(req.user.schoolId, dto);
  }
}
