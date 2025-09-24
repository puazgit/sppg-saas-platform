import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Leave Types Template untuk setiap SPPG
const DEFAULT_LEAVE_TYPES = [
  {
    name: 'Cuti Tahunan',
    code: 'ANNUAL',
    maxDaysPerYear: 12,
    carryOverDays: 6,
    requiresDocument: false
  },
  {
    name: 'Cuti Sakit',
    code: 'SICK',
    maxDaysPerYear: 30,
    carryOverDays: 0,
    requiresDocument: true
  },
  {
    name: 'Cuti Melahirkan',
    code: 'MATERNITY',
    maxDaysPerYear: 90,
    carryOverDays: 0,
    requiresDocument: true
  },
  {
    name: 'Cuti Menikah',
    code: 'MARRIAGE',
    maxDaysPerYear: 3,
    carryOverDays: 0,
    requiresDocument: true
  },
  {
    name: 'Cuti Khitan/Baptis Anak',
    code: 'CHILD_CEREMONY',
    maxDaysPerYear: 2,
    carryOverDays: 0,
    requiresDocument: true
  },
  {
    name: 'Cuti Kematian Keluarga',
    code: 'BEREAVEMENT',
    maxDaysPerYear: 5,
    carryOverDays: 0,
    requiresDocument: true
  }
]

// Payroll Components Template
const DEFAULT_PAYROLL_COMPONENTS = [
  // Earnings
  {
    name: 'Gaji Pokok',
    code: 'BASIC_SALARY',
    type: 'EARNING',
    calculationType: 'FIXED'
  },
  {
    name: 'Tunjangan Makan',
    code: 'MEAL_ALLOWANCE',
    type: 'EARNING',
    calculationType: 'FIXED',
    defaultAmount: 600000
  },
  {
    name: 'Tunjangan Transport',
    code: 'TRANSPORT_ALLOWANCE',
    type: 'EARNING',
    calculationType: 'FIXED',
    defaultAmount: 500000
  },
  {
    name: 'Tunjangan Kesehatan',
    code: 'HEALTH_ALLOWANCE',
    type: 'EARNING',
    calculationType: 'FIXED',
    defaultAmount: 300000
  },
  {
    name: 'Lembur',
    code: 'OVERTIME',
    type: 'EARNING',
    calculationType: 'HOURLY'
  },
  {
    name: 'Bonus Kinerja',
    code: 'PERFORMANCE_BONUS',
    type: 'EARNING',
    calculationType: 'FIXED'
  },
  
  // Statutory Deductions
  {
    name: 'PPh 21',
    code: 'INCOME_TAX',
    type: 'STATUTORY',
    calculationType: 'PERCENTAGE'
  },
  {
    name: 'BPJS Kesehatan',
    code: 'BPJS_HEALTH',
    type: 'STATUTORY',
    calculationType: 'PERCENTAGE',
    defaultAmount: 1 // 1% dari gaji
  },
  {
    name: 'BPJS Ketenagakerjaan',
    code: 'BPJS_EMPLOYMENT',
    type: 'STATUTORY',
    calculationType: 'PERCENTAGE',
    defaultAmount: 2 // 2% dari gaji
  },
  
  // Other Deductions
  {
    name: 'Potongan Keterlambatan',
    code: 'LATE_DEDUCTION',
    type: 'DEDUCTION',
    calculationType: 'FIXED'
  },
  {
    name: 'Pinjaman Karyawan',
    code: 'EMPLOYEE_LOAN',
    type: 'DEDUCTION',
    calculationType: 'FIXED'
  },
  {
    name: 'Seragam',
    code: 'UNIFORM_DEDUCTION',
    type: 'DEDUCTION',
    calculationType: 'FIXED'
  }
]

// Training Programs Template
const DEFAULT_TRAINING_PROGRAMS = [
  {
    title: 'Pelatihan Keamanan Pangan (HACCP)',
    description: 'Pelatihan dasar tentang sistem keamanan pangan HACCP untuk semua staff dapur',
    category: 'FOOD_SAFETY',
    duration: 16, // 16 jam
    maxParticipants: 20,
    cost: 500000
  },
  {
    title: 'Sertifikasi Halal',
    description: 'Pelatihan dan sertifikasi untuk memahami standar makanan halal',
    category: 'CERTIFICATION',
    duration: 8,
    maxParticipants: 15,
    cost: 300000
  },
  {
    title: 'Manajemen Inventori',
    description: 'Pelatihan pengelolaan inventori dan supply chain management',
    category: 'TECHNICAL',
    duration: 12,
    maxParticipants: 10,
    cost: 750000
  },
  {
    title: 'Kepemimpinan dan Manajemen Tim',
    description: 'Pelatihan soft skills untuk supervisor dan manager',
    category: 'LEADERSHIP',
    duration: 20,
    maxParticipants: 8,
    cost: 1200000
  },
  {
    title: 'Orientasi Karyawan Baru',
    description: 'Program orientasi untuk karyawan baru tentang kebijakan dan prosedur SPPG',
    category: 'ORIENTATION',
    duration: 4,
    maxParticipants: 25,
    cost: 0
  }
]

export async function seedLeaveTypes(sppgId: string) {
  console.log(`🏖️  Seeding Leave Types for SPPG: ${sppgId}...`)
  
  for (const leaveType of DEFAULT_LEAVE_TYPES) {
    await prisma.leaveType.upsert({
      where: {
        sppgId_code: {
          sppgId: sppgId,
          code: leaveType.code
        }
      },
      update: {},
      create: {
        ...leaveType,
        sppgId: sppgId
      }
    })
  }
  
  console.log(`✅ Leave types seeded for SPPG: ${sppgId}!`)
}

export async function seedPayrollComponents(sppgId: string) {
  console.log(`💰 Seeding Payroll Components for SPPG: ${sppgId}...`)
  
  for (const component of DEFAULT_PAYROLL_COMPONENTS) {
    await prisma.payrollComponent.upsert({
      where: {
        sppgId_code: {
          sppgId: sppgId,
          code: component.code
        }
      },
      update: {},
      create: {
        ...component,
        sppgId: sppgId,
        type: component.type as 'EARNING' | 'DEDUCTION' | 'STATUTORY'
      }
    })
  }
  
  console.log(`✅ Payroll components seeded for SPPG: ${sppgId}!`)
}

export async function seedTrainingPrograms(sppgId: string) {
  console.log(`🎓 Seeding Training Programs for SPPG: ${sppgId}...`)
  
  for (const program of DEFAULT_TRAINING_PROGRAMS) {
    // Check if program already exists
    const existing = await prisma.trainingProgram.findFirst({
      where: {
        sppgId: sppgId,
        title: program.title
      }
    })
    
    if (!existing) {
      await prisma.trainingProgram.create({
        data: {
          ...program,
          sppgId: sppgId
        }
      })
    }
  }
  
  console.log(`✅ Training programs seeded for SPPG: ${sppgId}!`)
}

export async function seedSampleAttendance(staffId: string) {
  console.log(`📅 Seeding Sample Attendance for Staff: ${staffId}...`)
  
  // Create attendance for last 30 days
  const today = new Date()
  const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000))
  
  for (let i = 0; i < 22; i++) { // 22 working days in a month
    const date = new Date(thirtyDaysAgo.getTime() + (i * 24 * 60 * 60 * 1000))
    
    // Skip weekends (assuming 5-day work week)
    if (date.getDay() === 0 || date.getDay() === 6) continue
    
    const checkInTime = new Date(date)
    checkInTime.setHours(8, Math.floor(Math.random() * 30), 0, 0) // 8:00-8:30 AM
    
    const checkOutTime = new Date(date)
    checkOutTime.setHours(17, Math.floor(Math.random() * 30), 0, 0) // 5:00-5:30 PM
    
    const workHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60) - 1 // minus 1 hour lunch
    
    await prisma.staffAttendance.upsert({
      where: {
        staffId_date: {
          staffId: staffId,
          date: date
        }
      },
      update: {},
      create: {
        staffId: staffId,
        date: date,
        checkIn: checkInTime,
        checkOut: checkOutTime,
        breakStart: new Date(checkInTime.getTime() + (4 * 60 * 60 * 1000)), // 4 hours after check in
        breakEnd: new Date(checkInTime.getTime() + (5 * 60 * 60 * 1000)), // 1 hour lunch
        workHours: workHours,
        breakHours: 1,
        status: Math.random() > 0.05 ? 'PRESENT' : 'LATE' // 95% present, 5% late
      }
    })
  }
  
  console.log(`✅ Sample attendance seeded for Staff: ${staffId}!`)
}

export async function seedHRDataForSPPG(sppgId: string) {
  console.log(`🏢 Seeding Complete HR Data for SPPG: ${sppgId}...`)
  
  await seedLeaveTypes(sppgId)
  await seedPayrollComponents(sppgId)
  await seedTrainingPrograms(sppgId)
  
  // Get staff for this SPPG and create sample attendance
  const staff = await prisma.staff.findMany({
    where: { sppgId: sppgId },
    take: 3 // Only for first 3 staff members
  })
  
  for (const staffMember of staff) {
    await seedSampleAttendance(staffMember.id)
  }
  
  console.log(`✅ Complete HR data seeded for SPPG: ${sppgId}!`)
}

export async function seedHRDataForAllSPPGs() {
  console.log('🏢 Seeding HR Data for All SPPGs...')
  
  const sppgs = await prisma.sPPG.findMany({
    select: { id: true, name: true }
  })
  
  if (sppgs.length === 0) {
    console.log('No SPPGs found. Please seed SPPGs first.')
    return
  }
  
  for (const sppg of sppgs) {
    console.log(`Processing SPPG: ${sppg.name}`)
    await seedHRDataForSPPG(sppg.id)
  }
  
  console.log('✅ HR data seeded for all SPPGs!')
}

export async function seedHRSystem() {
  console.log('🏢 Starting Complete HR System Seeding...')
  
  await seedHRDataForAllSPPGs()
  
  console.log('✅ Complete HR system seeded successfully!')
}