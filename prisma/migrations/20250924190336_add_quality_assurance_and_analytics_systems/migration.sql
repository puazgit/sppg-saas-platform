-- CreateEnum
CREATE TYPE "public"."QualityCheckType" AS ENUM ('INGREDIENT_INSPECTION', 'PRODUCTION_SAFETY', 'FOOD_TEMPERATURE', 'HYGIENE_CHECK', 'FINAL_PRODUCT', 'STORAGE_CONDITION', 'DELIVERY_SAFETY', 'FACILITY_AUDIT');

-- CreateEnum
CREATE TYPE "public"."QualityAssuranceStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'PASSED', 'FAILED', 'REQUIRES_RECHECK', 'CRITICAL_FAILURE');

-- CreateEnum
CREATE TYPE "public"."QualityRiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."CertificationStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'PENDING_RENEWAL', 'SUSPENDED', 'REVOKED');

-- CreateEnum
CREATE TYPE "public"."AnalyticsMetricType" AS ENUM ('PRODUCTION_EFFICIENCY', 'COST_ANALYSIS', 'NUTRITION_COMPLIANCE', 'QUALITY_SCORE', 'DISTRIBUTION_COVERAGE', 'BENEFICIARY_SATISFACTION', 'STAFF_PERFORMANCE', 'INVENTORY_TURNOVER');

-- CreateEnum
CREATE TYPE "public"."DashboardType" AS ENUM ('EXECUTIVE', 'OPERATIONAL', 'QUALITY_CONTROL', 'FINANCIAL', 'NUTRITION', 'COMPLIANCE');

-- CreateTable
CREATE TABLE "public"."quality_control_checklists" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "checkType" "public"."QualityCheckType" NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "frequency" TEXT NOT NULL,
    "riskLevel" "public"."QualityRiskLevel" NOT NULL,
    "criteria" JSONB NOT NULL,
    "acceptableLimits" JSONB,
    "isRegulatory" BOOLEAN NOT NULL DEFAULT false,
    "regulationRef" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quality_control_checklists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quality_assurance_checks" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "checklistId" TEXT NOT NULL,
    "checkDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "menuId" TEXT,
    "batchNumber" TEXT,
    "ingredientId" TEXT,
    "facilityArea" TEXT,
    "checkedBy" TEXT NOT NULL,
    "supervisedBy" TEXT,
    "status" "public"."QualityAssuranceStatus" NOT NULL,
    "score" DOUBLE PRECISION,
    "findings" JSONB NOT NULL,
    "temperature" DOUBLE PRECISION,
    "measurements" JSONB,
    "issues" TEXT[],
    "correctiveActions" TEXT[],
    "followUpRequired" BOOLEAN NOT NULL DEFAULT false,
    "followUpDate" TIMESTAMP(3),
    "riskLevel" "public"."QualityRiskLevel" NOT NULL,
    "riskNotes" TEXT,
    "photos" TEXT[],
    "documents" TEXT[],
    "isCompliant" BOOLEAN NOT NULL,
    "regulationStatus" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quality_assurance_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_safety_certifications" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "certificateName" TEXT NOT NULL,
    "certificateType" TEXT NOT NULL,
    "issuingAuthority" TEXT NOT NULL,
    "certificateNumber" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "status" "public"."CertificationStatus" NOT NULL,
    "requirements" JSONB NOT NULL,
    "auditFrequency" TEXT NOT NULL,
    "lastAuditDate" TIMESTAMP(3),
    "nextAuditDate" TIMESTAMP(3) NOT NULL,
    "certificateFile" TEXT,
    "auditReports" TEXT[],
    "complianceScore" DOUBLE PRECISION,
    "lastComplianceCheck" TIMESTAMP(3),
    "nonConformities" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_safety_certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quality_incidents" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "incidentNumber" TEXT NOT NULL,
    "incidentDate" TIMESTAMP(3) NOT NULL,
    "reportedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reportedBy" TEXT NOT NULL,
    "incidentType" TEXT NOT NULL,
    "severity" "public"."QualityRiskLevel" NOT NULL,
    "affectedProducts" TEXT[],
    "affectedPersons" INTEGER,
    "description" TEXT NOT NULL,
    "symptoms" TEXT,
    "rootCause" TEXT,
    "investigatedBy" TEXT,
    "investigationNotes" TEXT,
    "investigationStatus" TEXT NOT NULL,
    "immediateActions" TEXT[],
    "correctiveActions" TEXT[],
    "preventiveActions" TEXT[],
    "status" TEXT NOT NULL,
    "resolutionDate" TIMESTAMP(3),
    "resolutionNotes" TEXT,
    "reportedToAuthority" BOOLEAN NOT NULL DEFAULT false,
    "authorityReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quality_incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."analytics_dashboards" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "dashboardType" "public"."DashboardType" NOT NULL,
    "config" JSONB NOT NULL,
    "filters" JSONB,
    "refreshInterval" INTEGER NOT NULL DEFAULT 300,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "allowedRoles" TEXT[],
    "createdBy" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analytics_dashboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."analytics_widgets" (
    "id" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "widgetType" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "dataSource" TEXT NOT NULL,
    "query" JSONB NOT NULL,
    "position" JSONB NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analytics_widgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."kpi_tracking" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "kpiName" TEXT NOT NULL,
    "kpiType" "public"."AnalyticsMetricType" NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "calculationMethod" TEXT NOT NULL,
    "targetValue" DOUBLE PRECISION NOT NULL,
    "minAcceptable" DOUBLE PRECISION,
    "maxAcceptable" DOUBLE PRECISION,
    "measurementPeriod" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kpi_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."kpi_measurements" (
    "id" TEXT NOT NULL,
    "kpiId" TEXT NOT NULL,
    "measurementDate" DATE NOT NULL,
    "actualValue" DOUBLE PRECISION NOT NULL,
    "targetValue" DOUBLE PRECISION NOT NULL,
    "variance" DOUBLE PRECISION NOT NULL,
    "variancePercent" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "factors" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kpi_measurements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."predictive_analytics" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "predictionType" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "modelVersion" TEXT NOT NULL,
    "forecastDate" DATE NOT NULL,
    "predictionMade" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confidenceLevel" DOUBLE PRECISION NOT NULL,
    "predictions" JSONB NOT NULL,
    "accuracy" DOUBLE PRECISION,
    "inputData" JSONB NOT NULL,
    "assumptions" TEXT[],
    "limitations" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "predictive_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "quality_control_checklists_sppgId_checkType_isActive_idx" ON "public"."quality_control_checklists"("sppgId", "checkType", "isActive");

-- CreateIndex
CREATE INDEX "quality_assurance_checks_sppgId_checkDate_status_idx" ON "public"."quality_assurance_checks"("sppgId", "checkDate", "status");

-- CreateIndex
CREATE INDEX "quality_assurance_checks_checklistId_status_idx" ON "public"."quality_assurance_checks"("checklistId", "status");

-- CreateIndex
CREATE INDEX "quality_assurance_checks_riskLevel_isCompliant_idx" ON "public"."quality_assurance_checks"("riskLevel", "isCompliant");

-- CreateIndex
CREATE UNIQUE INDEX "product_safety_certifications_certificateNumber_key" ON "public"."product_safety_certifications"("certificateNumber");

-- CreateIndex
CREATE INDEX "product_safety_certifications_sppgId_status_expiryDate_idx" ON "public"."product_safety_certifications"("sppgId", "status", "expiryDate");

-- CreateIndex
CREATE INDEX "product_safety_certifications_certificateType_status_idx" ON "public"."product_safety_certifications"("certificateType", "status");

-- CreateIndex
CREATE UNIQUE INDEX "quality_incidents_incidentNumber_key" ON "public"."quality_incidents"("incidentNumber");

-- CreateIndex
CREATE INDEX "quality_incidents_sppgId_incidentDate_severity_idx" ON "public"."quality_incidents"("sppgId", "incidentDate", "severity");

-- CreateIndex
CREATE INDEX "quality_incidents_status_severity_idx" ON "public"."quality_incidents"("status", "severity");

-- CreateIndex
CREATE INDEX "analytics_dashboards_sppgId_dashboardType_isActive_idx" ON "public"."analytics_dashboards"("sppgId", "dashboardType", "isActive");

-- CreateIndex
CREATE INDEX "analytics_widgets_dashboardId_isActive_idx" ON "public"."analytics_widgets"("dashboardId", "isActive");

-- CreateIndex
CREATE INDEX "kpi_tracking_sppgId_kpiType_isActive_idx" ON "public"."kpi_tracking"("sppgId", "kpiType", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "kpi_tracking_sppgId_kpiName_key" ON "public"."kpi_tracking"("sppgId", "kpiName");

-- CreateIndex
CREATE INDEX "kpi_measurements_kpiId_measurementDate_idx" ON "public"."kpi_measurements"("kpiId", "measurementDate");

-- CreateIndex
CREATE UNIQUE INDEX "kpi_measurements_kpiId_measurementDate_key" ON "public"."kpi_measurements"("kpiId", "measurementDate");

-- CreateIndex
CREATE INDEX "predictive_analytics_sppgId_predictionType_forecastDate_idx" ON "public"."predictive_analytics"("sppgId", "predictionType", "forecastDate");

-- AddForeignKey
ALTER TABLE "public"."quality_control_checklists" ADD CONSTRAINT "quality_control_checklists_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quality_assurance_checks" ADD CONSTRAINT "quality_assurance_checks_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quality_assurance_checks" ADD CONSTRAINT "quality_assurance_checks_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "public"."quality_control_checklists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quality_assurance_checks" ADD CONSTRAINT "quality_assurance_checks_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "public"."menus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quality_assurance_checks" ADD CONSTRAINT "quality_assurance_checks_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "public"."ingredients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quality_assurance_checks" ADD CONSTRAINT "quality_assurance_checks_checkedBy_fkey" FOREIGN KEY ("checkedBy") REFERENCES "public"."staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quality_assurance_checks" ADD CONSTRAINT "quality_assurance_checks_supervisedBy_fkey" FOREIGN KEY ("supervisedBy") REFERENCES "public"."staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_safety_certifications" ADD CONSTRAINT "product_safety_certifications_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quality_incidents" ADD CONSTRAINT "quality_incidents_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quality_incidents" ADD CONSTRAINT "quality_incidents_reportedBy_fkey" FOREIGN KEY ("reportedBy") REFERENCES "public"."staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quality_incidents" ADD CONSTRAINT "quality_incidents_investigatedBy_fkey" FOREIGN KEY ("investigatedBy") REFERENCES "public"."staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."analytics_dashboards" ADD CONSTRAINT "analytics_dashboards_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."analytics_dashboards" ADD CONSTRAINT "analytics_dashboards_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."analytics_widgets" ADD CONSTRAINT "analytics_widgets_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "public"."analytics_dashboards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."kpi_tracking" ADD CONSTRAINT "kpi_tracking_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."kpi_measurements" ADD CONSTRAINT "kpi_measurements_kpiId_fkey" FOREIGN KEY ("kpiId") REFERENCES "public"."kpi_tracking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."predictive_analytics" ADD CONSTRAINT "predictive_analytics_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;
