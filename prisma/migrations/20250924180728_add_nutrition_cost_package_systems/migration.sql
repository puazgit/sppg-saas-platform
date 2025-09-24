-- CreateEnum
CREATE TYPE "public"."AgeGroup" AS ENUM ('INFANT_0_6_MONTHS', 'INFANT_7_11_MONTHS', 'TODDLER_1_3_YEARS', 'CHILD_4_6_YEARS', 'CHILD_7_9_YEARS', 'CHILD_10_12_YEARS', 'TEEN_13_15_YEARS', 'TEEN_16_18_YEARS', 'ADULT_19_29_YEARS', 'ADULT_30_49_YEARS', 'ADULT_50_64_YEARS', 'ELDERLY_65_PLUS', 'PREGNANT', 'LACTATING');

-- CreateEnum
CREATE TYPE "public"."CostType" AS ENUM ('INGREDIENT', 'LABOR', 'UTILITIES', 'PACKAGING', 'TRANSPORTATION', 'OVERHEAD', 'EQUIPMENT', 'OTHER');

-- AlterTable
ALTER TABLE "public"."subscriptions" ADD COLUMN     "packageId" TEXT;

-- CreateTable
CREATE TABLE "public"."nutrition_standards" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "version" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Indonesia',
    "publishedBy" TEXT NOT NULL,
    "publishedDate" TIMESTAMP(3) NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nutrition_standards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."nutrition_requirements" (
    "id" TEXT NOT NULL,
    "standardId" TEXT NOT NULL,
    "ageGroup" "public"."AgeGroup" NOT NULL,
    "gender" "public"."Gender",
    "activityLevel" TEXT,
    "specialCondition" TEXT,
    "calories" DOUBLE PRECISION NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "fat" DOUBLE PRECISION NOT NULL,
    "carbohydrate" DOUBLE PRECISION NOT NULL,
    "fiber" DOUBLE PRECISION NOT NULL,
    "vitaminA" DOUBLE PRECISION,
    "vitaminB1" DOUBLE PRECISION,
    "vitaminB2" DOUBLE PRECISION,
    "vitaminB3" DOUBLE PRECISION,
    "vitaminB6" DOUBLE PRECISION,
    "vitaminB12" DOUBLE PRECISION,
    "vitaminC" DOUBLE PRECISION,
    "vitaminD" DOUBLE PRECISION,
    "vitaminE" DOUBLE PRECISION,
    "vitaminK" DOUBLE PRECISION,
    "folate" DOUBLE PRECISION,
    "calcium" DOUBLE PRECISION,
    "iron" DOUBLE PRECISION,
    "magnesium" DOUBLE PRECISION,
    "phosphorus" DOUBLE PRECISION,
    "potassium" DOUBLE PRECISION,
    "sodium" DOUBLE PRECISION,
    "zinc" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nutrition_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."menu_nutrition_analyses" (
    "id" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "standardId" TEXT NOT NULL,
    "targetAgeGroup" "public"."AgeGroup" NOT NULL,
    "targetGender" "public"."Gender",
    "servingSize" DOUBLE PRECISION NOT NULL,
    "totalCalories" DOUBLE PRECISION NOT NULL,
    "totalProtein" DOUBLE PRECISION NOT NULL,
    "totalFat" DOUBLE PRECISION NOT NULL,
    "totalCarbs" DOUBLE PRECISION NOT NULL,
    "totalFiber" DOUBLE PRECISION NOT NULL,
    "totalSodium" DOUBLE PRECISION,
    "totalSugar" DOUBLE PRECISION,
    "caloriesFulfillment" DOUBLE PRECISION NOT NULL,
    "proteinFulfillment" DOUBLE PRECISION NOT NULL,
    "fatFulfillment" DOUBLE PRECISION NOT NULL,
    "carbsFulfillment" DOUBLE PRECISION NOT NULL,
    "fiberFulfillment" DOUBLE PRECISION NOT NULL,
    "nutritionScore" DOUBLE PRECISION,
    "recommendations" TEXT,
    "analysisDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_nutrition_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cost_categories" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."CostType" NOT NULL,
    "isFixedCost" BOOLEAN NOT NULL DEFAULT false,
    "defaultRate" DOUBLE PRECISION,
    "unit" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cost_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."menu_cost_calculations" (
    "id" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "batchSize" INTEGER NOT NULL,
    "calculationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "calculatedBy" TEXT,
    "totalIngredientCost" DOUBLE PRECISION NOT NULL,
    "totalLaborCost" DOUBLE PRECISION NOT NULL,
    "totalUtilitiesCost" DOUBLE PRECISION NOT NULL,
    "totalPackagingCost" DOUBLE PRECISION NOT NULL,
    "totalTransportCost" DOUBLE PRECISION NOT NULL,
    "totalOverheadCost" DOUBLE PRECISION NOT NULL,
    "totalOtherCost" DOUBLE PRECISION NOT NULL,
    "grandTotal" DOUBLE PRECISION NOT NULL,
    "costPerServing" DOUBLE PRECISION NOT NULL,
    "suggestedMargin" DOUBLE PRECISION,
    "suggestedSellingPrice" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_cost_calculations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cost_breakdowns" (
    "id" TEXT NOT NULL,
    "calculationId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "unitCost" DOUBLE PRECISION NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cost_breakdowns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subscription_packages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tier" "public"."SubscriptionTier" NOT NULL,
    "monthlyPrice" DOUBLE PRECISION NOT NULL,
    "yearlyPrice" DOUBLE PRECISION,
    "setupFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "maxRecipients" INTEGER NOT NULL,
    "maxStaff" INTEGER NOT NULL,
    "maxDistributionPoints" INTEGER NOT NULL,
    "maxMenusPerMonth" INTEGER NOT NULL,
    "storageGb" INTEGER NOT NULL,
    "maxReportsPerMonth" INTEGER NOT NULL,
    "hasAdvancedReporting" BOOLEAN NOT NULL DEFAULT false,
    "hasNutritionAnalysis" BOOLEAN NOT NULL DEFAULT false,
    "hasCostCalculation" BOOLEAN NOT NULL DEFAULT false,
    "hasQualityControl" BOOLEAN NOT NULL DEFAULT false,
    "hasAPIAccess" BOOLEAN NOT NULL DEFAULT false,
    "hasCustomBranding" BOOLEAN NOT NULL DEFAULT false,
    "hasPrioritySupport" BOOLEAN NOT NULL DEFAULT false,
    "hasTrainingIncluded" BOOLEAN NOT NULL DEFAULT false,
    "supportLevel" TEXT NOT NULL,
    "responseTimeSLA" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "highlightFeatures" TEXT[],
    "targetMarket" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subscription_package_features" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "featureName" TEXT NOT NULL,
    "featureValue" TEXT NOT NULL,
    "isHighlight" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,

    CONSTRAINT "subscription_package_features_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "nutrition_standards_name_version_key" ON "public"."nutrition_standards"("name", "version");

-- CreateIndex
CREATE INDEX "nutrition_requirements_ageGroup_gender_idx" ON "public"."nutrition_requirements"("ageGroup", "gender");

-- CreateIndex
CREATE UNIQUE INDEX "nutrition_requirements_standardId_ageGroup_gender_specialCo_key" ON "public"."nutrition_requirements"("standardId", "ageGroup", "gender", "specialCondition");

-- CreateIndex
CREATE UNIQUE INDEX "menu_nutrition_analyses_menuId_standardId_targetAgeGroup_ta_key" ON "public"."menu_nutrition_analyses"("menuId", "standardId", "targetAgeGroup", "targetGender");

-- CreateIndex
CREATE INDEX "cost_categories_sppgId_type_idx" ON "public"."cost_categories"("sppgId", "type");

-- CreateIndex
CREATE INDEX "menu_cost_calculations_sppgId_calculationDate_idx" ON "public"."menu_cost_calculations"("sppgId", "calculationDate");

-- CreateIndex
CREATE UNIQUE INDEX "menu_cost_calculations_menuId_version_key" ON "public"."menu_cost_calculations"("menuId", "version");

-- CreateIndex
CREATE INDEX "cost_breakdowns_calculationId_idx" ON "public"."cost_breakdowns"("calculationId");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_packages_name_key" ON "public"."subscription_packages"("name");

-- CreateIndex
CREATE INDEX "subscription_packages_tier_isActive_idx" ON "public"."subscription_packages"("tier", "isActive");

-- CreateIndex
CREATE INDEX "subscription_package_features_packageId_displayOrder_idx" ON "public"."subscription_package_features"("packageId", "displayOrder");

-- AddForeignKey
ALTER TABLE "public"."subscriptions" ADD CONSTRAINT "subscriptions_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "public"."subscription_packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."nutrition_requirements" ADD CONSTRAINT "nutrition_requirements_standardId_fkey" FOREIGN KEY ("standardId") REFERENCES "public"."nutrition_standards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."menu_nutrition_analyses" ADD CONSTRAINT "menu_nutrition_analyses_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "public"."menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."menu_nutrition_analyses" ADD CONSTRAINT "menu_nutrition_analyses_standardId_fkey" FOREIGN KEY ("standardId") REFERENCES "public"."nutrition_standards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cost_categories" ADD CONSTRAINT "cost_categories_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."menu_cost_calculations" ADD CONSTRAINT "menu_cost_calculations_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "public"."menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."menu_cost_calculations" ADD CONSTRAINT "menu_cost_calculations_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cost_breakdowns" ADD CONSTRAINT "cost_breakdowns_calculationId_fkey" FOREIGN KEY ("calculationId") REFERENCES "public"."menu_cost_calculations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cost_breakdowns" ADD CONSTRAINT "cost_breakdowns_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."cost_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subscription_package_features" ADD CONSTRAINT "subscription_package_features_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "public"."subscription_packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
