-- CreateEnum
CREATE TYPE "public"."SchoolType" AS ENUM ('SD', 'SMP', 'SMA', 'SMK', 'SLB', 'MI', 'MTS', 'MA', 'MAK', 'PAUD', 'TK', 'KB');

-- CreateEnum
CREATE TYPE "public"."SchoolStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING_APPROVAL', 'SUSPENDED', 'GRADUATED');

-- CreateEnum
CREATE TYPE "public"."AccreditationLevel" AS ENUM ('A', 'B', 'C', 'NOT_ACCREDITED');

-- CreateEnum
CREATE TYPE "public"."MealDeliveryStatus" AS ENUM ('PLANNED', 'IN_TRANSIT', 'DELIVERED', 'RECEIVED', 'CONSUMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."SchoolFeedbackType" AS ENUM ('COMPLAINT', 'COMPLIMENT', 'SUGGESTION', 'INQUIRY');

-- CreateEnum
CREATE TYPE "public"."SchoolFeedbackStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."InspectionStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'FOLLOW_UP_REQUIRED');

-- CreateTable
CREATE TABLE "public"."schools" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "npsn" TEXT,
    "name" TEXT NOT NULL,
    "type" "public"."SchoolType" NOT NULL,
    "level" TEXT NOT NULL,
    "status" "public"."SchoolStatus" NOT NULL DEFAULT 'PENDING_APPROVAL',
    "foundedYear" INTEGER,
    "accreditation" "public"."AccreditationLevel",
    "accreditationDate" TIMESTAMP(3),
    "schoolOperationalPermit" TEXT,
    "address" TEXT NOT NULL,
    "postalCode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "provinceId" TEXT NOT NULL,
    "regencyId" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "villageId" TEXT NOT NULL,
    "totalStudents" INTEGER NOT NULL DEFAULT 0,
    "totalTeachers" INTEGER NOT NULL DEFAULT 0,
    "totalClasses" INTEGER NOT NULL DEFAULT 0,
    "totalClassrooms" INTEGER NOT NULL DEFAULT 0,
    "participationStartDate" TIMESTAMP(3),
    "participationEndDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "principalName" TEXT,
    "principalPhone" TEXT,
    "principalEmail" TEXT,
    "picName" TEXT,
    "picPhone" TEXT,
    "picEmail" TEXT,
    "picPosition" TEXT,
    "dailyMealQuota" INTEGER NOT NULL DEFAULT 0,
    "servingDays" TEXT,
    "servingTime" TEXT,
    "specialRequirements" TEXT,
    "kitchenFacility" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."students" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "birthDate" DATE NOT NULL,
    "birthPlace" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "guardianName" TEXT NOT NULL,
    "guardianPhone" TEXT NOT NULL,
    "guardianEmail" TEXT,
    "guardianRelation" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "academicYear" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "enrollmentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "graduationDate" TIMESTAMP(3),
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "allergies" TEXT[],
    "specialDiet" TEXT,
    "healthNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."meal_deliveries" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "deliveryDate" DATE NOT NULL,
    "menuId" TEXT NOT NULL,
    "portionsPlanned" INTEGER NOT NULL,
    "portionsDelivered" INTEGER,
    "portionsConsumed" INTEGER,
    "status" "public"."MealDeliveryStatus" NOT NULL DEFAULT 'PLANNED',
    "deliveryTime" TIMESTAMP(3),
    "receivedBy" TEXT,
    "receivedAt" TIMESTAMP(3),
    "temperature" DOUBLE PRECISION,
    "qualityRating" INTEGER,
    "feedback" TEXT,
    "photos" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meal_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."student_meal_records" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "mealDeliveryId" TEXT NOT NULL,
    "isPresent" BOOLEAN NOT NULL DEFAULT true,
    "portionConsumed" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "satisfaction" INTEGER,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_meal_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."school_nutrition_reports" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "reportMonth" INTEGER NOT NULL,
    "reportYear" INTEGER NOT NULL,
    "totalStudents" INTEGER NOT NULL,
    "activeStudents" INTEGER NOT NULL,
    "averageAttendance" DOUBLE PRECISION NOT NULL,
    "totalMealsServed" INTEGER NOT NULL,
    "averageCaloriesPerMeal" DOUBLE PRECISION NOT NULL,
    "averageProteinPerMeal" DOUBLE PRECISION NOT NULL,
    "nutritionGoalAchievement" DOUBLE PRECISION NOT NULL,
    "averageSatisfactionRating" DOUBLE PRECISION NOT NULL,
    "complaintCount" INTEGER NOT NULL,
    "complimentCount" INTEGER NOT NULL,
    "averageHeightGain" DOUBLE PRECISION,
    "averageWeightGain" DOUBLE PRECISION,
    "healthImprovementNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "school_nutrition_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."student_nutrition_reports" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "reportMonth" INTEGER NOT NULL,
    "reportYear" INTEGER NOT NULL,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "bmi" DOUBLE PRECISION,
    "nutritionStatus" TEXT,
    "mealsConsumed" INTEGER NOT NULL,
    "averagePortion" DOUBLE PRECISION NOT NULL,
    "caloriesConsumed" DOUBLE PRECISION NOT NULL,
    "proteinConsumed" DOUBLE PRECISION NOT NULL,
    "healthNotes" TEXT,
    "recommendations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_nutrition_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."school_feedbacks" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "feedbackType" "public"."SchoolFeedbackType" NOT NULL,
    "category" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "suggestions" TEXT,
    "reporterName" TEXT NOT NULL,
    "reporterPosition" TEXT NOT NULL,
    "reporterContact" TEXT,
    "status" "public"."SchoolFeedbackStatus" NOT NULL DEFAULT 'OPEN',
    "responseText" TEXT,
    "respondedBy" TEXT,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "school_feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."school_inspections" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "inspectionDate" DATE NOT NULL,
    "inspectorName" TEXT NOT NULL,
    "inspectorPosition" TEXT NOT NULL,
    "inspectionType" TEXT NOT NULL,
    "facilityScore" INTEGER,
    "hygieneScore" INTEGER,
    "foodQualityScore" INTEGER,
    "serviceScore" INTEGER,
    "overallScore" INTEGER,
    "findings" TEXT[],
    "violations" TEXT[],
    "recommendations" TEXT[],
    "correctionDeadline" TIMESTAMP(3),
    "status" "public"."InspectionStatus" NOT NULL DEFAULT 'COMPLETED',
    "followUpRequired" BOOLEAN NOT NULL DEFAULT false,
    "followUpDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "school_inspections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "schools_npsn_key" ON "public"."schools"("npsn");

-- CreateIndex
CREATE INDEX "schools_sppgId_status_isActive_idx" ON "public"."schools"("sppgId", "status", "isActive");

-- CreateIndex
CREATE INDEX "schools_type_status_idx" ON "public"."schools"("type", "status");

-- CreateIndex
CREATE INDEX "schools_provinceId_regencyId_districtId_idx" ON "public"."schools"("provinceId", "regencyId", "districtId");

-- CreateIndex
CREATE UNIQUE INDEX "schools_sppgId_npsn_key" ON "public"."schools"("sppgId", "npsn");

-- CreateIndex
CREATE INDEX "students_schoolId_isActive_idx" ON "public"."students"("schoolId", "isActive");

-- CreateIndex
CREATE INDEX "students_sppgId_isActive_idx" ON "public"."students"("sppgId", "isActive");

-- CreateIndex
CREATE INDEX "students_grade_academicYear_idx" ON "public"."students"("grade", "academicYear");

-- CreateIndex
CREATE UNIQUE INDEX "students_schoolId_studentId_key" ON "public"."students"("schoolId", "studentId");

-- CreateIndex
CREATE INDEX "meal_deliveries_schoolId_deliveryDate_idx" ON "public"."meal_deliveries"("schoolId", "deliveryDate");

-- CreateIndex
CREATE INDEX "meal_deliveries_sppgId_deliveryDate_status_idx" ON "public"."meal_deliveries"("sppgId", "deliveryDate", "status");

-- CreateIndex
CREATE UNIQUE INDEX "meal_deliveries_schoolId_deliveryDate_menuId_key" ON "public"."meal_deliveries"("schoolId", "deliveryDate", "menuId");

-- CreateIndex
CREATE UNIQUE INDEX "student_meal_records_studentId_mealDeliveryId_key" ON "public"."student_meal_records"("studentId", "mealDeliveryId");

-- CreateIndex
CREATE INDEX "school_nutrition_reports_sppgId_reportYear_reportMonth_idx" ON "public"."school_nutrition_reports"("sppgId", "reportYear", "reportMonth");

-- CreateIndex
CREATE UNIQUE INDEX "school_nutrition_reports_schoolId_reportMonth_reportYear_key" ON "public"."school_nutrition_reports"("schoolId", "reportMonth", "reportYear");

-- CreateIndex
CREATE UNIQUE INDEX "student_nutrition_reports_studentId_reportMonth_reportYear_key" ON "public"."student_nutrition_reports"("studentId", "reportMonth", "reportYear");

-- CreateIndex
CREATE INDEX "school_feedbacks_schoolId_feedbackType_status_idx" ON "public"."school_feedbacks"("schoolId", "feedbackType", "status");

-- CreateIndex
CREATE INDEX "school_inspections_schoolId_inspectionDate_idx" ON "public"."school_inspections"("schoolId", "inspectionDate");

-- CreateIndex
CREATE INDEX "school_inspections_sppgId_inspectionDate_status_idx" ON "public"."school_inspections"("sppgId", "inspectionDate", "status");

-- AddForeignKey
ALTER TABLE "public"."schools" ADD CONSTRAINT "schools_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."schools" ADD CONSTRAINT "schools_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "public"."provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."schools" ADD CONSTRAINT "schools_regencyId_fkey" FOREIGN KEY ("regencyId") REFERENCES "public"."regencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."schools" ADD CONSTRAINT "schools_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "public"."districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."schools" ADD CONSTRAINT "schools_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "public"."villages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "public"."schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."meal_deliveries" ADD CONSTRAINT "meal_deliveries_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "public"."schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."meal_deliveries" ADD CONSTRAINT "meal_deliveries_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."meal_deliveries" ADD CONSTRAINT "meal_deliveries_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "public"."menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_meal_records" ADD CONSTRAINT "student_meal_records_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_meal_records" ADD CONSTRAINT "student_meal_records_mealDeliveryId_fkey" FOREIGN KEY ("mealDeliveryId") REFERENCES "public"."meal_deliveries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."school_nutrition_reports" ADD CONSTRAINT "school_nutrition_reports_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "public"."schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."school_nutrition_reports" ADD CONSTRAINT "school_nutrition_reports_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_nutrition_reports" ADD CONSTRAINT "student_nutrition_reports_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."school_feedbacks" ADD CONSTRAINT "school_feedbacks_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "public"."schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."school_inspections" ADD CONSTRAINT "school_inspections_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "public"."schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."school_inspections" ADD CONSTRAINT "school_inspections_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;
