# Permission System Documentation

## Overview

The SmartSchool application uses a role-based permission system where each user's capabilities are determined by their role and explicitly assigned permissions.

## Architecture

### Database Schema

```
User
 └── SchoolUser (links user to school with a role)
      ├── role: FOUNDER | DIRECTOR | SECRETARY | CENSOR | SUPERVISOR | ACCOUNTANT | TEACHER
      └── RolePermission[] (many-to-many)
           └── PermissionDefinition
                ├── code: string (e.g., "teachers.view")
                ├── name: string (display name)
                ├── description: string
                ├── category: string
                └── isDefault: boolean
```

### Permission Definitions

All available permissions are defined in: [`permissions.constants.ts`](file:///c:/Users/Leroi/.gemini/antigravity/playground/shining-universe/backend/src/shared/constants/permissions.constants.ts)

Permissions are organized by role:
- **DIRECTOR**: 18 permissions (admin, staff management, oversight)
- **SECRETARY**: 10 permissions (student enrollment, documents)
- **CENSOR**: 10 permissions (curriculum, exams, teacher management)
- **SUPERVISOR**: 7 permissions (discipline, attendance)
- **ACCOUNTANT**: 8 permissions (finance, cashier, payroll)
- **FOUNDER**: ALL permissions (super admin - all of the above)

Total unique permissions: **48**

## Permission Loading

### Repository Methods

All user-fetching methods in [`prisma-auth.repository.ts`](file:///c:/Users/Leroi/.gemini/antigravity/playground/shining-universe/backend/src/infrastructure/auth/prisma-auth.repository.ts) **must** include `rolePermissions`:

```typescript
include: {
    schoolUsers: {
        include: {
            school: { select: { name: true } },
            rolePermissions: {
                include: {
                    permissionDefinition: true
                }
            }
        }
    }
}
```

**Methods that load permissions:**
- ✅ `findByEmail` - for email-based queries
- ✅ `findByIdentifier` - used during login
- ✅ `findById` - used in services
- ✅ `create` - when creating new users
- ✅ `update` - when updating users

### Conversion to Domain

The `toDomain` helper extracts permission codes:

```typescript
const permissions = schoolUser?.rolePermissions?.map(
    (rp: any) => rp.permissionDefinition.code
) || [];
```

**Validation**: If permissions aren't loaded, a warning is logged to the console.

## Authentication Flow

### 1. Login

User logs in → `findByIdentifier` loads user with permissions → JWT created with permissions array

### 2. JWT Payload

```typescript
{
    sub: userId,
    email: "user@example.com",
    role: "DIRECTOR",
    permissions: ["students.view", "students.edit", ...],
    // ... other fields
}
```

**Validation**: Warning logged if permissions array is empty for non-TEACHER roles.

### 3. Request Authorization

Every protected endpoint:
1. JWT verified → `req.user` populated with payload
2. If `@RequirePermissions(...)` decorator present → `PermissionsGuard` checks
3. Guard verifies `req.user.permissions` contains required permissions

## Permission Assignment

### During Registration (Founder)

When a founder registers via [`auth.service.ts`](file:///c:/Users/Leroi/.gemini/antigravity/playground/shining-universe/backend/src/application/auth/auth.service.ts#L136-L219):

1. School created
2. User created
3. SchoolUser created with `role: 'FOUNDER'`
4. **ALL permissions assigned** (from all role constants)

### During User Creation (Other Roles)

When admins create staff members:

1. User created
2. SchoolUser created with specific role
3. **Default permissions for that role** assigned automatically

## Maintenance Scripts

### Audit All Permissions

Check if all users have correct permissions:

```bash
cd backend
npx tsx prisma/audit-all-permissions.ts
```

**Output:**
- Lists all users with their assigned vs. expected permissions
- Reports missing permissions
- Groups results by role

### Fix Missing Permissions

Automatically assign missing permissions to all users:

```bash
cd backend
npx tsx prisma/fix-all-permissions.ts
```

**Safe to run multiple times** - uses `skipDuplicates: true`

### Seed Permissions

Populate permission definitions on fresh database:

```bash
cd backend
npx prisma db seed
```

## Troubleshooting

### Issue: "Missing required permissions" error in frontend

**Symptoms:**
- User sees red error banners
- Cannot access certain features

**Diagnosis:**
1. Check backend logs for permission warnings:
   ```
   ⚠️ User email@example.com (DIRECTOR) has no permissions!
   ```

2. Run audit script:
   ```bash
   npx tsx prisma/audit-all-permissions.ts
   ```

**Solutions:**

1. **User needs to re-login**
   - JWT is cached with old permissions
   - Logout → Login refreshes the token

2. **Permissions not in database**
   ```bash
   npx tsx prisma/fix-all-permissions.ts
   ```

3. **Repository method not loading permissions**
   - Check the method includes `rolePermissions` in `include`
   - Review console warnings

### Issue: New permission not working

**Steps:**

1. Add permission to [`permissions.constants.ts`](file:///c:/Users/Leroi/.gemini/antigravity/playground/shining-universe/backend/src/shared/constants/permissions.constants.ts)

2. Run seed or fix script:
   ```bash
   npx tsx prisma/fix-all-permissions.ts
   ```

3. Users must re-login to get updated JWT

### Issue: Repository method returns empty permissions

**Check:**
1. Does the Prisma query include `rolePermissions`?
2. Is the `toDomain` method called on the result?
3. Check console for warnings

## Best Practices

### 1. Always Load Permissions

When querying users, **always** include `rolePermissions` relationship.

### 2. Use Constants

Never hardcode permission strings. Always use constants:

```typescript
import { DIRECTOR_PERMISSIONS } from '@/shared/constants/permissions.constants';
```

### 3. Validate on Login

Check that JWT payload contains permissions before issuing token.

### 4. Run Audits Regularly

Especially after:
- Database migrations
- Permission system changes
- User import operations

### 5. Document New Permissions

When adding permissions, update:
- `permissions.constants.ts`
- This documentation
- Frontend permission guards

## Security Considerations

### 1. Permission Bypass

**FOUNDER** and **SUPER_ADMIN_PLATFORM** roles bypass all permission checks.

### 2. JWT Expiration

Permissions are locked in JWT until expiration. Users must re-login to get updated permissions.

### 3. Database-Level Security

No database constraints enforce permissions - this is application-level only.

## Monitoring

### Logs to Watch

**Warning Signs:**
```
⚠️ [PrismaAuthRepository] User ... rolePermissions not included in query
⚠️ User ... has no permissions! This may cause authorization issues
```

**Good Signs:**
```
User user@example.com authenticated with 18 permission(s)
```

## Testing

To test permissions for a role:

1. Create test user with specific role
2. Login and check JWT payload
3. Verify permissions array is populated
4. Test access to protected routes
5. Check no "Missing required permissions" errors

## Maintenance Checklist

- [ ] Run permission audit monthly
- [ ] Check logs for permission warnings weekly
- [ ] After any migration, verify permissions with audit script
- [ ] Document new permissions as they're added
- [ ] Test new roles with all expected permissions
