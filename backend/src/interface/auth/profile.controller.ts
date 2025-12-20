import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../application/auth/jwt-auth.guard';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Controller('profile')
export class ProfileController {
  constructor(private prisma: PrismaService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req: any) {
    const userId = req.user.userId || req.user.sub;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        gender: true,
        phone: true,
        profilePicture: true,
        schoolUsers: {
          include: {
            school: {
              select: {
                id: true,
                name: true,
                address: true,
                phone: true,
                email: true,
                logo: true,
                cycles: true,
                subscriptionPlan: true,
                subscriptionStatus: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get the primary school (first one, or we can add logic for multiple schools)
    const primarySchoolUser = user.schoolUsers[0];

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`,
      gender: user.gender,
      phone: user.phone,
      profilePicture: user.profilePicture,
      initials:
        `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase(),
      role: primarySchoolUser?.role,
      school: primarySchoolUser?.school,
    };
  }
}
