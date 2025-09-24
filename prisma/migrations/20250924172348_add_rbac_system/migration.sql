/*
  Warnings:

  - The values [ON_LEAVE,SICK_LEAVE] on the enum `StaffStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `isSuperAdmin` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `roles` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('SUPERADMIN', 'SPPG_USER');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."StaffStatus_new" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'TERMINATED');
ALTER TABLE "public"."staff" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."staff" ALTER COLUMN "status" TYPE "public"."StaffStatus_new" USING ("status"::text::"public"."StaffStatus_new");
ALTER TYPE "public"."StaffStatus" RENAME TO "StaffStatus_old";
ALTER TYPE "public"."StaffStatus_new" RENAME TO "StaffStatus";
DROP TYPE "public"."StaffStatus_old";
ALTER TABLE "public"."staff" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "isSuperAdmin",
DROP COLUMN "roles",
ADD COLUMN     "userType" "public"."UserType" NOT NULL DEFAULT 'SPPG_USER';

-- CreateTable
CREATE TABLE "public"."roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSystemRole" BOOLEAN NOT NULL DEFAULT false,
    "sppgId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."permissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "module" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_roles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "assignedBy" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."role_permissions" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "roles_sppgId_idx" ON "public"."roles"("sppgId");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_sppgId_key" ON "public"."roles"("name", "sppgId");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "public"."permissions"("name");

-- CreateIndex
CREATE INDEX "permissions_module_idx" ON "public"."permissions"("module");

-- CreateIndex
CREATE INDEX "user_roles_userId_idx" ON "public"."user_roles"("userId");

-- CreateIndex
CREATE INDEX "user_roles_roleId_idx" ON "public"."user_roles"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_userId_roleId_key" ON "public"."user_roles"("userId", "roleId");

-- CreateIndex
CREATE INDEX "role_permissions_roleId_idx" ON "public"."role_permissions"("roleId");

-- CreateIndex
CREATE INDEX "role_permissions_permissionId_idx" ON "public"."role_permissions"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_roleId_permissionId_key" ON "public"."role_permissions"("roleId", "permissionId");

-- CreateIndex
CREATE INDEX "users_userType_idx" ON "public"."users"("userType");

-- AddForeignKey
ALTER TABLE "public"."roles" ADD CONSTRAINT "roles_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "public"."permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
