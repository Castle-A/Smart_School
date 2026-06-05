"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const permissions_constants_1 = require("../src/shared/constants/permissions.constants");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting seed...');
    console.log('... Seeding Permissions Definitions');
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
    const school = await prisma.school.create({
        data: {
            name: 'Lycée d\'Excellence d\'Abidjan',
            cycles: 'PRIMAIRE,COLLEGE',
            email: 'contact@lycee-excellence.ci',
            plan: 'PREMIUM',
            isActive: true,
        },
    });
    console.log('🏫 School created:', school.name);
    const passwordHash = await bcrypt.hash('password123', 10);
    const founder = await prisma.user.create({
        data: {
            email: 'admin@smartschool.ci',
            password: passwordHash,
            firstName: 'Jean',
            lastName: 'Kouassi',
            gender: 'HOMME',
            phone: '0102030405',
            profilePicture: null,
            mustChangePassword: false,
            isActive: true,
            loginMethod: 'email',
        },
    });
    console.log('👤 Founder created:', founder.email);
    const schoolUser = await prisma.schoolUser.create({
        data: {
            userId: founder.id,
            schoolId: school.id,
            role: 'FOUNDER',
            directorType: 'BOTH',
        },
    });
    console.log('🔗 Founder linked to School');
    console.log('... Assigning Permissions to Founder');
    for (const perm of uniquePermissions) {
        const permDef = await prisma.permissionDefinition.findUnique({ where: { code: perm.code } });
        if (permDef) {
            await prisma.rolePermission.create({
                data: {
                    schoolUserId: schoolUser.id,
                    permissionDefinitionId: permDef.id
                }
            });
        }
    }
    await prisma.class.createMany({
        data: [
            { name: '6ème A', cycle: 'COLLEGE', level: '6eme', schoolId: school.id },
            { name: '3ème B', cycle: 'COLLEGE', level: '3eme', schoolId: school.id },
            { name: 'CP A', cycle: 'PRIMAIRE', level: 'CP', schoolId: school.id },
        ],
    });
    console.log('📚 Basic classes created');
    const classes = await prisma.class.findMany({ where: { schoolId: school.id } });
    console.log('... Creating Test Users (Jane Doe, etc.)');
    const testUsers = [
        { email: 'jane.doe@smartschool.ci', first: 'Jane', last: 'Doe', role: 'TEACHER' },
        { email: 'secretary@smartschool.ci', first: 'Alice', last: 'Secretary', role: 'SECRETARY' },
    ];
    for (const u of testUsers) {
        const user = await prisma.user.create({
            data: {
                email: u.email,
                password: passwordHash,
                firstName: u.first,
                lastName: u.last,
                gender: 'FEMME',
                phone: u.email === 'jane.doe@smartschool.ci' ? '0607080910' : '0708091011',
                mustChangePassword: false,
                isActive: true,
                loginMethod: 'email',
            }
        });
        await prisma.schoolUser.create({
            data: {
                userId: user.id,
                schoolId: school.id,
                role: u.role,
            }
        });
        console.log(`👤 User created: ${u.email} (${u.role})`);
    }
    console.log('... Populating Subjects from Benin Template');
    const SUBJECTS_TEMPLATE = [
        { name: 'Lecture', cycle: 'PRIMAIRE', coef: 1 },
        { name: 'Mathématiques', cycle: 'PRIMAIRE', coef: 1 },
        { name: 'Expression Écrite', cycle: 'PRIMAIRE', coef: 1 },
        { name: 'Français', cycle: 'COLLEGE', coef: 3 },
        { name: 'Mathématiques', cycle: 'COLLEGE', coef: 3 },
        { name: 'Anglais', cycle: 'COLLEGE', coef: 2 },
        { name: 'Physique-Chimie-Technologie', cycle: 'COLLEGE', coef: 2 },
        { name: 'SVT', cycle: 'COLLEGE', coef: 2 },
        { name: 'Histoire-Géographie', cycle: 'COLLEGE', coef: 2 },
        { name: 'Philosophie', cycle: 'LYCEE', coef: 2 },
    ];
    for (const subj of SUBJECTS_TEMPLATE) {
        await prisma.subject.create({
            data: {
                name: subj.name,
                coefficient: subj.coef,
                cycle: subj.cycle,
                schoolId: school.id
            }
        });
    }
    console.log(`📚 ${SUBJECTS_TEMPLATE.length} Subjects created for the school.`);
    console.log('✅ Seed completed!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map