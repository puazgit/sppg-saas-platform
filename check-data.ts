import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkData() {
  console.log('🔍 Checking seeded data...')
  
  try {
    // Check nutrition standards
    const nutritionStandards = await prisma.nutritionStandard.findMany({
      select: {
        id: true,
        name: true,
        version: true,
        isActive: true
      }
    })
    console.log('📊 Nutrition Standards:', nutritionStandards.length)
    nutritionStandards.forEach(std => console.log(`  - ${std.name} v${std.version}`))
    
    // Check subscription packages
    const packages = await prisma.subscriptionPackage.findMany({
      select: {
        id: true,
        name: true,
        tier: true,
        monthlyPrice: true,
        hasNutritionAnalysis: true,
        hasCostCalculation: true
      }
    })
    console.log('\n📦 Subscription Packages:', packages.length)
    packages.forEach(pkg => console.log(`  - ${pkg.name} (${pkg.tier}) - Rp${pkg.monthlyPrice.toLocaleString()}`))
    
    // Check cost categories
    const costCategories = await prisma.costCategory.findMany({
      select: {
        id: true,
        name: true,
        type: true
      }
    })
    console.log('\n💰 Cost Categories:', costCategories.length)
    costCategories.forEach(cat => console.log(`  - ${cat.name} (${cat.type})`))
    
    console.log('\n✅ Data check completed!')
    
  } catch (error) {
    console.error('❌ Error checking data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkData()