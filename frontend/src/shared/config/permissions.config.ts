export const ROLES = {
    DIRECTOR: 'DIRECTOR',
    SECRETARY: 'SECRETARY',
    CENSEUR: 'CENSEUR',
    SURVEILLANT: 'SURVEILLANT',
    ACCOUNTANT: 'ACCOUNTANT',
} as const;

export type Role = keyof typeof ROLES;

export const DIRECTOR_TYPES = {
    PRIMARY_PRESCHOOL: 'PRIMARY_PRESCHOOL',
    COLLEGE: 'COLLEGE',
    BOTH: 'BOTH',
} as const;

export type DirectorType = keyof typeof DIRECTOR_TYPES;

export const PERMISSION_CATEGORIES = {
    STUDENTS: 'students',
    FINANCE: 'finance',
    DISCIPLINE: 'discipline',
    ACADEMICS: 'academics',
    COMMUNICATION: 'communication',
    REPORTS: 'reports',
    SCHEDULE: 'schedule',
    STAFF: 'staff',
} as const;

export interface PermissionDefinition {
    code: string;
    name: string;
    description: string;
    category: string;
    isDefault: boolean;
    // Frontend compatibility
    id?: string;
}

// Helper to ensure frontend ID compatibility if needed, though we should use 'code' or 'id' from backend (backend uses 'id' from DB, but here we define capabilities by code/name.
// Wait, the backend actually looks up permissions by ID in `MemberService`.
// The frontend *must* send permission IDs that exist in the database, OR permissions codes if the API supports it.
// Looking at MembersService.ts: `dto.permissionIds`. It expects UUIDs.
// BUT, the `PermissionsChecklist` displays *definitions*. It doesn't know the DB IDs.
// PROBLEM: The frontend config file defines permissions with static IDs? No, the previous file had 'p1', 'p2'. These are NOT database IDs.
// If I send 'p1' to the backend, it will fail because uuid validation or lookup will fail.
// Backend `MembersService` logic:
// `if (dto.permissionIds) { permissionsToAssign = dto.permissionIds }`
// The backend expects valid DB UUIDs.
//
// CRITICAL FIX: The frontend CANNOT know the DB IDs unless it fetches them from the API.
// We should probably change the logic to:
// 1. Frontend fetches available permissions from an API endpoint (e.g. `GET /permissions`).
// 2. OR, Frontend sends *codes* (e.g. `teachers.view`) and the Backend resolves them.
//
// Looking at `MembersService` again (Step 175):
// It calculates default permissions via `getDefaultPermissionsForRole` -> `defaultCodes`.
// Then it does `prisma.permissionDefinition.findMany({ where: { code: { in: defaultCodes } } })`.
//
// If I want the frontend to allow custom selection, the frontend needs to know the DB IDs.
// The `PermissionsChecklist.tsx` currently uses local config. This is BROKEN if it sends those local IDs.
//
// Refined Plan:
// The User wants the UI to work. "montre tous les permission et macth les avec le backend".
// I should update `CreateMemberPage` to FETCH permissions from the backend instead of using a hardcoded config file.
// OR, I can update the backend `createMember` to accept `permissionCodes` instead of `permissionIds`.
//
// Let's check `MembersController` or `CreateMemberDto`.
// If I can't change the DTO easily or if it breaks other things, fetching is safer.
//
// Wait, does `/permissions` endpoint exist?
// Logs check (Step 169): `Mapped {/permissions, GET} route`.
// Let's check what `GET /permissions` returns.
//
// Implementation Shift:
// 1. `PermissionsChecklist` should fetch permissions from `GET /permissions`.
// 2. It should assume the backend returns the full list with `isDefault` flags or I match them with local logic?
//
// Let's check `PermissionsController` first.

