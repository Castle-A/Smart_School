import { Controller, Get, Post, Query, Body, UseGuards, Request, Param, Header, StreamableFile } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';

@Controller('finance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FinanceController {
    constructor(private readonly financeService: FinanceService) { }

    @Get('students')
    @Roles('ACCOUNTANT', 'DIRECTOR', 'FOUNDER')
    async getStudentFinanceSummary(@Request() req, @Query('search') search: string) {
        const schoolId = req.user.schoolId;
        return this.financeService.getStudentFinanceSummary(schoolId, search);
    }

    @Post('payments')
    @Roles('ACCOUNTANT', 'DIRECTOR', 'FOUNDER')
    async createPayment(@Request() req, @Body() body: any) {
        const schoolId = req.user.schoolId;
        return this.financeService.createPayment(schoolId, body);
    }

    @Get('receipt/:paymentId')
    @Roles('ACCOUNTANT', 'DIRECTOR', 'FOUNDER')
    @Header('Content-Type', 'application/pdf')
    @Header('Content-Disposition', 'attachment; filename="recu.pdf"')
    async getReceipt(@Param('paymentId') paymentId: string) {
        const buffer = await this.financeService.generateReceiptPdf(paymentId);
        return new StreamableFile(buffer);
    }

    @Get('report')
    @Roles('ACCOUNTANT', 'DIRECTOR', 'FOUNDER')
    async getFinancialReport(@Request() req, @Query('startDate') startDate: string, @Query('endDate') endDate: string) {
        const schoolId = req.user.schoolId;
        return this.financeService.getFinancialReport(
            schoolId,
            startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1),
            endDate ? new Date(endDate) : new Date()
        );
    }

    @Get('stats/global')
    @Roles('ACCOUNTANT', 'DIRECTOR', 'FOUNDER')
    async getGlobalStats(@Request() req) {
        const schoolId = req.user.schoolId;
        return this.financeService.getGlobalStats(schoolId);
    }
}
