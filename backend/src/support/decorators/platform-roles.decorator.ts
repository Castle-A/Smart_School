import { SetMetadata } from '@nestjs/common';

export const PlatformRoles = (...roles: string[]) => SetMetadata('platformRoles', roles);
