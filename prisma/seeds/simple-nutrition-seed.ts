import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Sample AKG data (simplified)
const SIMPLE_AKG_DATA = [
  {
    ageGroup: 'CHILDREN_1_3' as const,
    gender: 'MALE' as const,
    energy: 1125,
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
    ageGroup: 'CHILDREN_1_3' as const,
    gender: 'FEMALE' as const,
    energy: 1125,
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
    ageGroup: 'ADULT' as const,
    gender: 'MALE' as const,
    energy: 2650,
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
    ageGroup: 'ADULT' as const,
    gender: 'FEMALE' as const,
    energy: 2150,
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

// Simple subscription packages
const SIMPLE_PACKAGES = [
  {
    name: 'SPPG Basic',
    tier: 'BASIC' as const,
    price: 500000,
    billingCycle: 'MONTHLY' as const,
    maxUsers: 5,
    maxMenus: 50,
    maxRecipes: 100,
    isActive: true,
    features: [
      { featureName: 'Menu Planning', featureValue: 'Basic', category: 'CORE' },
      { featureName: 'Max Users', featureValue: '5', category: 'LIMITS' }
    ]
  },
  {
    name: 'SPPG Standard',
    tier: 'STANDARD' as const,
    price: 1000000,
    billingCycle: 'MONTHLY' as const,
    maxUsers: 15,
    maxMenus: 200,
    maxRecipes: 500,
    isActive: true,
    features: [
      { featureName: 'Menu Planning', featureValue: 'Advanced', category: 'CORE' },
      { featureName: 'Max Users', featureValue: '15', category: 'LIMITS' }
    ]
  }
]

// Simple cost categories
const SIMPLE_COST_CATEGORIES = [
  { name: 'Bahan Pokok', type: 'INGREDIENT' as const },
  { name: 'Tenaga Kerja', type: 'LABOR' as const },
  { name: 'Utilitas', type: 'UTILITIES' as const },
  { name: 'Kemasan', type: 'PACKAGING' as const }
]

export async function seedSimpleNutrition() {
  console.log('🥗 Seeding Simple AKG Standards...')
  
  for (const standard of SIMPLE_AKG_DATA) {
    const existing = await prisma.nutritionStandard.findFirst({
      where: {
        ageGroup: standard.ageGroup,
        gender: standard.gender
      }
    })
    
    if (!existing) {
      await prisma.nutritionStandard.create({
        data: {
          ...standard,
          source: 'AKG Indonesia 2019',
          isActive: true
        }
      })
    }
  }
  
  console.log('✅ Simple AKG standards seeded!')
}

export async function seedSimplePackages() {
  console.log('📦 Seeding Simple Subscription Packages...')
  
  for (const pkg of SIMPLE_PACKAGES) {
    const { features, ...packageData } = pkg
    
    const existing = await prisma.subscriptionPackage.findFirst({
      where: { name: pkg.name }
    })
    
    if (!existing) {
      const createdPackage = await prisma.subscriptionPackage.create({
        data: packageData
      })
      
      // Add features
      for (const [index, feature] of features.entries()) {
        await prisma.subscriptionPackageFeature.create({
          data: {
            packageId: createdPackage.id,
            featureName: feature.featureName,
            featureValue: feature.featureValue,
            category: feature.category,
            displayOrder: index + 1
          }
        })
      }
    }
  }
  
  console.log('✅ Simple packages seeded!')
}

export async function seedSimpleCostCategories() {
  console.log('💰 Seeding Simple Cost Categories...')
  
  for (const category of SIMPLE_COST_CATEGORIES) {
    const existing = await prisma.costCategory.findFirst({
      where: {
        sppgId: null,
        name: category.name
      }
    })
    
    if (!existing) {
      await prisma.costCategory.create({
        data: {
          sppgId: null,
          name: category.name,
          type: category.type,
          description: `Default ${category.type.toLowerCase()} cost category`,
          isActive: true
        }
      })
    }
  }
  
  console.log('✅ Simple cost categories seeded!')
}