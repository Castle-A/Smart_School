import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { TransactionsService } from '../../application/finance/transactions.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { SchoolAccessGuard } from '../../shared/guards/school-access.guard';
import { Roles } from '../../shared/decorators/roles.decorator';

@Controller('finance/history')
@UseGuards(JwtAuthGuard, RolesGuard, SchoolAccessGuard) // Protection des données financières
export class TransactionsController {
    constructor(private transactionsService: TransactionsService) { }

    @Get()
    @Roles('ACCOUNTANT', 'DIRECTOR', 'FOUNDER')
    async getHistory(@Request() req, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
        const filters = startDate ? {
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : undefined
        } : undefined;

        return this.transactionsService.getHistory(req.user.schoolId, filters);
    }
}
