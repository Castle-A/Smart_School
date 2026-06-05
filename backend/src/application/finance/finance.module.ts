import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull'; // Added BullModule import
// Imports mis à jour vers la couche interface (Clean Architecture)
import { FinanceController } from '../../interface/finance/finance.controller';
import { ExpensesController } from '../../interface/finance/expenses.controller';
import { WebhookController } from '../../interface/finance/webhook.controller'; // Import
import { PayrollController } from '../../interface/finance/payroll.controller';
import { TransactionsController } from '../../interface/finance/transactions.controller';
import { FinanceConfigController } from '../../interface/finance/finance-config.controller';
import { FinanceService } from './finance.service';
import { ExpensesService } from './expenses.service';
import { PdfService } from './pdf.service';
import { TransactionsService } from './transactions.service';
import { PayrollService } from './payroll.service';
import { FinanceConfigService } from './finance-config.service';
import { PaymentProcessor } from './queue/payment.processor'; // Added PaymentProcessor import
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { SupportModule } from '../support/support.module';

@Module({
  imports: [
    PrismaModule,
    // Enregistrement de la file d'attente Payment
    BullModule.registerQueue({
      name: 'payment-queue',
    }),
    SupportModule,
  ],
  controllers: [
    FinanceController,
    ExpensesController,
    WebhookController, // Ajout du contrôleur Webhook
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
    PaymentProcessor // Worker BullMQ
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
