/**
 * SUBSCRIPTION SEED - Subscription Packages & Tiers
 * Seeding untuk paket subscription dan pricing
 */

import { PrismaClient, SubscriptionTier } from '@prisma/client'

const prisma = new PrismaClient()

async function seedSubscriptions() {
  console.log('💳 Seeding subscription packages...')
  
  // Subscription packages
  const packages = [
    {
      name: 'BASIC',
      displayName: 'Paket Dasar',
      description: 'Paket dasar untuk SPPG kecil',
      tier: SubscriptionTier.BASIC,
      monthlyPrice: 99000,
      yearlyPrice: 990000,
      setupFee: 0,
      maxRecipients: 100,
      maxStaff: 5,
      maxDistributionPoints: 1,
      maxMenusPerMonth: 30,
      storageGb: 5,
      maxReportsPerMonth: 10,
      hasAdvancedReporting: false,
      hasNutritionAnalysis: false,
      hasCostCalculation: true,
      hasQualityControl: false,
      hasAPIAccess: false,
      hasCustomBranding: false,
      hasPrioritySupport: false,
      hasTrainingIncluded: false,
      supportLevel: 'EMAIL',
      responseTimeSLA: '24 hours',
      isActive: true,
      isPopular: false,
      highlightFeatures: [
        'Maksimal 100 penerima manfaat',
        'Menu planning dasar',
        'Inventory tracking',
        'Laporan bulanan',
        'Support email'
      ],
      targetMarket: 'Small SPPG'
    },
    {
      name: 'STANDARD',
      displayName: 'Paket Standar',
      description: 'Paket standar untuk SPPG menengah',
      tier: SubscriptionTier.STANDARD,
      monthlyPrice: 199000,
      yearlyPrice: 1990000,
      setupFee: 0,
      maxRecipients: 500,
      maxStaff: 20,
      maxDistributionPoints: 3,
      maxMenusPerMonth: 100,
      storageGb: 20,
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
      responseTimeSLA: '12 hours',
      isActive: true,
      isPopular: true,
      highlightFeatures: [
        'Maksimal 500 penerima manfaat',
        'Menu planning advanced',
        'Nutrition analysis',
        'Multi-location support',
        'Laporan real-time'
      ],
      targetMarket: 'Medium SPPG'
    },
    {
      name: 'PRO',
      displayName: 'Paket Profesional',
      description: 'Paket profesional untuk SPPG besar',
      tier: SubscriptionTier.PRO,
      monthlyPrice: 399000,
      yearlyPrice: 3990000,
      setupFee: 0,
      maxRecipients: 2000,
      maxStaff: 100,
      maxDistributionPoints: 10,
      maxMenusPerMonth: 500,
      storageGb: 100,
      maxReportsPerMonth: 200,
      hasAdvancedReporting: true,
      hasNutritionAnalysis: true,
      hasCostCalculation: true,
      hasQualityControl: true,
      hasAPIAccess: true,
      hasCustomBranding: false,
      hasPrioritySupport: true,
      hasTrainingIncluded: true,
      supportLevel: 'PHONE',
      responseTimeSLA: '4 hours',
      isActive: true,
      isPopular: false,
      highlightFeatures: [
        'Maksimal 2000 penerima manfaat',
        'AI-powered menu optimization',
        'Advanced analytics',
        'API access',
        'Priority support'
      ],
      targetMarket: 'Large SPPG'
    },
    {
      name: 'ENTERPRISE',
      displayName: 'Paket Enterprise',
      description: 'Paket enterprise untuk organisasi besar',
      tier: SubscriptionTier.ENTERPRISE,
      monthlyPrice: 799000,
      yearlyPrice: 7990000,
      setupFee: 100000,
      maxRecipients: 10000,
      maxStaff: 1000,
      maxDistributionPoints: 100,
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
      highlightFeatures: [
        'Unlimited scale',
        'Full platform access',
        'Custom integrations',
        'White-label options',
        'SLA guarantee',
        '24/7 dedicated support'
      ],
      targetMarket: 'Enterprise'
    }
  ]

  for (const pkg of packages) {
    await prisma.subscriptionPackage.upsert({
      where: { name: pkg.name },
      update: pkg,
      create: pkg
    })
  }

  console.log(`✅ Created ${packages.length} subscription packages`)
}

if (require.main === module) {
  seedSubscriptions()
    .catch((e) => {
      console.error('❌ Subscriptions seeding failed:', e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

export default seedSubscriptions