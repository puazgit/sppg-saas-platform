import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { SubscriptionTier } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tier = searchParams.get('tier')

    // Build where condition - if tier is provided, filter by it
    const whereCondition: { isActive: boolean; tier?: SubscriptionTier } = {
      isActive: true
    }
    
    if (tier) {
      whereCondition.tier = tier.toUpperCase() as SubscriptionTier
    }

    // Fetch packages from database
    const packages = await prisma.subscriptionPackage.findMany({
      where: whereCondition,
      select: {
        id: true,
        tier: true,
        name: true,
        displayName: true,
        monthlyPrice: true,
        maxRecipients: true,
        maxStaff: true,
        maxDistributionPoints: true,
        hasAdvancedReporting: true,
        hasAPIAccess: true,
        hasNutritionAnalysis: true,
        hasQualityControl: true,
        highlightFeatures: true
      },
      orderBy: {
        tier: 'asc'
      }
    })

    if (packages.length === 0) {
      return NextResponse.json(
        { success: false, error: tier ? `No active packages found for tier: ${tier}` : 'No active packages found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      packages
    })

  } catch (error) {
    console.error('Error fetching subscription packages:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}