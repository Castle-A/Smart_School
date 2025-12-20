import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { SaveFinanceGridDto } from './dto/finance-config.dto';

@Injectable()
export class FinanceConfigService {
    private readonly logger = new Logger(FinanceConfigService.name);

    constructor(private prisma: PrismaService) { }

    async getFinanceGrid(schoolId: string) {
        const categories = await this.prisma.feeCategory.findMany({
            where: { schoolId },
            include: {
                classFees: {
                    include: {
                        installments: true,
                    },
                },
            },
        });

        const products = await this.prisma.schoolProduct.findMany({
            where: { schoolId },
        });

        const config = await this.prisma.schoolConfig.findUnique({
            where: { schoolId },
            select: { currency: true, penaltyRate: true }
        });

        return {
            categories,
            products,
            currency: config?.currency || 'XOF',
            penaltyRate: config?.penaltyRate || 0
        };
    }

    async saveFinanceGrid(schoolId: string, dto: SaveFinanceGridDto) {
        return this.prisma.$transaction(async (tx) => {
            // 0. Update SchoolConfig (Global params)
            if (dto.currency !== undefined || dto.penaltyRate !== undefined) {
                await tx.schoolConfig.update({
                    where: { schoolId },
                    data: {
                        currency: dto.currency,
                        penaltyRate: dto.penaltyRate,
                    },
                });
            }

            // 1. Sync Categories
            const categoryIdsToKeep = dto.categories
                .filter(c => c.id)
                .map(c => c.id as string);

            await tx.feeCategory.deleteMany({
                where: {
                    schoolId,
                    id: { notIn: categoryIdsToKeep },
                },
            });

            for (const catDto of dto.categories) {
                await tx.feeCategory.upsert({
                    where: { id: catDto.id || '00000000-0000-0000-0000-000000000000' },
                    create: { name: catDto.name, schoolId },
                    update: { name: catDto.name },
                });
            }

            // 2. Sync Class Fees & Installments
            const feeIdsToKeep: string[] = [];

            for (const feeDto of dto.fees) {
                const classFee = await tx.classFee.upsert({
                    where: {
                        unique_class_fee: {
                            schoolId,
                            level: feeDto.level,
                            series: feeDto.series || 'STANDARD',
                            categoryId: feeDto.categoryId,
                        },
                    },
                    create: {
                        school: { connect: { id: schoolId } },
                        level: feeDto.level,
                        series: feeDto.series || 'STANDARD',
                        category: { connect: { id: feeDto.categoryId } },
                        tuitionAmount: feeDto.tuitionAmount,
                        registrationAmount: feeDto.registrationAmount,
                    },
                    update: {
                        tuitionAmount: feeDto.tuitionAmount,
                        registrationAmount: feeDto.registrationAmount,
                    },
                });

                feeIdsToKeep.push(classFee.id);

                // Sync Installments (Clear and Recreate)
                await tx.feeInstallment.deleteMany({
                    where: { classFeeId: classFee.id },
                });

                if (feeDto.installments?.length > 0) {
                    await tx.feeInstallment.createMany({
                        data: feeDto.installments.map((inst) => ({
                            classFeeId: classFee.id,
                            name: inst.name,
                            amount: inst.amount,
                            dueDate: new Date(inst.dueDate),
                        })),
                    });
                }
            }

            // Delete removed class fees
            await tx.classFee.deleteMany({
                where: {
                    schoolId,
                    id: { notIn: feeIdsToKeep },
                },
            });

            // 3. Sync Products
            const productIdsToKeep = dto.products
                .filter((p) => p.id)
                .map((p) => p.id as string);

            await tx.schoolProduct.deleteMany({
                where: {
                    schoolId,
                    id: { notIn: productIdsToKeep },
                },
            });

            for (const prodDto of dto.products) {
                await tx.schoolProduct.upsert({
                    where: { id: prodDto.id || '00000000-0000-0000-0000-000000000000' },
                    create: {
                        name: prodDto.name,
                        price: prodDto.price,
                        category: prodDto.category,
                        schoolId,
                    },
                    update: {
                        name: prodDto.name,
                        price: prodDto.price,
                        category: prodDto.category,
                    },
                });
            }

            return { success: true };
        });
    }
}
