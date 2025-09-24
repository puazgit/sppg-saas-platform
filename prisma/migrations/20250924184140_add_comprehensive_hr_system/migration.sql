-- CreateEnum
CREATE TYPE "public"."AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'SICK_LEAVE', 'ANNUAL_LEAVE', 'UNPAID_LEAVE', 'HOLIDAY');

-- CreateEnum
CREATE TYPE "public"."LeaveStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."PayrollComponentType" AS ENUM ('EARNING', 'DEDUCTION', 'STATUTORY');

-- CreateEnum
CREATE TYPE "public"."PayrollStatus" AS ENUM ('DRAFT', 'APPROVED', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."ReviewStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'ACKNOWLEDGED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."TrainingStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."ParticipantStatus" AS ENUM ('REGISTERED', 'ATTENDED', 'COMPLETED', 'ABSENT', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."staff_attendance" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "checkIn" TIMESTAMP(3),
    "checkOut" TIMESTAMP(3),
    "breakStart" TIMESTAMP(3),
    "breakEnd" TIMESTAMP(3),
    "workHours" DOUBLE PRECISION,
    "overtimeHours" DOUBLE PRECISION,
    "breakHours" DOUBLE PRECISION,
    "status" "public"."AttendanceStatus" NOT NULL DEFAULT 'PRESENT',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."leave_types" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "maxDaysPerYear" INTEGER NOT NULL,
    "carryOverDays" INTEGER NOT NULL DEFAULT 0,
    "requiresDocument" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "leave_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."leave_requests" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "leaveTypeId" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "totalDays" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "document" TEXT,
    "status" "public"."LeaveStatus" NOT NULL DEFAULT 'PENDING',
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payroll_components" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "public"."PayrollComponentType" NOT NULL,
    "calculationType" TEXT NOT NULL,
    "defaultAmount" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "payroll_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."staff_payroll_components" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "payrollComponentId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "staff_payroll_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payrolls" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "periodMonth" INTEGER NOT NULL,
    "periodYear" INTEGER NOT NULL,
    "basicSalary" DOUBLE PRECISION NOT NULL,
    "allowances" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "overtime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bonus" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "grossSalary" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bpjs" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "insurance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "loan" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "otherDeductions" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalDeductions" DOUBLE PRECISION NOT NULL,
    "netSalary" DOUBLE PRECISION NOT NULL,
    "status" "public"."PayrollStatus" NOT NULL DEFAULT 'DRAFT',
    "paidAt" TIMESTAMP(3),
    "paymentMethod" TEXT,
    "paymentReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payrolls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."performance_reviews" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "reviewPeriod" TEXT NOT NULL,
    "overallRating" DOUBLE PRECISION NOT NULL,
    "goals" JSONB NOT NULL,
    "strengths" TEXT[],
    "improvements" TEXT[],
    "comments" TEXT,
    "status" "public"."ReviewStatus" NOT NULL DEFAULT 'DRAFT',
    "submittedAt" TIMESTAMP(3),
    "acknowledgedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "performance_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."training_programs" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "maxParticipants" INTEGER,
    "cost" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "training_programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."training_sessions" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "instructor" TEXT,
    "maxParticipants" INTEGER,
    "status" "public"."TrainingStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."training_participants" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "status" "public"."ParticipantStatus" NOT NULL DEFAULT 'REGISTERED',
    "completionDate" TIMESTAMP(3),
    "score" DOUBLE PRECISION,
    "certificateUrl" TEXT,
    "feedback" TEXT,

    CONSTRAINT "training_participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "staff_attendance_date_status_idx" ON "public"."staff_attendance"("date", "status");

-- CreateIndex
CREATE UNIQUE INDEX "staff_attendance_staffId_date_key" ON "public"."staff_attendance"("staffId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "leave_types_sppgId_code_key" ON "public"."leave_types"("sppgId", "code");

-- CreateIndex
CREATE INDEX "leave_requests_staffId_status_idx" ON "public"."leave_requests"("staffId", "status");

-- CreateIndex
CREATE INDEX "leave_requests_startDate_endDate_idx" ON "public"."leave_requests"("startDate", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_components_sppgId_code_key" ON "public"."payroll_components"("sppgId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "staff_payroll_components_staffId_payrollComponentId_key" ON "public"."staff_payroll_components"("staffId", "payrollComponentId");

-- CreateIndex
CREATE INDEX "payrolls_periodYear_periodMonth_idx" ON "public"."payrolls"("periodYear", "periodMonth");

-- CreateIndex
CREATE UNIQUE INDEX "payrolls_staffId_periodMonth_periodYear_key" ON "public"."payrolls"("staffId", "periodMonth", "periodYear");

-- CreateIndex
CREATE INDEX "performance_reviews_staffId_reviewPeriod_idx" ON "public"."performance_reviews"("staffId", "reviewPeriod");

-- CreateIndex
CREATE UNIQUE INDEX "training_participants_sessionId_staffId_key" ON "public"."training_participants"("sessionId", "staffId");

-- AddForeignKey
ALTER TABLE "public"."staff_attendance" ADD CONSTRAINT "staff_attendance_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."leave_types" ADD CONSTRAINT "leave_types_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."leave_requests" ADD CONSTRAINT "leave_requests_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."leave_requests" ADD CONSTRAINT "leave_requests_leaveTypeId_fkey" FOREIGN KEY ("leaveTypeId") REFERENCES "public"."leave_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."leave_requests" ADD CONSTRAINT "leave_requests_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "public"."staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payroll_components" ADD CONSTRAINT "payroll_components_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."staff_payroll_components" ADD CONSTRAINT "staff_payroll_components_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."staff_payroll_components" ADD CONSTRAINT "staff_payroll_components_payrollComponentId_fkey" FOREIGN KEY ("payrollComponentId") REFERENCES "public"."payroll_components"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payrolls" ADD CONSTRAINT "payrolls_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."performance_reviews" ADD CONSTRAINT "performance_reviews_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."performance_reviews" ADD CONSTRAINT "performance_reviews_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "public"."staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."training_programs" ADD CONSTRAINT "training_programs_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."training_sessions" ADD CONSTRAINT "training_sessions_programId_fkey" FOREIGN KEY ("programId") REFERENCES "public"."training_programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."training_participants" ADD CONSTRAINT "training_participants_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."training_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."training_participants" ADD CONSTRAINT "training_participants_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;
