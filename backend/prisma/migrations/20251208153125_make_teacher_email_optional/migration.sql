-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Teacher" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
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
