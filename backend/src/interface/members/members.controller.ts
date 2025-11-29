import { Controller, Post, Get, Body, UseGuards, Request, Delete, Patch, Param } from '@nestjs/common';
import { MembersService } from '../../application/members/members.service';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';

@Controller('members')
@UseGuards(JwtAuthGuard)
export class MembersController {
    constructor(private membersService: MembersService) { }

    @Post('create')
    async createMember(@Body() body: any, @Request() req: any) {
        try {
            console.log('👥 Creating new member:', body);

            // Generate random 8-character password
            const tempPassword = this.generatePassword();

            const member = await this.membersService.createMember(
                {
                    email: body.email,
                    phone: body.phone,
                    firstName: body.firstName,
                    lastName: body.lastName,
                    gender: body.gender,
                    role: body.role,
                    loginMethod: body.loginMethod,
                    schoolId: req.user.schoolId, // Get school ID from authenticated user
                },
                tempPassword
            );

            console.log('✅ Member created successfully:', member.id);

            // Return member info and temporary credentials
            return {
                member,
                credentials: {
                    identifier: body.loginMethod === 'email' ? body.email : body.phone,
                    tempPassword,
                },
            };
        } catch (error) {
            console.error('❌ Error creating member:', error);
            throw error;
        }
    }

    @Get('list')
    async getMembers(@Request() req: any) {
        try {
            const members = await this.membersService.getMembersBySchool(req.user.schoolId);
            return members;
        } catch (error) {
            console.error('❌ Error fetching members:', error);
            throw error;
        }
    }

    @Post(':id/reset-password')
    async resetPassword(@Param('id') id: string, @Request() req: any) {
        try {
            const tempPassword = this.generatePassword();
            await this.membersService.resetMemberPassword(id, tempPassword, req.user.schoolId);
            return { message: 'Password reset successfully', tempPassword };
        } catch (error) {
            console.error('❌ Error resetting password:', error);
            throw error;
        }
    }

    @Patch(':id/status')
    async updateStatus(@Param('id') id: string, @Body() body: { status: string }, @Request() req: any) {
        try {
            await this.membersService.updateMemberStatus(id, body.status, req.user.schoolId);
            return { message: 'Status updated successfully' };
        } catch (error) {
            console.error('❌ Error updating status:', error);
            throw error;
        }
    }

    @Delete(':id')
    async deleteMember(@Param('id') id: string, @Request() req: any) {
        try {
            await this.membersService.deleteMember(id, req.user.schoolId);
            return { message: 'Member deleted successfully' };
        } catch (error) {
            console.error('❌ Error deleting member:', error);
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
}
