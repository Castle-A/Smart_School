import {
    Controller,
    Get,
    Param,
    UseGuards,
    Req,
    NotFoundException,
} from '@nestjs/common';
import { StorageService } from './storage.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { SchoolAccessGuard } from '../../shared/guards/school-access.guard';

/**
 * Contrôleur pour la gestion sécurisée des fichiers.
 * Toutes les routes sont protégées et isolées par école (Multi-tenant).
 */
@Controller('files')
@UseGuards(JwtAuthGuard, SchoolAccessGuard)
export class StorageController {
    constructor(private readonly storageService: StorageService) { }

    /**
     * Génère une URL de téléchargement signée (R2/S3).
     * Vérifie que le fichier demandé appartient bien à l'école de l'utilisateur.
     */
    @Get(':id/download')
    async download(
        @Param('id') id: string,
        @Req() req: any
    ) {
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
