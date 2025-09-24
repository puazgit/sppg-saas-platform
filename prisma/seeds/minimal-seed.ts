import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedMinimalData() {
  console.log('🌱 Seeding minimal nutrition and package data...')
  
  try {
    // 1. Create AKG Nutrition Standard
    const akgStandard = await prisma.nutritionStandard.upsert({
      where: { 
        name_version: {
          name: 'AKG Indonesia 2019',
          version: '1.0'
        }
      },
      update: {},
      create: {
        name: 'AKG Indonesia 2019',
        description: 'Angka Kecukupan Gizi Indonesia 2019',
        version: '1.0',
        country: 'Indonesia',
        publishedBy: 'Kementerian Kesehatan RI',
        publishedDate: new Date('2019-01-01'),
        validFrom: new Date('2019-01-01'),
        isActive: true,
        isDefault: true
      }
    })
    
    // 2. Create simple nutrition requirements
    const requirements = [
      {
        ageGroup: 'CHILDREN_1_3',
        gender: null,
        calories: 1125,
        protein: 26,
        fat: 44,
        carbohydrate: 155,
        fiber: 16,
        calcium: 650,
        iron: 8,
        vitaminA: 400,
        vitaminC: 40
      },
      {
        ageGroup: 'ADULT',
        gender: 'MALE',
        calories: 2650,
        protein: 65,
        fat: 73,
        carbohydrate: 430,
        fiber: 37,
        calcium: 1000,
        iron: 9,
        vitaminA: 600,
        vitaminC: 90
      },
      {
        ageGroup: 'ADULT',
        gender: 'FEMALE',
        calories: 2150,
        protein: 60,
        fat: 59,
        carbohydrate: 350,
        fiber: 30,
        calcium: 1000,
        iron: 18,
        vitaminA: 500,
        vitaminC: 75
      }
    ]
    
    for (const req of requirements) {
      await prisma.nutritionRequirement.upsert({
        where: {
          standardId_ageGroup_gender_specialCondition: {
            standardId: akgStandard.id,
            ageGroup: req.ageGroup as any,
            gender: req.gender as any,
            specialCondition: null
          }
        },
        update: {},
        create: {
          standardId: akgStandard.id,
          ageGroup: req.ageGroup as any,
          gender: req.gender as any,
          calories: req.calories,
          protein: req.protein,
          fat: req.fat,
          carbohydrate: req.carbohydrate,
          fiber: req.fiber,
          calcium: req.calcium,
          iron: req.iron,
          vitaminA: req.vitaminA,
          vitaminC: req.vitaminC
        }
      })
    }
    
    // 3. Create basic subscription package
    await prisma.subscriptionPackage.upsert({
      where: { name: 'SPPG Basic' },
      update: {},
      create: {
        name: 'SPPG Basic',
        displayName: 'Paket Basic SPPG',
        description: 'Paket basic untuk SPPG kecil',
        tier: 'BASIC',
        monthlyPrice: 500000,
        billingCycle: 'MONTHLY',
        maxUsers: 5,
        maxMenus: 50,
        maxRecipes: 100,
        maxRecipients: 1000,
        storageLimit: 1024, // 1GB in MB
        supportLevel: 'EMAIL',
        isActive: true,
        isPopular: false
      }
    })
    
    // 4. Create basic cost categories
    const costCategories = [
      { name: 'Bahan Pokok', type: 'INGREDIENT' },
      { name: 'Tenaga Kerja', type: 'LABOR' },
      { name: 'Utilitas', type: 'UTILITIES' }
    ]
    
    for (const category of costCategories) {
      await prisma.costCategory.upsert({
        where: {
          sppgId_name: {
            sppgId: null,
            name: category.name
          }
        },
        update: {},
        create: {
          sppgId: null,
          name: category.name,
          type: category.type as any,
          description: `Kategori biaya ${category.name.toLowerCase()}`
        }
      })
    }
    
    console.log('✅ Minimal data seeded successfully!')
    
  } catch (error) {
    console.error('❌ Error seeding minimal data:', error)
    throw error
  }
}