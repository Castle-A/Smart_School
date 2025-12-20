import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { PERMISSIONS_BY_ROLE } from '../../shared/constants/permissions.constants';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async getPermissionsByRole(role: string, directorType?: string) {
    // 1. Get the authoritative list of permissions for this role from constants
    const roleKey = role.toUpperCase() as keyof typeof PERMISSIONS_BY_ROLE;
    const permissionDefs = PERMISSIONS_BY_ROLE[roleKey] || [];

    if (permissionDefs.length === 0) {
      return { default: [], additional: [] };
    }

    // 2. Filter by directorType (Context) if provided
    // - If a permission has NO directorType, it applies to all.
    // - If it HAS a directorType, it must match the provided type OR 'BOTH' (logic handled by caller/UI usually, but strict here)
    // - Actually, if definition says 'PRIMARY_PRESCHOOL', and user is 'COLLEGE', exclude it.
    const filteredDefs = permissionDefs.filter((def) => {
      if (!def.directorType) return true; // Universal permission
      if (!directorType) return true; // No context provided, show all? Or hide specific? Let's show all if unknown.
      return def.directorType === directorType || directorType === 'BOTH'; // If user is BOTH, they see everything. If permission is PRIMARY, only PRIMARY (or BOTH) see it.
      // Wait, logic:
      // Permission restricted to PRIMARY. User is COLLEGE. User SHOULD NOT see it.
      // Permission restricted to PRIMARY. User is PRIMARY. User Sees it.
      // Permission restricted to PRIMARY. User is BOTH. User Sees it.
    });

    const allowedCodes = filteredDefs.map((d) => d.code);

    // 3. Fetch from DB to ensure validity and get DB IDs (though we could rely on constants if we synced fully)
    // We need DB IDs for the frontend to submit `permissionIds`.
    const dbPermissions = await this.prisma.permissionDefinition.findMany({
      where: {
        code: { in: allowedCodes },
      },
    });

    // 4. Merge DB data with Constant Metadata (Category, Name, IsDefault - source of truth is Constants for logic, DB for IDs)
    const result = filteredDefs
      .map((def) => {
        const dbPerm = dbPermissions.find((p) => p.code === def.code);
        if (!dbPerm) return null; // Skip if not in DB yet (Seed needed)

        return {
          ...dbPerm,
          // Override DB metadata with Constants metadata (ensure up-to-date names/cats without reseeding constantly)
          name: def.name,
          description: def.description,
          category: def.category,
          isDefault: def.isDefault,
        };
      })
      .filter(Boolean); // Remove nulls

    return {
      default: result.filter((p) => p!.isDefault),
      additional: result.filter((p) => !p!.isDefault),
    };
  }

  async getAllPermissions() {
    return this.prisma.permissionDefinition.findMany({
      orderBy: [{ role: 'asc' }, { isDefault: 'desc' }, { category: 'asc' }],
    });
  }
}
