-- CreateEnum
CREATE TYPE "public"."SupplierStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLACKLISTED', 'PENDING_APPROVAL');

-- CreateEnum
CREATE TYPE "public"."QualityCheckStatus" AS ENUM ('PASSED', 'FAILED', 'CONDITIONAL', 'PENDING');

-- CreateEnum
CREATE TYPE "public"."AdjustmentType" AS ENUM ('INCREASE', 'DECREASE', 'TRANSFER', 'DAMAGED', 'EXPIRED', 'LOST', 'COUNT_ADJUSTMENT');

-- AlterTable
ALTER TABLE "public"."procurements" ADD COLUMN     "supplierId" TEXT;

-- CreateTable
CREATE TABLE "public"."suppliers" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "taxId" TEXT,
    "businessLicense" TEXT,
    "bankAccount" TEXT,
    "paymentTerms" TEXT,
    "status" "public"."SupplierStatus" NOT NULL DEFAULT 'PENDING_APPROVAL',
    "rating" DOUBLE PRECISION,
    "totalOrders" INTEGER NOT NULL DEFAULT 0,
    "totalValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "halalCertified" BOOLEAN NOT NULL DEFAULT false,
    "haccpCertified" BOOLEAN NOT NULL DEFAULT false,
    "certificationDocs" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."supplier_evaluations" (
    "id" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "evaluatedBy" TEXT NOT NULL,
    "qualityRating" INTEGER NOT NULL,
    "deliveryRating" INTEGER NOT NULL,
    "serviceRating" INTEGER NOT NULL,
    "priceRating" INTEGER NOT NULL,
    "overallRating" DOUBLE PRECISION NOT NULL,
    "strengths" TEXT,
    "weaknesses" TEXT,
    "recommendations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "supplier_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."inventory_adjustments" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "adjustmentType" "public"."AdjustmentType" NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" "public"."Unit" NOT NULL,
    "reason" TEXT NOT NULL,
    "quantityBefore" DOUBLE PRECISION NOT NULL,
    "quantityAfter" DOUBLE PRECISION NOT NULL,
    "adjustedBy" TEXT NOT NULL,
    "approvedBy" TEXT,
    "approvalDate" TIMESTAMP(3),
    "referenceType" TEXT,
    "referenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quality_checks" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "checkType" TEXT NOT NULL,
    "checkDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkedBy" TEXT NOT NULL,
    "status" "public"."QualityCheckStatus" NOT NULL,
    "temperature" DOUBLE PRECISION,
    "humidity" DOUBLE PRECISION,
    "ph" DOUBLE PRECISION,
    "visualCheck" TEXT,
    "tasteCheck" TEXT,
    "smellCheck" TEXT,
    "textureCheck" TEXT,
    "passed" BOOLEAN NOT NULL,
    "score" DOUBLE PRECISION,
    "notes" TEXT,
    "correctionActions" TEXT,
    "evidenceFiles" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quality_checks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_code_key" ON "public"."suppliers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_evaluations_supplierId_period_key" ON "public"."supplier_evaluations"("supplierId", "period");

-- CreateIndex
CREATE INDEX "inventory_adjustments_sppgId_ingredientId_idx" ON "public"."inventory_adjustments"("sppgId", "ingredientId");

-- CreateIndex
CREATE INDEX "inventory_adjustments_adjustmentType_idx" ON "public"."inventory_adjustments"("adjustmentType");

-- CreateIndex
CREATE INDEX "quality_checks_sppgId_entityType_entityId_idx" ON "public"."quality_checks"("sppgId", "entityType", "entityId");

-- CreateIndex
CREATE INDEX "quality_checks_checkDate_idx" ON "public"."quality_checks"("checkDate");

-- AddForeignKey
ALTER TABLE "public"."procurements" ADD CONSTRAINT "procurements_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."supplier_evaluations" ADD CONSTRAINT "supplier_evaluations_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."supplier_evaluations" ADD CONSTRAINT "supplier_evaluations_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventory_adjustments" ADD CONSTRAINT "inventory_adjustments_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventory_adjustments" ADD CONSTRAINT "inventory_adjustments_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "public"."ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventory_adjustments" ADD CONSTRAINT "inventory_adjustments_adjustedBy_fkey" FOREIGN KEY ("adjustedBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventory_adjustments" ADD CONSTRAINT "inventory_adjustments_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quality_checks" ADD CONSTRAINT "quality_checks_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quality_checks" ADD CONSTRAINT "quality_checks_checkedBy_fkey" FOREIGN KEY ("checkedBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
