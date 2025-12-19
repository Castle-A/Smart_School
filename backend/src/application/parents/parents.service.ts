import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { PasswordUtil } from '../../shared/utils/password.util';

@Injectable()
export class ParentsService {
    constructor(private prisma: PrismaService) { }

    /**
     * Crée un nouveau parent.
     * Si l'email est fourni, vérifie s'il existe déjà un utilisateur.
     */
    async create(schoolId: string, data: any) {
        // Logique de création
        return this.prisma.$transaction(async (prisma) => {
            let userId: string | null = null;

            // Créer un compte utilisateur si email fourni
            if (data.email) {
                // Vérifier si utilisateur existe
                let user = await prisma.user.findUnique({ where: { email: data.email } });

                if (!user) {
                    const tempPassword = PasswordUtil.generateTemporary();
                    user = await prisma.user.create({
                        data: {
                            email: data.email,
                            password: await PasswordUtil.hash(tempPassword),
                            firstName: data.firstName,
                            lastName: data.lastName,
                            phone: data.phone,
                            // Rôle implicite ou explicite ?
                            // Comme demandé : "Gestion des Parents une entité parent"
                            // On peut ajouter un rôle 'PARENT' au User si on modifie l'enum,
                            // ou juste compter sur la relation user.parentProfile
                            // role: 'PARENT', // Removed as it does not exist on User model
                            isActive: true,
                            mustChangePassword: true
                        }
                    });
                    // TODO: Envoyer email avec tempPassword
                }
                userId = user.id;
            }

            // Créer l'entité Parent
            const parent = await prisma.parent.create({
                data: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone,
                    occupation: data.occupation,
                    address: data.address,
                    schoolId: schoolId,
                    userId: userId
                }
            });

            // Lier aux élèves si fournis
            if (data.studentIds && data.studentIds.length > 0) {
                await prisma.parent.update({
                    where: { id: parent.id },
                    data: {
                        students: {
                            connect: data.studentIds.map((id: string) => ({ id }))
                        }
                    }
                });
            }

            return parent;
        });
    }

    async findAll(schoolId: string) {
        return this.prisma.parent.findMany({
            where: { schoolId },
            include: { students: true }
        });
    }

    async findOne(id: string, schoolId: string) {
        const parent = await this.prisma.parent.findFirst({
            where: { id, schoolId },
            include: { students: true }
        });
        if (!parent) throw new NotFoundException('Parent non trouvé');
        return parent;
    }
    async getChildren(userId: string) {
        const parent = await this.prisma.parent.findFirst({
            where: { userId },
            include: {
                students: {
                    include: {
                        class: true,
                        school: { select: { name: true } }
                    }
                }
            }
        });

        if (!parent) throw new NotFoundException('Profil parent non trouvé pour cet utilisateur');
        return parent.students;
    }

    async getOverview(userId: string) {
        const parent = await this.prisma.parent.findFirst({
            where: { userId },
            include: { students: true }
        });

        if (!parent) throw new NotFoundException('Profil parent non trouvé');

        // Simple overview stats
        const studentCount = parent.students.length;
        // In real app, fetch payments and notifications here

        return {
            studentCount,
            nextPaymentDue: null, // Placeholder
            unreadNotifications: 0
        };
    }
}
