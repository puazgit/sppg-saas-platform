/*
  Warnings:

  - A unique constraint covering the columns `[lookupCode]` on the table `districts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lookupCode]` on the table `provinces` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lookupCode]` on the table `regencies` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lookupCode]` on the table `villages` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."districts" ADD COLUMN     "lookupCode" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "public"."provinces" ADD COLUMN     "lookupCode" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "public"."regencies" ADD COLUMN     "lookupCode" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "public"."villages" ADD COLUMN     "lookupCode" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "districts_lookupCode_key" ON "public"."districts"("lookupCode");

-- CreateIndex
CREATE INDEX "districts_lookupCode_idx" ON "public"."districts"("lookupCode");

-- CreateIndex
CREATE INDEX "districts_code_idx" ON "public"."districts"("code");

-- CreateIndex
CREATE UNIQUE INDEX "provinces_lookupCode_key" ON "public"."provinces"("lookupCode");

-- CreateIndex
CREATE INDEX "provinces_lookupCode_idx" ON "public"."provinces"("lookupCode");

-- CreateIndex
CREATE INDEX "provinces_code_idx" ON "public"."provinces"("code");

-- CreateIndex
CREATE UNIQUE INDEX "regencies_lookupCode_key" ON "public"."regencies"("lookupCode");

-- CreateIndex
CREATE INDEX "regencies_lookupCode_idx" ON "public"."regencies"("lookupCode");

-- CreateIndex
CREATE INDEX "regencies_code_idx" ON "public"."regencies"("code");

-- CreateIndex
CREATE UNIQUE INDEX "villages_lookupCode_key" ON "public"."villages"("lookupCode");

-- CreateIndex
CREATE INDEX "villages_lookupCode_idx" ON "public"."villages"("lookupCode");

-- CreateIndex
CREATE INDEX "villages_code_idx" ON "public"."villages"("code");
