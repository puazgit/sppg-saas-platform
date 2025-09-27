-- CreateTable
CREATE TABLE "public"."case_studies" (
    "id" TEXT NOT NULL,
    "organizationName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "organizationSize" TEXT NOT NULL,
    "industry" TEXT NOT NULL DEFAULT 'Government',
    "beforeSituation" TEXT NOT NULL,
    "afterSituation" TEXT NOT NULL,
    "mainProblems" TEXT[],
    "solutionsProvided" TEXT[],
    "resultsAchieved" JSONB NOT NULL,
    "metrics" JSONB NOT NULL,
    "testimonial" TEXT,
    "testimonialAuthor" TEXT,
    "testimonialPosition" TEXT,
    "duration" TEXT NOT NULL,
    "investment" TEXT NOT NULL,
    "roi" TEXT NOT NULL,
    "implementationDate" TIMESTAMP(3) NOT NULL,
    "completionDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[],
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "case_studies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "case_studies_organizationSize_idx" ON "public"."case_studies"("organizationSize");

-- CreateIndex
CREATE INDEX "case_studies_isPublished_idx" ON "public"."case_studies"("isPublished");

-- CreateIndex
CREATE INDEX "case_studies_isFeatured_idx" ON "public"."case_studies"("isFeatured");

-- CreateIndex
CREATE INDEX "case_studies_status_idx" ON "public"."case_studies"("status");
