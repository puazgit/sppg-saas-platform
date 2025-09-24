-- CreateTable
CREATE TABLE "public"."system_settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "dataType" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isEditable" BOOLEAN NOT NULL DEFAULT true,
    "validationRules" JSONB,
    "defaultValue" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sppg_settings" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "dataType" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "systemDefault" TEXT,
    "isCustomized" BOOLEAN NOT NULL DEFAULT false,
    "validationRules" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sppg_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."feature_flags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "isStable" BOOLEAN NOT NULL DEFAULT true,
    "rolloutPercent" INTEGER NOT NULL DEFAULT 0,
    "allowedTiers" "public"."SubscriptionTier"[],
    "targetUserTypes" "public"."UserType"[],
    "specificSppgIds" TEXT[],
    "launchDate" TIMESTAMP(3),
    "deprecationDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sppg_feature_access" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "featureFlagId" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "enabledBy" TEXT,
    "enabledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstUsed" TIMESTAMP(3),
    "lastUsed" TIMESTAMP(3),
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "rating" INTEGER,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sppg_feature_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."api_keys" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT,
    "name" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "keyPreview" TEXT NOT NULL,
    "permissions" TEXT[],
    "allowedIps" TEXT[],
    "rateLimit" INTEGER NOT NULL DEFAULT 1000,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "lastUsed" TIMESTAMP(3),
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."webhook_endpoints" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "events" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "retryAttempts" INTEGER NOT NULL DEFAULT 3,
    "timeoutSeconds" INTEGER NOT NULL DEFAULT 30,
    "lastTriggered" TIMESTAMP(3),
    "successCount" INTEGER NOT NULL DEFAULT 0,
    "failureCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webhook_endpoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."webhook_deliveries" (
    "id" TEXT NOT NULL,
    "endpointId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "httpStatus" INTEGER,
    "deliveredAt" TIMESTAMP(3),
    "responseTime" INTEGER,
    "status" TEXT NOT NULL,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webhook_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_key_key" ON "public"."system_settings"("key");

-- CreateIndex
CREATE INDEX "system_settings_category_isActive_idx" ON "public"."system_settings"("category", "isActive");

-- CreateIndex
CREATE INDEX "sppg_settings_sppgId_category_idx" ON "public"."sppg_settings"("sppgId", "category");

-- CreateIndex
CREATE UNIQUE INDEX "sppg_settings_sppgId_key_key" ON "public"."sppg_settings"("sppgId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "feature_flags_name_key" ON "public"."feature_flags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "feature_flags_key_key" ON "public"."feature_flags"("key");

-- CreateIndex
CREATE INDEX "feature_flags_isEnabled_isStable_idx" ON "public"."feature_flags"("isEnabled", "isStable");

-- CreateIndex
CREATE INDEX "sppg_feature_access_sppgId_isEnabled_idx" ON "public"."sppg_feature_access"("sppgId", "isEnabled");

-- CreateIndex
CREATE UNIQUE INDEX "sppg_feature_access_sppgId_featureFlagId_key" ON "public"."sppg_feature_access"("sppgId", "featureFlagId");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_keyHash_key" ON "public"."api_keys"("keyHash");

-- CreateIndex
CREATE INDEX "api_keys_sppgId_isActive_idx" ON "public"."api_keys"("sppgId", "isActive");

-- CreateIndex
CREATE INDEX "webhook_endpoints_sppgId_isActive_idx" ON "public"."webhook_endpoints"("sppgId", "isActive");

-- CreateIndex
CREATE INDEX "webhook_deliveries_endpointId_status_idx" ON "public"."webhook_deliveries"("endpointId", "status");

-- CreateIndex
CREATE INDEX "webhook_deliveries_createdAt_idx" ON "public"."webhook_deliveries"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."sppg_settings" ADD CONSTRAINT "sppg_settings_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sppg_feature_access" ADD CONSTRAINT "sppg_feature_access_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sppg_feature_access" ADD CONSTRAINT "sppg_feature_access_featureFlagId_fkey" FOREIGN KEY ("featureFlagId") REFERENCES "public"."feature_flags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."api_keys" ADD CONSTRAINT "api_keys_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."webhook_endpoints" ADD CONSTRAINT "webhook_endpoints_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."webhook_deliveries" ADD CONSTRAINT "webhook_deliveries_endpointId_fkey" FOREIGN KEY ("endpointId") REFERENCES "public"."webhook_endpoints"("id") ON DELETE CASCADE ON UPDATE CASCADE;
