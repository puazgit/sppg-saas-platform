// Enhanced HR Models untuk SPPG Platform
// Tambahkan ini ke schema.prisma setelah model Staff yang sudah ada

// === ATTENDANCE MANAGEMENT ===
model StaffAttendance {
  id              String @id @default(cuid())
  staffId         String
  date            DateTime @db.Date
  
  // Check in/out times
  checkIn         DateTime?
  checkOut        DateTime?
  breakStart      DateTime?
  breakEnd        DateTime?
  
  // Calculated hours
  workHours       Float? // Jam kerja aktual
  overtimeHours   Float? // Jam lembur
  breakHours      Float? // Jam istirahat
  
  // Status
  status          AttendanceStatus @default(PRESENT)
  notes           String? // Catatan khusus
  
  // Relations
  staff           Staff @relation(fields: [staffId], references: [id], onDelete: Cascade)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@unique([staffId, date])
  @@index([date, status])
  @@map("staff_attendance")
}

// === LEAVE MANAGEMENT ===
model LeaveType {
  id              String @id @default(cuid())
  sppgId          String
  name            String // Cuti Tahunan, Cuti Sakit, Cuti Melahirkan, dll
  code            String // ANNUAL, SICK, MATERNITY, etc
  maxDaysPerYear  Int
  carryOverDays   Int @default(0) // Hari yang bisa dibawa ke tahun berikutnya
  requiresDocument Boolean @default(false) // Butuh surat keterangan dokter, dll
  isActive        Boolean @default(true)
  
  sppg            SPPG @relation(fields: [sppgId], references: [id], onDelete: Cascade)
  leaveRequests   LeaveRequest[]
  
  @@unique([sppgId, code])
  @@map("leave_types")
}

model LeaveRequest {
  id              String @id @default(cuid())
  staffId         String
  leaveTypeId     String
  
  startDate       DateTime @db.Date
  endDate         DateTime @db.Date
  totalDays       Int
  reason          String
  document        String? // URL to supporting document
  
  status          LeaveStatus @default(PENDING)
  approvedBy      String? // Staff ID yang approve
  approvedAt      DateTime?
  rejectionReason String?
  
  staff           Staff @relation(fields: [staffId], references: [id], onDelete: Cascade)
  leaveType       LeaveType @relation(fields: [leaveTypeId], references: [id])
  approver        Staff? @relation("LeaveApprover", fields: [approvedBy], references: [id])
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([staffId, status])
  @@index([startDate, endDate])
  @@map("leave_requests")
}

// === PAYROLL MANAGEMENT ===
model PayrollComponent {
  id              String @id @default(cuid())
  sppgId          String
  name            String // Gaji Pokok, Tunjangan Makan, BPJS, Pajak, dll
  code            String // BASIC_SALARY, MEAL_ALLOWANCE, BPJS, TAX
  type            PayrollComponentType
  calculationType String // FIXED, PERCENTAGE, HOURLY
  defaultAmount   Float?
  isActive        Boolean @default(true)
  
  sppg            SPPG @relation(fields: [sppgId], references: [id], onDelete: Cascade)
  staffPayrollComponents StaffPayrollComponent[]
  
  @@unique([sppgId, code])
  @@map("payroll_components")
}

model StaffPayrollComponent {
  id                  String @id @default(cuid())
  staffId             String
  payrollComponentId  String
  amount              Float
  isActive            Boolean @default(true)
  
  staff               Staff @relation(fields: [staffId], references: [id], onDelete: Cascade)
  payrollComponent    PayrollComponent @relation(fields: [payrollComponentId], references: [id])
  
  @@unique([staffId, payrollComponentId])
  @@map("staff_payroll_components")
}

model Payroll {
  id              String @id @default(cuid())
  staffId         String
  periodMonth     Int // 1-12
  periodYear      Int
  
  // Earnings
  basicSalary     Float
  allowances      Float @default(0)
  overtime        Float @default(0)
  bonus           Float @default(0)
  grossSalary     Float
  
  // Deductions
  tax             Float @default(0)
  bpjs            Float @default(0)
  insurance       Float @default(0)
  loan            Float @default(0)
  otherDeductions Float @default(0)
  totalDeductions Float
  
  // Net
  netSalary       Float
  
  // Status
  status          PayrollStatus @default(DRAFT)
  paidAt          DateTime?
  paymentMethod   String? // BANK_TRANSFER, CASH
  paymentReference String? // No referensi transfer
  
  staff           Staff @relation(fields: [staffId], references: [id], onDelete: Cascade)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@unique([staffId, periodMonth, periodYear])
  @@index([periodYear, periodMonth])
  @@map("payrolls")
}

// === PERFORMANCE MANAGEMENT ===
model PerformanceReview {
  id              String @id @default(cuid())
  staffId         String
  reviewerId      String
  reviewPeriod    String // Q1-2024, 2024-Annual, etc
  
  overallRating   Float // 1-5 scale
  goals           Json // Array of goals dengan progress
  strengths       String[]
  improvements    String[]
  comments        String?
  
  status          ReviewStatus @default(DRAFT)
  submittedAt     DateTime?
  acknowledgedAt  DateTime? // Kapan staff acknowledge review
  
  staff           Staff @relation(fields: [staffId], references: [id], onDelete: Cascade)
  reviewer        Staff @relation("PerformanceReviewer", fields: [reviewerId], references: [id])
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([staffId, reviewPeriod])
  @@map("performance_reviews")
}

// === TRAINING & CERTIFICATION ===
model TrainingProgram {
  id              String @id @default(cuid())
  sppgId          String
  title           String
  description     String?
  category        String // FOOD_SAFETY, LEADERSHIP, TECHNICAL, etc
  duration        Int // durasi dalam jam
  maxParticipants Int?
  cost            Float?
  isActive        Boolean @default(true)
  
  sppg            SPPG @relation(fields: [sppgId], references: [id], onDelete: Cascade)
  trainingSessions TrainingSession[]
  
  @@map("training_programs")
}

model TrainingSession {
  id              String @id @default(cuid())
  programId       String
  title           String
  startDate       DateTime
  endDate         DateTime
  location        String?
  instructor      String?
  maxParticipants Int?
  status          TrainingStatus @default(SCHEDULED)
  
  program         TrainingProgram @relation(fields: [programId], references: [id], onDelete: Cascade)
  participants    TrainingParticipant[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("training_sessions")
}

model TrainingParticipant {
  id              String @id @default(cuid())
  sessionId       String
  staffId         String
  
  status          ParticipantStatus @default(REGISTERED)
  completionDate  DateTime?
  score           Float? // 0-100
  certificateUrl  String?
  feedback        String?
  
  session         TrainingSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  staff           Staff @relation(fields: [staffId], references: [id], onDelete: Cascade)
  
  @@unique([sessionId, staffId])
  @@map("training_participants")
}

// === ENUMS ===
enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
  HALF_DAY
  SICK_LEAVE
  ANNUAL_LEAVE
  UNPAID_LEAVE
  HOLIDAY
}

enum LeaveStatus {
  PENDING
  APPROVED
  REJECTED
  CANCELLED
}

enum PayrollComponentType {
  EARNING
  DEDUCTION
  STATUTORY // BPJS, Tax, etc
}

enum PayrollStatus {
  DRAFT
  APPROVED
  PAID
  CANCELLED
}

enum ReviewStatus {
  DRAFT
  SUBMITTED
  ACKNOWLEDGED
  COMPLETED
}

enum TrainingStatus {
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum ParticipantStatus {
  REGISTERED
  ATTENDED
  COMPLETED
  ABSENT
  CANCELLED
}

// === UPDATE STAFF MODEL ===
// Tambahkan relations ini ke model Staff yang sudah ada:
/*
model Staff {
  // ... existing fields ...
  
  // New HR Relations
  attendance              StaffAttendance[]
  leaveRequests          LeaveRequest[]
  approvedLeaves         LeaveRequest[] @relation("LeaveApprover")
  payrollComponents      StaffPayrollComponent[]
  payrolls               Payroll[]
  performanceReviews     PerformanceReview[]
  conductedReviews       PerformanceReview[] @relation("PerformanceReviewer")
  trainingParticipations TrainingParticipant[]
  
  // ... existing relations ...
}
*/