import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
// TODO: Create proper activity tracking schema
// import { sppgActivitySchema } from '@/features/superadmin'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.userType !== 'SPPG_USER' || !session.user.sppgId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const sppgId = session.user.sppgId

    // Get recent activities from the last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const [productionActivities, distributionActivities, stockActivities] = await Promise.all([
      // Recent production activities
      prisma.production.findMany({
        where: {
          operation: {
            sppgId,
            createdAt: { gte: sevenDaysAgo }
          }
        },
        include: {
          menu: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),

      // Recent distribution activities
      prisma.distribution.findMany({
        where: {
          operation: {
            sppgId,
            createdAt: { gte: sevenDaysAgo }
          }
        },
        include: {
          menu: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),

      // Recent stock activities  
      prisma.stockLog.findMany({
        where: {
          ingredient: {
            sppgId
          },
          createdAt: { gte: sevenDaysAgo }
        },
        include: {
          ingredient: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ])

    // Transform activities
    const activities: Array<{
      id: string;
      type: 'production' | 'distribution' | 'inventory';
      title: string;
      description: string;
      timestamp: string;
      status: string;
    }> = []

    // Production activities
    productionActivities.forEach(production => {
      activities.push({
        id: `production-${production.id}`,
        type: 'production' as const,
        title: `Produksi ${production.menu.name}`,
        description: `${production.totalServings} porsi diproduksi dalam ${production.batchCount} batch`,
        timestamp: production.createdAt.toISOString(),
        status: 'success'
      })
    })

    // Distribution activities
    distributionActivities.forEach(distribution => {
      activities.push({
        id: `distribution-${distribution.id}`,
        type: 'distribution' as const,
        title: `Distribusi ${distribution.menu.name}`,
        description: `${distribution.deliveredQuantity} dari ${distribution.plannedQuantity} porsi didistribusikan`,
        timestamp: distribution.createdAt.toISOString(),
        status: distribution.status === 'COMPLETED' ? 'success' : 
                distribution.status === 'IN_PROGRESS' ? 'warning' : 'info'
      })
    })

    // Stock activities
    stockActivities.forEach(stockLog => {
      activities.push({
        id: `stock-${stockLog.id}`,
        type: 'inventory' as const,
        title: `Stock ${stockLog.ingredient.name}`,
        description: `${stockLog.type} - ${stockLog.quantity} ${stockLog.unit}`,
        timestamp: stockLog.createdAt.toISOString(),
        status: stockLog.type === 'IN' ? 'success' : 'info'
      })
    })

    // Sort by timestamp and take top 10
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    const recentActivities = activities.slice(0, 10)

    return NextResponse.json(recentActivities)

  } catch (error) {
    console.error('SPPG Recent Activities API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}