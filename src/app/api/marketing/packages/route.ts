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
      features: [
        ...(pkg.maxRecipients > 0 ? [`Maksimal ${pkg.maxRecipients.toLocaleString()} penerima`] : ['Unlimited penerima']),
        ...(pkg.maxStaff > 0 ? [`Maksimal ${pkg.maxStaff} staff`] : ['Unlimited staff']),
        ...(pkg.maxDistributionPoints > 0 ? [`${pkg.maxDistributionPoints} titik distribusi`] : ['Unlimited titik distribusi']),
        ...(pkg.hasAdvancedReporting ? ['Advanced reporting'] : ['Basic reporting']),
        ...(pkg.hasNutritionAnalysis ? ['Analisis nutrisi'] : []),
        ...(pkg.hasCostCalculation ? ['Kalkulasi biaya'] : []),
        ...(pkg.hasQualityControl ? ['Quality control'] : []),
        ...(pkg.hasAPIAccess ? ['API access'] : []),
        ...(pkg.hasCustomBranding ? ['Custom branding'] : [])
      ],
      limitations: [
        ...(pkg.maxRecipients > 0 ? [`Terbatas ${pkg.maxRecipients.toLocaleString()} penerima`] : []),
        ...(pkg.storageGb > 0 ? [`${pkg.storageGb}GB storage`] : []),
        ...(pkg.maxReportsPerMonth > 0 ? [`${pkg.maxReportsPerMonth} laporan/bulan`] : [])
      ],
      maxSppg: 1,
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