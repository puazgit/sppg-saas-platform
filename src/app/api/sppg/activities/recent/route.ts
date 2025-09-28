import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.userType !== 'SPPG_USER') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const sppgId = session.user.sppgId
    if (!sppgId) {
      return NextResponse.json(
        { success: false, error: 'SPPG ID not found' }, 
        { status: 400 }
      )
    }

    // Get recent activities from various tables
    const [
      recentProductions,
      recentDistributions,
      recentInventoryChanges,
      recentStaffActions
    ] = await Promise.all([
      // Recent production activities
      prisma.production.findMany({
        where: { 
          sppgId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        },
        include: {
          menu: { select: { name: true } },
          operation: { select: { date: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      
      // Recent distribution activities  
      prisma.distribution.findMany({
        where: { 
          sppgId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        include: {
          distributionPoint: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      
      // Recent inventory changes (stock logs)
      prisma.stockLog.findMany({
        where: { 
          ingredient: { sppgId },
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        include: {
          ingredient: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      
      // Recent staff activities (new staff or role changes)
      prisma.staff.findMany({
        where: { 
          sppgId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ])

    // Transform activities to common format
    const activities = []

    // Add production activities
    recentProductions.forEach(prod => {
      activities.push({
        id: `prod_${prod.id}`,
        type: 'PRODUCTION' as const,
        title: `Produksi ${prod.menu.name} selesai`,
        description: `${prod.totalServings} porsi diproduksi dalam ${prod.batchCount} batch`,
        user: 'Staff Produksi',
        timestamp: prod.createdAt.toISOString(),
        status: prod.status === 'COMPLETED' ? 'SUCCESS' : 
               prod.status === 'QUALITY_CHECK' ? 'WARNING' : undefined,
        metadata: {
          menuName: prod.menu.name,
          servings: prod.totalServings,
          batches: prod.batchCount
        }
      })
    })

    // Add distribution activities
    recentDistributions.forEach(dist => {
      activities.push({
        id: `dist_${dist.id}`,
        type: 'DISTRIBUTION' as const,
        title: `Distribusi ke ${dist.distributionPoint.name}`,
        description: `${dist.portionsDelivered} porsi telah didistribusikan`,
        user: 'Staff Distribusi',
        timestamp: dist.createdAt.toISOString(),
        status: dist.status === 'DELIVERED' ? 'SUCCESS' : 
               dist.status === 'DELAYED' ? 'WARNING' : undefined,
        metadata: {
          distributionPoint: dist.distributionPoint.name,
          portions: dist.portionsDelivered
        }
      })
    })

    // Add inventory activities
    recentInventoryChanges.forEach(stock => {
      const isIncoming = stock.changeType === 'IN'
      activities.push({
        id: `inv_${stock.id}`,
        type: 'INVENTORY' as const,
        title: `${isIncoming ? 'Penambahan' : 'Penggunaan'} stok ${stock.ingredient.name}`,
        description: `${isIncoming ? '+' : '-'}${stock.quantity} ${stock.unit}`,
        user: 'Admin Inventori',
        timestamp: stock.createdAt.toISOString(),
        status: !isIncoming && stock.newBalance < 10 ? 'WARNING' : 'SUCCESS',
        metadata: {
          ingredient: stock.ingredient.name,
          quantity: stock.quantity,
          unit: stock.unit,
          changeType: stock.changeType
        }
      })
    })

    // Add staff activities
    recentStaffActions.forEach(staff => {
      activities.push({
        id: `staff_${staff.id}`,
        type: 'STAFF' as const,
        title: `Staff baru bergabung: ${staff.name}`,
        description: `${staff.role} telah bergabung dengan tim`,
        user: 'Admin SPPG',
        timestamp: staff.createdAt.toISOString(),
        status: 'SUCCESS' as const,
        metadata: {
          staffName: staff.name,
          role: staff.role
        }
      })
    })

    // Sort all activities by timestamp (most recent first)
    activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    // Return top 20 activities
    const recentActivities = activities.slice(0, 20)

    return NextResponse.json({ 
      success: true, 
      data: recentActivities 
    })

  } catch (error) {
    console.error('Error fetching recent activities:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recent activities' },
      { status: 500 }
    )
  }
}