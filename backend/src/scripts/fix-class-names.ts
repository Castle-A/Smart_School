
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Starting class name fix...');

    const classes = await prisma.class.findMany({
        where: {
            cycle: 'PRIMAIRE'
        }
    });

    console.log(`Found ${classes.length} primary classes.`);

    for (const cls of classes) {
        let newName = cls.name;
        let newLevel = cls.level;
        let modified = false;

        // Corrections map
        const replacements = [
            { old: 'C.I', new: 'CI' },
            { old: 'C.P', new: 'CP' },
            { old: 'C.E.1', new: 'CE1' },
            { old: 'C.E.2', new: 'CE2' },
            { old: 'C.M.1', new: 'CM1' },
            { old: 'C.M.2', new: 'CM2' },
            // Handle variations with spaces if needed, e.g. "C. I" -> regex better?
            // Simple replaceAll for now, assuming standard spacing
        ];

        for (const r of replacements) {
            if (newName.includes(r.old)) {
                newName = newName.replace(r.old, r.new);
                modified = true;
            }
            if (newLevel.includes(r.old)) {
                newLevel = newLevel.replace(r.old, r.new);
                modified = true;
            }
        }

        if (modified) {
            console.log(`Updating '${cls.name}' -> '${newName}' (Level: '${cls.level}' -> '${newLevel}')`);
            await prisma.class.update({
                where: { id: cls.id },
                data: {
                    name: newName,
                    level: newLevel
                }
            });
        }
    }

    console.log('✅ Class name corrections completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
