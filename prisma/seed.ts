import { PrismaClient } from '@prisma/client'
import { seedRBAC } from './seeds/rbac-seed'
import { seedRegionalData, seedNotificationTemplates } from './seeds/regional-seed'
import { runBasicSeed } from './seeds/basic-seed'
import { seedStaffModule } from './seeds/staff-seed'
import { seedHRSystem } from './seeds/hr-seed'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')
  
  try {
    // 1. Seed Regional Data (base data)
    await seedRegionalData()
    
    // 2. Seed RBAC System
    await seedRBAC()
    
    // 3. Seed Notification Templates
    await seedNotificationTemplates()
    
    // 4. Seed Basic Nutrition & Package Data
    await runBasicSeed()
    
    // 5. Seed Staff Data
    await seedStaffModule()
    
    // 6. Seed Complete HR System
    await seedHRSystem()
    
    console.log('✅ Database seeding completed successfully!')
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })