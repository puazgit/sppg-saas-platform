import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// GET /api/superadmin/subscription-packages - Get all subscription packages
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.userType !== 'SUPERADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const packages = await prisma.subscriptionPackage.findMany({
      where: { isActive: true },
      include: {
        features: {
          select: {
            feature: {
              select: {
                name: true,
                description: true
              }
            }
          }
        },
        _count: {
          select: {
            subscriptions: {
              where: { status: 'ACTIVE' }
            }
          }
        }
      },
      orderBy: [
        { tier: 'asc' },
        { monthlyPrice: 'asc' }
      ]
    })

    // Format packages with features
    const formattedPackages = packages.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      tier: pkg.tier,
      description: pkg.description,
      monthlyPrice: pkg.monthlyPrice,
      yearlyPrice: pkg.yearlyPrice,
      maxRecipients: pkg.maxRecipients,
      maxStaff: pkg.maxStaff,
      maxDistributionPoints: pkg.maxDistributionPoints,
      storageGb: pkg.storageGb,
      features: pkg.features.map(f => f.feature.name),
      isActive: pkg.isActive,
      activeSubscriptions: pkg._count.subscriptions,
      createdAt: pkg.createdAt.toISOString(),
      updatedAt: pkg.updatedAt.toISOString()
    }))

    return NextResponse.json({
      success: true,
      data: formattedPackages
    })

  } catch (error) {
    console.error('Error fetching subscription packages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscription packages' },
      { status: 500 }
    )
  }
}