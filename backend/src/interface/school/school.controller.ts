import { Controller, Post, Get, Body, Param, Put } from '@nestjs/common';
import { SchoolService } from '../../application/school/school.service';

@Controller('schools')
export class SchoolController {
    constructor(private schoolService: SchoolService) { }

    @Post()
    async createSchool(@Body() body: any) {
        return this.schoolService.createSchool(body.name, body.founderId);
    }

    @Post(':schoolId/staff')
    async createStaffMember(
        @Param('schoolId') schoolId: string,
        @Body() body: any
    ) {
        return this.schoolService.createStaffMember(
            schoolId,
            body.userId,
            body.role,
            body.permissions || []
        );
    }

    @Get(':schoolId/staff')
    async getSchoolStaff(@Param('schoolId') schoolId: string) {
        return this.schoolService.getSchoolStaff(schoolId);
    }

    @Get('user/:userId')
    async getUserSchools(@Param('userId') userId: string) {
        return this.schoolService.getUserSchools(userId);
    }

    @Put('staff/:schoolUserId/permissions')
    async updatePermissions(
        @Param('schoolUserId') schoolUserId: string,
        @Body() body: any
    ) {
        await this.schoolService.updatePermissions(schoolUserId, body.permissions);
        return { success: true };
    }
}
