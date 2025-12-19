import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { UpdateSchoolConfigDto } from './dto/update-school-config.dto';

@Injectable()
export class ConfigurationService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Récupère la configuration d'une école. 
     * Crée une configuration par défaut si elle n'existe pas.
     */
    async getConfig(schoolId: string) {
        let config = await (this.prisma as any).schoolConfig.findUnique({
            where: { schoolId }
        });

        // Initialisation automatique avec les valeurs par défaut du schéma si manquante
        if (!config) {
            config = await (this.prisma as any).schoolConfig.create({
                data: { schoolId }
            });
        }

        return config;
    }

    /**
     * Met à jour la configuration.
     * L'isolation au niveau de Prisma (Phase 3) garantit que schoolId est respecté.
     */
    async updateConfig(schoolId: string, dto: UpdateSchoolConfigDto) {
        // S'assurer que la config existe avant l'update
        await this.getConfig(schoolId);

        return (this.prisma as any).schoolConfig.update({
            where: { schoolId },
            data: dto
        });
    }

    /**
     * Récupère une valeur spécifique de la config (Héritage)
     * Utile pour les calculs de bulletins ou de finances.
     */
    async getSetting<T>(schoolId: string, key: keyof UpdateSchoolConfigDto, defaultValue: T): Promise<T> {
        const config = await this.getConfig(schoolId);
        return (config[key] as T) ?? defaultValue;
    }
}
