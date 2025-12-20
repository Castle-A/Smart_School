import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Delete,
  Patch,
  Param,
} from '@nestjs/common';
import { MembersService } from '../../application/members/members.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { SchoolAccessGuard } from '../../shared/guards/school-access.guard';
import { CreateMemberDto } from '../../application/members/dto/create-member.dto';
import { UpdateMemberDto } from '../../application/members/dto/update-member.dto';
import { CustomLogger } from '../../shared/logger/custom-logger.service';
import { Roles } from '../../shared/decorators/roles.decorator';
import { AuthenticatedRequest } from '../../shared/interfaces/authenticated-request.interface';

@Controller('members')
@UseGuards(JwtAuthGuard, RolesGuard, SchoolAccessGuard) // Rôles et Isolation pour la gestion des membres
export class MembersController {
  private readonly logger = new CustomLogger();

  constructor(private membersService: MembersService) {}

  @Post('create')
  @Roles('FOUNDER')
  async createMember(
    @Body() createMemberDto: CreateMemberDto,
    @Request() req: AuthenticatedRequest,
  ) {
    try {
      this.logger.log(
        `Creating new member: ${createMemberDto.email}`,
        'MembersController',
      );

      // Generate random 8-character password
      const tempPassword = this.generatePassword();

      const loginMethod = createMemberDto.loginMethod || 'email';

      const member = await this.membersService.createMember(
        {
          email: createMemberDto.email || '',
          phone: createMemberDto.phone,
          firstName: createMemberDto.firstName,
          lastName: createMemberDto.lastName,
          gender: createMemberDto.gender,
          role: createMemberDto.role,
          loginMethod: loginMethod,
          schoolId: req.user.schoolId,
          directorType: createMemberDto.directorType,
          permissionIds: createMemberDto.permissionIds, // Passer les permissions au service
        },
        tempPassword,
      );

      this.logger.log(
        `Member created successfully: ${member.id}`,
        'MembersController',
      );

      // Return member info and temporary credentials
      const identifier =
        loginMethod === 'phone' ? createMemberDto.phone : createMemberDto.email;

      return {
        member,
        credentials: {
          identifier,
          tempPassword,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error creating member: ${error.message}`,
        error.stack,
        'MembersController',
      );
      throw error;
    }
  }

  @Get('list')
  async getMembers(@Request() req: AuthenticatedRequest) {
    try {
      const members = await this.membersService.getMembersBySchool(
        req.user.schoolId,
      );
      return members;
    } catch (error) {
      this.logger.error(
        `Error fetching members: ${error.message}`,
        error.stack,
        'MembersController',
      );
      throw error;
    }
  }

  @Post(':id/reset-password')
  async resetPassword(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    try {
      this.logger.log(
        `Resetting password for member: ${id}`,
        'MembersController',
      );
      const tempPassword = this.generatePassword();
      await this.membersService.resetMemberPassword(
        id,
        tempPassword,
        req.user.schoolId,
      );
      return { message: 'Password reset successfully', tempPassword };
    } catch (error) {
      this.logger.error(
        `Error resetting password: ${error.message}`,
        error.stack,
        'MembersController',
      );
      throw error;
    }
  }

  @Patch(':id/toggle-status')
  async toggleStatus(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    try {
      const result = await this.membersService.toggleMemberStatus(
        id,
        req.user.schoolId,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error toggling status: ${error.message}`,
        error.stack,
        'MembersController',
      );
      throw error;
    }
  }

  @Patch(':id/permissions')
  async updatePermissions(
    @Param('id') id: string,
    @Body() body: { permissionIds: string[]; directorType?: string },
    @Request() req: AuthenticatedRequest,
  ) {
    try {
      this.logger.log(
        `Updating permissions for member: ${id}`,
        'MembersController',
      );
      await this.membersService.updateMemberPermissions(
        id,
        body.permissionIds,
        req.user.schoolId,
        body.directorType,
      );
      return { message: 'Permissions updated successfully' };
    } catch (error) {
      this.logger.error(
        `Error updating permissions: ${error.message}`,
        error.stack,
        'MembersController',
      );
      throw error;
    }
  }

  @Get(':id/permissions')
  async getMemberPermissions(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    try {
      const permissions = await this.membersService.getMemberPermissions(
        id,
        req.user.schoolId,
      );
      return permissions;
    } catch (error) {
      this.logger.error(
        `Error fetching member permissions: ${error.message}`,
        error.stack,
        'MembersController',
      );
      throw error;
    }
  }

  @Delete(':id')
  async deleteMember(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    try {
      this.logger.log(`Deleting member: ${id}`, 'MembersController');
      await this.membersService.deleteMember(id, req.user.schoolId);
      return { message: 'Member deleted successfully' };
    } catch (error) {
      this.logger.error(
        `Error deleting member: ${error.message}`,
        error.stack,
        'MembersController',
      );
      throw error;
    }
  }

  private generatePassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
  @Patch(':id/salary')
  @Roles('DIRECTOR', 'ACCOUNTANT', 'FOUNDER')
  updateSalary(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body('monthlySalary') monthlySalary: number,
  ) {
    return this.membersService.updateMemberSalary(
      id,
      req.user.schoolId,
      monthlySalary,
    );
  }
}
