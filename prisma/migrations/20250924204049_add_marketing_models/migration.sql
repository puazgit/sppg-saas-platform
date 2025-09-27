-- CreateEnum
CREATE TYPE "public"."LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST');

-- CreateEnum
CREATE TYPE "public"."DemoStatus" AS ENUM ('PENDING', 'SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateTable
CREATE TABLE "public"."marketing_leads" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "organization" TEXT,
    "interest" "public"."SubscriptionTier" NOT NULL DEFAULT 'STANDARD',
    "source" TEXT NOT NULL,
    "status" "public"."LeadStatus" NOT NULL DEFAULT 'NEW',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketing_leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."demo_requests" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "preferredDate" TIMESTAMP(3),
    "status" "public"."DemoStatus" NOT NULL DEFAULT 'PENDING',
    "requirements" TEXT,
    "estimatedUsers" INTEGER,
    "estimatedSchools" INTEGER,
    "scheduledAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "demo_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."newsletter_subscribers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "source" TEXT NOT NULL DEFAULT 'WEBSITE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribedAt" TIMESTAMP(3),
    "reactivatedAt" TIMESTAMP(3),

    CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "marketing_leads_email_idx" ON "public"."marketing_leads"("email");

-- CreateIndex
CREATE INDEX "marketing_leads_status_idx" ON "public"."marketing_leads"("status");

-- CreateIndex
CREATE INDEX "marketing_leads_source_idx" ON "public"."marketing_leads"("source");

-- CreateIndex
CREATE INDEX "demo_requests_leadId_idx" ON "public"."demo_requests"("leadId");

-- CreateIndex
CREATE INDEX "demo_requests_status_idx" ON "public"."demo_requests"("status");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscribers_email_key" ON "public"."newsletter_subscribers"("email");

-- CreateIndex
CREATE INDEX "newsletter_subscribers_email_idx" ON "public"."newsletter_subscribers"("email");

-- CreateIndex
CREATE INDEX "newsletter_subscribers_isActive_idx" ON "public"."newsletter_subscribers"("isActive");

-- AddForeignKey
ALTER TABLE "public"."demo_requests" ADD CONSTRAINT "demo_requests_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."marketing_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
