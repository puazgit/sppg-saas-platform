import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedBasicNutrition() {
  console.log('🥗 Creating basic nutrition data...')
  
  try {
    // Create AKG Standard
    console.log('Creating AKG Standard...')
    const standard = await prisma.nutritionStandard.create({
      data: {
        name: 'AKG Indonesia 2019',
        description: 'Angka Kecukupan Gizi Indonesia 2019',
        version: '1.0',
        publishedBy: 'Kementerian Kesehatan RI',
        publishedDate: new Date('2019-01-01'),
        validFrom: new Date('2019-01-01'),
        isActive: true,
        isDefault: true
      }
    })
    
    console.log('✅ AKG Standard created!')
    return standard.id
    
  } catch (error) {
    console.log('Standard might already exist, skipping...')
    const existing = await prisma.nutritionStandard.findFirst({
      where: { name: 'AKG Indonesia 2019' }
    })
    return existing?.id
  }
}

export async function seedBasicPackage() {  
  console.log('📦 Creating basic subscription package...')
  
  try {
    await prisma.subscriptionPackage.create({
      data: {
        name: 'SPPG Basic',
        displayName: 'Paket Basic SPPG', 
        description: 'Paket dasar untuk SPPG',
        tier: 'BASIC',
        monthlyPrice: 500000,
        maxRecipients: 1000,
        maxStaff: 5,
        maxDistributionPoints: 3,
        maxMenusPerMonth: 50,
        storageGb: 1,
        maxReportsPerMonth: 10,
        supportLevel: 'EMAIL',
        hasNutritionAnalysis: true,
        hasCostCalculation: true,
        isActive: true
      }
    })
    
    console.log('✅ Basic package created!')
    
  } catch {
    console.log('Package might already exist, skipping...')
  }
}

export async function seedBasicCosts() {
  console.log('💰 Creating basic cost categories...')
  
  try {
    await prisma.costCategory.create({
      data: {
        name: 'Bahan Pokok',
        type: 'INGREDIENT',
        description: 'Biaya bahan makanan pokok'
      }
    })
    
    await prisma.costCategory.create({
      data: {
        name: 'Tenaga Kerja', 
        type: 'LABOR',
        description: 'Biaya tenaga kerja'
      }
    })
    
    console.log('✅ Basic cost categories created!')
    
  } catch {
    console.log('Cost categories might already exist, skipping...')
  }
}

export async function runBasicSeed() {
  console.log('🌱 Starting basic seed...')
  
  await seedBasicNutrition()
  await seedBasicPackage() 
  await seedBasicCosts()
  
  console.log('✅ Basic seed completed!')
}