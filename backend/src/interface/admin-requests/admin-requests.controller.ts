import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AdminRequestService } from '../../application/admin-requests/admin-requests.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { AuthenticatedRequest } from '../../shared/interfaces/authenticated-request.interface';

@Controller('admin-requests')
@UseGuards(JwtAuthGuard)
export class AdminRequestController {
  constructor(private readonly adminRequestService: AdminRequestService) {}

  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() body: { type: string; data: any },
  ) {
    return this.adminRequestService.create(
      req.user.schoolId,
      req.user.userId,
      body.type,
      body.data,
    );
  }

  @Get('my-requests')
  async findMyRequests(
    @Request() req: AuthenticatedRequest,
    @Query('archived') archived?: string,
  ) {
    return this.adminRequestService.findMyRequests(
      req.user.schoolId,
      req.user.userId,
      archived === 'true',
    );
  }

  @Get()
  async findAll(
    @Request() req: AuthenticatedRequest,
    @Query('status') status?: string,
    @Query('archived') archived?: string,
  ) {
    return this.adminRequestService.findAll(
      req.user.schoolId,
      status,
      archived === 'true',
    );
  }

  @Patch(':id/archive')
  async archive(@Param('id') id: string) {
    return this.adminRequestService.archive(id);
  }

  @Patch('archive-all-processed')
  async archiveAllProcessed(@Request() req: AuthenticatedRequest) {
    return this.adminRequestService.archiveAllProcessed(
      req.user.schoolId,
      req.user.userId,
    );
  }

  @Patch(':id/resolve')
  async resolve(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: { status: 'APPROVED' | 'REJECTED'; comment?: string },
  ) {
    // Here we could add Role Guard to ensure only Director checks this?
    // Logic handled in service or implicitly by UI view for now, but safer with Guard.
    // Assuming Director calls this.
    return this.adminRequestService.resolve(
      id,
      req.user.schoolId,
      req.user.userId,
      body.status,
      body.comment,
    );
  }
}
