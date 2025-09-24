-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('INFO', 'WARNING', 'ERROR', 'SUCCESS', 'REMINDER', 'SYSTEM', 'PROCUREMENT', 'PRODUCTION', 'DISTRIBUTION', 'BILLING');

-- CreateEnum
CREATE TYPE "public"."NotificationPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "public"."FeedbackCategory" AS ENUM ('FOOD_QUALITY', 'FOOD_TASTE', 'PORTION_SIZE', 'DELIVERY_TIME', 'STAFF_SERVICE', 'HYGIENE', 'PACKAGING', 'GENERAL', 'COMPLAINT', 'SUGGESTION');

-- CreateEnum
CREATE TYPE "public"."FeedbackStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'ESCALATED');

-- CreateTable
CREATE TABLE "public"."audit_logs" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "previousData" JSONB,
    "newData" JSONB,
    "userId" TEXT,
    "userName" TEXT,
    "userEmail" TEXT,
    "sppgId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "requestPath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notification_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "variables" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sppgId" TEXT,
    "templateId" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "priority" "public"."NotificationPriority" NOT NULL DEFAULT 'NORMAL',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "isSent" BOOLEAN NOT NULL DEFAULT false,
    "sentAt" TIMESTAMP(3),
    "relatedEntityType" TEXT,
    "relatedEntityId" TEXT,
    "actionUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."file_attachments" (
    "id" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileHash" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "uploadedBy" TEXT NOT NULL,
    "sppgId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "file_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."feedbacks" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "relatedType" TEXT NOT NULL,
    "relatedId" TEXT,
    "date" DATE NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "comment" TEXT,
    "category" "public"."FeedbackCategory" NOT NULL,
    "reporterName" TEXT,
    "reporterPhone" TEXT,
    "reporterEmail" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "distributionPointId" TEXT,
    "status" "public"."FeedbackStatus" NOT NULL DEFAULT 'OPEN',
    "responseText" TEXT,
    "respondedBy" TEXT,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."provinces" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "provinces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."regencies" (
    "id" TEXT NOT NULL,
    "provinceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "regencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."districts" (
    "id" TEXT NOT NULL,
    "regencyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."villages" (
    "id" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "villages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "public"."audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "public"."audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_sppgId_idx" ON "public"."audit_logs"("sppgId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "public"."audit_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "notification_templates_name_key" ON "public"."notification_templates"("name");

-- CreateIndex
CREATE INDEX "notifications_userId_isRead_idx" ON "public"."notifications"("userId", "isRead");

-- CreateIndex
CREATE INDEX "notifications_sppgId_isRead_idx" ON "public"."notifications"("sppgId", "isRead");

-- CreateIndex
CREATE INDEX "notifications_type_priority_idx" ON "public"."notifications"("type", "priority");

-- CreateIndex
CREATE INDEX "file_attachments_entityType_entityId_idx" ON "public"."file_attachments"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "file_attachments_uploadedBy_idx" ON "public"."file_attachments"("uploadedBy");

-- CreateIndex
CREATE INDEX "file_attachments_sppgId_idx" ON "public"."file_attachments"("sppgId");

-- CreateIndex
CREATE INDEX "feedbacks_sppgId_date_idx" ON "public"."feedbacks"("sppgId", "date");

-- CreateIndex
CREATE INDEX "feedbacks_status_idx" ON "public"."feedbacks"("status");

-- CreateIndex
CREATE INDEX "feedbacks_category_rating_idx" ON "public"."feedbacks"("category", "rating");

-- CreateIndex
CREATE UNIQUE INDEX "provinces_code_key" ON "public"."provinces"("code");

-- CreateIndex
CREATE UNIQUE INDEX "regencies_code_key" ON "public"."regencies"("code");

-- CreateIndex
CREATE INDEX "regencies_provinceId_idx" ON "public"."regencies"("provinceId");

-- CreateIndex
CREATE UNIQUE INDEX "districts_code_key" ON "public"."districts"("code");

-- CreateIndex
CREATE INDEX "districts_regencyId_idx" ON "public"."districts"("regencyId");

-- CreateIndex
CREATE UNIQUE INDEX "villages_code_key" ON "public"."villages"("code");

-- CreateIndex
CREATE INDEX "villages_districtId_idx" ON "public"."villages"("districtId");

-- AddForeignKey
ALTER TABLE "public"."sppg" ADD CONSTRAINT "sppg_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "public"."provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sppg" ADD CONSTRAINT "sppg_regencyId_fkey" FOREIGN KEY ("regencyId") REFERENCES "public"."regencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sppg" ADD CONSTRAINT "sppg_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "public"."districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sppg" ADD CONSTRAINT "sppg_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "public"."villages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."notification_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."file_attachments" ADD CONSTRAINT "file_attachments_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."file_attachments" ADD CONSTRAINT "file_attachments_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."feedbacks" ADD CONSTRAINT "feedbacks_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."feedbacks" ADD CONSTRAINT "feedbacks_distributionPointId_fkey" FOREIGN KEY ("distributionPointId") REFERENCES "public"."distribution_points"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."feedbacks" ADD CONSTRAINT "feedbacks_respondedBy_fkey" FOREIGN KEY ("respondedBy") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."regencies" ADD CONSTRAINT "regencies_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "public"."provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."districts" ADD CONSTRAINT "districts_regencyId_fkey" FOREIGN KEY ("regencyId") REFERENCES "public"."regencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."villages" ADD CONSTRAINT "villages_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "public"."districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
