# Script de Migration - Director Types

## Objectif
Attribuer automatiquement le `directorType` aux directeurs existants avant le déploiement.

## Prérequis
- Backup de la base de données effectué
- Environnement de staging pour tester

## Exécution

```bash
# Test en local
RUN_MIGRATION=yes npx ts-node prisma/migrations-scripts/assign-director-types.ts

# Production (après validation)
NODE_ENV=production RUN_MIGRATION=yes npx ts-node prisma/migrations-scripts/assign-director-types.ts
```

## Logique de Détection

### Auto-détection
Le script analyse les cycles de l'école :

| Cycles École | directorType Attribué |
|--------------|----------------------|
| MATERNELLE_I, MATERNELLE_II, PRIMAIRE uniquement | `MATERNELLE_PRIMAIRE` |
| PREMIER_CYCLE, SECOND_CYCLE uniquement | `COLLEGE_LYCEE` |
| **Tous les cycles** | `null` (manuel requis) |
| Cycles inconnus | `null` (manuel requis) |

### Attribution Manuelle
Pour les écoles avec tous les cycles, créer 2 comptes directeurs :
1. Directeur Maternelle/Primaire → `directorType = MATERNELLE_PRIMAIRE`
2. Directeur Collège/Lycée → `directorType = COLLEGE_LYCEE`

## Rollback
Si problème détecté :

```sql
-- Annuler l'attribution
UPDATE "User" SET "directorType" = NULL 
WHERE id IN (SELECT "userId" FROM "SchoolUser" WHERE role = 'DIRECTOR');
```

## Validation Post-Migration

```sql
-- Vérifier la répartition
SELECT "directorType", COUNT(*) 
FROM "User" 
WHERE id IN (SELECT "userId" FROM "SchoolUser" WHERE role = 'DIRECTOR')
GROUP BY "directorType";
```
