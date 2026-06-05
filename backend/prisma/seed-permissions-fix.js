"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const permissions_constants_1 = require("../src/shared/constants/permissions.constants");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding Permissions...');
    const allPermissions = [
        ...permissions_constants_1.DIRECTOR_PERMISSIONS,
        ...permissions_constants_1.SECRETARY_PERMISSIONS,
        ...permissions_constants_1.SUPERVISOR_PERMISSIONS,
        ...permissions_constants_1.CENSOR_PERMISSIONS,
        ...permissions_constants_1.ACCOUNTANT_PERMISSIONS
    ];
    const uniquePermissions = Array.from(new Map(allPermissions.map(item => [item.code, item])).values());
    for (const perm of uniquePermissions) {
        await prisma.permissionDefinition.upsert({
            where: { code: perm.code },
            update: {
                name: perm.name,
                description: perm.description,
                category: perm.category,
                isDefault: perm.isDefault,
                directorType: perm.directorType
            },
            create: {
                code: perm.code,
                name: perm.name,
                description: perm.description,
                category: perm.category,
                role: 'ALL',
                isDefault: perm.isDefault,
                directorType: perm.directorType
            }
        });
    }
    const founders = await prisma.schoolUser.findMany({
        where: { role: 'FOUNDER' },
        include: { rolePermissions: true }
    });
    console.log(`Found ${founders.length} founders to update.`);
    for (const founder of founders) {
        for (const perm of uniquePermissions) {
            const hasPermission = founder.rolePermissions.some(rp => rp.permissionDefinitionId === perm.code);
            const permDef = await prisma.permissionDefinition.findUnique({ where: { code: perm.code } });
            if (!permDef)
                continue;
            const exists = await prisma.rolePermission.findFirst({
                where: {
                    schoolUserId: founder.id,
                    permissionDefinitionId: permDef.id
                }
            });
            if (!exists) {
                await prisma.rolePermission.create({
                    data: {
                        schoolUserId: founder.id,
                        permissionDefinitionId: permDef.id
                    }
                });
            }
        }
    }
    console.log('Permissions seeded and assigned to founders.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-permissions-fix.js.map