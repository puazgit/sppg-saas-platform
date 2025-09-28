import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// GET /api/superadmin/subscription-analytics - Get subscription analytics
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.userType !== 'SUPERADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const now = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    // Execute all analytics queries in parallel
    const [
      totalSubscriptions,
      activeSubscriptions,
      expiredSubscriptions,
      suspendedSubscriptions,
      cancelledSubscriptions,
      subscriptionsByTier,
      newSubscriptionsThisMonth,
      cancelledThisMonth,
      upcomingExpirations,
      monthlyRevenue,
      lastMonthRevenue
    ] = await Promise.all([
      // Total subscriptions
      prisma.subscription.count(),
      
      // Active subscriptions
      prisma.subscription.count({
        where: { status: 'ACTIVE' }
      }),
      
      // Expired subscriptions
      prisma.subscription.count({
        where: { status: 'EXPIRED' }
      }),
      
      // Suspended subscriptions
      prisma.subscription.count({
        where: { status: 'SUSPENDED' }
      }),
      
      // Cancelled subscriptions
      prisma.subscription.count({
        where: { status: 'CANCELLED' }
      }),
      
      // Subscriptions by tier
      prisma.subscription.groupBy({
        by: ['tier'],
        _count: { tier: true },
        where: { status: 'ACTIVE' }
      }),
      
      // New subscriptions this month
      prisma.subscription.count({
        where: {
          createdAt: {
            gte: thisMonth,
            lt: nextMonth
          }
        }
      }),
      
      // Cancelled subscriptions this month
      prisma.subscription.count({
        where: {
          status: 'CANCELLED',
          updatedAt: {
            gte: thisMonth,
            lt: nextMonth
          }
        }
      }),
      
      // Upcoming expirations (next 30 days)
      prisma.subscription.count({
        where: {
          status: 'ACTIVE',
          endDate: {
            gte: now,
            lte: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // This month's revenue (estimated from active subscriptions)
      prisma.subscription.findMany({
        where: { 
          status: 'ACTIVE',
          billingDate: {
            gte: thisMonth,
            lt: nextMonth
          }
        },
        include: {
          package: {
            select: { monthlyPrice: true }
          }
        }
      }),
      
      // Last month's revenue
      prisma.subscription.findMany({
        where: {
          status: 'ACTIVE',
          billingDate: {
            gte: lastMonth,
            lt: thisMonth
          }
        },
        include: {
          package: {
            select: { monthlyPrice: true }
          }
        }
      })
    ])

    // Calculate revenue
    const revenueThisMonth = monthlyRevenue.reduce((sum, sub) => {
      return sum + (sub.package?.monthlyPrice || 0)
    }, 0)

    const revenueLastMonth = lastMonthRevenue.reduce((sum, sub) => {
      return sum + (sub.package?.monthlyPrice || 0)
    }, 0)

    // Process tier distribution
    const distributionByTier = {
      BASIC: 0,
      STANDARD: 0,
      PRO: 0,
      ENTERPRISE: 0
    }

    subscriptionsByTier.forEach(group => {
      distributionByTier[group.tier as keyof typeof distributionByTier] = group._count.tier
    })

    // Calculate churn rate
    const activeSubscriptionsStartMonth = activeSubscriptions + cancelledThisMonth
    const churnRate = activeSubscriptionsStartMonth > 0 
      ? (cancelledThisMonth / activeSubscriptionsStartMonth) * 100 
      : 0

    const analytics = {
      totalSubscriptions,
      activeSubscriptions,
      expiredSubscriptions,
      suspendedSubscriptions,
      cancelledSubscriptions,
      revenueThisMonth,
      revenueLastMonth,
      churnRate: Number(churnRate.toFixed(2)),
      newSubscriptionsThisMonth,
      distributionByTier,
      upcomingExpirations
    }

    return NextResponse.json({
      success: true,
      data: analytics
    })

  } catch (error) {
    console.error('Error fetching subscription analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscription analytics' },
      { status: 500 }
    )
  }
}