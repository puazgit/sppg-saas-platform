import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Sample staff data untuk testing
const SAMPLE_STAFF = [
  {
    employeeId: 'SPPG001',
    name: 'Budi Santoso',
    email: 'budi.santoso@sppg.id',
    phone: '081234567890',
    address: 'Jl. Sudirman No. 123, Jakarta',
    birthDate: new Date('1985-05-15'),
    gender: 'MALE',
    role: 'SPPG_MANAGER',
    department: 'Management',
    salary: 8000000,
    haccpCertified: true,
    halalCertified: true,
    specialSkills: ['Leadership', 'Food Safety Management', 'Operational Planning']
  },
  {
    employeeId: 'SPPG002',
    name: 'Siti Nurhaliza',
    email: 'siti.nurhaliza@sppg.id',
    phone: '081234567891',
    address: 'Jl. Thamrin No. 456, Jakarta',
    birthDate: new Date('1988-08-20'),
    gender: 'FEMALE',
    role: 'HEAD_CHEF',
    department: 'Kitchen',
    salary: 6000000,
    haccpCertified: true,
    halalCertified: true,
    specialSkills: ['Culinary Arts', 'Menu Planning', 'Nutrition Knowledge', 'Team Leadership']
  },
  {
    employeeId: 'SPPG003',
    name: 'Ahmad Firdaus',
    email: 'ahmad.firdaus@sppg.id',
    phone: '081234567892',
    address: 'Jl. Gatot Subroto No. 789, Jakarta',
    birthDate: new Date('1990-03-10'),
    gender: 'MALE',
    role: 'PRODUCTION_SUPERVISOR',
    department: 'Production',
    salary: 5000000,
    haccpCertified: true,
    halalCertified: false,
    specialSkills: ['Production Planning', 'Quality Control', 'Team Management']
  },
  {
    employeeId: 'SPPG004',
    name: 'Dewi Sartika',
    email: 'dewi.sartika@sppg.id',
    phone: '081234567893',
    address: 'Jl. HR Rasuna Said No. 321, Jakarta',
    birthDate: new Date('1992-11-25'),
    gender: 'FEMALE',
    role: 'DISTRIBUTION_COORDINATOR',
    department: 'Distribution',
    salary: 4500000,
    haccpCertified: false,
    halalCertified: false,
    specialSkills: ['Logistics', 'Route Planning', 'Customer Service']
  },
  {
    employeeId: 'SPPG005',
    name: 'Rizki Pratama',
    email: 'rizki.pratama@sppg.id',
    phone: '081234567894',
    address: 'Jl. Kuningan No. 654, Jakarta',
    birthDate: new Date('1987-07-12'),
    gender: 'MALE',
    role: 'INVENTORY_ADMIN',
    department: 'Inventory',
    salary: 4000000,
    haccpCertified: false,
    halalCertified: false,
    specialSkills: ['Inventory Management', 'Data Analysis', 'Computer Skills']
  },
  {
    employeeId: 'SPPG006',
    name: 'Maya Indah',
    email: 'maya.indah@sppg.id',
    phone: '081234567895',
    address: 'Jl. Senayan No. 987, Jakarta',
    birthDate: new Date('1991-01-30'),
    gender: 'FEMALE',
    role: 'QUALITY_CONTROL',
    department: 'Quality Assurance',
    salary: 4200000,
    haccpCertified: true,
    halalCertified: true,
    specialSkills: ['Food Safety', 'Quality Testing', 'Documentation']
  },
  {
    employeeId: 'SPPG007',
    name: 'Joni Iskandar',
    email: 'joni.iskandar@sppg.id',
    phone: '081234567896',
    address: 'Jl. Kemang No. 147, Jakarta',
    birthDate: new Date('1993-04-18'),
    gender: 'MALE',
    role: 'DRIVER',
    department: 'Distribution',
    salary: 3500000,
    haccpCertified: false,
    halalCertified: false,
    specialSkills: ['Safe Driving', 'Vehicle Maintenance', 'Route Knowledge']
  },
  {
    employeeId: 'SPPG008',
    name: 'Lina Marlina',
    email: 'lina.marlina@sppg.id',
    phone: '081234567897',
    address: 'Jl. Menteng No. 258, Jakarta',
    birthDate: new Date('1989-09-05'),
    gender: 'FEMALE',
    role: 'ASSISTANT_CHEF',
    department: 'Kitchen',
    salary: 3800000,
    haccpCertified: true,
    halalCertified: true,
    specialSkills: ['Food Preparation', 'Recipe Following', 'Kitchen Safety']
  }
]

export async function seedStaffData(sppgId: string) {
  console.log(`👥 Seeding Staff Data for SPPG: ${sppgId}...`)
  
  try {
    for (const staffData of SAMPLE_STAFF) {
      // Check if staff already exists
      const existingStaff = await prisma.staff.findFirst({
        where: {
          sppgId: sppgId,
          employeeId: staffData.employeeId
        }
      })
      
      if (!existingStaff) {
        await prisma.staff.create({
          data: {
            ...staffData,
            sppgId: sppgId,
            role: staffData.role as 'SPPG_MANAGER' | 'PRODUCTION_SUPERVISOR' | 'HEAD_CHEF' | 'ASSISTANT_CHEF' | 'DISTRIBUTION_COORDINATOR' | 'DRIVER' | 'INVENTORY_ADMIN' | 'QUALITY_CONTROL' | 'FIELD_STAFF',
            gender: staffData.gender as 'MALE' | 'FEMALE'
          }
        })
        console.log(`  ✅ Created staff: ${staffData.name} (${staffData.employeeId})`)
      } else {
        console.log(`  ⏭️  Staff ${staffData.name} already exists, skipping...`)
      }
    }
    
    console.log(`✅ Staff data seeded for SPPG: ${sppgId}!`)
    
  } catch (error) {
    console.error(`❌ Error seeding staff data:`, error)
    throw error
  }
}

// Function to create basic staff for multiple SPPGs
export async function seedBasicStaffForAllSPPGs() {
  console.log('👥 Seeding Basic Staff for All SPPGs...')
  
  try {
    // Get all SPPGs
    const sppgs = await prisma.sPPG.findMany({
      select: { id: true, name: true }
    })
    
    if (sppgs.length === 0) {
      console.log('No SPPGs found. Please seed SPPGs first.')
      return
    }
    
    // Create basic staff for each SPPG
    for (const sppg of sppgs) {
      console.log(`Creating staff for SPPG: ${sppg.name}`)
      
      // Create at least a manager and a chef for each SPPG
      const basicStaffTemplate = [
        {
          employeeId: `${sppg.id.slice(-3).toUpperCase()}001`,
          name: `Manager SPPG ${sppg.name}`,
          email: `manager.${sppg.id}@sppg.id`,
          phone: '081234567890',
          gender: 'MALE',
          role: 'SPPG_MANAGER',
          department: 'Management',
          salary: 6000000,
          specialSkills: ['Leadership', 'Management']
        },
        {
          employeeId: `${sppg.id.slice(-3).toUpperCase()}002`,
          name: `Chef SPPG ${sppg.name}`,
          email: `chef.${sppg.id}@sppg.id`,
          phone: '081234567891',
          gender: 'FEMALE',
          role: 'HEAD_CHEF',
          department: 'Kitchen',
          salary: 5000000,
          haccpCertified: true,
          halalCertified: true,
          specialSkills: ['Culinary Arts', 'Menu Planning']
        }
      ]
      
      for (const staff of basicStaffTemplate) {
        const existingStaff = await prisma.staff.findFirst({
          where: {
            sppgId: sppg.id,
            employeeId: staff.employeeId
          }
        })
        
        if (!existingStaff) {
          await prisma.staff.create({
            data: {
              ...staff,
              sppgId: sppg.id,
              role: staff.role as 'SPPG_MANAGER' | 'PRODUCTION_SUPERVISOR' | 'HEAD_CHEF' | 'ASSISTANT_CHEF' | 'DISTRIBUTION_COORDINATOR' | 'DRIVER' | 'INVENTORY_ADMIN' | 'QUALITY_CONTROL' | 'FIELD_STAFF',
              gender: staff.gender as 'MALE' | 'FEMALE'
            }
          })
        }
      }
    }
    
    console.log('✅ Basic staff seeded for all SPPGs!')
    
  } catch (error) {
    console.error('❌ Error seeding basic staff:', error)
    throw error
  }
}

export async function seedStaffModule() {
  console.log('👥 Starting Staff Module Seeding...')
  
  await seedBasicStaffForAllSPPGs()
  
  console.log('✅ Staff module seeded successfully!')
}