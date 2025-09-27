/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `marketing_case_studies` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `marketing_hero_features` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[label]` on the table `marketing_trust_indicators` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organizationType` to the `sppg` table without a default value. This is not possible if the table is not empty.
  - Added the required column `picEmail` to the `sppg` table without a default value. This is not possible if the table is not empty.
  - Added the required column `picName` to the `sppg` table without a default value. This is not possible if the table is not empty.
  - Added the required column `picPhone` to the `sppg` table without a default value. This is not possible if the table is not empty.
  - Added the required column `picPosition` to the `sppg` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."OrganizationType" AS ENUM ('PEMERINTAH', 'SWASTA', 'YAYASAN', 'KOMUNITAS', 'LAINNYA');

-- AlterTable
ALTER TABLE "public"."sppg" ADD COLUMN     "establishedYear" INTEGER,
ADD COLUMN     "organizationType" "public"."OrganizationType" NOT NULL,
ADD COLUMN     "picEmail" TEXT NOT NULL,
ADD COLUMN     "picName" TEXT NOT NULL,
ADD COLUMN     "picPhone" TEXT NOT NULL,
ADD COLUMN     "picPosition" TEXT NOT NULL,
ADD COLUMN     "picWhatsapp" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "marketing_case_studies_title_key" ON "public"."marketing_case_studies"("title");

-- CreateIndex
CREATE UNIQUE INDEX "marketing_hero_features_title_key" ON "public"."marketing_hero_features"("title");

-- CreateIndex
CREATE UNIQUE INDEX "marketing_trust_indicators_label_key" ON "public"."marketing_trust_indicators"("label");
