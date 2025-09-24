-- AlterTable
ALTER TABLE "public"."sppg" ADD COLUMN     "businessHoursEnd" TEXT NOT NULL DEFAULT '18:00',
ADD COLUMN     "businessHoursStart" TEXT NOT NULL DEFAULT '06:00',
ADD COLUMN     "operationalDays" TEXT NOT NULL DEFAULT 'MONDAY_TO_FRIDAY',
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'Asia/Jakarta',
ADD COLUMN     "weekendDays" INTEGER[] DEFAULT ARRAY[0, 6]::INTEGER[];

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "displayTimezone" TEXT,
ADD COLUMN     "preferredTimezone" TEXT,
ADD COLUMN     "timezoneAutoDetect" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "public"."mobile_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "deviceTimezone" TEXT NOT NULL,
    "sppgTimezone" TEXT NOT NULL,
    "timezoneOffset" INTEGER NOT NULL,
    "sessionStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionEnd" TIMESTAMP(3),
    "localSessionStart" TEXT NOT NULL,
    "localSessionEnd" TEXT,
    "lastKnownLocation" JSONB,
    "isOnline" BOOLEAN NOT NULL DEFAULT true,
    "connectionQuality" TEXT,
    "deviceInfo" JSONB,
    "batteryLevel" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mobile_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."offline_actions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "sessionId" TEXT,
    "actionType" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "localTimestamp" TEXT NOT NULL,
    "deviceTimezone" TEXT NOT NULL,
    "sppgTimezone" TEXT NOT NULL,
    "utcTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actionData" JSONB NOT NULL,
    "originalData" JSONB,
    "conflictResolution" TEXT,
    "isSynced" BOOLEAN NOT NULL DEFAULT false,
    "syncedAt" TIMESTAMP(3),
    "syncAttempts" INTEGER NOT NULL DEFAULT 0,
    "lastSyncError" TEXT,
    "syncPriority" TEXT NOT NULL DEFAULT 'NORMAL',
    "dataChecksum" TEXT,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "validationErrors" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offline_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."timezone_logs" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT,
    "userId" TEXT,
    "eventType" TEXT NOT NULL,
    "oldTimezone" TEXT,
    "newTimezone" TEXT NOT NULL,
    "changeReason" TEXT,
    "affectedRecords" INTEGER,
    "migrationStatus" TEXT,
    "changedBy" TEXT,
    "systemGenerated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "timezone_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mobile_sessions_sppgId_sessionStart_idx" ON "public"."mobile_sessions"("sppgId", "sessionStart");

-- CreateIndex
CREATE INDEX "mobile_sessions_userId_isOnline_idx" ON "public"."mobile_sessions"("userId", "isOnline");

-- CreateIndex
CREATE INDEX "offline_actions_sppgId_isSynced_idx" ON "public"."offline_actions"("sppgId", "isSynced");

-- CreateIndex
CREATE INDEX "offline_actions_userId_actionType_idx" ON "public"."offline_actions"("userId", "actionType");

-- CreateIndex
CREATE INDEX "offline_actions_syncPriority_isSynced_idx" ON "public"."offline_actions"("syncPriority", "isSynced");

-- CreateIndex
CREATE INDEX "timezone_logs_sppgId_eventType_idx" ON "public"."timezone_logs"("sppgId", "eventType");

-- CreateIndex
CREATE INDEX "timezone_logs_createdAt_idx" ON "public"."timezone_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."mobile_sessions" ADD CONSTRAINT "mobile_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."mobile_sessions" ADD CONSTRAINT "mobile_sessions_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."offline_actions" ADD CONSTRAINT "offline_actions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."offline_actions" ADD CONSTRAINT "offline_actions_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."offline_actions" ADD CONSTRAINT "offline_actions_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."mobile_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."timezone_logs" ADD CONSTRAINT "timezone_logs_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."timezone_logs" ADD CONSTRAINT "timezone_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
