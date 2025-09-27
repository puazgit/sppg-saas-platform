import { PrismaClient } from '@prisma/client'
import { seedRBAC } from './seeds/rbac-seed'
import { seedRegionalData, seedNotificationTemplates } from './seeds/regional-seed'
import { runBasicSeed } from './seeds/basic-seed'
import { seedStaffModule } from './seeds/staff-seed'
import { seedHRSystem } from './seeds/hr-seed'
import { seedSubscriptionPackages } from './seeds/marketing-seed'
import { seedCaseStudies } from './seeds/case-studies-seed'
import { seedMarketingModels } from './seeds/marketing-hero-seed'

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
    
    // 7. Seed Marketing Data (Subscription Packages)
    await seedSubscriptionPackages()
    
    // 8. Seed Marketing Hero Features & Trust Indicators
    await seedMarketingModels()
    
    // 9. Seed Case Studies Data  
    await seedCaseStudies()
    
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