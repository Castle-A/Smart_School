import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ExpensesService } from '../../application/finance/expenses.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { SchoolAccessGuard } from '../../shared/guards/school-access.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { CreateExpenseDto } from '../../application/finance/dto/create-expense.dto';
import { AuthenticatedRequest } from '../../shared/interfaces/authenticated-request.interface';

@Controller('finance/expenses')
@UseGuards(JwtAuthGuard, RolesGuard, SchoolAccessGuard) // Sécurité et isolation des dépenses
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @Roles('ACCOUNTANT', 'DIRECTOR', 'FOUNDER')
  create(@Request() req: AuthenticatedRequest, @Body() body: CreateExpenseDto) {
    return this.expensesService.create(
      req.user.schoolId,
      req.user.userId,
      body,
    );
  }

  @Get()
  @Roles('ACCOUNTANT', 'DIRECTOR', 'FOUNDER')
  findAll(
    @Request() req: AuthenticatedRequest,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('category') category?: string,
  ) {
    return this.expensesService.findAll(req.user.schoolId, {
      startDate,
      endDate,
      category,
    });
  }

  @Get('stats')
  @Roles('ACCOUNTANT', 'DIRECTOR', 'FOUNDER')
  getStats(@Request() req: AuthenticatedRequest) {
    return this.expensesService.getStats(req.user.schoolId);
  }
}
