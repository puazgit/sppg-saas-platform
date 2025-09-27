import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedMarketingModels() {
  console.log('🎯 Seeding marketing models...')

  try {
    // 1. Special Offers
    const specialOffers = await prisma.specialOffer.createMany({
      data: [
        {
          title: 'Early Adopter Discount 2025',
          description: 'Dapatkan potongan 40% untuk 6 bulan pertama + setup gratis + training eksklusif',
          discountPercentage: 40,
          validFrom: new Date('2025-01-01'),
          validUntil: new Date('2025-06-30'),
          active: true,
          termsConditions: 'Berlaku untuk SPPG baru yang mendaftar sebelum 30 Juni 2025. Tidak dapat digabung dengan promo lain.',
          maxUsage: 100,
          currentUsage: 23,
          targetAudience: ['NEW_CUSTOMERS'],
          applicablePackages: ['STANDARD', 'PRO', 'ENTERPRISE']
        },
        {
          title: 'Government Partnership Program',
          description: 'Diskon khusus 25% untuk SPPG pemerintah daerah dengan komitmen 2 tahun',
          discountPercentage: 25,
          validFrom: new Date('2025-01-01'),
          validUntil: new Date('2025-12-31'),
          active: true,
          termsConditions: 'Berlaku untuk instansi pemerintah dengan kontrak minimum 24 bulan. Verifikasi dokumen diperlukan.',
          maxUsage: 200,
          currentUsage: 45,
          targetAudience: ['NEW_CUSTOMERS', 'EXISTING'],
          applicablePackages: ['PRO', 'ENTERPRISE']
        }
      ],
      skipDuplicates: true
    })

    console.log(`✅ Created ${specialOffers.count} special offers`)
    console.log('🎯 Marketing models seeding completed!')

  } catch (error) {
    console.error('❌ Error seeding marketing models:', error)
    throw error
  }
}

async function seedSubscriptionPackages() {
  console.log('🔄 Seeding subscription packages...')

  // Clear existing packages
  await prisma.subscriptionPackage.deleteMany({})

  // Create subscription packages
  const packages = await prisma.subscriptionPackage.createMany({
    data: [
      {
        name: 'BASIC',
        displayName: 'Paket Dasar',
        description: 'Cocok untuk SPPG kecil dengan operasi dasar',
        tier: 'BASIC',
        monthlyPrice: 2500000, // Rp 2.5jt
        yearlyPrice: 25000000, // Rp 25jt (2 bulan gratis)
        setupFee: 0,
        maxRecipients: 5000,
        maxStaff: 10,
        maxDistributionPoints: 3,
        maxMenusPerMonth: 50,
        storageGb: 10,
        maxReportsPerMonth: 20,
        hasAdvancedReporting: false,
        hasNutritionAnalysis: true,
        hasCostCalculation: false,
        hasQualityControl: false,
        hasAPIAccess: false,
        hasCustomBranding: false,
        hasPrioritySupport: false,
        hasTrainingIncluded: true,
        supportLevel: 'EMAIL',
        responseTimeSLA: '24 hours',
        isActive: true,
        isPopular: false,
        isCustom: false,
        highlightFeatures: [
          'Perencanaan menu bulanan',
          'Manajemen inventori basic',
          'Laporan dasar',
          'Dashboard sederhana',
          'Support email',
          'Mobile app access'
        ],
        targetMarket: 'Small SPPG'
      },
      {
        name: 'STANDARD',
        displayName: 'Paket Standar',
        description: 'Ideal untuk SPPG menengah dengan kebutuhan lengkap',
        tier: 'STANDARD',
        monthlyPrice: 4500000, // Rp 4.5jt
        yearlyPrice: 45000000, // Rp 45jt
        setupFee: 0,
        maxRecipients: 15000,
        maxStaff: 25,
        maxDistributionPoints: 8,
        maxMenusPerMonth: 100,
        storageGb: 50,
        maxReportsPerMonth: 50,
        hasAdvancedReporting: true,
        hasNutritionAnalysis: true,
        hasCostCalculation: true,
        hasQualityControl: true,
        hasAPIAccess: false,
        hasCustomBranding: false,
        hasPrioritySupport: false,
        hasTrainingIncluded: true,
        supportLevel: 'PHONE',
        responseTimeSLA: '4 hours',
        isActive: true,
        isPopular: true,
        isCustom: false,
        highlightFeatures: [
          'Semua fitur BASIC',
          'Analisis gizi otomatis',
          'Manajemen supplier',
          'Advanced reporting',
          'Real-time analytics',
          'WhatsApp notifications',
          'Bulk import data',
          'Quality control system'
        ],
        targetMarket: 'Medium SPPG'
      },
      {
        name: 'PRO',
        displayName: 'Paket Professional',
        description: 'Untuk SPPG besar dengan kebutuhan advanced',
        tier: 'PRO',
        monthlyPrice: 7500000, // Rp 7.5jt
        yearlyPrice: 75000000, // Rp 75jt
        setupFee: 0,
        maxRecipients: 50000,
        maxStaff: 50,
        maxDistributionPoints: 15,
        maxMenusPerMonth: 200,
        storageGb: 200,
        maxReportsPerMonth: 100,
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
        isCustom: false,
        highlightFeatures: [
          'Semua fitur STANDARD',
          'AI menu optimization',
          'Predictive analytics',
          'Custom workflows',
          'Advanced integrations',
          'White-label options',
          'Priority support',
          'Custom reports'
        ],
        targetMarket: 'Large SPPG'
      },
      {
        name: 'ENTERPRISE',
        displayName: 'Paket Enterprise',
        description: 'Solusi custom untuk organisasi besar dan multi-wilayah',
        tier: 'ENTERPRISE',
        monthlyPrice: 0, // Custom pricing
        yearlyPrice: 0,
        setupFee: 0,
        maxRecipients: 999999,
        maxStaff: 999999,
        maxDistributionPoints: 999999,
        maxMenusPerMonth: 999999,
        storageGb: 1000,
        maxReportsPerMonth: 999999,
        hasAdvancedReporting: true,
        hasNutritionAnalysis: true,
        hasCostCalculation: true,
        hasQualityControl: true,
        hasAPIAccess: true,
        hasCustomBranding: true,
        hasPrioritySupport: true,
        hasTrainingIncluded: true,
        supportLevel: 'DEDICATED',
        responseTimeSLA: '30 minutes',
        isActive: true,
        isPopular: false,
        isCustom: true,
        highlightFeatures: [
          'Semua fitur PRO',
          'Unlimited users & facilities',
          'Custom development',
          'On-premise deployment',
          'Advanced security',
          'SLA guarantee',
          '24/7 dedicated support',
          'Custom training program'
        ],
        targetMarket: 'Enterprise'
      }
    ]
  })

  console.log(`✅ Created ${packages.count} subscription packages`)
}

async function main() {
  try {
    await seedMarketingModels()
    await seedSubscriptionPackages()
    console.log('🎉 Marketing seed completed successfully!')
  } catch (error) {
    console.error('❌ Error seeding marketing data:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}

export { seedSubscriptionPackages }