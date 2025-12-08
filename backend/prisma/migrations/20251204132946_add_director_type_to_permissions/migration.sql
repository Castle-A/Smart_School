-- AlterTable
ALTER TABLE "PermissionDefinition" ADD COLUMN "directorType" TEXT;

-- CreateIndex
CREATE INDEX "PermissionDefinition_directorType_idx" ON "PermissionDefinition"("directorType");
