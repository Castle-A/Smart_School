import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request, Query } from '@nestjs/common';
import { AdminRequestService } from '../../application/admin-requests/admin-requests.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';

@Controller('admin-requests')
@UseGuards(JwtAuthGuard)
export class AdminRequestController {
    constructor(private readonly adminRequestService: AdminRequestService) { }

    @Post()
    async create(@Request() req, @Body() body: { type: string; data: any }) {
        return this.adminRequestService.create(
            req.user.schoolId,
            req.user.userId,
            body.type,
            body.data
        );
    }

    @Get()
    async findAll(@Request() req, @Query('status') status?: string) {
        return this.adminRequestService.findAll(req.user.schoolId, status);
    }

    @Patch(':id/resolve')
    async resolve(
        @Request() req,
        @Param('id') id: string,
        @Body() body: { status: 'APPROVED' | 'REJECTED'; comment?: string }
    ) {
        // Here we could add Role Guard to ensure only Director checks this?
        // Logic handled in service or implicitly by UI view for now, but safer with Guard.
        // Assuming Director calls this.
        return this.adminRequestService.resolve(
            id,
            req.user.schoolId,
            req.user.userId,
            body.status,
            body.comment
        );
    }
}
