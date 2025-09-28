/**
 * PRISMA MASTER SEED FILE
 * Orchestrator untuk se    console.log('📈 FINAL DATA COUNTS:')
    console.log(`   🔑 Permissions: ${counts.permissions}`)
    console.log(`   👥 Roles: ${counts.roles}`)
    console.log(`   👤 Users: ${counts.users}`)
    console.log(`   🔗 User Roles: ${counts.userRoles}`)
    console.log(`   💳 Subscription Packages: ${counts.subscriptionPackages}`)
    console.log(`   🏢 SPPG Organizations: ${counts.sppgOrganizations}`)
    console.log(`   📋 Subscriptions: ${counts.subscriptions}`)
    console.log(`   🗺️ Provinces: ${counts.provinces}`)
    console.log(`   🏢 Regencies/Cities: ${counts.regencies}`)
    console.log(`   🏘️ Districts: ${counts.districts}`)
    console.log(`   🏠 Villages/Kelurahan: ${counts.villages}`)
    console.log(`   📊 Staff Members: ${await prisma.staff.count()}`)
    console.log(`   🏠 Facilities: ${await prisma.facility.count()}`)
    console.log(`   📦 Ingredients: ${await prisma.ingredient.count()}`)
    console.log(`   👨‍🍳 Daily Operations: ${await prisma.dailyOperation.count()}`)
    console.log(`   🚚 Distributions: ${await prisma.distribution.count()}`)
    console.log(`   👥 Beneficiaries: ${await prisma.beneficiary.count()}`)
    console.log(`   🍽️ Menus: ${await prisma.menu.count()}`)
    console.log(`   🧾 Recipes: ${await prisma.recipe.count()}`)
    console.log(`   📊 Production Records: ${await prisma.production.count()}`)
    console.log(`   🔄 Inventory Transactions: ${await prisma.inventoryTransaction.count()}`)
    console.log(`   🛒 Procurement Records: ${await prisma.procurement.count()}`)g operations
 * 
 * Structure:
 * - prisma/seed.ts (file ini) = Master orchestrator
 * - prisma/seeds/{model}-seed.ts = Individual model seeds
 */

import { PrismaClient } from '@prisma/client'

// Import all individual seeds
import seedRoles from './seeds/roles-seed'
import seedSubscriptions from './seeds/subscriptions-seed'
import seedRegions from './seeds/regions-seed'
import seedSuperAdmin from './seeds/superadmin-seed'
import seedSampleSPPGs from './seeds/sample-sppg-seed'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 STARTING COMPLETE SPPG PLATFORM SEEDING')
  console.log('='.repeat(60))
  
  try {
    // 1. Basic system data
    console.log('\n📊 PHASE 1: SYSTEM FOUNDATION')
    await seedRoles()
    await seedSubscriptions()
    
    // 2. SuperAdmin user
    console.log('\n📊 PHASE 2: PLATFORM ADMINISTRATOR')
    await seedSuperAdmin()
    
    // 3. Geographic data  
    console.log('\n📊 PHASE 3: GEOGRAPHIC DATA')
    await seedRegions()
    
    // 4. Sample SPPG organizations
    console.log('\n📊 PHASE 4: SAMPLE SPPG ORGANIZATIONS')
    await seedSampleSPPGs()
    
    // Success summary
    console.log('\n' + '='.repeat(60))
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!')
    console.log()
    
    // Verification counts
    const counts = {
      permissions: await prisma.permission.count(),
      roles: await prisma.role.count(),
      users: await prisma.user.count(),
      userRoles: await prisma.userRole.count(),
      subscriptionPackages: await prisma.subscriptionPackage.count(),
      sppgOrganizations: await prisma.sPPG.count(),
      subscriptions: await prisma.subscription.count(),
      provinces: await prisma.province.count(),
      regencies: await prisma.regency.count(),
      districts: await prisma.district.count(),
      villages: await prisma.village.count()
    }
    
    console.log('📈 FINAL DATA COUNTS:')
    console.log(`   � Permissions: ${counts.permissions}`)
    console.log(`   �🔐 Roles: ${counts.roles}`)
    console.log(`   👤 Users: ${counts.users}`)
    console.log(`   🔗 User Roles: ${counts.userRoles}`)
    console.log(`   💳 Subscription Packages: ${counts.subscriptionPackages}`)
    console.log(`   🗺️ Provinces: ${counts.provinces}`)
    console.log(`   🏢 Regencies/Cities: ${counts.regencies}`)
    console.log(`   🏘️ Districts: ${counts.districts}`)
    console.log(`   🏠 Villages/Kelurahan: ${counts.villages}`)
    
    console.log()
    console.log('✅ Database seeded successfully!')
    console.log('🚀 SPPG Platform is ready for development!')
    
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  }
}

// Execute seeding
main()
  .catch((e) => {
    console.error('❌ Fatal seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

export default main