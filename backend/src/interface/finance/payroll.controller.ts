import { Controller, Get, Post, Put, Body, Query, UseGuards, Request, Param, Patch } from '@nestjs/common';
import { PayrollService } from '../../application/finance/payroll.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { SchoolAccessGuard } from '../../shared/guards/school-access.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { GeneratePayrollDto } from '../../application/finance/dto/generate-payroll.dto';
import { UpdatePayrollDto } from '../../application/finance/dto/update-payroll.dto';

@Controller('finance/payroll')
@UseGuards(JwtAuthGuard, RolesGuard, SchoolAccessGuard) // Protection de la confidentialité de la paie
export class PayrollController {
    constructor(private readonly payrollService: PayrollService) { }

    @Get()
    @Roles('ACCOUNTANT', 'DIRECTOR', 'FOUNDER')
    findAll(@Request() req, @Query('month') month?: string, @Query('year') year?: number) {
        return this.payrollService.getPayrollList(req.user.schoolId, month, year);
    }

    @Post('generate')
    @Roles('ACCOUNTANT', 'DIRECTOR', 'FOUNDER')
    generate(@Request() req, @Body() body: GeneratePayrollDto) {
        return this.payrollService.generatePayroll(req.user.schoolId, body);
    }

    @Patch(':id')
    @Roles('ACCOUNTANT', 'DIRECTOR', 'FOUNDER')
    update(@Request() req, @Param('id') id: string, @Body() dto: UpdatePayrollDto) {
        // Validation stricte des modifications de paie (Phase 2)
        return this.payrollService.updatePayroll(req.user.schoolId, id, dto);
    }
}
