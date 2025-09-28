import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { superadminDashboardSchema } from '@/features/superadmin/dashboard/schemas'

export async function GET(request: Request) {
  try {
    // Authentication check
    const session = await auth()
    if (!session?.user || session.user.userType !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || 'monthly'

    // Time range parameter for future use
    // const now = new Date()
    // ... time calculations would go here
    
    // Use startDate for future time-based queries
    // Calculate time range for queries
    const now = new Date()
    let startDate: Date
    
    switch (timeRange) {
      case 'weekly':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
        break
      case 'yearly':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        break
      default: // monthly
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    }

    console.log('SuperAdmin metrics requested for timeRange:', timeRange, 'from', startDate.toISOString())

    // Parallel database queries for dashboard metrics
    const [
      totalSPPGs,
      totalUsers,
      totalSubscriptions,
      activeSubscriptions,
      activeSppg,
      activeUsers,
      revenueData,
      regionDistribution,
      subscriptionAnalytics,
      recentActivities
    ] = await Promise.all([
      // Basic counts
      prisma.sPPG.count(),
      prisma.user.count(),
      
      // Subscription statistics
      prisma.subscription.count(),
      prisma.subscription.count({
        where: { status: 'ACTIVE' }
      }),
      
      // SPPG statistics with active subscriptions
      prisma.sPPG.count({
        where: {
          subscription: {
            status: 'ACTIVE'
          }
        }
      }),
      
      // Active users (logged in last 30 days)
      prisma.user.count({
        where: {
          lastLogin: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Revenue data - subscriptions with packages
      prisma.subscription.findMany({
        include: {
          package: {
            select: { monthlyPrice: true, tier: true }
          }
        },
        where: {
          status: 'ACTIVE'
        }
      }),
      
      // Regional distribution
      prisma.sPPG.groupBy({
        by: ['provinceId'],
        _count: { id: true },
        where: {
          status: 'ACTIVE'
        }
      }),
      
      // Subscription tier analytics
      prisma.subscription.groupBy({
        by: ['tier'],
        _count: { id: true },
        where: {
          status: 'ACTIVE'
        }
      }),
      
      // Recent user activities
      prisma.user.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 10,
        select: {
          id: true,
          name: true,
          email: true,
          userType: true,
          updatedAt: true
        }
      })
    ])

    // System health data
    const systemHealth = {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: Math.floor(Math.random() * 50 + 20), // Mock CPU usage for now
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      databaseStatus: 'connected' as const,
    }

    // Calculate platform metrics
    const monthlyRevenue = revenueData
      .filter(sub => sub.package?.monthlyPrice)
      .reduce((sum, sub) => sum + (sub.package?.monthlyPrice || 0), 0)

    const yearlyRevenue = monthlyRevenue * 12

    // Calculate revenue growth (simplified - would need historical data)
    const previousMonthRevenue = monthlyRevenue * 0.9 // Mock previous month for now
    const revenueGrowth = previousMonthRevenue > 0 
      ? ((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
      : 0

    // Calculate churn rate
    const churnRate = totalSubscriptions > 0 
      ? Math.max(0, ((totalSubscriptions - activeSubscriptions) / totalSubscriptions) * 100)
      : 0

    // Get province names (simplified for now)
    const getProvinceName = (provinceId: string) => {
      const provinces: Record<string, string> = {
        '11': 'Aceh',
        '12': 'Sumatera Utara',
        '13': 'Sumatera Barat',
        '14': 'Riau',
        '15': 'Jambi',
        '16': 'Sumatera Selatan',
        '17': 'Bengkulu',
        '18': 'Lampung',
        '19': 'Kepulauan Bangka Belitung',
        '21': 'Kepulauan Riau',
        '31': 'DKI Jakarta',
        '32': 'Jawa Barat',
        '33': 'Jawa Tengah',
        '34': 'DI Yogyakarta',
        '35': 'Jawa Timur',
        '36': 'Banten',
        '51': 'Bali',
        '52': 'Nusa Tenggara Barat',
        '53': 'Nusa Tenggara Timur',
        '61': 'Kalimantan Barat',
        '62': 'Kalimantan Tengah',
        '63': 'Kalimantan Selatan',
        '64': 'Kalimantan Timur',
        '65': 'Kalimantan Utara',
        '71': 'Sulawesi Utara',
        '72': 'Sulawesi Tengah',
        '73': 'Sulawesi Selatan',
        '74': 'Sulawesi Tenggara',
        '75': 'Gorontalo',
        '76': 'Sulawesi Barat',
        '81': 'Maluku',
        '82': 'Maluku Utara',
        '91': 'Papua Barat',
        '94': 'Papua'
      }
      return provinces[provinceId] || `Province ${provinceId}`
    }

    // Process regional distribution
    const processedRegionalDistribution = regionDistribution.map(region => ({
      provinceId: region.provinceId || 'unknown',
      provinceName: getProvinceName(region.provinceId || 'unknown'),
      sppgCount: region._count.id,
      activeCount: region._count.id, // All counted SPPGs are active
      totalBeneficiaries: region._count.id * 500, // Estimate 500 beneficiaries per SPPG
      totalStaff: region._count.id * 15, // Estimate 15 staff per SPPG
    }))

    // Process subscription analytics
    const processedSubscriptionAnalytics = subscriptionAnalytics.map(item => {
      const tierPrices = {
        'BASIC': 1500000,
        'STANDARD': 3000000,
        'PRO': 4500000,
        'ENTERPRISE': 7500000
      }
      const price = tierPrices[item.tier as keyof typeof tierPrices] || 0
      
      return {
        tier: item.tier,
        count: item._count.id,
        revenue: item._count.id * price,
        avgBeneficiaries: item.tier === 'BASIC' ? 500 : 
                         item.tier === 'STANDARD' ? 1000 :
                         item.tier === 'PRO' ? 1500 : 2500,
        retentionRate: 95 - (item.tier === 'BASIC' ? 5 : 
                            item.tier === 'STANDARD' ? 3 :
                            item.tier === 'PRO' ? 2 : 1), // Higher tiers have better retention
      }
    })

    // Process recent activities
    const processedActivities = recentActivities.map(user => ({
      id: user.id,
      type: 'user_action' as const,
      title: `${user.userType === 'SUPERADMIN' ? 'Admin' : 'User'} Activity`,
      description: `${user.name || user.email} updated their profile`,
      metadata: {
        userId: user.id,
        userType: user.userType,
        email: user.email,
        name: user.name
      },
      severity: 'low' as const,
      timestamp: user.updatedAt.toISOString(),
      userId: user.id,
    }))

    // Build response according to schema
    const dashboardData = {
      systemHealth,
      platformMetrics: {
        totalSppg: totalSPPGs,
        activeSppg,
        totalUsers,
        activeUsers,
        totalSubscriptions,
        activeSubscriptions,
        monthlyRevenue,
        yearlyRevenue,
        revenueGrowth,
        churnRate,
      },
      regionalDistribution: processedRegionalDistribution,
      subscriptionAnalytics: processedSubscriptionAnalytics,
      recentActivities: processedActivities,
      timestamp: new Date().toISOString(),
    }

    // Validate response with schema
    const validatedData = superadminDashboardSchema.parse(dashboardData)

    return NextResponse.json(validatedData)

  } catch (error) {
    console.error('Dashboard metrics error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch dashboard metrics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}