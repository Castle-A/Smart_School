import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AcademicYearsService } from '../../application/academic-years/academic-years.service';
import { YearTransitionService } from '../../application/academic-years/year-transition.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { SchoolAccessGuard } from '../../shared/guards/school-access.guard';
import { DirectorTypeGuard } from '../../shared/guards/director-type.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { RequireDirectorType } from '../../shared/decorators/director-type.decorator';
import { CreateAcademicYearDto } from '../../application/academic-years/dto/create-academic-year.dto';
import { CreateNextYearDto } from '../../application/academic-years/dto/create-next-year.dto';
import { AuthenticatedRequest } from '../../shared/interfaces/authenticated-request.interface';

@Controller('academic-years')
@UseGuards(JwtAuthGuard, RolesGuard, SchoolAccessGuard) // Sécurisation et isolation par école
export class AcademicYearsController {
  constructor(
    private readonly service: AcademicYearsService,
    private readonly transitionService: YearTransitionService,
  ) {}

  /**
   * Créer une nouvelle année scolaire
   *
   * @remarks
   * - RÉSERVÉ AU FONDATEUR UNIQUEMENT
   * - La première année créée est automatiquement activée
   * - Les années suivantes sont créées en statut DRAFT
   * - Impossible de créer si une année ACTIVE existe déjà
   *
   * @param req - Request avec user JWT (schoolId extrait automatiquement)
   * @param dto - Données de l'année (name, startDate, endDate)
   * @returns Année scolaire créée avec son statut
   * @throws {BadRequestException} Si une année ACTIVE existe déjà
   */
  @Post()
  @Roles('FOUNDER')
  create(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateAcademicYearDto,
  ) {
    return this.service.create(req.user.schoolId, dto);
  }

  /**
   * Lister toutes les années de l'école
   * Accessible à tous les rôles
   */
  @Get()
  @Roles('FOUNDER', 'DIRECTOR', 'CENSOR', 'SECRETARY', 'ACCOUNTANT', 'TEACHER')
  findAll(@Request() req: AuthenticatedRequest) {
    return this.service.findAll(req.user.schoolId);
  }

  /**
   * Obtenir l'année active de l'école
   */
  @Get('active')
  @Roles('FOUNDER', 'DIRECTOR', 'CENSOR', 'SECRETARY', 'ACCOUNTANT', 'TEACHER')
  async getActiveYear(@Request() req: AuthenticatedRequest) {
    const years = await this.service.findAll(req.user.schoolId);
    const activeYear = years.find((y) => y.isActive);

    if (!activeYear) {
      return null;
    }

    return activeYear;
  }

  /**
   * Obtenir détails + statistiques d'une année
   */
  @Get(':id')
  @Roles('FOUNDER', 'DIRECTOR', 'CENSOR', 'SECRETARY', 'ACCOUNTANT')
  getYear(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.service.getYearWithStats(req.user.schoolId, id);
  }

  /**
   * Activer une année (désactive automatiquement l'ancienne)
   */
  @Patch(':id/activate')
  @Roles('FOUNDER', 'DIRECTOR')
  activate(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.service.activate(req.user.schoolId, id);
  }

  /**
   * Valider si l'année active peut être clôturée
   * Utilisé par l'onglet "Clôturer l'Année" du Directeur
   */
  @Get('active/validate-closure')
  @Roles('DIRECTOR')
  validateActiveYearClosure(@Request() req: AuthenticatedRequest) {
    return this.service.validateClosure(req.user.schoolId);
  }

  /**
   * Valider si une année spécifique peut être clôturée
   */
  @Get(':id/validate-closure')
  @Roles('FOUNDER', 'DIRECTOR')
  validateClosure(
    @Request() req: AuthenticatedRequest,
    @Param('id') _id: string,
  ) {
    // TODO: Implémenter validation pour année spécifique
    // Pour l'instant, utiliser l'année active
    return this.service.validateClosure(req.user.schoolId);
  }

  /**
   * Clôturer l'année active
   * RÉSERVÉ AU FONDATEUR UNIQUEMENT
   */
  @Post('active/close')
  @Roles('FOUNDER')
  closeActiveYear(@Request() req: AuthenticatedRequest) {
    return this.service.closeActiveYear(req.user.schoolId);
  }

  /**
   * Clôturer une année spécifique
   */
  @Post(':id/close')
  @Roles('FOUNDER', 'DIRECTOR')
  closeYear(@Request() req: AuthenticatedRequest, @Param('id') _id: string) {
    // TODO: Adapter pour année spécifique
    return this.service.closeActiveYear(req.user.schoolId);
  }

  /**
   * Archiver une année fermée
   * Depuis Configuration > Années Scolaires
   */
  @Post(':id/archive')
  @Roles('FOUNDER')
  archiveYear(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.service.archiveYear(req.user.schoolId, id);
  }

  /**
   * Prévisualiser le rollover vers l'année suivante
   * Affiche statistiques de ce qui sera hérité
   */
  @Get(':id/preview-next')
  @Roles('FOUNDER', 'DIRECTOR')
  previewTransition(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.transitionService.previewTransition(req.user.schoolId, id);
  }

  /**
   * Créer l'année suivante avec héritage (rollover)
   * Transaction complexe avec duplication et promotion
   */
  @Post(':id/create-next')
  @Roles('FOUNDER', 'DIRECTOR')
  createNextYear(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: CreateNextYearDto,
  ) {
    return this.transitionService.createNextYear(req.user.schoolId, id, dto);
  }

  /**
   * Certifier le cycle Maternelle/Primaire
   *
   * @remarks
   * - RÉSERVÉ AU DIRECTEUR MATERNELLE/PRIMAIRE
   * - Marque maternellePrimaireCertified = true
   * - DirectorTypeGuard vérifie automatiquement le type de directeur
   * - Rate limited: 5 requêtes/minute pour éviter les clics multiples
   *
   * @param req - Request avec user JWT
   * @param id - ID de l'année scolaire à certifier
   * @returns Année mise à jour avec certification
   * @throws {ForbiddenException} Si le directeur n'est pas de type MATERNELLE_PRIMAIRE
   * @throws {NotFoundException} Si l'année n'existe pas
   */
  @Post(':id/certify-maternelle-primaire')
  @Roles('DIRECTOR')
  @UseGuards(DirectorTypeGuard)
  @RequireDirectorType('MATERNELLE_PRIMAIRE')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // Max 5 requêtes par minute
  certifyMaternellePrimaire(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.service.certifyMaternellePrimaire(req.user.schoolId, id);
  }

  /**
   * Certifier le cycle Collège/Lycée
   *
   * @remarks
   * - RÉSERVÉ AU DIRECTEUR COLLÈGE/LYCÉE
   * - Marque collegeLyceeCertified = true
   * - DirectorTypeGuard vérifie automatiquement le type de directeur
   * - Rate limited: 5 requêtes/minute pour éviter les clics multiples
   *
   * @param req - Request avec user JWT
   * @param id - ID de l'année scolaire à certifier
   * @returns Année mise à jour avec certification
   * @throws {ForbiddenException} Si le directeur n'est pas de type COLLEGE_LYCEE
   * @throws {NotFoundException} Si l'année n'existe pas
   */
  @Post(':id/certify-college-lycee')
  @Roles('DIRECTOR')
  @UseGuards(DirectorTypeGuard)
  @RequireDirectorType('COLLEGE_LYCEE')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // Max 5 requêtes par minute
  certifyCollegeLycee(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.service.certifyCollegeLycee(req.user.schoolId, id);
  }

  /**
   * Certifier les finances globales de l'école
   *
   * @remarks
   * - RÉSERVÉ AU COMPTABLE
   * - Marque financeCertified = true
   * - Certification globale pour toute l'école (tous cycles confondus)
   * - Rate limited: 5 requêtes/minute pour éviter les clics multiples
   *
   * @param req - Request avec user JWT
   * @param id - ID de l'année scolaire à certifier
   * @returns Année mise à jour avec certification
   * @throws {NotFoundException} Si l'année n'existe pas
   */
  @Post(':id/certify-finances')
  @Roles('ACCOUNTANT')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // Max 5 requêtes par minute
  certifyFinances(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.service.certifyFinances(req.user.schoolId, id);
  }
}
