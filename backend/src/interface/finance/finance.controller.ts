import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
  Request,
  Param,
  Header,
  StreamableFile,
} from '@nestjs/common';
import { FinanceService } from '../../application/finance/finance.service';
import { CreatePaymentDto } from '../../application/finance/dto/create-payment.dto';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { SchoolAccessGuard } from '../../shared/guards/school-access.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { AuthenticatedRequest } from '../../shared/interfaces/authenticated-request.interface';

@Controller('finance')
@UseGuards(JwtAuthGuard, RolesGuard, SchoolAccessGuard) // Isolation des flux financiers
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('students')
  @Roles('ACCOUNTANT', 'DIRECTOR', 'FOUNDER')
  async getStudentFinanceSummary(
    @Request() req: AuthenticatedRequest,
    @Query('search') search: string,
  ) {
    const schoolId = req.user.schoolId;
    return this.financeService.getStudentFinanceSummary(schoolId, search);
  }

  @Post('payments')
  @Roles('ACCOUNTANT', 'DIRECTOR', 'FOUNDER')
  async createPayment(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreatePaymentDto,
  ) {
    // Le DTO assure la validation des types et montants (Phase 2)
    const schoolId = req.user.schoolId;
    return this.financeService.createPayment(schoolId, dto);
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
  async getFinancialReport(
    @Request() req: AuthenticatedRequest,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const schoolId = req.user.schoolId;
    return this.financeService.getFinancialReport(
      schoolId,
      startDate
        ? new Date(startDate)
        : new Date(new Date().getFullYear(), 0, 1),
      endDate ? new Date(endDate) : new Date(),
    );
  }

  @Get('stats/global')
  @Roles('ACCOUNTANT', 'DIRECTOR', 'FOUNDER')
  async getGlobalStats(@Request() req: AuthenticatedRequest) {
    const schoolId = req.user.schoolId;
    return this.financeService.getGlobalStats(schoolId);
  }
}
