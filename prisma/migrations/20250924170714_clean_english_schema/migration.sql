/*
  Warnings:

  - You are about to drop the column `alamat` on the `sppg` table. All the data in the column will be lost.
  - You are about to drop the column `desaId` on the `sppg` table. All the data in the column will be lost.
  - You are about to drop the column `deskripsi` on the `sppg` table. All the data in the column will be lost.
  - You are about to drop the column `dibuat` on the `sppg` table. All the data in the column will be lost.
  - You are about to drop the column `diperbarui` on the `sppg` table. All the data in the column will be lost.
  - You are about to drop the column `kabupatenId` on the `sppg` table. All the data in the column will be lost.
  - You are about to drop the column `kecamatanId` on the `sppg` table. All the data in the column will be lost.
  - You are about to drop the column `kode` on the `sppg` table. All the data in the column will be lost.
  - You are about to drop the column `nama` on the `sppg` table. All the data in the column will be lost.
  - You are about to drop the column `provinsiId` on the `sppg` table. All the data in the column will be lost.
  - You are about to drop the column `radiusMaksimal` on the `sppg` table. All the data in the column will be lost.
  - You are about to drop the column `tanggalBerakhirOps` on the `sppg` table. All the data in the column will be lost.
  - You are about to drop the column `tanggalMulaiOps` on the `sppg` table. All the data in the column will be lost.
  - You are about to drop the column `targetPenerima` on the `sppg` table. All the data in the column will be lost.
  - You are about to drop the column `telepon` on the `sppg` table. All the data in the column will be lost.
  - You are about to drop the column `waktuTempuhMaks` on the `sppg` table. All the data in the column will be lost.
  - The `status` column on the `sppg` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `dibuat` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `diperbarui` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `emailTerverifikasi` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `gambarProfil` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `kataSandi` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `nama` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `peran` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `statusAktif` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `telepon` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `terakhirLogin` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `bahan_baku` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `distribusi` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `distribusi_titik` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `langganan_sppg` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `laporan_harian` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `menu` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `operasi_harian` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `planning_menu` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `planning_menu_detail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `procurement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `procurement_detail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `produksi` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `resep_detail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `staf` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stok_log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tagihan_sppg` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `titik_distribusi` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `sppg` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `sppg` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `sppg` table without a default value. This is not possible if the table is not empty.
  - Added the required column `districtId` to the `sppg` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxRadius` to the `sppg` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxTravelTime` to the `sppg` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `sppg` table without a default value. This is not possible if the table is not empty.
  - Added the required column `operationStartDate` to the `sppg` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `sppg` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provinceId` to the `sppg` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regencyId` to the `sppg` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetRecipients` to the `sppg` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `sppg` table without a default value. This is not possible if the table is not empty.
  - Added the required column `villageId` to the `sppg` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."SppgStatus" AS ENUM ('PENDING_APPROVAL', 'ACTIVE', 'SUSPENDED', 'TERMINATED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('TRIAL', 'ACTIVE', 'OVERDUE', 'CANCELLED', 'PAUSED', 'UPGRADE_PENDING');

-- CreateEnum
CREATE TYPE "public"."SubscriptionTier" AS ENUM ('BASIC', 'STANDARD', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "public"."StaffStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'TERMINATED', 'ON_LEAVE', 'SICK_LEAVE');

-- CreateEnum
CREATE TYPE "public"."StaffRole" AS ENUM ('SPPG_MANAGER', 'PRODUCTION_SUPERVISOR', 'HEAD_CHEF', 'ASSISTANT_CHEF', 'DISTRIBUTION_COORDINATOR', 'DRIVER', 'INVENTORY_ADMIN', 'QUALITY_CONTROL', 'FIELD_STAFF');

-- CreateEnum
CREATE TYPE "public"."DistributionPointType" AS ENUM ('ELEMENTARY_SCHOOL', 'MIDDLE_SCHOOL', 'HIGH_SCHOOL', 'VOCATIONAL_SCHOOL', 'SPECIAL_NEEDS_SCHOOL', 'POSYANDU', 'PUSKESMAS', 'COMMUNITY_CENTER', 'ELDERLY_CENTER', 'DAYCARE', 'PLACE_OF_WORSHIP', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'AFTERNOON_SNACK', 'SNACK', 'BEVERAGE', 'SPECIAL_MEAL');

-- CreateEnum
CREATE TYPE "public"."DistributionStatus" AS ENUM ('PLANNED', 'PREPARING', 'IN_TRANSIT', 'DELIVERED', 'RETURNED', 'CANCELLED', 'DELAYED');

-- CreateEnum
CREATE TYPE "public"."OperationStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'POSTPONED', 'EMERGENCY_STOP');

-- CreateEnum
CREATE TYPE "public"."IngredientStatus" AS ENUM ('AVAILABLE', 'OUT_OF_STOCK', 'LOW_STOCK', 'EXPIRED', 'DAMAGED', 'ORDERED');

-- CreateEnum
CREATE TYPE "public"."ProcurementStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'ORDERED', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."Unit" AS ENUM ('KG', 'GRAM', 'LITER', 'ML', 'PCS', 'PACK', 'BOX', 'CARTON');

-- CreateEnum
CREATE TYPE "public"."MenuCategory" AS ENUM ('STAPLE_FOOD', 'SIDE_DISH', 'VEGETABLES', 'FRUITS', 'BEVERAGES', 'DESSERT');

-- DropForeignKey
ALTER TABLE "public"."bahan_baku" DROP CONSTRAINT "bahan_baku_sppgId_fkey";

-- DropForeignKey
ALTER TABLE "public"."distribusi" DROP CONSTRAINT "distribusi_menuId_fkey";

-- DropForeignKey
ALTER TABLE "public"."distribusi" DROP CONSTRAINT "distribusi_operasiId_fkey";

-- DropForeignKey
ALTER TABLE "public"."distribusi_titik" DROP CONSTRAINT "distribusi_titik_distribusiId_fkey";

-- DropForeignKey
ALTER TABLE "public"."distribusi_titik" DROP CONSTRAINT "distribusi_titik_titikDistribusiId_fkey";

-- DropForeignKey
ALTER TABLE "public"."langganan_sppg" DROP CONSTRAINT "langganan_sppg_sppgId_fkey";

-- DropForeignKey
ALTER TABLE "public"."laporan_harian" DROP CONSTRAINT "laporan_harian_sppgId_fkey";

-- DropForeignKey
ALTER TABLE "public"."menu" DROP CONSTRAINT "menu_sppgId_fkey";

-- DropForeignKey
ALTER TABLE "public"."operasi_harian" DROP CONSTRAINT "operasi_harian_sppgId_fkey";

-- DropForeignKey
ALTER TABLE "public"."operasi_harian" DROP CONSTRAINT "operasi_harian_supervisorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."planning_menu" DROP CONSTRAINT "planning_menu_sppgId_fkey";

-- DropForeignKey
ALTER TABLE "public"."planning_menu_detail" DROP CONSTRAINT "planning_menu_detail_menuId_fkey";

-- DropForeignKey
ALTER TABLE "public"."planning_menu_detail" DROP CONSTRAINT "planning_menu_detail_planningId_fkey";

-- DropForeignKey
ALTER TABLE "public"."procurement" DROP CONSTRAINT "procurement_sppgId_fkey";

-- DropForeignKey
ALTER TABLE "public"."procurement_detail" DROP CONSTRAINT "procurement_detail_bahanBakuId_fkey";

-- DropForeignKey
ALTER TABLE "public"."procurement_detail" DROP CONSTRAINT "procurement_detail_procurementId_fkey";

-- DropForeignKey
ALTER TABLE "public"."produksi" DROP CONSTRAINT "produksi_menuId_fkey";

-- DropForeignKey
ALTER TABLE "public"."produksi" DROP CONSTRAINT "produksi_operasiId_fkey";

-- DropForeignKey
ALTER TABLE "public"."resep_detail" DROP CONSTRAINT "resep_detail_bahanBakuId_fkey";

-- DropForeignKey
ALTER TABLE "public"."resep_detail" DROP CONSTRAINT "resep_detail_menuId_fkey";

-- DropForeignKey
ALTER TABLE "public"."staf" DROP CONSTRAINT "staf_sppgId_fkey";

-- DropForeignKey
ALTER TABLE "public"."stok_log" DROP CONSTRAINT "stok_log_bahanBakuId_fkey";

-- DropForeignKey
ALTER TABLE "public"."stok_log" DROP CONSTRAINT "stok_log_sppgId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tagihan_sppg" DROP CONSTRAINT "tagihan_sppg_sppgId_fkey";

-- DropForeignKey
ALTER TABLE "public"."titik_distribusi" DROP CONSTRAINT "titik_distribusi_sppgId_fkey";

-- DropIndex
DROP INDEX "public"."sppg_kode_key";

-- DropIndex
DROP INDEX "public"."sppg_provinsiId_kabupatenId_idx";

-- AlterTable
ALTER TABLE "public"."sppg" DROP COLUMN "alamat",
DROP COLUMN "desaId",
DROP COLUMN "deskripsi",
DROP COLUMN "dibuat",
DROP COLUMN "diperbarui",
DROP COLUMN "kabupatenId",
DROP COLUMN "kecamatanId",
DROP COLUMN "kode",
DROP COLUMN "nama",
DROP COLUMN "provinsiId",
DROP COLUMN "radiusMaksimal",
DROP COLUMN "tanggalBerakhirOps",
DROP COLUMN "tanggalMulaiOps",
DROP COLUMN "targetPenerima",
DROP COLUMN "telepon",
DROP COLUMN "waktuTempuhMaks",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "districtId" TEXT NOT NULL,
ADD COLUMN     "maxRadius" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "maxTravelTime" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "operationEndDate" TIMESTAMP(3),
ADD COLUMN     "operationStartDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "provinceId" TEXT NOT NULL,
ADD COLUMN     "regencyId" TEXT NOT NULL,
ADD COLUMN     "targetRecipients" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "villageId" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."SppgStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "dibuat",
DROP COLUMN "diperbarui",
DROP COLUMN "emailTerverifikasi",
DROP COLUMN "gambarProfil",
DROP COLUMN "kataSandi",
DROP COLUMN "nama",
DROP COLUMN "peran",
DROP COLUMN "statusAktif",
DROP COLUMN "telepon",
DROP COLUMN "terakhirLogin",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "profileImage" TEXT,
ADD COLUMN     "roles" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "public"."bahan_baku";

-- DropTable
DROP TABLE "public"."distribusi";

-- DropTable
DROP TABLE "public"."distribusi_titik";

-- DropTable
DROP TABLE "public"."langganan_sppg";

-- DropTable
DROP TABLE "public"."laporan_harian";

-- DropTable
DROP TABLE "public"."menu";

-- DropTable
DROP TABLE "public"."operasi_harian";

-- DropTable
DROP TABLE "public"."planning_menu";

-- DropTable
DROP TABLE "public"."planning_menu_detail";

-- DropTable
DROP TABLE "public"."procurement";

-- DropTable
DROP TABLE "public"."procurement_detail";

-- DropTable
DROP TABLE "public"."produksi";

-- DropTable
DROP TABLE "public"."resep_detail";

-- DropTable
DROP TABLE "public"."staf";

-- DropTable
DROP TABLE "public"."stok_log";

-- DropTable
DROP TABLE "public"."tagihan_sppg";

-- DropTable
DROP TABLE "public"."titik_distribusi";

-- DropEnum
DROP TYPE "public"."JenisKelamin";

-- DropEnum
DROP TYPE "public"."JenisMakanan";

-- DropEnum
DROP TYPE "public"."JenisTitikDistribusi";

-- DropEnum
DROP TYPE "public"."KategoriMenu";

-- DropEnum
DROP TYPE "public"."PeranStaf";

-- DropEnum
DROP TYPE "public"."SatuanUkuran";

-- DropEnum
DROP TYPE "public"."StatusBahanBaku";

-- DropEnum
DROP TYPE "public"."StatusDistribusi";

-- DropEnum
DROP TYPE "public"."StatusLangganan";

-- DropEnum
DROP TYPE "public"."StatusOperasi";

-- DropEnum
DROP TYPE "public"."StatusPembayaran";

-- DropEnum
DROP TYPE "public"."StatusProcurement";

-- DropEnum
DROP TYPE "public"."StatusSPPG";

-- DropEnum
DROP TYPE "public"."StatusStaf";

-- DropEnum
DROP TYPE "public"."TierLangganan";

-- CreateTable
CREATE TABLE "public"."subscriptions" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "tier" "public"."SubscriptionTier" NOT NULL,
    "status" "public"."SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "billingDate" TIMESTAMP(3) NOT NULL,
    "maxRecipients" INTEGER NOT NULL,
    "maxStaff" INTEGER NOT NULL,
    "maxDistributionPoints" INTEGER NOT NULL,
    "storageGb" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."staff" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "employeeId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "birthDate" TIMESTAMP(3),
    "gender" "public"."Gender" NOT NULL,
    "role" "public"."StaffRole" NOT NULL,
    "department" TEXT,
    "hireDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "terminationDate" TIMESTAMP(3),
    "status" "public"."StaffStatus" NOT NULL DEFAULT 'ACTIVE',
    "salary" DOUBLE PRECISION,
    "haccpCertified" BOOLEAN NOT NULL DEFAULT false,
    "halalCertified" BOOLEAN NOT NULL DEFAULT false,
    "specialSkills" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."distribution_points" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."DistributionPointType" NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "contactPersonName" TEXT NOT NULL,
    "contactPersonPhone" TEXT NOT NULL,
    "contactPersonEmail" TEXT,
    "dailyPortions" INTEGER NOT NULL,
    "operatingDays" TEXT NOT NULL,
    "deliveryTime" TEXT NOT NULL,
    "specialNeeds" TEXT,
    "accessNotes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "distribution_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."menus" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."MealType" NOT NULL,
    "category" "public"."MenuCategory" NOT NULL,
    "caloriesPerServing" DOUBLE PRECISION NOT NULL,
    "proteinGrams" DOUBLE PRECISION NOT NULL,
    "fatGrams" DOUBLE PRECISION NOT NULL,
    "carbohydrateGrams" DOUBLE PRECISION NOT NULL,
    "fiberGrams" DOUBLE PRECISION NOT NULL,
    "sodiumMg" DOUBLE PRECISION,
    "sugarGrams" DOUBLE PRECISION,
    "saturatedFatGrams" DOUBLE PRECISION,
    "costPerServing" DOUBLE PRECISION NOT NULL,
    "preparationTimeMinutes" INTEGER NOT NULL,
    "servingsPerBatch" INTEGER NOT NULL,
    "difficultyLevel" TEXT,
    "isHalal" BOOLEAN NOT NULL DEFAULT true,
    "isVegetarian" BOOLEAN NOT NULL DEFAULT false,
    "isGlutenFree" BOOLEAN NOT NULL DEFAULT false,
    "allergenInfo" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "specialInstructions" TEXT,
    "presentationTips" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."daily_operations" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "status" "public"."OperationStatus" NOT NULL,
    "plannedPortions" INTEGER NOT NULL,
    "producedPortions" INTEGER NOT NULL,
    "distributedPortions" INTEGER NOT NULL,
    "staffPresent" INTEGER NOT NULL,
    "menusServed" TEXT[],
    "weather" TEXT,
    "notes" TEXT,
    "costPerServing" DOUBLE PRECISION,
    "totalCost" DOUBLE PRECISION,
    "supervisorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_operations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."productions" (
    "id" TEXT NOT NULL,
    "operationId" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "batchCount" INTEGER NOT NULL,
    "servingsPerBatch" INTEGER NOT NULL,
    "totalServings" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "qualityCheck" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "productions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."distributions" (
    "id" TEXT NOT NULL,
    "operationId" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "vehicleId" TEXT,
    "driverId" TEXT,
    "plannedQuantity" INTEGER NOT NULL,
    "deliveredQuantity" INTEGER NOT NULL,
    "departureTime" TIMESTAMP(3),
    "arrivalTime" TIMESTAMP(3),
    "status" "public"."DistributionStatus" NOT NULL,
    "receivedByPIC" TEXT,
    "deliveryTemperature" DOUBLE PRECISION,
    "qualityNotes" TEXT,
    "distributionNotes" TEXT,
    "returnedQuantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "distributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."delivery_points" (
    "id" TEXT NOT NULL,
    "distributionId" TEXT NOT NULL,
    "distributionPointId" TEXT NOT NULL,
    "portionCount" INTEGER NOT NULL,
    "deliveryTime" TIMESTAMP(3),
    "receptionStatus" TEXT NOT NULL,
    "recipientNotes" TEXT,

    CONSTRAINT "delivery_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ingredients" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "primaryUnit" "public"."Unit" NOT NULL,
    "purchaseUnit" "public"."Unit" NOT NULL,
    "conversionFactor" DOUBLE PRECISION NOT NULL,
    "minStock" INTEGER NOT NULL,
    "maxStock" INTEGER NOT NULL,
    "currentStock" INTEGER NOT NULL DEFAULT 0,
    "status" "public"."IngredientStatus" NOT NULL DEFAULT 'AVAILABLE',
    "averagePrice" DOUBLE PRECISION,
    "lastPrice" DOUBLE PRECISION,
    "primarySupplier" TEXT,
    "shelfLifeDays" INTEGER,
    "specialRequirements" TEXT,
    "storageNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."recipe_details" (
    "id" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" "public"."Unit" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipe_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."procurements" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "poNumber" TEXT NOT NULL,
    "poDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requiredDate" TIMESTAMP(3) NOT NULL,
    "supplierName" TEXT NOT NULL,
    "supplierContact" TEXT NOT NULL,
    "status" "public"."ProcurementStatus" NOT NULL DEFAULT 'DRAFT',
    "estimatedTotal" DOUBLE PRECISION,
    "actualTotal" DOUBLE PRECISION,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "approvedBy" TEXT,
    "approvalDate" TIMESTAMP(3),
    "approvalNotes" TEXT,
    "shipmentDate" TIMESTAMP(3),
    "receivedDate" TIMESTAMP(3),
    "receptionNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "procurements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."procurement_details" (
    "id" TEXT NOT NULL,
    "procurementId" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "orderedQuantity" DOUBLE PRECISION NOT NULL,
    "receivedQuantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unit" "public"."Unit" NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "batchNumber" TEXT,
    "qualityCheck" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "procurement_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."stock_logs" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "transactionType" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" "public"."Unit" NOT NULL,
    "stockBefore" DOUBLE PRECISION NOT NULL,
    "stockAfter" DOUBLE PRECISION NOT NULL,
    "referenceId" TEXT,
    "referenceType" TEXT,
    "notes" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."menu_plannings" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "targetCalories" DOUBLE PRECISION,
    "targetProtein" DOUBLE PRECISION,
    "budgetPerServing" DOUBLE PRECISION,
    "specialNotes" TEXT,
    "approvedBy" TEXT,
    "approvalDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_plannings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."menu_planning_details" (
    "id" TEXT NOT NULL,
    "planningId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "mealType" "public"."MealType" NOT NULL,
    "menuId" TEXT NOT NULL,
    "servingCount" INTEGER NOT NULL,

    CONSTRAINT "menu_planning_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."invoices" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "baseAmount" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "invoiceDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidDate" TIMESTAMP(3),
    "paymentMethod" TEXT,
    "paymentReference" TEXT,
    "paymentNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."daily_reports" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "totalMenusProduced" INTEGER NOT NULL,
    "totalServingsProduced" INTEGER NOT NULL,
    "totalProductionCost" DOUBLE PRECISION NOT NULL,
    "productionEfficiency" DOUBLE PRECISION,
    "totalDistributionPoints" INTEGER NOT NULL,
    "totalServingsDistributed" INTEGER NOT NULL,
    "deliverySuccessRate" DOUBLE PRECISION,
    "staffPresentCount" INTEGER NOT NULL,
    "operationalHours" DOUBLE PRECISION NOT NULL,
    "specialNotes" TEXT,
    "weatherCondition" TEXT,
    "complaintCount" INTEGER NOT NULL DEFAULT 0,
    "satisfactionRating" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_sppgId_key" ON "public"."subscriptions"("sppgId");

-- CreateIndex
CREATE UNIQUE INDEX "staff_email_key" ON "public"."staff"("email");

-- CreateIndex
CREATE INDEX "staff_sppgId_status_idx" ON "public"."staff"("sppgId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "staff_sppgId_employeeId_key" ON "public"."staff"("sppgId", "employeeId");

-- CreateIndex
CREATE INDEX "distribution_points_sppgId_type_isActive_idx" ON "public"."distribution_points"("sppgId", "type", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "distribution_points_sppgId_code_key" ON "public"."distribution_points"("sppgId", "code");

-- CreateIndex
CREATE INDEX "menus_sppgId_type_isActive_idx" ON "public"."menus"("sppgId", "type", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "menus_sppgId_code_key" ON "public"."menus"("sppgId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "daily_operations_sppgId_date_key" ON "public"."daily_operations"("sppgId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "delivery_points_distributionId_distributionPointId_key" ON "public"."delivery_points"("distributionId", "distributionPointId");

-- CreateIndex
CREATE INDEX "ingredients_sppgId_status_idx" ON "public"."ingredients"("sppgId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ingredients_sppgId_code_key" ON "public"."ingredients"("sppgId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_details_menuId_ingredientId_key" ON "public"."recipe_details"("menuId", "ingredientId");

-- CreateIndex
CREATE INDEX "procurements_sppgId_status_idx" ON "public"."procurements"("sppgId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "procurements_sppgId_poNumber_key" ON "public"."procurements"("sppgId", "poNumber");

-- CreateIndex
CREATE INDEX "stock_logs_sppgId_ingredientId_idx" ON "public"."stock_logs"("sppgId", "ingredientId");

-- CreateIndex
CREATE INDEX "stock_logs_createdAt_idx" ON "public"."stock_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "menu_plannings_sppgId_weekNumber_month_year_key" ON "public"."menu_plannings"("sppgId", "weekNumber", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "menu_planning_details_planningId_dayOfWeek_mealType_key" ON "public"."menu_planning_details"("planningId", "dayOfWeek", "mealType");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNumber_key" ON "public"."invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "invoices_sppgId_period_idx" ON "public"."invoices"("sppgId", "period");

-- CreateIndex
CREATE INDEX "invoices_status_dueDate_idx" ON "public"."invoices"("status", "dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "daily_reports_sppgId_date_key" ON "public"."daily_reports"("sppgId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "sppg_code_key" ON "public"."sppg"("code");

-- CreateIndex
CREATE INDEX "sppg_status_idx" ON "public"."sppg"("status");

-- CreateIndex
CREATE INDEX "sppg_provinceId_regencyId_idx" ON "public"."sppg"("provinceId", "regencyId");

-- AddForeignKey
ALTER TABLE "public"."subscriptions" ADD CONSTRAINT "subscriptions_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."staff" ADD CONSTRAINT "staff_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."distribution_points" ADD CONSTRAINT "distribution_points_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."menus" ADD CONSTRAINT "menus_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."daily_operations" ADD CONSTRAINT "daily_operations_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."daily_operations" ADD CONSTRAINT "daily_operations_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "public"."staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."productions" ADD CONSTRAINT "productions_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "public"."daily_operations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."productions" ADD CONSTRAINT "productions_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "public"."menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."distributions" ADD CONSTRAINT "distributions_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "public"."daily_operations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."distributions" ADD CONSTRAINT "distributions_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "public"."menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."delivery_points" ADD CONSTRAINT "delivery_points_distributionId_fkey" FOREIGN KEY ("distributionId") REFERENCES "public"."distributions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."delivery_points" ADD CONSTRAINT "delivery_points_distributionPointId_fkey" FOREIGN KEY ("distributionPointId") REFERENCES "public"."distribution_points"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ingredients" ADD CONSTRAINT "ingredients_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recipe_details" ADD CONSTRAINT "recipe_details_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "public"."menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recipe_details" ADD CONSTRAINT "recipe_details_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "public"."ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."procurements" ADD CONSTRAINT "procurements_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."procurement_details" ADD CONSTRAINT "procurement_details_procurementId_fkey" FOREIGN KEY ("procurementId") REFERENCES "public"."procurements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."procurement_details" ADD CONSTRAINT "procurement_details_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "public"."ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."stock_logs" ADD CONSTRAINT "stock_logs_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."stock_logs" ADD CONSTRAINT "stock_logs_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "public"."ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."menu_plannings" ADD CONSTRAINT "menu_plannings_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."menu_planning_details" ADD CONSTRAINT "menu_planning_details_planningId_fkey" FOREIGN KEY ("planningId") REFERENCES "public"."menu_plannings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."menu_planning_details" ADD CONSTRAINT "menu_planning_details_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "public"."menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoices" ADD CONSTRAINT "invoices_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."daily_reports" ADD CONSTRAINT "daily_reports_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;
