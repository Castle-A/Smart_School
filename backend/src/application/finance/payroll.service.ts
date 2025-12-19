import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { GeneratePayrollDto } from './dto/generate-payroll.dto';

@Injectable()
export class PayrollService {
    constructor(private prisma: PrismaService) { }

    async getPayrollList(schoolId: string, month?: string, year?: number) {
        const where: any = { schoolId };
        if (month) where.month = month;
        if (year) where.year = Number(year);

        return this.prisma.payroll.findMany({
            where,
            include: { teacher: true },
            orderBy: { teacher: { lastName: 'asc' } }
        });
    }

    async generatePayroll(schoolId: string, dto: GeneratePayrollDto) {
        const teachers = await this.prisma.teacher.findMany({
            where: { schoolId, deletedAt: null }
        });

        const createdPayrolls: any[] = [];

        for (const teacher of teachers) {
            // Check if exists
            const existing = await this.prisma.payroll.findFirst({
                where: {
                    schoolId,
                    teacherId: teacher.id,
                    month: dto.month,
                    year: dto.year
                }
            });

            if (!existing) {
                // Future: Fetch baseSalary from Teacher model if added
                const baseSalary = 0;

                const payroll = await this.prisma.payroll.create({
                    data: {
                        schoolId,
                        teacherId: teacher.id,
                        month: dto.month,
                        year: dto.year,
                        baseSalary: baseSalary,
                        netSalary: baseSalary, // - deductions + bonus
                        status: 'DRAFT'
                    }
                });
                createdPayrolls.push(payroll);
            }
        }

        return { message: "Generated", count: createdPayrolls.length };
    }

    async updatePayroll(schoolId: string, id: string, data: { baseSalary?: number, bonus?: number, deductions?: number, status?: string }) {
        const current = await this.prisma.payroll.findUnique({ where: { id } });
        if (!current) throw new Error("Payroll not found");

        const base = data.baseSalary ?? current.baseSalary;
        const bonus = data.bonus ?? current.bonus;
        const deductions = data.deductions ?? current.deductions;
        const net = base + bonus - deductions;

        return this.prisma.payroll.update({
            where: { id },
            data: {
                baseSalary: base,
                bonus: bonus,
                deductions: deductions,
                netSalary: net,
                status: data.status ?? current.status,
                paymentDate: data.status === 'PAID' && current.status !== 'PAID' ? new Date() : current.paymentDate
            }
        });
    }
}
