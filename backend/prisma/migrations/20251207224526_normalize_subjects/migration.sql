/*
  Warnings:

  - You are about to drop the `_SubjectTeacher` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `Teacher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `subjects` on the `Teacher` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "_SubjectTeacher_B_index";

-- DropIndex
DROP INDEX "_SubjectTeacher_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_SubjectTeacher";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_SubjectToTeacher" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_SubjectToTeacher_A_fkey" FOREIGN KEY ("A") REFERENCES "Subject" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SubjectToTeacher_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Teacher" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "contractType" TEXT NOT NULL,
    "hireDate" DATETIME NOT NULL,
    "matricule" TEXT,
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
INSERT INTO "new_Teacher" ("contractType", "createdAt", "deletedAt", "diploma", "email", "firstName", "gender", "hireDate", "id", "lastName", "matricule", "phone", "photoUrl", "schoolId", "specialty", "title", "updatedAt", "userId") SELECT "contractType", "createdAt", "deletedAt", "diploma", "email", "firstName", "gender", "hireDate", "id", "lastName", "matricule", "phone", "photoUrl", "schoolId", "specialty", "title", "updatedAt", "userId" FROM "Teacher";
DROP TABLE "Teacher";
ALTER TABLE "new_Teacher" RENAME TO "Teacher";
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");
CREATE UNIQUE INDEX "Teacher_matricule_key" ON "Teacher"("matricule");
CREATE UNIQUE INDEX "Teacher_userId_key" ON "Teacher"("userId");
CREATE INDEX "Teacher_schoolId_idx" ON "Teacher"("schoolId");
CREATE INDEX "Teacher_userId_idx" ON "Teacher"("userId");
CREATE INDEX "Teacher_deletedAt_idx" ON "Teacher"("deletedAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_SubjectToTeacher_AB_unique" ON "_SubjectToTeacher"("A", "B");

-- CreateIndex
CREATE INDEX "_SubjectToTeacher_B_index" ON "_SubjectToTeacher"("B");
