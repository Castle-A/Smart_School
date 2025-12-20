import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Req,
  NotFoundException,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { SchoolAccessGuard } from '../../shared/guards/school-access.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { RolesGuard } from '../../shared/guards/roles.guard';

/**
 * Contrôleur pour la gestion sécurisée des fichiers.
 * Toutes les routes sont protégées et isolées par école (Multi-tenant).
 */
@Controller('files')
@UseGuards(JwtAuthGuard, RolesGuard, SchoolAccessGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  /**
   * Upload du logo de l'école
   * Formats acceptés : PNG, JPG, JPEG, SVG
   * Taille max : 2MB
   */
  @Post('school-logo')
  @Roles('FOUNDER', 'DIRECTOR')
  @UseInterceptors(FileInterceptor('logo'))
  async uploadSchoolLogo(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    // Validation du type de fichier
    const allowedMimeTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/svg+xml',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Format non accepté. Utilisez PNG, JPG ou SVG uniquement.',
      );
    }

    // Validation de la taille (2MB max)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      throw new BadRequestException(
        'Fichier trop volumineux. Taille maximale : 2MB.',
      );
    }

    const schoolId = req.user.schoolId;
    const ext = file.originalname.split('.').pop() || 'png';

    // Upload vers R2 avec clé spécifique pour le logo
    const result = await this.storageService.uploadSchoolLogo(
      schoolId,
      file.buffer,
      file.mimetype,
      ext,
    );

    return {
      success: true,
      logoUrl: result.logoUrl,
      message: 'Logo téléversé avec succès',
    };
  }

  /**
   * Génère une URL de téléchargement signée (R2/S3).
   * Vérifie que le fichier demandé appartient bien à l'école de l'utilisateur.
   */
  @Get(':id/download')
  async download(@Param('id') id: string, @Req() req: any) {
    // Sécurité : Utilisation du schoolId extrait du token JWT validé
    const schoolId = req.user.schoolId;

    const url = await this.storageService.getDownloadUrl(id, schoolId);

    if (!url) {
      throw new NotFoundException('Fichier introuvable ou accès refusé');
    }

    return {
      url,
    };
  }
}
