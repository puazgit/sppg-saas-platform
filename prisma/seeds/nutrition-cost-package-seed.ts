import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// AKG Indonesia 2019 (Kemenkes RI)
const AKG_INDONESIA_2019 = {
  standard: {
    name: 'AKG Indonesia 2019',
    description: 'Angka Kebutuhan Gizi Indonesia berdasarkan Peraturan Menteri Kesehatan RI Nomor 28 Tahun 2019',
    version: '2019',
    country: 'Indonesia',
    publishedBy: 'Kementerian Kesehatan Republik Indonesia',
    publishedDate: new Date('2019-08-01'),
    validFrom: new Date('2019-08-01'),
    isActive: true,
    isDefault: true
  },
  requirements: [
    // Bayi 0-6 bulan
    { ageGroup: 'INFANT_0_6_MONTHS', gender: null, calories: 550, protein: 12, fat: 31, carbohydrate: 58, fiber: 0, calcium: 200, iron: 0.3, vitaminA: 375, vitaminC: 40 },
    
    // Bayi 7-11 bulan
    { ageGroup: 'INFANT_7_11_MONTHS', gender: null, calories: 725, protein: 18, fat: 36, carbohydrate: 82, fiber: 11, calcium: 250, iron: 7, vitaminA: 400, vitaminC: 50 },
    
    // Balita 1-3 tahun
    { ageGroup: 'TODDLER_1_3_YEARS', gender: null, calories: 1125, protein: 26, fat: 44, carbohydrate: 155, fiber: 16, calcium: 650, iron: 8, vitaminA: 400, vitaminC: 40 },
    
    // Anak 4-6 tahun
    { ageGroup: 'CHILD_4_6_YEARS', gender: null, calories: 1600, protein: 35, fat: 62, carbohydrate: 220, fiber: 22, calcium: 1000, iron: 9, vitaminA: 450, vitaminC: 45 },
    
    // Anak 7-9 tahun
    { ageGroup: 'CHILD_7_9_YEARS', gender: null, calories: 1850, protein: 49, fat: 72, carbohydrate: 254, fiber: 26, calcium: 1000, iron: 10, vitaminA: 500, vitaminC: 45 },
    
    // Anak 10-12 tahun Laki-laki
    { ageGroup: 'CHILD_10_12_YEARS', gender: 'MALE', calories: 2100, protein: 56, fat: 82, carbohydrate: 289, fiber: 30, calcium: 1200, iron: 13, vitaminA: 600, vitaminC: 50 },
    
    // Anak 10-12 tahun Perempuan
    { ageGroup: 'CHILD_10_12_YEARS', gender: 'FEMALE', calories: 2000, protein: 60, fat: 78, carbohydrate: 275, fiber: 28, calcium: 1200, iron: 20, vitaminA: 600, vitaminC: 50 },
    
    // Remaja 13-15 tahun Laki-laki
    { ageGroup: 'TEEN_13_15_YEARS', gender: 'MALE', calories: 2400, protein: 72, fat: 93, carbohydrate: 330, fiber: 34, calcium: 1200, iron: 19, vitaminA: 600, vitaminC: 75 },
    
    // Remaja 13-15 tahun Perempuan
    { ageGroup: 'TEEN_13_15_YEARS', gender: 'FEMALE', calories: 2125, protein: 69, fat: 83, carbohydrate: 292, fiber: 30, calcium: 1200, iron: 26, vitaminA: 600, vitaminC: 65 },
    
    // Remaja 16-18 tahun Laki-laki
    { ageGroup: 'TEEN_16_18_YEARS', gender: 'MALE', calories: 2650, protein: 66, fat: 103, carbohydrate: 365, fiber: 37, calcium: 1200, iron: 15, vitaminA: 700, vitaminC: 90 },
    
    // Remaja 16-18 tahun Perempuan
    { ageGroup: 'TEEN_16_18_YEARS', gender: 'FEMALE', calories: 2125, protein: 62, fat: 83, carbohydrate: 292, fiber: 30, calcium: 1200, iron: 26, vitaminA: 600, vitaminC: 75 },
    
    // Dewasa 19-29 tahun Laki-laki
    { ageGroup: 'ADULT_19_29_YEARS', gender: 'MALE', calories: 2650, protein: 65, fat: 103, carbohydrate: 365, fiber: 37, calcium: 1000, iron: 9, vitaminA: 650, vitaminC: 90 },
    
    // Dewasa 19-29 tahun Perempuan
    { ageGroup: 'ADULT_19_29_YEARS', gender: 'FEMALE', calories: 2250, protein: 60, fat: 88, carbohydrate: 309, fiber: 32, calcium: 1000, iron: 18, vitaminA: 600, vitaminC: 75 },
    
    // Dewasa 30-49 tahun Laki-laki
    { ageGroup: 'ADULT_30_49_YEARS', gender: 'MALE', calories: 2650, protein: 65, fat: 103, carbohydrate: 365, fiber: 37, calcium: 1000, iron: 9, vitaminA: 650, vitaminC: 90 },
    
    // Dewasa 30-49 tahun Perempuan
    { ageGroup: 'ADULT_30_49_YEARS', gender: 'FEMALE', calories: 2250, protein: 60, fat: 88, carbohydrate: 309, fiber: 32, calcium: 1000, iron: 18, vitaminA: 600, vitaminC: 75 },
    
    // Dewasa 50-64 tahun Laki-laki
    { ageGroup: 'ADULT_50_64_YEARS', gender: 'MALE', calories: 2250, protein: 65, fat: 88, carbohydrate: 309, fiber: 32, calcium: 1000, iron: 9, vitaminA: 650, vitaminC: 90 },
    
    // Dewasa 50-64 tahun Perempuan
    { ageGroup: 'ADULT_50_64_YEARS', gender: 'FEMALE', calories: 1900, protein: 60, fat: 74, carbohydrate: 261, fiber: 27, calcium: 1000, iron: 12, vitaminA: 600, vitaminC: 75 },
    
    // Lansia 65+ Laki-laki
    { ageGroup: 'ELDERLY_65_PLUS', gender: 'MALE', calories: 1800, protein: 64, fat: 70, carbohydrate: 247, fiber: 25, calcium: 1000, iron: 9, vitaminA: 650, vitaminC: 90 },
    
    // Lansia 65+ Perempuan
    { ageGroup: 'ELDERLY_65_PLUS', gender: 'FEMALE', calories: 1550, protein: 58, fat: 61, carbohydrate: 213, fiber: 22, calcium: 1000, iron: 8, vitaminA: 600, vitaminC: 75 },
    
    // Ibu Hamil (tambahan)
    { ageGroup: 'PREGNANT', gender: 'FEMALE', calories: 2500, protein: 75, fat: 97, carbohydrate: 344, fiber: 35, calcium: 1200, iron: 27, vitaminA: 800, vitaminC: 85 },
    
    // Ibu Menyusui (tambahan)
    { ageGroup: 'LACTATING', gender: 'FEMALE', calories: 2700, protein: 80, fat: 105, carbohydrate: 372, fiber: 38, calcium: 1200, iron: 9, vitaminA: 850, vitaminC: 120 }
  ]
}

// Default Subscription Packages
const SUBSCRIPTION_PACKAGES = [
  {
    name: 'BASIC',
    displayName: 'Paket Dasar',
    description: 'Cocok untuk SPPG kecil dengan kebutuhan dasar',
    tier: 'BASIC',
    monthlyPrice: 500000, // Rp 500,000
    yearlyPrice: 5000000, // Rp 5,000,000 (2 bulan gratis)
    setupFee: 0,
    maxRecipients: 500,
    maxStaff: 10,
    maxDistributionPoints: 5,
    maxMenusPerMonth: 50,
    storageGb: 5,
    maxReportsPerMonth: 10,
    hasAdvancedReporting: false,
    hasNutritionAnalysis: false,
    hasCostCalculation: false,
    hasQualityControl: false,
    hasAPIAccess: false,
    hasCustomBranding: false,
    hasPrioritySupport: false,
    hasTrainingIncluded: false,
    supportLevel: 'EMAIL',
    responseTimeSLA: '48 hours',
    isActive: true,
    isPopular: false,
    highlightFeatures: ['Menu Planning Dasar', 'Inventory Management', 'Laporan Standar', 'Support Email'],
    targetMarket: 'SPPG Kecil - Pedesaan',
    features: [
      { featureName: 'Maksimal Penerima', featureValue: '500 orang', category: 'Kapasitas' },
      { featureName: 'Maksimal Staff', featureValue: '10 orang', category: 'Kapasitas' },
      { featureName: 'Titik Distribusi', featureValue: '5 lokasi', category: 'Kapasitas' },
      { featureName: 'Menu per Bulan', featureValue: '50 menu', category: 'Kapasitas' },
      { featureName: 'Storage', featureValue: '5 GB', category: 'Storage' },
      { featureName: 'Laporan per Bulan', featureValue: '10 laporan', category: 'Reporting' },
      { featureName: 'Support', featureValue: 'Email (48 jam)', category: 'Support' }
    ]
  },
  {
    name: 'STANDARD',
    displayName: 'Paket Standar',
    description: 'Untuk SPPG menengah dengan fitur analisis nutrisi',
    tier: 'STANDARD',
    monthlyPrice: 1500000, // Rp 1,500,000
    yearlyPrice: 15000000, // Rp 15,000,000
    setupFee: 500000, // Rp 500,000
    maxRecipients: 2000,
    maxStaff: 25,
    maxDistributionPoints: 15,
    maxMenusPerMonth: 150,
    storageGb: 25,
    maxReportsPerMonth: 50,
    hasAdvancedReporting: true,
    hasNutritionAnalysis: true,
    hasCostCalculation: true,
    hasQualityControl: false,
    hasAPIAccess: false,
    hasCustomBranding: false,
    hasPrioritySupport: false,
    hasTrainingIncluded: true,
    supportLevel: 'CHAT',
    responseTimeSLA: '24 hours',
    isActive: true,
    isPopular: true,
    highlightFeatures: ['Analytics Nutrisi AKG', 'Kalkulasi Biaya', 'Advanced Reporting', 'Training Gratis'],
    targetMarket: 'SPPG Menengah - Perkotaan',
    features: [
      { featureName: 'Maksimal Penerima', featureValue: '2,000 orang', category: 'Kapasitas', isHighlight: true },
      { featureName: 'Maksimal Staff', featureValue: '25 orang', category: 'Kapasitas' },
      { featureName: 'Titik Distribusi', featureValue: '15 lokasi', category: 'Kapasitas' },
      { featureName: 'Menu per Bulan', featureValue: '150 menu', category: 'Kapasitas' },
      { featureName: 'Storage', featureValue: '25 GB', category: 'Storage' },
      { featureName: 'Analisis Nutrisi AKG', featureValue: 'Ya', category: 'Features', isHighlight: true },
      { featureName: 'Kalkulasi Biaya', featureValue: 'Ya', category: 'Features', isHighlight: true },
      { featureName: 'Advanced Reporting', featureValue: 'Ya', category: 'Reporting' },
      { featureName: 'Training', featureValue: 'Termasuk', category: 'Support', isHighlight: true },
      { featureName: 'Support', featureValue: 'Chat (24 jam)', category: 'Support' }
    ]
  },
  {
    name: 'PRO',
    displayName: 'Paket Professional',
    description: 'Untuk SPPG besar dengan quality control dan API access',
    tier: 'PRO',
    monthlyPrice: 3500000, // Rp 3,500,000
    yearlyPrice: 35000000, // Rp 35,000,000
    setupFee: 1000000, // Rp 1,000,000
    maxRecipients: 10000,
    maxStaff: 75,
    maxDistributionPoints: 50,
    maxMenusPerMonth: 500,
    storageGb: 100,
    maxReportsPerMonth: 200,
    hasAdvancedReporting: true,
    hasNutritionAnalysis: true,
    hasCostCalculation: true,
    hasQualityControl: true,
    hasAPIAccess: true,
    hasCustomBranding: true,
    hasPrioritySupport: true,
    hasTrainingIncluded: true,
    supportLevel: 'PHONE',
    responseTimeSLA: '4 hours',
    isActive: true,
    isPopular: false,
    highlightFeatures: ['Quality Control', 'API Access', 'Custom Branding', 'Priority Support'],
    targetMarket: 'SPPG Besar - Multi Kota',
    features: [
      { featureName: 'Maksimal Penerima', featureValue: '10,000 orang', category: 'Kapasitas', isHighlight: true },
      { featureName: 'Maksimal Staff', featureValue: '75 orang', category: 'Kapasitas' },
      { featureName: 'Titik Distribusi', featureValue: '50 lokasi', category: 'Kapasitas' },
      { featureName: 'Menu per Bulan', featureValue: '500 menu', category: 'Kapasitas' },
      { featureName: 'Storage', featureValue: '100 GB', category: 'Storage' },
      { featureName: 'Semua Fitur Standard', featureValue: 'Ya', category: 'Features' },
      { featureName: 'Quality Control', featureValue: 'Ya', category: 'Features', isHighlight: true },
      { featureName: 'API Access', featureValue: 'Ya', category: 'Integration', isHighlight: true },
      { featureName: 'Custom Branding', featureValue: 'Ya', category: 'Features', isHighlight: true },
      { featureName: 'Priority Support', featureValue: 'Phone (4 jam)', category: 'Support', isHighlight: true }
    ]
  },
  {
    name: 'ENTERPRISE',
    displayName: 'Paket Enterprise',
    description: 'Solusi khusus untuk SPPG skala nasional dengan dedicated support',
    tier: 'ENTERPRISE',
    monthlyPrice: 7500000, // Rp 7,500,000
    yearlyPrice: 75000000, // Rp 75,000,000
    setupFee: 2500000, // Rp 2,500,000
    maxRecipients: 100000,
    maxStaff: 500,
    maxDistributionPoints: 500,
    maxMenusPerMonth: 2000,
    storageGb: 1000,
    maxReportsPerMonth: 1000,
    hasAdvancedReporting: true,
    hasNutritionAnalysis: true,
    hasCostCalculation: true,
    hasQualityControl: true,
    hasAPIAccess: true,
    hasCustomBranding: true,
    hasPrioritySupport: true,
    hasTrainingIncluded: true,
    supportLevel: 'DEDICATED',
    responseTimeSLA: '1 hour',
    isActive: true,
    isPopular: false,
    highlightFeatures: ['Unlimited Scale', 'Dedicated Support', 'Custom Development', 'SLA 1 Jam'],
    targetMarket: 'SPPG Nasional - Multi Provinsi',
    features: [
      { featureName: 'Maksimal Penerima', featureValue: '100,000+ orang', category: 'Kapasitas', isHighlight: true },
      { featureName: 'Maksimal Staff', featureValue: '500 orang', category: 'Kapasitas' },
      { featureName: 'Titik Distribusi', featureValue: '500+ lokasi', category: 'Kapasitas' },
      { featureName: 'Menu per Bulan', featureValue: 'Unlimited', category: 'Kapasitas' },
      { featureName: 'Storage', featureValue: '1 TB', category: 'Storage' },
      { featureName: 'Semua Fitur Pro', featureValue: 'Ya', category: 'Features' },
      { featureName: 'Custom Development', featureValue: 'Ya', category: 'Features', isHighlight: true },
      { featureName: 'Dedicated Support', featureValue: 'Ya', category: 'Support', isHighlight: true },
      { featureName: 'SLA Response', featureValue: '1 jam', category: 'Support', isHighlight: true },
      { featureName: 'On-site Training', featureValue: 'Ya', category: 'Support', isHighlight: true }
    ]
  }
]

// Default Cost Categories
const DEFAULT_COST_CATEGORIES = [
  { name: 'Beras', type: 'INGREDIENT', defaultRate: 12000, unit: 'per kg' },
  { name: 'Daging Ayam', type: 'INGREDIENT', defaultRate: 35000, unit: 'per kg' },
  { name: 'Sayuran', type: 'INGREDIENT', defaultRate: 8000, unit: 'per kg' },
  { name: 'Minyak Goreng', type: 'INGREDIENT', defaultRate: 15000, unit: 'per liter' },
  { name: 'Bumbu Dapur', type: 'INGREDIENT', defaultRate: 5000, unit: 'per kg' },
  
  { name: 'Chef/Juru Masak', type: 'LABOR', defaultRate: 100000, unit: 'per hari' },
  { name: 'Asisten Dapur', type: 'LABOR', defaultRate: 75000, unit: 'per hari' },
  { name: 'Driver Distribusi', type: 'LABOR', defaultRate: 125000, unit: 'per hari' },
  
  { name: 'Gas LPG', type: 'UTILITIES', defaultRate: 25000, unit: 'per tabung' },
  { name: 'Listrik', type: 'UTILITIES', defaultRate: 1500, unit: 'per kWh' },
  { name: 'Air', type: 'UTILITIES', defaultRate: 8000, unit: 'per m3' },
  
  { name: 'Kotak Makan', type: 'PACKAGING', defaultRate: 2000, unit: 'per pcs' },
  { name: 'Plastik Wrap', type: 'PACKAGING', defaultRate: 500, unit: 'per pcs' },
  
  { name: 'Bensin Kendaraan', type: 'TRANSPORTATION', defaultRate: 10000, unit: 'per liter' },
  { name: 'Maintenance Kendaraan', type: 'TRANSPORTATION', defaultRate: 50000, unit: 'per hari' },
  
  { name: 'Sewa Dapur', type: 'OVERHEAD', isFixedCost: true, defaultRate: 5000000, unit: 'per bulan' },
  { name: 'Asuransi', type: 'OVERHEAD', isFixedCost: true, defaultRate: 500000, unit: 'per bulan' }
]

export async function seedNutritionStandards() {
  console.log('🥗 Seeding Nutrition Standards & AKG...')

  // Create AKG Indonesia 2019 standard
  const standard = await prisma.nutritionStandard.upsert({
    where: { name_version: { name: AKG_INDONESIA_2019.standard.name, version: AKG_INDONESIA_2019.standard.version } },
    update: {},
    create: AKG_INDONESIA_2019.standard
  })

    // Create nutrition requirements
    for (const req of AKG_INDONESIA_2019.requirements) {
      // Check if requirement already exists
      const existingReq = await prisma.nutritionRequirement.findFirst({
        where: {
          standardId: standard.id,
          ageGroup: req.ageGroup as 'INFANT_0_6_MONTHS' | 'INFANT_7_11_MONTHS' | 'TODDLER_1_3_YEARS' | 'CHILD_4_6_YEARS' | 'CHILD_7_9_YEARS' | 'CHILD_10_12_YEARS' | 'TEEN_13_15_YEARS' | 'TEEN_16_18_YEARS' | 'ADULT_19_29_YEARS' | 'ADULT_30_49_YEARS' | 'ADULT_50_64_YEARS' | 'ELDERLY_65_PLUS' | 'PREGNANT' | 'LACTATING',
          gender: req.gender as 'MALE' | 'FEMALE' | null
        }
      })
      
      if (!existingReq) {
        await prisma.nutritionRequirement.create({
          data: {
            standardId: standard.id,
            ageGroup: req.ageGroup as 'INFANT_0_6_MONTHS' | 'INFANT_7_11_MONTHS' | 'TODDLER_1_3_YEARS' | 'CHILD_4_6_YEARS' | 'CHILD_7_9_YEARS' | 'CHILD_10_12_YEARS' | 'TEEN_13_15_YEARS' | 'TEEN_16_18_YEARS' | 'ADULT_19_29_YEARS' | 'ADULT_30_49_YEARS' | 'ADULT_50_64_YEARS' | 'ELDERLY_65_PLUS' | 'PREGNANT' | 'LACTATING',
            gender: req.gender as 'MALE' | 'FEMALE' | null,
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
    }  console.log('✅ AKG Indonesia 2019 seeded successfully!')
}

export async function seedSubscriptionPackages() {
  console.log('💳 Seeding Subscription Packages...')

  for (const pkg of SUBSCRIPTION_PACKAGES) {
    const { features, ...packageData } = pkg
    
    const createdPackage = await prisma.subscriptionPackage.upsert({
      where: { name: pkg.name },
      update: {},
      create: {
        ...packageData,
        tier: packageData.tier as 'BASIC' | 'STANDARD' | 'PRO' | 'ENTERPRISE'
      }
    })

    // Create package features
    for (const [index, feature] of features.entries()) {
      // Check if feature already exists
      const existingFeature = await prisma.subscriptionPackageFeature.findFirst({
        where: {
          packageId: createdPackage.id,
          featureName: feature.featureName
        }
      })
      
      if (!existingFeature) {
        await prisma.subscriptionPackageFeature.create({
          data: {
            packageId: createdPackage.id,
            featureName: feature.featureName,
            featureValue: feature.featureValue,
            category: feature.category,
            isHighlight: feature.isHighlight || false,
            displayOrder: index + 1
          }
        })
      }
    }
  }

  console.log('✅ Subscription packages seeded successfully!')
}

export async function seedDefaultCostCategories() {
  console.log('💰 Seeding Default Cost Categories...')

  for (const category of DEFAULT_COST_CATEGORIES) {
    // Check if category already exists
    const existingCategory = await prisma.costCategory.findFirst({
      where: {
        sppgId: null,
        name: category.name
      }
    })
    
    if (!existingCategory) {
      await prisma.costCategory.create({
        data: {
          ...category,
          type: category.type as 'INGREDIENT' | 'LABOR' | 'UTILITIES' | 'PACKAGING' | 'TRANSPORTATION' | 'OVERHEAD' | 'OTHER',
          description: `Default ${category.type.toLowerCase()} cost category`
        }
      })
    }
  }

  console.log('✅ Default cost categories seeded successfully!')
}