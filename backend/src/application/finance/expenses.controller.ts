import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Controller('finance/expenses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExpensesController {
    constructor(private readonly expensesService: ExpensesService) { }

    @Post()
    @Roles('ACCOUNTANT', 'DIRECTOR', 'FOUNDER')
    create(@Request() req, @Body() body: CreateExpenseDto) {
        return this.expensesService.create(req.user.schoolId, req.user.id, body);
    }

    @Get()
    @Roles('ACCOUNTANT', 'DIRECTOR', 'FOUNDER')
    findAll(@Request() req, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string, @Query('category') category?: string) {
        return this.expensesService.findAll(req.user.schoolId, { startDate, endDate, category });
    }

    @Get('stats')
    @Roles('ACCOUNTANT', 'DIRECTOR', 'FOUNDER')
    getStats(@Request() req) {
        return this.expensesService.getStats(req.user.schoolId);
    }
}
