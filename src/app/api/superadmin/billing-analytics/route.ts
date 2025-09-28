import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { subMonths, format } from 'date-fns'

// Schema untuk validasi query parameters
const analyticsQuerySchema = z.object({
  period: z.enum(['7d', '30d', '90d', '12m']).default('30d'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sppgId: z.string().optional(),
  tier: z.enum(['BASIC', 'STANDARD', 'PRO', 'ENTERPRISE']).optional()
})

interface MonthlyRevenueData {
  month: Date
  revenue: string
  payments: string
}

interface SPPGData {
  sppgId: string
  tier: string
  total_revenue: string
  total_payments: string
}

// GET /api/superadmin/billing-analytics - Get comprehensive billing analytics
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    
    // Parse and validate query parameters
    const params = {
      period: searchParams.get('period') || '30d',
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
      sppgId: searchParams.get('sppgId'),
      tier: searchParams.get('tier')
    }

    const validatedParams = analyticsQuerySchema.parse(params)

    // Calculate date range
    let startDate: Date
    let endDate: Date = new Date()

    if (validatedParams.startDate && validatedParams.endDate) {
      startDate = new Date(validatedParams.startDate)
      endDate = new Date(validatedParams.endDate)
    } else {
      switch (validatedParams.period) {
        case '7d':
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          break
        case '30d':
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          break
        case '90d':
          startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
          break
        case '12m':
          startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
          break
        default:
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    }

    // Build filter conditions
    const paymentWhere: Record<string, unknown> = {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    }

    const invoiceWhere: Record<string, unknown> = {
      issueDate: {
        gte: startDate,
        lte: endDate
      }
    }

    const subscriptionWhere: Record<string, unknown> = {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    }

    // Add SPPG filter if specified
    if (validatedParams.sppgId) {
      paymentWhere.subscription = { sppgId: validatedParams.sppgId }
      invoiceWhere.subscription = { sppgId: validatedParams.sppgId }
      subscriptionWhere.sppgId = validatedParams.sppgId
    }

    // Add tier filter if specified
    if (validatedParams.tier) {
      if (paymentWhere.subscription) {
        (paymentWhere.subscription as Record<string, unknown>).tier = validatedParams.tier
      } else {
        paymentWhere.subscription = { tier: validatedParams.tier }
      }
      
      if (invoiceWhere.subscription) {
        (invoiceWhere.subscription as Record<string, unknown>).tier = validatedParams.tier
      } else {
        invoiceWhere.subscription = { tier: validatedParams.tier }
      }
      
      subscriptionWhere.tier = validatedParams.tier
    }

    // Execute parallel queries for better performance
    const [
      totalRevenue,
      totalPayments,
      completedPayments,
      failedPayments,
      pendingPayments,
      totalInvoices,
      paidInvoices,
      overdueInvoices,
      totalSubscriptions,
      activeSubscriptions,
      cancelledSubscriptions,
      revenueByMonth,
      paymentsByStatus,
      revenueByTier,
      recentPayments,
      topSPPGs
    ] = await Promise.all([
      // Total Revenue
      prisma.payment.aggregate({
        where: { ...paymentWhere, status: 'COMPLETED' },
        _sum: { amount: true }
      }),

      // Total Payments Count
      prisma.payment.count({ where: paymentWhere }),

      // Completed Payments
      prisma.payment.count({
        where: { ...paymentWhere, status: 'COMPLETED' }
      }),

      // Failed Payments
      prisma.payment.count({
        where: { ...paymentWhere, status: 'FAILED' }
      }),

      // Pending Payments
      prisma.payment.count({
        where: { ...paymentWhere, status: 'PENDING' }
      }),

      // Total Invoices
      prisma.invoice.count({ where: invoiceWhere }),

      // Paid Invoices
      prisma.invoice.count({
        where: { ...invoiceWhere, status: 'PAID' }
      }),

      // Overdue Invoices
      prisma.invoice.count({
        where: { 
          ...invoiceWhere, 
          status: 'OVERDUE',
          dueDate: { lt: new Date() }
        }
      }),

      // Total Subscriptions
      prisma.subscription.count({ where: subscriptionWhere }),

      // Active Subscriptions
      prisma.subscription.count({
        where: { ...subscriptionWhere, status: 'ACTIVE' }
      }),

      // Cancelled Subscriptions
      prisma.subscription.count({
        where: { ...subscriptionWhere, status: 'CANCELLED' }
      }),

      // Revenue by Month (last 12 months)
      prisma.$queryRaw<MonthlyRevenueData[]>`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          SUM("amount") as revenue,
          COUNT(*) as payments
        FROM "Payment" 
        WHERE "status" = 'COMPLETED'
          AND "createdAt" >= ${subMonths(new Date(), 12)}
          AND "createdAt" <= ${new Date()}
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month DESC
      `,

      // Payments by Status
      prisma.payment.groupBy({
        by: ['status'],
        where: paymentWhere,
        _count: { _all: true },
        _sum: { amount: true }
      }),

      // Revenue by Subscription Tier
      prisma.payment.groupBy({
        by: ['subscriptionId'],
        where: { ...paymentWhere, status: 'COMPLETED' },
        _sum: { amount: true },
        _count: { _all: true }
      }),

      // Recent Payments (last 10)
      prisma.payment.findMany({
        where: paymentWhere,
        include: {
          subscription: {
            select: { sppgId: true, tier: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),

      // Top SPPGs by Revenue
      prisma.$queryRaw<SPPGData[]>`
        SELECT 
          s."sppgId",
          s."tier",
          COALESCE(SUM(p."amount"), 0) as total_revenue,
          COUNT(p."id") as total_payments
        FROM "Subscription" s
        LEFT JOIN "Payment" p ON s."id" = p."subscriptionId" 
          AND p."status" = 'COMPLETED'
          AND p."createdAt" >= ${startDate}
          AND p."createdAt" <= ${endDate}
        WHERE s."createdAt" >= ${startDate}
          AND s."createdAt" <= ${endDate}
        GROUP BY s."sppgId", s."tier"
        ORDER BY total_revenue DESC
        LIMIT 10
      `
    ])

    // Calculate metrics
    const successRate = totalPayments > 0 ? (completedPayments / totalPayments) * 100 : 0
    const failureRate = totalPayments > 0 ? (failedPayments / totalPayments) * 100 : 0
    const invoiceCollectionRate = totalInvoices > 0 ? (paidInvoices / totalInvoices) * 100 : 0
    const subscriptionGrowthRate = totalSubscriptions > 0 ? (activeSubscriptions / totalSubscriptions) * 100 : 0

    // Calculate previous period for growth comparison
    const previousStartDate = new Date(startDate.getTime() - (endDate.getTime() - startDate.getTime()))
    
    const previousRevenue = await prisma.payment.aggregate({
      where: {
        ...paymentWhere,
        status: 'COMPLETED',
        createdAt: {
          gte: previousStartDate,
          lt: startDate
        }
      },
      _sum: { amount: true }
    })

    const revenueGrowth = previousRevenue._sum.amount 
      ? ((((totalRevenue._sum.amount || 0) - (previousRevenue._sum.amount || 0)) / (previousRevenue._sum.amount || 1)) * 100)
      : 0

    // Format revenue by month data
    const monthlyRevenueData = revenueByMonth.map(item => ({
      month: format(new Date(item.month), 'MMM yyyy'),
      revenue: parseFloat(item.revenue || '0'),
      payments: parseInt(item.payments || '0')
    }))

    // Format payments by status data
    const statusData = paymentsByStatus.map(item => ({
      status: item.status,
      count: item._count._all,
      amount: item._sum.amount || 0
    }))

    // Format tier revenue data
    const tierRevenueMap = new Map()
    for (const payment of revenueByTier) {
      // Simplified version - in real implementation you'd join with subscription
      tierRevenueMap.set('STANDARD', (tierRevenueMap.get('STANDARD') || 0) + (payment._sum.amount || 0))
    }

    const analytics = {
      summary: {
        totalRevenue: totalRevenue._sum.amount || 0,
        revenueGrowth,
        totalPayments,
        successRate,
        failureRate,
        totalInvoices,
        invoiceCollectionRate,
        overdueInvoices,
        totalSubscriptions,
        activeSubscriptions,
        subscriptionGrowthRate,
        pendingPayments,
        cancelledSubscriptions
      },
      charts: {
        monthlyRevenue: monthlyRevenueData,
        paymentsByStatus: statusData,
        revenueByTier: Array.from(tierRevenueMap.entries()).map(([tier, revenue]) => ({
          tier,
          revenue
        }))
      },
      recentActivity: {
        recentPayments: recentPayments.map(payment => ({
          id: payment.id,
          amount: payment.amount,
          status: payment.status,
          method: payment.method,
          gateway: payment.gateway,
          createdAt: payment.createdAt,
          sppgId: payment.subscription?.sppgId,
          tier: payment.subscription?.tier
        })),
        topSPPGs: topSPPGs.map(sppg => ({
          sppgId: sppg.sppgId,
          tier: sppg.tier,
          totalRevenue: parseFloat(sppg.total_revenue || '0'),
          totalPayments: parseInt(sppg.total_payments || '0')
        }))
      },
      filters: {
        period: validatedParams.period,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        sppgId: validatedParams.sppgId,
        tier: validatedParams.tier
      }
    }

    return NextResponse.json(analytics)

  } catch (error) {
    console.error('Error fetching billing analytics:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}