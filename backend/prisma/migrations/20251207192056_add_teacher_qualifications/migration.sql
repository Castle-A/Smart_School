/*
  Warnings:

  - You are about to drop the `_ClassToSubject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to alter the column `coefficient` on the `Subject` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - Added the required column `updatedAt` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_ClassToSubject_B_index";

-- DropIndex
DROP INDEX "_ClassToSubject_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ClassToSubject";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ClassSubject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "classId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "coefficient" REAL NOT NULL DEFAULT 1,
    CONSTRAINT "ClassSubject_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ClassSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "userId" TEXT,
    "schoolId" TEXT,
    "metadata" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    CONSTRAINT "AnalyticsEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AnalyticsEvent_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdminRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "data" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "resolverId" TEXT,
    "schoolId" TEXT NOT NULL,
    "adminComment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AdminRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AdminRequest_resolverId_fkey" FOREIGN KEY ("resolverId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AdminRequest_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StudentComment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StudentComment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StudentComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ClassTeachers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ClassTeachers_A_fkey" FOREIGN KEY ("A") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ClassTeachers_B_fkey" FOREIGN KEY ("B") REFERENCES "SchoolUser" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matricule" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dob" DATETIME NOT NULL,
    "gender" TEXT NOT NULL,
    "address" TEXT,
    "parentName" TEXT,
    "parentPhone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "schoolId" TEXT NOT NULL,
    "classId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Student_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Student_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Student" ("address", "classId", "dob", "firstName", "gender", "id", "lastName", "matricule", "schoolId") SELECT "address", "classId", "dob", "firstName", "gender", "id", "lastName", "matricule", "schoolId" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
CREATE UNIQUE INDEX "Student_matricule_key" ON "Student"("matricule");
CREATE TABLE "new_Subject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "coefficient" REAL NOT NULL DEFAULT 1,
    "cycle" TEXT NOT NULL DEFAULT 'PRIMAIRE',
    "schoolId" TEXT NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Subject_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Subject" ("coefficient", "id", "name", "schoolId") SELECT "coefficient", "id", "name", "schoolId" FROM "Subject";
DROP TABLE "Subject";
ALTER TABLE "new_Subject" RENAME TO "Subject";
CREATE TABLE "new_Teacher" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "contractType" TEXT NOT NULL,
    "hireDate" DATETIME NOT NULL,
    "matricule" TEXT,
    "subjects" TEXT,
    "title" TEXT,
    "diploma" TEXT,
    "specialty" TEXT,
    "photoUrl" TEXT,
    "deletedAt" DATETIME,
    "schoolId" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Teacher_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Teacher" ("contractType", "createdAt", "deletedAt", "email", "firstName", "gender", "hireDate", "id", "lastName", "matricule", "phone", "photoUrl", "schoolId", "subjects", "updatedAt", "userId") SELECT "contractType", "createdAt", "deletedAt", "email", "firstName", "gender", "hireDate", "id", "lastName", "matricule", "phone", "photoUrl", "schoolId", "subjects", "updatedAt", "userId" FROM "Teacher";
DROP TABLE "Teacher";
ALTER TABLE "new_Teacher" RENAME TO "Teacher";
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");
CREATE UNIQUE INDEX "Teacher_matricule_key" ON "Teacher"("matricule");
CREATE UNIQUE INDEX "Teacher_userId_key" ON "Teacher"("userId");
CREATE INDEX "Teacher_schoolId_idx" ON "Teacher"("schoolId");
CREATE INDEX "Teacher_userId_idx" ON "Teacher"("userId");
CREATE INDEX "Teacher_deletedAt_idx" ON "Teacher"("deletedAt");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" TEXT,
    "phone" TEXT,
    "profilePicture" TEXT,
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "loginMethod" TEXT DEFAULT 'email',
    "platformRole" TEXT,
    "termsAcceptedAt" DATETIME,
    "termsVersion" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);
INSERT INTO "new_User" ("createdAt", "deletedAt", "email", "firstName", "gender", "id", "isActive", "lastName", "mustChangePassword", "password", "phone", "platformRole", "profilePicture", "termsAcceptedAt", "termsVersion", "updatedAt") SELECT "createdAt", "deletedAt", "email", "firstName", "gender", "id", "isActive", "lastName", "mustChangePassword", "password", "phone", "platformRole", "profilePicture", "termsAcceptedAt", "termsVersion", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ClassSubject_classId_subjectId_key" ON "ClassSubject"("classId", "subjectId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_type_idx" ON "AnalyticsEvent"("type");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_userId_idx" ON "AnalyticsEvent"("userId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_timestamp_idx" ON "AnalyticsEvent"("timestamp");

-- CreateIndex
CREATE INDEX "AdminRequest_schoolId_idx" ON "AdminRequest"("schoolId");

-- CreateIndex
CREATE INDEX "AdminRequest_status_idx" ON "AdminRequest"("status");

-- CreateIndex
CREATE INDEX "AdminRequest_type_idx" ON "AdminRequest"("type");

-- CreateIndex
CREATE INDEX "StudentComment_studentId_idx" ON "StudentComment"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "_ClassTeachers_AB_unique" ON "_ClassTeachers"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassTeachers_B_index" ON "_ClassTeachers"("B");
