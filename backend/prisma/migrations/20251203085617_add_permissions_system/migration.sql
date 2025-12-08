/*
  Warnings:

  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cycle` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SchoolUser" ADD COLUMN "deletedAt" DATETIME;
ALTER TABLE "SchoolUser" ADD COLUMN "directorType" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "deletedAt" DATETIME;
ALTER TABLE "User" ADD COLUMN "platformRole" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Permission";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "SupportLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "supportId" TEXT NOT NULL,
    "schoolId" TEXT,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "schoolId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "oldValue" TEXT,
    "newValue" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "contractType" TEXT NOT NULL,
    "hireDate" DATETIME NOT NULL,
    "matricule" TEXT NOT NULL,
    "subjects" TEXT NOT NULL,
    "photoUrl" TEXT,
    "deletedAt" DATETIME,
    "schoolId" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Teacher_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PermissionDefinition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "schoolUserId" TEXT NOT NULL,
    "permissionDefinitionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RolePermission_schoolUserId_fkey" FOREIGN KEY ("schoolUserId") REFERENCES "SchoolUser" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RolePermission_permissionDefinitionId_fkey" FOREIGN KEY ("permissionDefinitionId") REFERENCES "PermissionDefinition" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Class" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "cycle" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "series" TEXT,
    "room" TEXT,
    "capacity" INTEGER NOT NULL DEFAULT 0,
    "schoolId" TEXT NOT NULL,
    "mainTeacherId" TEXT,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Class_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Class_mainTeacherId_fkey" FOREIGN KEY ("mainTeacherId") REFERENCES "SchoolUser" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Class" ("id", "level", "mainTeacherId", "name", "schoolId") SELECT "id", "level", "mainTeacherId", "name", "schoolId" FROM "Class";
DROP TABLE "Class";
ALTER TABLE "new_Class" RENAME TO "Class";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "SupportLog_supportId_idx" ON "SupportLog"("supportId");

-- CreateIndex
CREATE INDEX "SupportLog_schoolId_idx" ON "SupportLog"("schoolId");

-- CreateIndex
CREATE INDEX "SupportLog_createdAt_idx" ON "SupportLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_schoolId_idx" ON "AuditLog"("schoolId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_entity_idx" ON "AuditLog"("entity");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_matricule_key" ON "Teacher"("matricule");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_userId_key" ON "Teacher"("userId");

-- CreateIndex
CREATE INDEX "Teacher_schoolId_idx" ON "Teacher"("schoolId");

-- CreateIndex
CREATE INDEX "Teacher_userId_idx" ON "Teacher"("userId");

-- CreateIndex
CREATE INDEX "Teacher_deletedAt_idx" ON "Teacher"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PermissionDefinition_code_key" ON "PermissionDefinition"("code");

-- CreateIndex
CREATE INDEX "PermissionDefinition_role_idx" ON "PermissionDefinition"("role");

-- CreateIndex
CREATE INDEX "PermissionDefinition_category_idx" ON "PermissionDefinition"("category");

-- CreateIndex
CREATE INDEX "RolePermission_schoolUserId_idx" ON "RolePermission"("schoolUserId");

-- CreateIndex
CREATE INDEX "RolePermission_permissionDefinitionId_idx" ON "RolePermission"("permissionDefinitionId");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_schoolUserId_permissionDefinitionId_key" ON "RolePermission"("schoolUserId", "permissionDefinitionId");
