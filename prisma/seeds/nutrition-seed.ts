import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedNutritionStandards() {
  console.log('🥗 Seeding Nutrition Standards...')
  
  try {
    // Create AKG Indonesia 2019 Standard
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
        description: 'Angka Kecukupan Gizi Indonesia tahun 2019 dari Kementerian Kesehatan RI',
        version: '1.0',
        country: 'Indonesia',
        publishedBy: 'Kementerian Kesehatan Republik Indonesia',
        publishedDate: new Date('2019-01-01'),
        validFrom: new Date('2019-01-01'),
        isActive: true,
        isDefault: true
      }
    })
    
    console.log('✅ AKG Indonesia 2019 standard created!')
    return akgStandard.id
    
  } catch (error) {
    console.log('Standard might already exist, finding existing...')
    const existing = await prisma.nutritionStandard.findFirst({
      where: { name: 'AKG Indonesia 2019' }
    })
    return existing?.id
  }
}

export async function seedNutritionRequirements(standardId: string) {
  console.log('📊 Seeding Basic Nutrition Requirements...')
  
  // Basic AKG requirements for common age groups
  const basicRequirements = [
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
      ageGroup: 'CHILDREN_4_6',
      gender: null,
      calories: 1600,
      protein: 35,
      fat: 62,
      carbohydrate: 220,
      fiber: 22,
      calcium: 1000,
      iron: 9,
      vitaminA: 450,
      vitaminC: 45
    },
    {
      ageGroup: 'CHILDREN_7_9',
      gender: null,
      calories: 1850,
      protein: 49,
      fat: 72,
      carbohydrate: 254,
      fiber: 26,
      calcium: 1000,
      iron: 10,
      vitaminA: 500,
      vitaminC: 45
    },
    {
      ageGroup: 'ADOLESCENT_10_12',
      gender: 'MALE',
      calories: 2100,
      protein: 56,
      fat: 82,
      carbohydrate: 289,
      fiber: 30,
      calcium: 1200,
      iron: 13,
      vitaminA: 600,
      vitaminC: 50
    },
    {
      ageGroup: 'ADOLESCENT_10_12',
      gender: 'FEMALE',
      calories: 2000,
      protein: 60,
      fat: 78,
      carbohydrate: 275,
      fiber: 28,
      calcium: 1200,
      iron: 20,
      vitaminA: 600,
      vitaminC: 50
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
    },
    {
      ageGroup: 'ELDERLY',
      gender: 'MALE',
      calories: 2050,
      protein: 64,
      fat: 57,
      carbohydrate: 333,
      fiber: 28,
      calcium: 1000,
      iron: 9,
      vitaminA: 600,
      vitaminC: 90
    },
    {
      ageGroup: 'ELDERLY',
      gender: 'FEMALE',
      calories: 1700,
      protein: 58,
      fat: 47,
      carbohydrate: 276,
      fiber: 23,
      calcium: 1000,
      iron: 8,
      vitaminA: 500,
      vitaminC: 75
    }
  ]
  
  for (const req of basicRequirements) {
    try {
      await prisma.nutritionRequirement.upsert({
        where: {
          standardId_ageGroup_gender_specialCondition: {
            standardId: standardId,
            ageGroup: req.ageGroup as any,
            gender: req.gender as any,
            specialCondition: null
          }
        },
        update: {},
        create: {
          standardId: standardId,
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
    } catch {
      // Skip if already exists
      console.log(`Requirement for ${req.ageGroup} ${req.gender || 'ALL'} already exists, skipping...`)
    }
  }
  
  console.log('✅ Basic nutrition requirements seeded!')
}

export async function seedNutritionData() {
  console.log('🍎 Starting Nutrition Data Seeding...')
  
  const standardId = await seedNutritionStandards()
  if (standardId) {
    await seedNutritionRequirements(standardId)
  }
  
  console.log('✅ Nutrition data seeded successfully!')
}