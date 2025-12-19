import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Script de migration pour attribuer le directorType aux directeurs existants
 * 
 * Ce script doit être exécuté UNE SEULE FOIS après le déploiement de la nouvelle fonctionnalité
 * 
 * Exécution : npx ts-node prisma/migrations-scripts/assign-director-types.ts
 */
async function assignDirectorTypes() {
    console.log('🔄 Démarrage de la migration des types de directeurs...\n');

    try {
        // 1. Récupérer tous les directeurs (via SchoolUser avec role = DIRECTOR)
        const directors = await prisma.user.findMany({
            where: {
                schoolUsers: {
                    some: {
                        role: 'DIRECTOR'
                    }
                }
            },
            include: {
                schoolUsers: {
                    where: { role: 'DIRECTOR' },
                    include: {
                        school: {
                            select: {
                                id: true,
                                name: true,
                                cycles: true
                            }
                        }
                    }
                }
            }
        });

        console.log(`📊 ${directors.length} directeur(s) trouvé(s)\n`);

        if (directors.length === 0) {
            console.log('✅ Aucun directeur à migrer\n');
            return;
        }

        // 2. Pour chaque directeur, déterminer son type selon les cycles de l'école
        for (const director of directors) {
            const schoolUser = director.schoolUsers[0];
            const school = schoolUser.school;
            const cycles = school.cycles?.split(',') || [];

            console.log(`\n👤 Directeur: ${director.firstName} ${director.lastName}`);
            console.log(`   École: ${school.name}`);
            console.log(`   Cycles: ${cycles.join(', ')}`);

            // Logique de détermination automatique
            let directorType: 'MATERNELLE_PRIMAIRE' | 'COLLEGE_LYCEE' | null = null;

            const hasMaternellePrimaire = cycles.some(c =>
                ['MATERNELLE_I', 'MATERNELLE_II', 'PRIMAIRE'].includes(c.trim())
            );

            const hasCollegeLycee = cycles.some(c =>
                ['PREMIER_CYCLE', 'SECOND_CYCLE'].includes(c.trim())
            );

            // Si l'école a les deux types de cycles
            if (hasMaternellePrimaire && hasCollegeLycee) {
                console.log('   ⚠️  École avec TOUS les cycles détectée');
                console.log('   ℹ️  Attribution manuelle requise');
                console.log('   💡 Suggestion: Créer 2 comptes directeurs distincts');
                // On laisse null pour attribution manuelle
                directorType = null;
            }
            // Si seulement Maternelle/Primaire
            else if (hasMaternellePrimaire) {
                directorType = 'MATERNELLE_PRIMAIRE';
                console.log('   ✓ Type détecté: MATERNELLE_PRIMAIRE');
            }
            // Si seulement Collège/Lycée
            else if (hasCollegeLycee) {
                directorType = 'COLLEGE_LYCEE';
                console.log('   ✓ Type détecté: COLLEGE_LYCEE');
            }
            // Cas indéterminé
            else {
                console.log('   ⚠️  Cycles non reconnus, attribution manuelle requise');
                directorType = null;
            }

            // 3. Mettre à jour le directeur
            if (directorType !== null) {
                await prisma.user.update({
                    where: { id: director.id },
                    data: { directorType }
                });
                console.log(`   ✅ Mis à jour: ${directorType}`);
            } else {
                console.log(`   ⏭️  Ignoré (attribution manuelle nécessaire)`);
            }
        }

        console.log('\n✅ Migration terminée avec succès!\n');

        // 4. Afficher un résumé
        const summary = await prisma.user.groupBy({
            by: ['directorType'],
            where: {
                schoolUsers: {
                    some: { role: 'DIRECTOR' }
                }
            },
            _count: true
        });

        console.log('📊 Résumé:');
        summary.forEach(group => {
            const type = group.directorType || 'NON ATTRIBUÉ';
            console.log(`   - ${type}: ${group._count} directeur(s)`);
        });

    } catch (error) {
        console.error('❌ Erreur lors de la migration:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Demander confirmation avant exécution
async function main() {
    console.log('⚠️  ATTENTION: Ce script va modifier les données existantes\n');
    console.log('Voulez-vous continuer? (yes/no): ');

    // En production, utiliser readline pour la confirmation
    // Pour l'instant, on exécute directement
    const shouldRun = process.env.RUN_MIGRATION === 'yes';

    if (shouldRun) {
        await assignDirectorTypes();
    } else {
        console.log('ℹ️  Migration annulée');
        console.log('Pour exécuter: RUN_MIGRATION=yes npx ts-node prisma/migrations-scripts/assign-director-types.ts');
    }
}

main();
