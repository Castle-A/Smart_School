import { Module } from '@nestjs/common';
// Imports mis à jour vers la couche interface (Clean Architecture)
import { FinanceController } from '../../interface/finance/finance.controller';
import { ExpensesController } from '../../interface/finance/expenses.controller';
import { PayrollController } from '../../interface/finance/payroll.controller';
import { TransactionsController } from '../../interface/finance/transactions.controller';
import { FinanceConfigController } from '../../interface/finance/finance-config.controller';
import { FinanceService } from './finance.service';
import { ExpensesService } from './expenses.service';
import { PdfService } from './pdf.service';
import { TransactionsService } from './transactions.service';
import { PayrollService } from './payroll.service';
import { FinanceConfigService } from './finance-config.service';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    FinanceController,
    ExpensesController,
    PayrollController,
    TransactionsController,
    FinanceConfigController,
  ],
  providers: [
    FinanceService,
    ExpensesService,
    PdfService,
    PayrollService,
    TransactionsService,
    FinanceConfigService,
  ],
  exports: [
    FinanceService,
    ExpensesService,
    PdfService,
    PayrollService,
    TransactionsService,
    FinanceConfigService,
  ],
})
export class FinanceModule { }
