import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FinanceConfigService } from '../../application/finance/finance-config.service';
import { SaveFinanceGridDto } from '../../application/finance/dto/finance-config.dto';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { AuthenticatedRequest } from '../../shared/interfaces/authenticated-request.interface';

@Controller('finance-config')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FinanceConfigController {
  constructor(private readonly financeConfigService: FinanceConfigService) {}

  @Get()
  @Roles('FOUNDER', 'DIRECTOR', 'ACCOUNTANT')
  async getConfig(@Request() req: AuthenticatedRequest) {
    return this.financeConfigService.getFinanceGrid(req.user.schoolId);
  }

  @Post()
  @Roles('FOUNDER', 'DIRECTOR', 'ACCOUNTANT')
  async saveConfig(
    @Request() req: AuthenticatedRequest,
    @Body() dto: SaveFinanceGridDto,
  ) {
    return this.financeConfigService.saveFinanceGrid(req.user.schoolId, dto);
  }
}
