import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // La méthode $connect() n'existe plus dans Prisma 5+
    // La connexion est établie automatiquement à la première requête.
    // On peut juste logger que le service est prêt.
    console.log('Prisma Service has been initialized.');
  }

  async onModuleDestroy() {
    // On s'assure de déconnecter proprement à l'arrêt de l'application
    await this.$disconnect();
  }
}