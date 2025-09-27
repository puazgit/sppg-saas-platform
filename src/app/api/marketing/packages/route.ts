import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get subscription packages from database
    const packages = await prisma.subscriptionPackage.findMany({
      where: { isActive: true },
      orderBy: { tier: 'asc' },
      include: {
        packageFeatures: true
      }
    })

    const subscriptionData = packages.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      tier: pkg.tier,
      monthlyPrice: pkg.monthlyPrice,
      yearlyPrice: pkg.yearlyPrice,
      description: pkg.description,
      // Clean features list - only unique capabilities, no redundant capacity info
      features: [
        ...(pkg.hasNutritionAnalysis ? ['Analisis nutrisi otomatis'] : []),
        ...(pkg.hasCostCalculation ? ['Kalkulasi biaya real-time'] : []),
        ...(pkg.hasQualityControl ? ['Quality control system'] : []),
        ...(pkg.hasAPIAccess ? ['API integration'] : []),
        ...(pkg.hasCustomBranding ? ['Custom branding'] : []),
        ...(pkg.hasPrioritySupport ? ['Priority support'] : []),
        ...(pkg.hasTrainingIncluded ? ['Training included'] : []),
        ...(pkg.hasAdvancedReporting ? ['Advanced analytics & reporting'] : ['Laporan standar'])
      ].filter(Boolean),
      // Simplified - remove redundant limitations
      limitations: [
        ...(pkg.storageGb > 0 && pkg.storageGb < 500 ? [`${pkg.storageGb}GB storage`] : []),
        ...(pkg.maxReportsPerMonth > 0 && pkg.maxReportsPerMonth < 1000 ? [`${pkg.maxReportsPerMonth} laporan/bulan`] : [])
      ],
      // Clean capacity data without redundancy
      maxRecipients: pkg.maxRecipients,
      maxStaff: pkg.maxStaff,
      maxDistributionPoints: pkg.maxDistributionPoints,
      maxUsers: pkg.maxStaff || -1,
      maxSchools: pkg.maxDistributionPoints || -1,
      supportLevel: pkg.supportLevel,
      isPopular: pkg.isPopular,
      isEnterprise: pkg.tier === 'ENTERPRISE'
    }))

    return NextResponse.json({ 
      packages: subscriptionData,
      success: true,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching packages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch packages' },
      { status: 500 }
    )
  }
}