import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TenantContextService } from '../context/tenant-context.service';

/**
 * Service Prisma étendu avec isolation multi-tenant native.
 * Intercepte chaque requête pour injecter automatiquement le filtre { schoolId }.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly tenantContext: TenantContextService) {
    super();

    // Création de l'extension d'isolation native (Phase 3)
    const extendedClient = this.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            const schoolId = tenantContext.getSchoolId();

            // Récupération sécurisée des métadonnées du modèle via DMMF (Prisma Internal)
            const modelMeta = (
              PrismaService as any
            ).dmmf?.datamodel?.models?.find((m: any) => m.name === model);
            const fields = modelMeta?.fields || [];
            const hasSchoolId = fields.some((f: any) => f.name === 'schoolId');
            const hasDeletedAt = fields.some(
              (f: any) => f.name === 'deletedAt',
            );

            const filterOperations = [
              'findMany',
              'findFirst',
              'findUnique',
              'findUniqueOrThrow',
              'count',
              'update',
              'updateMany',
              'delete',
              'deleteMany',
              'aggregate',
            ];

            // 1. Isolation Multi-tenant (schoolId)
            if (schoolId && hasSchoolId) {
              if (filterOperations.includes(operation)) {
                (args as any).where = (args as any).where || {};
                (args as any).where['schoolId'] = schoolId;
              }

              if (operation === 'create') {
                (args as any).data = (args as any).data || {};
                (args as any).data['schoolId'] = schoolId;
              }

              if (operation === 'createMany') {
                if (Array.isArray((args as any).data)) {
                  (args as any).data.forEach(
                    (item: any) => (item['schoolId'] = schoolId),
                  );
                }
              }
            }

            // 2. Transparence du Soft-Delete (deletedAt: null)
            // On filtre automatiquement les enregistrements supprimés pour les opérations de lecture
            if (
              hasDeletedAt &&
              ['findMany', 'findFirst', 'count', 'aggregate'].includes(
                operation,
              )
            ) {
              (args as any).where = (args as any).where || {};
              // Ne surcharge pas si une valeur spécifique pour deletedAt est déjà demandée
              if ((args as any).where['deletedAt'] === undefined) {
                (args as any).where['deletedAt'] = null;
              }
            }

            return query(args);
          },
        },
      },
    });

    // Utilisation d'un Proxy Expert pour rendre l'isolation totalement transparente.
    // Tout appel à un modèle (ex: prisma.student) sera redirigé vers le client étendu,
    // garantissant que les filtres de sécurité sont toujours appliqués.
    return new Proxy(this, {
      get(target, prop, receiver) {
        const source = prop in extendedClient ? extendedClient : target;
        const value = Reflect.get(source, prop, receiver);
        if (typeof value === 'function' && prop !== 'constructor') {
          return value.bind(source);
        }
        return value;
      },
    }) as any;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
