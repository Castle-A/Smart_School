"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function assignDirectorTypes() {
    console.log('🔄 Démarrage de la migration des types de directeurs...\n');
    try {
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
        for (const director of directors) {
            const schoolUser = director.schoolUsers[0];
            const school = schoolUser.school;
            const cycles = school.cycles?.split(',') || [];
            console.log(`\n👤 Directeur: ${director.firstName} ${director.lastName}`);
            console.log(`   École: ${school.name}`);
            console.log(`   Cycles: ${cycles.join(', ')}`);
            let directorType = null;
            const hasMaternellePrimaire = cycles.some(c => ['MATERNELLE_I', 'MATERNELLE_II', 'PRIMAIRE'].includes(c.trim()));
            const hasCollegeLycee = cycles.some(c => ['PREMIER_CYCLE', 'SECOND_CYCLE'].includes(c.trim()));
            if (hasMaternellePrimaire && hasCollegeLycee) {
                console.log('   ⚠️  École avec TOUS les cycles détectée');
                console.log('   ℹ️  Attribution manuelle requise');
                console.log('   💡 Suggestion: Créer 2 comptes directeurs distincts');
                directorType = null;
            }
            else if (hasMaternellePrimaire) {
                directorType = 'MATERNELLE_PRIMAIRE';
                console.log('   ✓ Type détecté: MATERNELLE_PRIMAIRE');
            }
            else if (hasCollegeLycee) {
                directorType = 'COLLEGE_LYCEE';
                console.log('   ✓ Type détecté: COLLEGE_LYCEE');
            }
            else {
                console.log('   ⚠️  Cycles non reconnus, attribution manuelle requise');
                directorType = null;
            }
            if (directorType !== null) {
                await prisma.user.update({
                    where: { id: director.id },
                    data: { directorType }
                });
                console.log(`   ✅ Mis à jour: ${directorType}`);
            }
            else {
                console.log(`   ⏭️  Ignoré (attribution manuelle nécessaire)`);
            }
        }
        console.log('\n✅ Migration terminée avec succès!\n');
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
    }
    catch (error) {
        console.error('❌ Erreur lors de la migration:', error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
}
async function main() {
    console.log('⚠️  ATTENTION: Ce script va modifier les données existantes\n');
    console.log('Voulez-vous continuer? (yes/no): ');
    const shouldRun = process.env.RUN_MIGRATION === 'yes';
    if (shouldRun) {
        await assignDirectorTypes();
    }
    else {
        console.log('ℹ️  Migration annulée');
        console.log('Pour exécuter: RUN_MIGRATION=yes npx ts-node prisma/migrations-scripts/assign-director-types.ts');
    }
}
main();
//# sourceMappingURL=assign-director-types.js.map