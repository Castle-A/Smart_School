import { PrismaClient } from '@prisma/client';
import { BENIN_SUBJECTS_TEMPLATE, BeninSubjectTemplate } from '../shared/constants/benin-subjects.constants';

const prisma = new PrismaClient();

async function main() {
    console.log("🇧🇯 Starting Benin Subjects Population Script...");

    // Fetch all schools
    const schools = await prisma.school.findMany();

    if (schools.length === 0) {
        console.log("⚠️ No schools found in database.");
        return;
    }

    console.log(`Found ${schools.length} school(s). Processing...`);

    for (const school of schools) {
        console.log(`\n🏫 Processing School: ${school.name} (${school.id})`);

        // Determine School Type context (from 'cycles' field string e.g., "PRIMARY,SECONDARY")
        const cycles = (school.cycles || "").toUpperCase();
        const isMaternelle = cycles.includes('PRESCHOOL') || cycles.includes('MATERNELLE');
        const isPrimaire = cycles.includes('PRIMARY') || cycles.includes('PRIMAIRE');
        const isCollege = cycles.includes('SECONDARY') || cycles.includes('COLLEGE');
        const isLycee = cycles.includes('SECONDARY') || cycles.includes('LYCEE');
        const isTechnique = cycles.includes('TECHNICAL') || cycles.includes('TECHNIQUE');

        // Filter relevant subjects from template
        const subjectsToInject = BENIN_SUBJECTS_TEMPLATE.filter(subj => {
            if (subj.cycle === 'MATERNELLE' && isMaternelle) return true;
            if (subj.cycle === 'PRIMAIRE' && isPrimaire) return true;
            if (subj.cycle === 'COLLEGE' && isCollege) return true;
            if (subj.cycle === 'LYCEE' && isLycee) return true;
            if (subj.cycle === 'COLLEGE_LYCEE' && (isCollege || isLycee)) return true;
            if (subj.cycle === 'LYCEE_TECHNIQUE' && isTechnique) return true;
            return false;
        });

        console.log(`   👉 Identified ${subjectsToInject.length} subjects to inject.`);

        let addedCount = 0;
        let skippedCount = 0;

        for (const tmpl of subjectsToInject) {
            // Check if subject already exists by name (case insensitive ideally, but strict here for now)
            const existing = await prisma.subject.findFirst({
                where: {
                    schoolId: school.id,
                    name: tmpl.name
                }
            });

            if (existing) {
                skippedCount++;
            } else {
                await prisma.subject.create({
                    data: {
                        name: tmpl.name,
                        schoolId: school.id,
                        coefficient: tmpl.defaultCoef,
                        cycle: mapTemplateCycleToDbCycle(tmpl.cycle, isPrimaire, isCollege),
                        // We could store 'category' if schema supported it, but it doesn't yet.
                        // Future: prisma schema update to add 'category' to Subject model.
                    }
                });
                addedCount++;
            }
        }

        console.log(`   ✅ Added: ${addedCount} | Skipped (Existing): ${skippedCount}`);
    }

    console.log("\n✨ Population complete!");
}

function mapTemplateCycleToDbCycle(templateCycle: string, isPrimaire: boolean, isCollege: boolean): string {
    // Maps the template cycle string to the DB 'cycle' enum/string
    // DB assumes simple strings like 'PRIMAIRE', 'COLLEGE'. 
    // Adapting based on context.

    if (templateCycle === 'MATERNELLE') return 'MATERNELLE';
    if (templateCycle === 'PRIMAIRE') return 'PRIMAIRE';
    if (templateCycle === 'COLLEGE_LYCEE') return isCollege ? 'COLLEGE' : 'LYCEE';
    if (templateCycle === 'LYCEE_TECHNIQUE') return 'LYCEE'; // Simplification
    return templateCycle; // Default fallback
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
